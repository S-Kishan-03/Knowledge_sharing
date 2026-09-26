import React, { useState, useMemo } from 'react';
import type { Category, TopicMeta } from '../types';
import {
  Search,
  Calculator,
  ArrowRight,
  Compass,
  CheckCircle2,
  Milestone,
} from 'lucide-react';
import heroImage from '../assets/images/hero_engineering_cad_1790441514945.jpg';

interface HomeViewProps {
  categories: Category[];
  topics: TopicMeta[];
  activeCategoryId?: string;
  onSelectTopic: (topicId: string) => void;
  onSelectCategory: (categoryId: string | undefined) => void;
  onSelectCalculators: () => void;
  onSelectRoadmap: () => void;
  readTopicIds: Set<string>;
}

export const HomeView: React.FC<HomeViewProps> = ({
  categories,
  topics,
  activeCategoryId,
  onSelectTopic,
  onSelectCategory,
  onSelectCalculators,
  onSelectRoadmap,
  readTopicIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      // Category filter
      if (activeCategoryId && t.categoryId !== activeCategoryId) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'all' && t.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [topics, activeCategoryId, selectedDifficulty, searchQuery]);

  const activeCategoryObj = categories.find((c) => c.id === activeCategoryId);

  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      design: '📐',
      computer: '🖥️',
      factory: '🏭',
    };
    return iconMap[iconName] || '⚙️';
  };

  const completedCount = readTopicIds.size;
  const progressPercent = Math.round((completedCount / topics.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-in fade-in duration-200">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-10 lg:p-12 shadow-sm dark:shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide">
              <span>Interactive Engineering Reference Hub</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-slate-600 dark:text-slate-300">3 Core Pillars</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight text-balance">
              Precision Mechanical Engineering Knowledge Base
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Explore mathematical derivations, Wikipedia-grade technical specifications, and live unit-aware calculators spanning <strong>Product Design & CAD</strong>, <strong>Simulation & Analysis (CAE)</strong>, and <strong>Manufacturing & CAM</strong>.
            </p>

            {/* Stats row with Tabular Numerals */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <div>
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {topics.length}
                </span>{' '}
                <span className="text-slate-600 dark:text-slate-400 font-sans">Curated Topics</span>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  3
                </span>{' '}
                <span className="text-slate-600 dark:text-slate-400 font-sans">Core Disciplines</span>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  6
                </span>{' '}
                <span className="text-slate-600 dark:text-slate-400 font-sans">Live Calculators</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onSelectRoadmap}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Open Roadmap (roadmap.sh Flowchart)</span>
              </button>

              <button
                onClick={onSelectCalculators}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-sm border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Calculators</span>
              </button>
            </div>
          </div>

          {/* Hero Visual Asset */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/60 shadow-md dark:shadow-2xl aspect-[16/10] bg-slate-950">
              <img
                src={heroImage}
                alt="High-precision CAD aerospace turbine and gear mechanical assembly"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-slate-300 flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-300">Integrated CAD-CAE-CAM Pipeline</span>
                <span className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">ISO Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Roadmap Tracker Banner */}
      <section className="rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/70 dark:bg-indigo-950/20 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Interactive Learning Sequence</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Track your reading progress &amp; advance through the curriculum
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Follow a sequence of 30 topics organized across Product Design, CAE Simulation, and CAM Manufacturing. Check off completed topics and move forward sequentially.
          </p>

          <div className="pt-2 flex items-center gap-3 text-xs">
            <div className="w-48 h-2 rounded-full bg-slate-200 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-slate-600 dark:text-slate-400">
              {completedCount} of {topics.length} read ({progressPercent}%)
            </span>
          </div>
        </div>

        <button
          onClick={onSelectRoadmap}
          className="self-start md:self-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Open Full Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* 3 Core Disciplines Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              3 Core Engineering Disciplines
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              All 30 engineering topics organized under the 3 industry pillars
            </p>
          </div>

          {activeCategoryId && (
            <button
              onClick={() => onSelectCategory(undefined)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors cursor-pointer"
            >
              Clear Filter (Show All 3)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const catTopics = topics.filter((t) => t.categoryId === cat.id);
            const count = catTopics.length;
            const isSelected = activeCategoryId === cat.id;
            const catRead = catTopics.filter((t) => readTopicIds.has(t.id)).length;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? undefined : cat.id)}
                className={`p-6 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-600/15 border-indigo-600 dark:border-indigo-500 shadow-md'
                    : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        {count} topics
                      </span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                        {catRead}/{count} read
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  <span>{isSelected ? 'Currently Viewing' : 'Explore Category'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section id="catalog-section" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{activeCategoryObj ? activeCategoryObj.name : 'All Engineering Topics'}</span>
              <span className="font-mono text-sm font-normal text-slate-500 dark:text-slate-400">
                ({filteredTopics.length})
              </span>
            </h2>
          </div>

          {/* Difficulty segmented tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            {['all', 'beginner', 'intermediate', 'advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Search input in catalog */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter catalog by keywords, formulas, or material properties..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
          />
        </div>

        {/* Topics Grid */}
        {filteredTopics.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-slate-700 dark:text-slate-300 font-medium">No topics found matching your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the difficulty or search filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('all');
                onSelectCategory(undefined);
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-xs text-white font-medium cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTopics.map((topic) => {
              const isRead = readTopicIds.has(topic.id);

              return (
                <article
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.id)}
                  className={`group p-5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer shadow-sm ${
                    isRead
                      ? 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/60'
                      : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Zero-Pill Lead Metadata */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">{topic.category}</span>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <span>{topic.difficulty}</span>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <span>{topic.readTime}</span>
                      </div>

                      {isRead && (
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Read</span>
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-base font-bold transition-colors ${
                        isRead ? 'text-slate-700 dark:text-slate-200' : 'text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300'
                      }`}
                    >
                      {topic.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {topic.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[11px] text-slate-500 font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
