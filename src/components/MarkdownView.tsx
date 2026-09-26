import React from 'react';
import { MathView } from './MathView';
import { getTopicById } from '../data/topicsRegistry';
import { ArrowUpRight } from 'lucide-react';

interface MarkdownViewProps {
  content: string;
  onNavigateTopic: (topicId: string) => void;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, onNavigateTopic }) => {
  // Split content by block-level math `$$...$$`
  const renderBlocks = () => {
    if (!content) return null;

    // First handle block math
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = blockMathRegex.exec(content)) !== null) {
      const textBefore = content.substring(lastIndex, match.index);
      if (textBefore) {
        parts.push(renderTextParagraphs(textBefore, `text-${lastIndex}`));
      }

      const mathExpression = match[1].trim();
      parts.push(
        <MathView
          key={`math-block-${match.index}`}
          math={mathExpression}
          displayMode={true}
          showCopy={true}
        />
      );

      lastIndex = blockMathRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      parts.push(renderTextParagraphs(remainingText, `text-${lastIndex}`));
    }

    return parts;
  };

  const renderTextParagraphs = (rawText: string, keyPrefix: string) => {
    const lines = rawText.split('\n');
    const nodes: React.ReactNode[] = [];
    let inList = false;
    let listType: 'ul' | 'ol' = 'ul';
    let listItems: React.ReactNode[] = [];

    const flushList = (idx: number) => {
      if (inList && listItems.length > 0) {
        if (listType === 'ul') {
          nodes.push(
            <ul key={`${keyPrefix}-ul-${idx}`} className="my-3 space-y-1.5 list-disc pl-6 text-slate-300 dark:text-slate-300">
              {listItems}
            </ul>
          );
        } else {
          nodes.push(
            <ol key={`${keyPrefix}-ol-${idx}`} className="my-3 space-y-1.5 list-decimal pl-6 text-slate-300 dark:text-slate-300">
              {listItems}
            </ol>
          );
        }
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushList(idx);
        return;
      }

      // Check for headings
      if (trimmed.startsWith('### ')) {
        flushList(idx);
        nodes.push(
          <h3 key={`${keyPrefix}-h3-${idx}`} className="text-lg font-semibold text-slate-100 mt-5 mb-2 tracking-tight">
            {renderInline(trimmed.substring(4))}
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        flushList(idx);
        nodes.push(
          <h2 key={`${keyPrefix}-h2-${idx}`} className="text-xl font-bold text-slate-100 mt-6 mb-3 pb-1 border-b border-slate-800 tracking-tight">
            {renderInline(trimmed.substring(3))}
          </h2>
        );
        return;
      }

      // Unordered list item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList || listType !== 'ul') {
          flushList(idx);
          inList = true;
          listType = 'ul';
        }
        listItems.push(
          <li key={`li-${idx}`} className="leading-relaxed">
            {renderInline(trimmed.substring(2))}
          </li>
        );
        return;
      }

      // Ordered list item
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        if (!inList || listType !== 'ol') {
          flushList(idx);
          inList = true;
          listType = 'ol';
        }
        listItems.push(
          <li key={`li-${idx}`} className="leading-relaxed">
            {renderInline(numMatch[2])}
          </li>
        );
        return;
      }

      // Standard paragraph
      flushList(idx);
      nodes.push(
        <p key={`${keyPrefix}-p-${idx}`} className="my-2.5 leading-relaxed text-slate-300">
          {renderInline(trimmed)}
        </p>
      );
    });

    flushList(lines.length);
    return <div key={keyPrefix}>{nodes}</div>;
  };

  // Inline formatting: wiki links `[[target|label]]`, inline math `$math$`, bold `**text**`, code `` `code` ``
  const renderInline = (text: string): React.ReactNode => {
    // Regex matching:
    // 1: wiki-link: \[\[(.*?)\]\]
    // 2: inline math: \$(.*?)\$
    // 3: bold: \*\*(.*?)\*\*
    // 4: code: `(.*?)`
    const inlineRegex = /\[\[(.*?)\]\]|\$([^\$]+?)\$|\*\*(.*?)\*\*|`([^`]+?)`/g;
    const elements: React.ReactNode[] = [];
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = inlineRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        elements.push(text.substring(lastIdx, match.index));
      }

      if (match[1] !== undefined) {
        // Wiki Link [[target|label]]
        const raw = match[1];
        const [target, customLabel] = raw.split('|').map(s => s.trim());
        const targetTopic = getTopicById(target);
        const label = customLabel || targetTopic?.title || target;

        elements.push(
          <button
            key={`wiki-${match.index}`}
            onClick={() => onNavigateTopic(target)}
            title={targetTopic ? `${targetTopic.title} (${targetTopic.category})` : `Topic: ${target}`}
            className="inline-flex items-center gap-0.5 text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4 decoration-indigo-400/40 hover:decoration-indigo-400 transition-colors mx-0.5 cursor-pointer group"
          >
            <span>{label}</span>
            <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        );
      } else if (match[2] !== undefined) {
        // Inline Math
        elements.push(
          <MathView
            key={`inline-math-${match.index}`}
            math={match[2]}
            displayMode={false}
          />
        );
      } else if (match[3] !== undefined) {
        // Bold
        elements.push(
          <strong key={`bold-${match.index}`} className="font-semibold text-slate-100">
            {match[3]}
          </strong>
        );
      } else if (match[4] !== undefined) {
        // Code
        elements.push(
          <code
            key={`code-${match.index}`}
            className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800/80 text-indigo-300 border border-slate-700/50"
          >
            {match[4]}
          </code>
        );
      }

      lastIdx = inlineRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      elements.push(text.substring(lastIdx));
    }

    return elements;
  };

  return <div className="space-y-1">{renderBlocks()}</div>;
};
