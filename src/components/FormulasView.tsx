import React, { useState, useMemo } from 'react';
import type { TopicDetail, TopicMeta } from '../types';
import { MathView } from './MathView';
import { Search, Layers, ArrowUpRight, Copy, Check } from 'lucide-react';

interface FormulasViewProps {
  topicsMap: Map<string, TopicDetail>;
  allTopics: TopicMeta[];
  onNavigateTopic: (topicId: string) => void;
}

interface FormulaCardItem {
  topicId: string;
  topicTitle: string;
  category: string;
  label: string;
  math: string;
}

export const FormulasView: React.FC<FormulasViewProps> = ({
  topicsMap,
  allTopics,
  onNavigateTopic,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract all formulas from all topics
  const allFormulas = useMemo(() => {
    const list: FormulaCardItem[] = [];

    topicsMap.forEach((topic) => {
      if (topic.infobox?.keyFormulas) {
        topic.infobox.keyFormulas.forEach((f) => {
          list.push({
            topicId: topic.id,
            topicTitle: topic.title,
            category: topic.category,
            label: f.label,
            math: f.math,
          });
        });
      }
    });

    return list;
  }, [topicsMap]);

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allFormulas.forEach((f) => cats.add(f.category));
    return Array.from(cats);
  }, [allFormulas]);

  const filtered = useMemo(() => {
    return allFormulas.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        return (
          item.label.toLowerCase().includes(q) ||
          item.topicTitle.toLowerCase().includes(q) ||
          item.math.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allFormulas, selectedCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      <header className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-2">
          <span>Mechanical Engineering Equations & Formulas</span>
          <span className="text-slate-600">·</span>
          <span>LaTeX Math Sheet</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
          Governing Formula Index
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-3xl">
          Quick-access reference cheat sheet of governing engineering formulas with KaTeX mathematical rendering and one-click LaTeX code copying.
        </p>
      </header>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search formulas by name, variable, or discipline..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Disciplines ({allFormulas.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg shadow-slate-950/20"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="text-indigo-400 font-semibold">{item.category}</span>
                <button
                  onClick={() => onNavigateTopic(item.topicId)}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer group"
                  title="Open topic"
                >
                  <span className="truncate max-w-[140px]">{item.topicTitle}</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-slate-100 mb-3">{item.label}</h3>

              <div className="py-2 px-1">
                <MathView math={item.math} displayMode={true} showCopy={true} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="truncate">Formula #{idx + 1}</span>
              <button
                onClick={() => onNavigateTopic(item.topicId)}
                className="text-indigo-400 hover:underline cursor-pointer"
              >
                View Derivation →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
