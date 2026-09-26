import React, { useState, useEffect, useCallback } from 'react';
import type { ActiveView, BookmarkItem } from './types';
import { siteData, topicsMap, getAllTopics, getTopicById } from './data/topicsRegistry';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { TopicDetailView } from './components/TopicDetailView';
import { CalculatorsView } from './components/CalculatorsView';
import { FormulasView } from './components/FormulasView';
import { ConstantsView } from './components/ConstantsView';
import { BookmarksView } from './components/BookmarksView';
import { RoadmapView } from './components/RoadmapView';
import { SearchModal } from './components/SearchModal';
import { PanelLeft } from 'lucide-react';

export const App: React.FC = () => {
  // Theme state with localStorage sync
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('mechwiki_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('mechwiki_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sidebar visibility state with localStorage sync
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem('mechwiki_sidebar_hidden');
    if (saved !== null) {
      return saved !== 'true';
    }
    // Default open on larger screens
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });

  const toggleSidebar = () => {
    setSidebarVisible((prev) => {
      const next = !prev;
      localStorage.setItem('mechwiki_sidebar_hidden', String(!next));
      return next;
    });
  };

  // Read / Completed topics set with localStorage sync
  const [readTopicIds, setReadTopicIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('mechwiki_read_topics');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleReadTopic = (topicId: string) => {
    setReadTopicIds((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      localStorage.setItem('mechwiki_read_topics', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const resetReadProgress = () => {
    setReadTopicIds(new Set());
    localStorage.removeItem('mechwiki_read_topics');
  };

  // Bookmarks state with localStorage sync
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('mechwiki_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (topicId: string) => {
    const topic = getTopicById(topicId);
    if (!topic) return;

    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === topicId);
      let updated: BookmarkItem[];
      if (exists) {
        updated = prev.filter((b) => b.id !== topicId);
      } else {
        updated = [
          ...prev,
          {
            id: topic.id,
            title: topic.title,
            category: topic.category,
            categoryId: topic.categoryId,
            dateAdded: Date.now(),
          },
        ];
      }
      localStorage.setItem('mechwiki_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const removeBookmark = (topicId: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== topicId);
      localStorage.setItem('mechwiki_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllBookmarks = () => {
    setBookmarks([]);
    localStorage.removeItem('mechwiki_bookmarks');
  };

  // Hash-based client router
  const parseHash = (): ActiveView => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash || hash === 'home') return { type: 'home' };
    if (hash.startsWith('category/')) {
      return { type: 'home', categoryId: hash.replace('category/', '') };
    }
    if (hash.startsWith('topic/')) {
      return { type: 'topic', topicId: hash.replace('topic/', '') };
    }
    if (hash.startsWith('calculators')) {
      const parts = hash.split('/');
      return { type: 'calculators', activeCalcId: parts[1] };
    }
    if (hash === 'roadmap') return { type: 'roadmap' };
    if (hash === 'formulas') return { type: 'formulas' };
    if (hash === 'constants') return { type: 'constants' };
    if (hash === 'bookmarks') return { type: 'bookmarks' };
    return { type: 'home' };
  };

  const [activeView, setActiveView] = useState<ActiveView>(parseHash);
  const [searchOpen, setSearchOpen] = useState(false);

  // Sync state on hash change
  useEffect(() => {
    const onHashChange = () => {
      setActiveView(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((view: ActiveView) => {
    setActiveView(view);
    let hash = '#home';
    if (view.type === 'home') {
      hash = view.categoryId ? `#category/${view.categoryId}` : '#home';
    } else if (view.type === 'topic') {
      hash = `#topic/${view.topicId}`;
    } else if (view.type === 'calculators') {
      hash = view.activeCalcId ? `#calculators/${view.activeCalcId}` : '#calculators';
    } else if (view.type === 'roadmap') {
      hash = '#roadmap';
    } else if (view.type === 'formulas') {
      hash = '#formulas';
    } else if (view.type === 'constants') {
      hash = '#constants';
    } else if (view.type === 'bookmarks') {
      hash = '#bookmarks';
    }

    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Global keyboard shortcuts (Cmd+K for search, Ctrl+B for sidebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      } else if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const allTopics = getAllTopics();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-600 selection:text-white transition-colors duration-150">
      {/* 3-Zone Top Bar */}
      <Navbar
        activeView={activeView}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        isSidebarVisible={sidebarVisible}
        onToggleSidebar={toggleSidebar}
        bookmarksCount={bookmarks.length}
        readCount={readTopicIds.size}
        totalTopicsCount={allTopics.length}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex relative">
        {/* Floating reveal button when sidebar is hidden on desktop */}
        {!sidebarVisible && (
          <button
            onClick={toggleSidebar}
            title="Show sidebar (Ctrl+B)"
            aria-label="Show navigation sidebar"
            className="fixed left-3 top-20 z-30 px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-sm transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5 text-xs font-semibold group animate-in fade-in slide-in-from-left-2 duration-150"
          >
            <PanelLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Sidebar</span>
          </button>
        )}

        {/* Collapsible/Hideable Navigation Sidebar */}
        <Sidebar
          categories={siteData.categories}
          topics={allTopics}
          activeTopicId={activeView.type === 'topic' ? activeView.topicId : undefined}
          activeCategoryId={activeView.type === 'home' ? activeView.categoryId : undefined}
          onSelectTopic={(id) => navigate({ type: 'topic', topicId: id })}
          onSelectCategory={(id) => navigate({ type: 'home', categoryId: id })}
          onSelectCalculators={() => navigate({ type: 'calculators' })}
          onSelectRoadmap={() => navigate({ type: 'roadmap' })}
          isVisible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          readTopicIds={readTopicIds}
        />

        {/* Content Region - dynamically expands when sidebar is hidden */}
        <main
          className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-out ${
            sidebarVisible ? 'lg:pl-72' : 'lg:pl-0'
          }`}
        >
          <div className="flex-1">
            {activeView.type === 'home' && (
              <HomeView
                categories={siteData.categories}
                topics={allTopics}
                activeCategoryId={activeView.categoryId}
                onSelectTopic={(id) => navigate({ type: 'topic', topicId: id })}
                onSelectCategory={(id) => navigate({ type: 'home', categoryId: id })}
                onSelectCalculators={() => navigate({ type: 'calculators' })}
                onSelectRoadmap={() => navigate({ type: 'roadmap' })}
                readTopicIds={readTopicIds}
              />
            )}

            {activeView.type === 'roadmap' && (
              <RoadmapView
                allTopics={allTopics}
                readTopicIds={readTopicIds}
                onToggleReadTopic={toggleReadTopic}
                onSelectTopic={(id) => navigate({ type: 'topic', topicId: id })}
                onResetProgress={resetReadProgress}
              />
            )}

            {activeView.type === 'topic' && (() => {
              const currentTopic = getTopicById(activeView.topicId);
              if (!currentTopic) {
                return (
                  <div className="max-w-2xl mx-auto py-24 text-center space-y-4">
                    <h2 className="text-2xl font-bold text-slate-100">Topic Not Found</h2>
                    <p className="text-sm text-slate-400">
                      The mechanical engineering topic &ldquo;{activeView.topicId}&rdquo; could not be loaded.
                    </p>
                    <button
                      onClick={() => navigate({ type: 'home' })}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-500 cursor-pointer"
                    >
                      Return to Engineering Catalog
                    </button>
                  </div>
                );
              }
              return (
                <TopicDetailView
                  topic={currentTopic}
                  allTopics={allTopics}
                  onNavigateTopic={(id) => navigate({ type: 'topic', topicId: id })}
                  onNavigateCategory={(catId) => navigate({ type: 'home', categoryId: catId })}
                  onNavigateHome={() => navigate({ type: 'home' })}
                  onNavigateRoadmap={() => navigate({ type: 'roadmap' })}
                  isBookmarked={bookmarks.some((b) => b.id === currentTopic.id)}
                  onToggleBookmark={() => toggleBookmark(currentTopic.id)}
                  isRead={readTopicIds.has(currentTopic.id)}
                  onToggleRead={() => toggleReadTopic(currentTopic.id)}
                />
              );
            })()}

            {activeView.type === 'calculators' && (
              <CalculatorsView
                initialCalcId={activeView.activeCalcId}
                onNavigateTopic={(topicId) => navigate({ type: 'topic', topicId })}
              />
            )}

            {activeView.type === 'formulas' && (
              <FormulasView
                topicsMap={topicsMap}
                allTopics={allTopics}
                onNavigateTopic={(topicId) => navigate({ type: 'topic', topicId })}
              />
            )}

            {activeView.type === 'constants' && <ConstantsView />}

            {activeView.type === 'bookmarks' && (
              <BookmarksView
                bookmarks={bookmarks}
                allTopics={allTopics}
                onSelectTopic={(topicId) => navigate({ type: 'topic', topicId })}
                onRemoveBookmark={removeBookmark}
                onClearAll={clearAllBookmarks}
              />
            )}
          </div>

          {/* Quiet, Human-Engineered Footer */}
          <footer className="mt-16 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/60 py-8 px-6 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 dark:text-slate-200">MechWiki</span>
              <span className="text-slate-400 dark:text-slate-600">·</span>
              <span>Open Mechanical Engineering Knowledge Hub</span>
              <span className="text-slate-400 dark:text-slate-600">·</span>
              <span>MIT License</span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <button
                onClick={() => navigate({ type: 'home' })}
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Disciplines
              </button>
              <button
                onClick={() => navigate({ type: 'roadmap' })}
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer text-indigo-600 dark:text-indigo-400 font-semibold"
              >
                Roadmap
              </button>
              <button
                onClick={() => navigate({ type: 'calculators' })}
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Calculators
              </button>
              <button
                onClick={() => navigate({ type: 'formulas' })}
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Formulas
              </button>
              <button
                onClick={() => navigate({ type: 'constants' })}
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Constants
              </button>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        topics={allTopics}
        onSelectTopic={(id) => navigate({ type: 'topic', topicId: id })}
      />
    </div>
  );
};
