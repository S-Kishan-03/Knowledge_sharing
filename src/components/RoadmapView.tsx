import React, { useState, useMemo } from 'react';
import type { TopicMeta, TopicDetail } from '../types';
import { ROADMAP_STEPS, getTopicById } from '../data/topicsRegistry';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Compass,
  Sparkles,
  Layers,
  ChevronRight,
  RotateCcw,
  BookOpen,
  X,
  ExternalLink,
  Milestone,
  Check,
  Award,
  Filter,
  Eye,
  GitBranch,
  ListOrdered,
  Calculator,
  Search,
  Share2,
  BookmarkCheck,
  ChevronDown,
} from 'lucide-react';

interface RoadmapViewProps {
  allTopics: TopicMeta[];
  readTopicIds: Set<string>;
  onToggleReadTopic: (topicId: string) => void;
  onSelectTopic: (topicId: string) => void;
  onResetProgress: () => void;
}

interface RoadmapModule {
  id: string;
  phaseId: 'phase-1' | 'phase-2' | 'phase-3';
  phaseTitle: string;
  moduleTitle: string;
  topicIds: string[];
}

const TOPIC_CALCULATOR_MAP: Record<string, { id: string; name: string }> = {
  'thermodynamics-laws': { id: 'carnot', name: 'Carnot Calculator' },
  'bernoulli-fluid-mechanics': { id: 'bernoulli', name: 'Bernoulli Calculator' },
  'stress-strain-analysis': { id: 'stress', name: 'Stress-Strain Calculator' },
  'spur-gear-design': { id: 'gears', name: 'Gear Kinematics Calculator' },
  'machining-fundamentals': { id: 'milling', name: 'Milling Speeds & Feeds' },
  'gdnt-fundamentals': { id: 'gdnt', name: 'GD&T Position Calculator' },
};

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  allTopics,
  readTopicIds,
  onToggleReadTopic,
  onSelectTopic,
  onResetProgress,
}) => {
  const [viewMode, setViewMode] = useState<'flowchart' | 'list'>('flowchart');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<'all' | 'unread' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  // Topics map for fast lookup
  const topicsLookup = useMemo(() => {
    const map = new Map<string, TopicMeta>();
    allTopics.forEach((t) => map.set(t.id, t));
    return map;
  }, [allTopics]);

  // Overall progress stats
  const totalCount = ROADMAP_STEPS.length;
  const completedCount = ROADMAP_STEPS.filter((s) => readTopicIds.has(s.topicId)).length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Next up step
  const nextUnreadStep = ROADMAP_STEPS.find((s) => !readTopicIds.has(s.topicId));
  const nextUnreadTopic = nextUnreadStep ? topicsLookup.get(nextUnreadStep.topicId) : undefined;

  // Selected topic details for roadmap.sh style interactive popover/drawer
  const selectedTopicDetail: TopicDetail | undefined = useMemo(() => {
    return selectedTopicId ? getTopicById(selectedTopicId) : undefined;
  }, [selectedTopicId]);

  // Structured roadmap modules modeled directly on roadmap.sh architecture
  const modules: RoadmapModule[] = [
    // Phase 1: Product Design & CAD
    {
      id: 'mod-1',
      phaseId: 'phase-1',
      phaseTitle: 'Phase 1 · Product Design & CAD',
      moduleTitle: 'Requirements & 3D CAD Modeling',
      topicIds: ['engineering-specifications', 'new-product-design', 'cad-computer-aided-design'],
    },
    {
      id: 'mod-2',
      phaseId: 'phase-1',
      phaseTitle: 'Phase 1 · Product Design & CAD',
      moduleTitle: 'Drafting, Fits & Tolerances',
      topicIds: [
        'engineering-drawings-and-bom',
        'iso-fits-and-surface-finish',
        'gdnt-fundamentals',
        'tolerance-stack-up-analysis',
      ],
    },
    {
      id: 'mod-3',
      phaseId: 'phase-1',
      phaseTitle: 'Phase 1 · Product Design & CAD',
      moduleTitle: 'Machine Elements & Design Validation',
      topicIds: [
        'fasteners-and-threaded-joints',
        'springs-seals-and-keys',
        'prototype-testing-and-validation',
        'cad-customization-automation',
      ],
    },

    // Phase 2: Simulation & Analysis (CAE)
    {
      id: 'mod-4',
      phaseId: 'phase-2',
      phaseTitle: 'Phase 2 · Simulation & Analysis (CAE)',
      moduleTitle: 'Statics, Mechanics & Kinematics',
      topicIds: ['stress-strain-analysis', 'mechanism-and-kinematics-analysis'],
    },
    {
      id: 'mod-5',
      phaseId: 'phase-2',
      phaseTitle: 'Phase 2 · Simulation & Analysis (CAE)',
      moduleTitle: 'Thermodynamics & Fluid Dynamics',
      topicIds: ['thermodynamics-laws', 'bernoulli-fluid-mechanics', 'thermal-and-cfd-analysis'],
    },
    {
      id: 'mod-6',
      phaseId: 'phase-2',
      phaseTitle: 'Phase 2 · Simulation & Analysis (CAE)',
      moduleTitle: 'Finite Element Analysis & Durability',
      topicIds: ['cae-analysis', 'fatigue-and-failure-analysis'],
    },

    // Phase 3: Manufacturing & CAM
    {
      id: 'mod-7',
      phaseId: 'phase-3',
      phaseTitle: 'Phase 3 · Manufacturing & CAM',
      moduleTitle: 'Subtractive CNC Machining & Toolpaths',
      topicIds: [
        'manufacturing-process-selection',
        'machining-fundamentals',
        'cam-computer-aided-manufacturing',
      ],
    },
    {
      id: 'mod-8',
      phaseId: 'phase-3',
      phaseTitle: 'Phase 3 · Manufacturing & CAM',
      moduleTitle: 'Power Transmission & Rotating Machinery',
      topicIds: ['spur-gear-design', 'bearings-and-shafts', 'mechanical-power-transmission'],
    },
    {
      id: 'mod-9',
      phaseId: 'phase-3',
      phaseTitle: 'Phase 3 · Manufacturing & CAM',
      moduleTitle: 'Fabrication, Casting & 3D Printing',
      topicIds: [
        'sheet-metal-manufacturing',
        'casting-forging-and-molding',
        'welding-and-joining',
        'additive-manufacturing',
      ],
    },
    {
      id: 'mod-10',
      phaseId: 'phase-3',
      phaseTitle: 'Phase 3 · Manufacturing & CAM',
      moduleTitle: 'Metrology, Inspection & SPC Quality',
      topicIds: ['metrology-and-inspection', 'quality-control-and-spc'],
    },
  ];

  // Group modules by Phase
  const phases = [
    {
      id: 'phase-1',
      title: '1. Product Design & CAD',
      badge: 'Design & Drafting',
      color: 'indigo',
      desc: 'Master product specifications, 3D CAD modeling, GD&T tolerancing, dimension stack-ups, and joint mechanics.',
      modules: modules.filter((m) => m.phaseId === 'phase-1'),
    },
    {
      id: 'phase-2',
      title: '2. Simulation & Analysis (CAE)',
      badge: 'Physics & FEA',
      color: 'cyan',
      desc: 'Formulate stress-strain elasticity, thermodynamics, fluid dynamics, and FEA/CFD finite element simulation.',
      modules: modules.filter((m) => m.phaseId === 'phase-2'),
    },
    {
      id: 'phase-3',
      title: '3. Manufacturing & CAM',
      badge: 'Production & Quality',
      color: 'emerald',
      desc: 'Execute CNC milling, gear transmission, sheet metal, casting, additive manufacturing, and SPC quality control.',
      modules: modules.filter((m) => m.phaseId === 'phase-3'),
    },
  ];

  const handleShare = () => {
    const text = `I have completed ${completedCount} of ${totalCount} topics (${progressPercent}%) on the MechWiki Mechanical Engineer Roadmap!`;
    navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#roadmap');
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleJumpToNext = () => {
    if (nextUnreadTopic) {
      setSelectedTopicId(nextUnreadTopic.id);
      const el = document.getElementById(`node-${nextUnreadTopic.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header with roadmap.sh aesthetic */}
      <header className="pb-6 border-b border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Mechanical Engineering Roadmap 2026</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>roadmap.sh Style Sequence</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Share roadmap link"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            {completedCount > 0 && (
              <button
                onClick={onResetProgress}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500/50 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                title="Reset all checkmarks"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Mechanical Engineer Roadmap
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Community-curated sequential learning path to mastering modern mechanical engineering. Follow the connected nodes from <strong>Product Design</strong> through <strong>CAE Simulation</strong> to <strong>CAM &amp; Quality</strong>. Click any box to inspect formulas, calculators, and take-aways, or mark topics completed.
        </p>

        {/* roadmap.sh Iconic Legend Strip */}
        <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
            Legend:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600" />
            <span>Completed / Read</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500 animate-pulse" />
            <span>Current / Up Next</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600" />
            <span>To Learn / Unread</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Interactive Calculator</span>
          </div>
        </div>
      </header>

      {/* Control Bar: Mode Toggle + Search + Progress Meter */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* View mode toggle: Flowchart vs List */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setViewMode('flowchart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'flowchart'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Flowchart View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Structured List</span>
            </button>
          </div>

          {/* Quick Filter Search in Roadmap */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find node in roadmap..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Overall progress indicator */}
          <div className="flex items-center gap-3 text-xs shrink-0">
            <div className="text-right">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                {completedCount}/{totalCount} Completed
              </span>
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                {progressPercent}% Done
              </span>
            </div>

            <div className="w-24 sm:w-32 h-2.5 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter nodes & Up Next quick jump */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Show:</span>
            <div className="flex items-center gap-1">
              {(['all', 'unread', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterState(filter)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                    filterState === filter
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {nextUnreadTopic && (
            <button
              onClick={handleJumpToNext}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 font-medium transition-all cursor-pointer shadow-xs group"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>
                Step {String(nextUnreadStep?.stepNumber).padStart(2, '0')}:{' '}
                <strong>{nextUnreadTopic.title}</strong>
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* ROADMAP.SH FLOWCHART VIEW */}
      {viewMode === 'flowchart' ? (
        <div className="relative py-4 max-w-4xl mx-auto space-y-10">
          {/* Start Pill Banner (roadmap.sh style milestone start) */}
          <div className="flex flex-col items-center">
            <div className="px-6 py-3 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm tracking-tight shadow-md flex items-center gap-2 border-2 border-amber-500/80">
              <Milestone className="w-4 h-4 text-slate-950" />
              <span>START: Mechanical Engineering Curriculum</span>
            </div>
            {/* Vertical Flow Connector with Arrowhead */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-700" />
              <ChevronDown className="w-4 h-4 -mt-2 text-slate-400 dark:text-slate-600" />
            </div>
          </div>

          {/* Phase Blocks with Connected Nodes */}
          {phases.map((phase, pIdx) => {
            return (
              <div key={phase.id} className="relative space-y-6">
                {/* Phase Section Milestone Node */}
                <div className="flex flex-col items-center text-center">
                  <div className="px-6 py-3.5 rounded-2xl border-2 border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-base sm:text-lg shadow-sm max-w-lg w-full">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-0.5 font-bold">
                      {phase.badge}
                    </div>
                    <div>{phase.title}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mt-1 leading-snug">
                      {phase.desc}
                    </p>
                  </div>
                  {/* Stem connector with Arrow */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-7 bg-slate-300 dark:bg-slate-700" />
                    <ChevronDown className="w-4 h-4 -mt-2 text-slate-400 dark:text-slate-600" />
                  </div>
                </div>

                {/* Sub-modules & flowchart node clusters */}
                <div className="space-y-6">
                  {phase.modules.map((mod, mIdx) => {
                    const visibleTopicIds = mod.topicIds.filter((tId) => {
                      const topic = topicsLookup.get(tId);
                      if (!topic) return false;

                      // Filter state
                      const isRead = readTopicIds.has(tId);
                      if (filterState === 'unread' && isRead) return false;
                      if (filterState === 'completed' && !isRead) return false;

                      // Search query
                      if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase().trim();
                        const match =
                          topic.title.toLowerCase().includes(q) ||
                          topic.summary.toLowerCase().includes(q) ||
                          topic.tags.some((tag) => tag.toLowerCase().includes(q));
                        if (!match) return false;
                      }

                      return true;
                    });

                    if (visibleTopicIds.length === 0) return null;

                    return (
                      <div key={mod.id} className="relative flex flex-col items-center">
                        {/* Sub-module grouped box (roadmap.sh category boundary) */}
                        <div className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-4 sm:p-5 space-y-3.5 shadow-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span>{mod.moduleTitle}</span>
                            </h3>
                            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                              {visibleTopicIds.length} topics
                            </span>
                          </div>

                          {/* Nodes grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {visibleTopicIds.map((topicId) => {
                              const topic = topicsLookup.get(topicId);
                              if (!topic) return null;

                              const isDone = readTopicIds.has(topicId);
                              const isNext = nextUnreadStep?.topicId === topicId;
                              const isSelected = selectedTopicId === topicId;
                              const calcInfo = TOPIC_CALCULATOR_MAP[topicId];
                              const step = ROADMAP_STEPS.find((s) => s.topicId === topicId);

                              return (
                                <div
                                  id={`node-${topicId}`}
                                  key={topicId}
                                  onClick={() => setSelectedTopicId(topicId)}
                                  className={`relative group rounded-xl border-2 p-3.5 text-left transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                                    isDone
                                      ? 'bg-emerald-50/90 dark:bg-emerald-950/25 border-emerald-500 dark:border-emerald-600'
                                      : isNext
                                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 dark:border-amber-500 ring-2 ring-amber-400/40'
                                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400'
                                  } ${isSelected ? 'ring-2 ring-indigo-500 shadow-lg' : ''}`}
                                >
                                  <div>
                                    {/* Top row: Step number + Checkbox toggle */}
                                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <span>Step {String(step?.stepNumber || '').padStart(2, '0')}</span>
                                        {calcInfo && (
                                          <span
                                            title="Includes interactive live calculator"
                                            className="text-cyan-600 dark:text-cyan-400 inline-flex items-center"
                                          >
                                            <Calculator className="w-3 h-3" />
                                          </span>
                                        )}
                                      </span>

                                      {/* Interactive Done Checkbox */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onToggleReadTopic(topicId);
                                        }}
                                        title={isDone ? 'Mark unread' : 'Mark completed'}
                                        aria-label={isDone ? 'Mark unread' : 'Mark completed'}
                                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer group-hover:scale-110"
                                      >
                                        {isDone ? (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        ) : (
                                          <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />
                                        )}
                                      </button>
                                    </div>

                                    {/* Topic title */}
                                    <h4
                                      className={`text-xs font-bold leading-snug line-clamp-2 ${
                                        isDone
                                          ? 'text-emerald-950 dark:text-emerald-200'
                                          : isNext
                                          ? 'text-amber-950 dark:text-amber-200'
                                          : 'text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300'
                                      }`}
                                    >
                                      {topic.title}
                                    </h4>
                                  </div>

                                  {/* Bottom metadata strip */}
                                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                                    <span className="text-slate-500 dark:text-slate-400 font-mono">
                                      {topic.readTime}
                                    </span>

                                    {isDone ? (
                                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                        <Check className="w-3 h-3" />
                                        <span>Completed</span>
                                      </span>
                                    ) : isNext ? (
                                      <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                                        <span>Up Next</span>
                                        <ArrowRight className="w-3 h-3" />
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300">
                                        Details →
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Connector down to next module */}
                        {mIdx < phase.modules.length - 1 && (
                          <div className="flex flex-col items-center">
                            <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
                            <ChevronDown className="w-3.5 h-3.5 -mt-1.5 text-slate-400 dark:text-slate-600" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Connector down to next phase */}
                {pIdx < phases.length - 1 && (
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-700" />
                    <ChevronDown className="w-4 h-4 -mt-2 text-slate-400 dark:text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Curriculum Completion Milestone Badge */}
          <div className="flex flex-col items-center pt-2">
            <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
            <ChevronDown className="w-4 h-4 -mt-1.5 text-slate-400 dark:text-slate-600 mb-2" />
            <div className="px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm shadow-xl flex items-center gap-2.5 border-2 border-emerald-500">
              <Award className="w-5 h-5 text-white" />
              <span>GOAL: Certified Mechanical Design &amp; CAE Mastery</span>
            </div>
          </div>
        </div>
      ) : (
        /* ROADMAP LIST VIEW */
        <div className="space-y-6">
          {phases.map((phase) => {
            const phaseSteps = ROADMAP_STEPS.filter((s) => s.phaseId === phase.id);
            const visibleSteps = phaseSteps.filter((s) => {
              const isRead = readTopicIds.has(s.topicId);
              if (filterState === 'unread' && isRead) return false;
              if (filterState === 'completed' && !isRead) return false;

              if (searchQuery.trim()) {
                const topic = topicsLookup.get(s.topicId);
                if (!topic) return false;
                const q = searchQuery.toLowerCase().trim();
                return (
                  topic.title.toLowerCase().includes(q) ||
                  topic.summary.toLowerCase().includes(q) ||
                  s.focus.toLowerCase().includes(q)
                );
              }
              return true;
            });

            if (visibleSteps.length === 0) return null;

            return (
              <section
                key={phase.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {phase.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{phase.desc}</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg">
                    {phaseSteps.filter((s) => readTopicIds.has(s.topicId)).length} /{' '}
                    {phaseSteps.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {visibleSteps.map((step) => {
                    const topic = topicsLookup.get(step.topicId);
                    if (!topic) return null;

                    const isDone = readTopicIds.has(step.topicId);
                    const isNext = nextUnreadStep?.topicId === step.topicId;
                    const calcInfo = TOPIC_CALCULATOR_MAP[step.topicId];

                    return (
                      <div
                        key={step.stepNumber}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isNext
                            ? 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-400 dark:border-amber-500'
                            : isDone
                            ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <button
                            onClick={() => onToggleReadTopic(step.topicId)}
                            title={isDone ? 'Mark unread' : 'Mark done'}
                            className="mt-0.5 shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                            )}
                          </button>

                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                Step {String(step.stepNumber).padStart(2, '0')}
                              </span>
                              <span className="text-slate-300 dark:text-slate-600">·</span>
                              <span className="text-slate-500 dark:text-slate-400">
                                {topic.readTime}
                              </span>
                              {calcInfo && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-1.5 py-0.5 rounded">
                                  <Calculator className="w-3 h-3" />
                                  <span>Calculator</span>
                                </span>
                              )}
                              {isNext && (
                                <span className="font-bold text-[10px] uppercase text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-400/20 px-1.5 py-0.5 rounded">
                                  Up Next
                                </span>
                              )}
                            </div>

                            <h3
                              onClick={() => setSelectedTopicId(step.topicId)}
                              className={`text-sm font-bold cursor-pointer hover:underline ${
                                isDone
                                  ? 'text-slate-600 dark:text-slate-300'
                                  : 'text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              {topic.title}
                            </h3>

                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              {step.focus}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => onSelectTopic(step.topicId)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer flex items-center gap-1"
                          >
                            <span>Read</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ROADMAP.SH STYLE NODE DETAIL MODAL / DRAWER */}
      {selectedTopicDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSelectedTopicId(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {selectedTopicDetail.category}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {selectedTopicDetail.readTime} read
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {selectedTopicDetail.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {selectedTopicDetail.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedTopicId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedTopicDetail.summary}
            </p>

            {/* Key Takeaways preview if available */}
            {selectedTopicDetail.keyTakeaways && selectedTopicDetail.keyTakeaways.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Key Concepts Covered:
                </span>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  {selectedTopicDetail.keyTakeaways.slice(0, 3).map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* If has calculator */}
            {TOPIC_CALCULATOR_MAP[selectedTopicDetail.id] && (
              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-300">
                  <Calculator className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>
                    Interactive Tool: <strong>{TOPIC_CALCULATOR_MAP[selectedTopicDetail.id].name}</strong>
                  </span>
                </div>
                <button
                  onClick={() => {
                    const calc = TOPIC_CALCULATOR_MAP[selectedTopicDetail.id];
                    setSelectedTopicId(null);
                    window.location.hash = `#calculators/${calc.id}`;
                  }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold cursor-pointer"
                >
                  Open Tool
                </button>
              </div>
            )}

            {/* Actions: Mark Done / Open Article */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  onToggleReadTopic(selectedTopicDetail.id);
                }}
                className={`w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border ${
                  readTopicIds.has(selectedTopicDetail.id)
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                }`}
              >
                {readTopicIds.has(selectedTopicDetail.id) ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Completed (Click to Undo)</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>Mark as Done</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setSelectedTopicId(null);
                  onSelectTopic(selectedTopicDetail.id);
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <span>Read Full Article</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
