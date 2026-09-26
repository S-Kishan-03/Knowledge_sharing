import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { TopicMeta } from '../types';
import { Search, X, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: TopicMeta[];
  onSelectTopic: (topicId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  topics,
  onSelectTopic,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return topics.slice(0, 8);
    }
    const q = query.toLowerCase().trim();
    return topics
      .filter((t) => {
        return (
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      })
      .slice(0, 10);
  }, [query, topics]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectTopic(filtered[selectedIndex].id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search mechanics, thermodynamics, fluids, GD&T, formulas..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <p>No mechanical engineering topics found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for &ldquo;stress&rdquo;, &ldquo;gear&rdquo;, &ldquo;Bernoulli&rdquo;, or &ldquo;Carnot&rdquo;
              </p>
            </div>
          ) : (
            filtered.map((topic, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left p-3 rounded-xl transition-colors flex items-start justify-between gap-4 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/15 border border-indigo-500/30'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-indigo-400 font-medium">{topic.category}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{topic.readTime}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{topic.difficulty}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-100 truncate">
                      {topic.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {topic.summary}
                    </p>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-indigo-400 translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Use ↑ and ↓ to navigate, Enter to select</span>
          <span className="font-mono">{filtered.length} matches</span>
        </div>
      </div>
    </div>
  );
};
