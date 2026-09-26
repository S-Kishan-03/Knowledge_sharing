import React, { useState } from 'react';
import type { Category, TopicMeta } from '../types';
import {
  ChevronDown,
  ChevronRight,
  Calculator,
  Compass,
  CheckCircle2,
  PanelLeftClose,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  topics: TopicMeta[];
  activeTopicId?: string;
  activeCategoryId?: string;
  onSelectTopic: (topicId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectCalculators: () => void;
  onSelectRoadmap: () => void;
  isVisible: boolean;
  onClose: () => void;
  readTopicIds: Set<string>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  topics,
  activeTopicId,
  activeCategoryId,
  onSelectTopic,
  onSelectCategory,
  onSelectCalculators,
  onSelectRoadmap,
  isVisible,
  onClose,
  readTopicIds,
}) => {
  // All 3 categories open by default
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach((c) => {
      initial[c.id] = true;
    });
    return initial;
  });

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      design: '📐',
      computer: '🖥️',
      factory: '🏭',
    };
    return iconMap[iconName] || '📂';
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isVisible && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 backdrop-blur-md flex flex-col transition-transform duration-200 ease-out ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Quick Nav Shortcuts: Roadmap & Calculators */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800/60 space-y-2">
          <div className="flex items-center justify-between pb-1 px-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Navigation Menu
            </span>
            <button
              onClick={onClose}
              title="Hide sidebar"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              onSelectRoadmap();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:rotate-45 transition-transform" />
              <span>Learning Roadmap</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold">
              {readTopicIds.size}/{topics.length}
            </span>
          </button>

          <button
            onClick={() => {
              onSelectCalculators();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Interactive Calculators</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
              6 Live
            </span>
          </button>
        </div>

        {/* 3 Categories and Topics List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 flex items-center justify-between">
            <span>3 Core Disciplines</span>
            <span className="font-mono text-slate-400 font-normal">
              {topics.length} topics
            </span>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => {
              const catTopics = topics.filter((t) => t.categoryId === cat.id);
              const isExpanded = openCategories[cat.id] ?? true;
              const isCatActive = activeCategoryId === cat.id;
              const catReadCount = catTopics.filter((t) => readTopicIds.has(t.id)).length;

              return (
                <div key={cat.id} className="rounded-xl overflow-hidden bg-slate-50/80 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/50">
                  <div className="flex items-center justify-between px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-900/70 transition-colors group">
                    <button
                      onClick={() => {
                        onSelectCategory(cat.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={`flex-1 text-left flex items-center gap-2 text-xs font-semibold tracking-tight transition-colors cursor-pointer ${
                        isCatActive
                          ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                      }`}
                    >
                      <span className="text-sm">{getCategoryIcon(cat.icon)}</span>
                      <span className="truncate">{cat.name}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-500">
                        {catReadCount}/{catTopics.length}
                      </span>
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        aria-label="Toggle category"
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Topic Items */}
                  {isExpanded && (
                    <ul className="pb-1.5 px-1.5 space-y-0.5">
                      {catTopics.map((topic) => {
                        const isTopicActive = activeTopicId === topic.id;
                        const isRead = readTopicIds.has(topic.id);

                        return (
                          <li key={topic.id}>
                            <button
                              onClick={() => {
                                onSelectTopic(topic.id);
                                if (window.innerWidth < 1024) onClose();
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between group/item cursor-pointer ${
                                isTopicActive
                                  ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 font-semibold border-l-2 border-indigo-600 dark:border-indigo-500'
                                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {isRead ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                                )}
                                <span className="truncate">{topic.title}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">
                                {topic.readTime}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with hide toggle */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>MechWiki Hub</span>
          <button
            onClick={onClose}
            className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            <span>Hide sidebar</span>
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
