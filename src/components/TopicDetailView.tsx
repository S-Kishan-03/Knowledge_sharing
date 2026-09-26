import React, { useEffect, useState } from 'react';
import type { TopicDetail, TopicMeta } from '../types';
import {
  getRoadmapStepForTopic,
  getNextTopicInRoadmap,
  getPreviousTopicInRoadmap,
} from '../data/topicsRegistry';
import { Infobox } from './Infobox';
import { MarkdownView } from './MarkdownView';
import { CalculatorDispatcher } from './calculators/CalculatorDispatcher';
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Check,
  Bookmark,
  Printer,
  Sparkles,
  Compass,
  CheckCircle2,
  Circle,
} from 'lucide-react';

interface TopicDetailViewProps {
  topic: TopicDetail;
  allTopics: TopicMeta[];
  onNavigateTopic: (topicId: string) => void;
  onNavigateCategory: (categoryId: string) => void;
  onNavigateHome: () => void;
  onNavigateRoadmap: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isRead: boolean;
  onToggleRead: () => void;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topic,
  allTopics,
  onNavigateTopic,
  onNavigateCategory,
  onNavigateHome,
  onNavigateRoadmap,
  isBookmarked,
  onToggleBookmark,
  isRead,
  onToggleRead,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(topic.sections[0]?.id || '');
  const [copiedLink, setCopiedLink] = useState(false);

  const currentStep = getRoadmapStepForTopic(topic.id);
  const nextTopic = getNextTopicInRoadmap(topic.id);
  const prevTopic = getPreviousTopicInRoadmap(topic.id);

  // Scrollspy observer for Table of Contents
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    topic.sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [topic]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Find related topic objects
  const relatedTopicsMeta = (topic.relatedTopics || [])
    .map((id) => allTopics.find((t) => t.id === id))
    .filter(Boolean) as TopicMeta[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation + Roadmap Sequence Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            onClick={onNavigateHome}
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <button
            onClick={() => onNavigateCategory(topic.categoryId)}
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            {topic.category}
          </button>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-800 dark:text-slate-300 font-medium truncate max-w-xs sm:max-w-sm">
            {topic.title}
          </span>
        </nav>

        {currentStep && (
          <button
            onClick={onNavigateRoadmap}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:border-indigo-400 transition-colors cursor-pointer shadow-sm"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Roadmap Step {String(currentStep.stepNumber).padStart(2, '0')}/30</span>
          </button>
        )}
      </div>

      {/* Topic Header with Zero-Pill Typography */}
      <header className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{topic.category}</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span>{topic.difficulty}</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span>{topic.readTime} read</span>
          {currentStep && (
            <>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-slate-700 dark:text-slate-300 font-mono">Step {String(currentStep.stepNumber).padStart(2, '0')}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 max-w-4xl text-balance">
          {topic.title}
        </h1>

        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {topic.summary}
        </p>

        {/* Action bar: Mark Read, Bookmark, Share, Print */}
        <div className="flex flex-wrap items-center gap-3 mt-5">
          {/* Read / Completed toggle */}
          <button
            onClick={onToggleRead}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isRead
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm'
            }`}
          >
            {isRead ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Marked as Completed</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                <span>Mark as Read</span>
              </>
            )}
          </button>

          <button
            onClick={onToggleBookmark}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm'
            }`}
          >
            {isBookmarked ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved to Bookmarks</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Topic</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-sm"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            title="Print or Save as PDF"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column (8 or 9 cols) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-10 min-w-0">
          {/* Infobox displayed on mobile */}
          {topic.infobox && (
            <div className="lg:hidden mb-6">
              <Infobox
                infobox={topic.infobox}
                topicTitle={topic.title}
                isBookmarked={isBookmarked}
                onToggleBookmark={onToggleBookmark}
              />
            </div>
          )}

          {/* Sections List */}
          <div className="space-y-12">
            {topic.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 pt-2"
              >
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800/80">
                  {section.heading}
                </h2>

                <div className="wiki-prose text-slate-700 dark:text-slate-300">
                  <MarkdownView
                    content={section.content}
                    onNavigateTopic={onNavigateTopic}
                  />
                </div>

                {/* Embedded Live Calculator */}
                {section.calculator && (
                  <div className="mt-6">
                    <CalculatorDispatcher type={section.calculator} />
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Key Takeaways */}
          {topic.keyTakeaways && topic.keyTakeaways.length > 0 && (
            <div className="rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/20 p-6 mt-10 shadow-sm">
              <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Key Engineering Takeaways</span>
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {topic.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">•</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Forward / Backward Sequential Roadmap Navigation Bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Roadmap Sequence Progression</span>
              </span>
              <button
                onClick={onNavigateRoadmap}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline transition-colors cursor-pointer"
              >
                View Full Curriculum →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Previous Step in Sequence */}
              {prevTopic ? (
                <button
                  onClick={() => onNavigateTopic(prevTopic.id)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-left flex flex-col justify-between group cursor-pointer shadow-sm"
                >
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    <span>Previous Topic</span>
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {prevTopic.title}
                  </span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 text-left">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block mb-1">Roadmap Start</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">First topic in curriculum</span>
                </div>
              )}

              {/* Next Step in Sequence */}
              {nextTopic ? (
                <button
                  onClick={() => {
                    if (!isRead) onToggleRead();
                    onNavigateTopic(nextTopic.id);
                  }}
                  className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/40 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-all text-right flex flex-col justify-between group cursor-pointer shadow-sm"
                >
                  <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 flex items-center justify-end gap-1 mb-1">
                    <span>Next in Sequence</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {nextTopic.title}
                  </span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-right">
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block mb-1">Curriculum Complete</span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">Last topic in sequence</span>
                </div>
              )}
            </div>
          </div>

          {/* Related Topics Cross-Linking */}
          {relatedTopicsMeta.length > 0 && (
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4 text-slate-400" />
                <span>Related Reference Topics</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedTopicsMeta.map((related) => (
                  <button
                    key={related.id}
                    onClick={() => onNavigateTopic(related.id)}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-left group cursor-pointer shadow-sm"
                  >
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                      {related.category}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors mb-1">
                      {related.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {related.summary}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Infobox & Sticky Table of Contents (4 or 3 cols) */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-6 sticky top-20">
          {topic.infobox && (
            <Infobox
              infobox={topic.infobox}
              topicTitle={topic.title}
              isBookmarked={isBookmarked}
              onToggleBookmark={onToggleBookmark}
            />
          )}

          {/* Table of Contents */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 p-5 backdrop-blur-sm shadow-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              On This Page
            </h4>
            <ul className="space-y-1 text-xs">
              {topic.sections.map((sec) => {
                const isActive = activeSectionId === sec.id;
                return (
                  <li key={sec.id}>
                    <button
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors cursor-pointer truncate ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-semibold border-l-2 border-indigo-600 dark:border-indigo-500'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {sec.heading}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
