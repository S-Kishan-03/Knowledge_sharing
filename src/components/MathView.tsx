import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { Copy, Check } from 'lucide-react';

interface MathViewProps {
  math: string;
  displayMode?: boolean;
  className?: string;
  showCopy?: boolean;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  displayMode = false,
  className = '',
  showCopy = false,
}) => {
  const [copied, setCopied] = useState(false);

  // Clean common LaTeX formatting quirks
  const cleanedMath = useMemo(() => {
    return math.trim().replace(/^\\small\s*/, '');
  }, [math]);

  const html = useMemo(() => {
    try {
      return katex.renderToString(cleanedMath, {
        displayMode,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch {
      return `<code class="font-mono text-sm">${cleanedMath}</code>`;
    }
  }, [cleanedMath, displayMode]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cleanedMath);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  if (!displayMode) {
    return (
      <span
        className={`inline-math font-mono text-[0.95em] ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className={`relative group my-3 py-3 px-4 rounded-xl bg-slate-900/60 dark:bg-slate-900/80 border border-slate-800/80 dark:border-slate-800 overflow-x-auto ${className}`}>
      <div
        className="text-center font-mono py-1"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {showCopy && (
        <button
          onClick={handleCopy}
          aria-label="Copy LaTeX formula"
          title="Copy LaTeX"
          className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};
