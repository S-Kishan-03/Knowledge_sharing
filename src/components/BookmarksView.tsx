import React from 'react';
import type { BookmarkItem, TopicMeta } from '../types';
import { Bookmark, Trash2, ArrowRight, BookOpen } from 'lucide-react';

interface BookmarksViewProps {
  bookmarks: BookmarkItem[];
  allTopics: TopicMeta[];
  onSelectTopic: (topicId: string) => void;
  onRemoveBookmark: (topicId: string) => void;
  onClearAll: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  allTopics,
  onSelectTopic,
  onRemoveBookmark,
  onClearAll,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      <header className="pb-6 border-b border-slate-800 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-2">
            <span>Saved Reference Library</span>
            <span className="text-slate-600">·</span>
            <span>Local Storage</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
            Bookmarked Engineering Articles
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
            Quickly revisit your pinned reference guides, formula derivations, and design specifications.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </header>

      {bookmarks.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-slate-800/80 bg-slate-900/40 max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">No bookmarked articles yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Click the bookmark icon on any topic page or infobox to save articles for instant retrieval here.
            </p>
          </div>

          <div className="pt-2">
            <span className="text-xs text-slate-500 block mb-2">Suggested Core Topics:</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {allTopics.slice(0, 4).map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTopic(t.id)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 transition-colors cursor-pointer"
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookmarks.map((b) => {
            const topic = allTopics.find((t) => t.id === b.id);
            return (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between group shadow-lg shadow-slate-950/20"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="text-indigo-400 font-semibold">{b.category}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(b.id);
                      }}
                      title="Remove bookmark"
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3
                    onClick={() => onSelectTopic(b.id)}
                    className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    {b.title}
                  </h3>

                  {topic && (
                    <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {topic.summary}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    Saved {new Date(b.dateAdded).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onSelectTopic(b.id)}
                    className="inline-flex items-center gap-1 text-indigo-400 font-medium group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
