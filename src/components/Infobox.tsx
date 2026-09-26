import React from 'react';
import type { InfoboxData } from '../types';
import { MathView } from './MathView';
import { Layers, Bookmark, Check } from 'lucide-react';

interface InfoboxProps {
  infobox: InfoboxData;
  topicTitle: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const Infobox: React.FC<InfoboxProps> = ({
  infobox,
  topicTitle,
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <aside className="w-full lg:w-80 shrink-0 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl shadow-slate-950/40 backdrop-blur-sm self-start">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl">
            {infobox.imageSymbol || '⚙️'}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight leading-snug">
              {infobox.title || `${topicTitle} Specs`}
            </h3>
            <span className="text-xs text-slate-400">Engineering Reference</span>
          </div>
        </div>

        {onToggleBookmark && (
          <button
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this topic'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {isBookmarked ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Key Formulas */}
      {infobox.keyFormulas && infobox.keyFormulas.length > 0 && (
        <div className="py-4 border-b border-slate-800/80">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Key Governing Formulas</span>
          </h4>
          <div className="space-y-2">
            {infobox.keyFormulas.map((f, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60"
              >
                <div className="text-[11px] font-medium text-slate-400 mb-1">
                  {f.label}
                </div>
                <div className="overflow-x-auto text-center font-mono">
                  <MathView math={f.math} displayMode={true} showCopy={true} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Metadata Table */}
      <dl className="pt-3 divide-y divide-slate-800/60 text-xs">
        {infobox.siUnits && (
          <div className="py-2.5 flex justify-between gap-4">
            <dt className="text-slate-400 font-medium shrink-0">SI Units</dt>
            <dd className="text-slate-200 text-right font-mono font-medium">
              {infobox.siUnits}
            </dd>
          </div>
        )}

        {infobox.primaryFields && (
          <div className="py-2.5 flex justify-between gap-4">
            <dt className="text-slate-400 font-medium shrink-0">Primary Fields</dt>
            <dd className="text-slate-200 text-right leading-relaxed">
              {infobox.primaryFields}
            </dd>
          </div>
        )}

        {infobox.keyConstants && (
          <div className="py-2.5 flex flex-col gap-1.5">
            <dt className="text-slate-400 font-medium">Key Constants & Values</dt>
            <dd className="text-slate-300 font-mono text-[11px] bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 leading-relaxed">
              {infobox.keyConstants}
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
};
