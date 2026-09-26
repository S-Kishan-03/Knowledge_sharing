import React from 'react';
import type { ActiveView } from '../types';
import { Search, Sun, Moon, PanelLeftClose, PanelLeft, Compass, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenSearch: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isSidebarVisible: boolean;
  onToggleSidebar: () => void;
  bookmarksCount: number;
  readCount: number;
  totalTopicsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  onOpenSearch,
  theme,
  onToggleTheme,
  isSidebarVisible,
  onToggleSidebar,
  bookmarksCount,
  readCount,
  totalTopicsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Zone 1: Single text element brand wordmark + Sidebar toggle */}
      <div className="flex items-center gap-3">
        {/* Universal Sidebar Toggle (Desktop & Mobile) */}
        <button
          onClick={onToggleSidebar}
          aria-label={isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
          title={isSidebarVisible ? 'Hide sidebar (Ctrl+B)' : 'Show sidebar (Ctrl+B)'}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/60 transition-colors cursor-pointer group"
        >
          {isSidebarVisible ? (
            <PanelLeftClose className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          ) : (
            <PanelLeft className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          )}
        </button>

        <button
          onClick={() => onNavigate({ type: 'home' })}
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2 group"
        >
          <span className="font-extrabold tracking-tighter bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 dark:from-indigo-400 dark:via-indigo-300 dark:to-cyan-400 bg-clip-text text-transparent">
            MechWiki
          </span>
        </button>
      </div>

      {/* Zone 2: Clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
        <button
          onClick={() => onNavigate({ type: 'home' })}
          className={`cursor-pointer transition-colors py-1 hover:text-slate-900 dark:hover:text-white whitespace-nowrap ${
            activeView.type === 'home' && !activeView.categoryId
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-500'
              : ''
          }`}
        >
          Disciplines
        </button>

        <button
          onClick={() => onNavigate({ type: 'roadmap' })}
          className={`cursor-pointer transition-colors py-1 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 whitespace-nowrap ${
            activeView.type === 'roadmap'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-500'
              : ''
          }`}
        >
          <span>Roadmap</span>
          {readCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              <span>{readCount}</span>
              <span>/</span>
              <span>{totalTopicsCount}</span>
            </span>
          )}
        </button>

        <button
          onClick={() => onNavigate({ type: 'calculators' })}
          className={`cursor-pointer transition-colors py-1 hover:text-slate-900 dark:hover:text-white whitespace-nowrap ${
            activeView.type === 'calculators'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-500'
              : ''
          }`}
        >
          Calculators
        </button>

        <button
          onClick={() => onNavigate({ type: 'formulas' })}
          className={`cursor-pointer transition-colors py-1 hover:text-slate-900 dark:hover:text-white whitespace-nowrap ${
            activeView.type === 'formulas'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-500'
              : ''
          }`}
        >
          Formulas
        </button>

        <button
          onClick={() => onNavigate({ type: 'constants' })}
          className={`cursor-pointer transition-colors py-1 hover:text-slate-900 dark:hover:text-white whitespace-nowrap ${
            activeView.type === 'constants'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-500'
              : ''
          }`}
        >
          Constants
        </button>

        <button
          onClick={() => onNavigate({ type: 'bookmarks' })}
          className={`cursor-pointer transition-colors py-1 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 whitespace-nowrap ${
            activeView.type === 'bookmarks'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-500'
              : ''
          }`}
        >
          <span>Saved</span>
          {bookmarksCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold">
              {bookmarksCount}
            </span>
          )}
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2.5">
        {/* Quick Search Trigger */}
        <button
          onClick={onOpenSearch}
          aria-label="Open search dialog"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-xs cursor-pointer group"
        >
          <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>
      </div>
    </header>
  );
};
