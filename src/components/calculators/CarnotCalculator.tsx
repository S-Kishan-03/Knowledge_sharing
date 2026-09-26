import React, { useState, useMemo } from 'react';
import { Flame, Zap, AlertTriangle, RotateCcw } from 'lucide-react';

type CarnotResult =
  | { valid: false; error: string }
  | { valid: true; thK: number; tcK: number; efficiency: number; work: number; qc: number };

export const CarnotCalculator: React.FC = () => {
  const [th, setTh] = useState<number>(500);
  const [thUnit, setThUnit] = useState<'C' | 'K'>('C');
  const [tc, setTc] = useState<number>(25);
  const [tcUnit, setTcUnit] = useState<'C' | 'K'>('C');
  const [qh, setQh] = useState<number>(1000);

  const results: CarnotResult = useMemo(() => {
    const thK = thUnit === 'C' ? th + 273.15 : th;
    const tcK = tcUnit === 'C' ? tc + 273.15 : tc;

    if (tcK <= 0 || thK <= 0) {
      return { valid: false, error: 'Temperatures must be above Absolute Zero (0 K)' };
    }
    if (tcK >= thK) {
      return { valid: false, error: 'Cold sink temperature (Tc) must be strictly less than Hot source (Th)' };
    }

    const efficiency = 1 - tcK / thK;
    const work = qh * efficiency;
    const qc = qh - work;

    return {
      valid: true,
      thK,
      tcK,
      efficiency: efficiency * 100,
      work,
      qc,
    };
  }, [th, thUnit, tc, tcUnit, qh]);

  const handleReset = () => {
    setTh(500);
    setThUnit('C');
    setTc(25);
    setTcUnit('C');
    setQh(1000);
  };

  return (
    <div className="my-6 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-100">
              Carnot Engine Efficiency Calculator
            </h4>
            <p className="text-xs text-slate-400">
              Maximum theoretical thermodynamic efficiency & energy partition
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          title="Reset to default values"
          className="text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Grid: Inputs & Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        {/* Input Parameters (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Hot Reservoir Temperature (T<sub>H</sub>)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={th}
                onChange={(e) => setTh(parseFloat(e.target.value) || 0)}
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <select
                value={thUnit}
                onChange={(e) => setThUnit(e.target.value as 'C' | 'K')}
                className="px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono cursor-pointer"
              >
                <option value="C">°C</option>
                <option value="K">K</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Cold Reservoir Temperature (T<sub>C</sub>)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={tc}
                onChange={(e) => setTc(parseFloat(e.target.value) || 0)}
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <select
                value={tcUnit}
                onChange={(e) => setTcUnit(e.target.value as 'C' | 'K')}
                className="px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono cursor-pointer"
              >
                <option value="C">°C</option>
                <option value="K">K</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Heat Supplied from Source (Q<sub>H</sub>) in kJ
            </label>
            <input
              type="number"
              value={qh}
              min={1}
              step={50}
              onChange={(e) => setQh(Math.max(1, parseFloat(e.target.value) || 1))}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Dynamic Diagram (6 cols) */}
        <div className="lg:col-span-6 rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col items-center justify-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Carnot Heat Flow Schematic
          </span>
          <svg viewBox="0 0 280 180" className="w-full max-w-[260px] h-auto">
            {/* Hot Reservoir */}
            <rect x="50" y="10" width="180" height="28" rx="6" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1.5" />
            <text x="140" y="28" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="600" fontFamily="sans-serif">
              Hot Source T_H ({results.valid ? `${results.thK.toFixed(1)} K` : '--'})
            </text>

            {/* Q_H Arrow Down */}
            <path d="M140 38 L140 65" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrow-red)" />
            <text x="155" y="55" fill="#fca5a5" fontSize="10" fontWeight="bold" fontFamily="monospace">
              Q_H: {qh} kJ
            </text>

            {/* Engine Circle */}
            <circle cx="140" cy="90" r="24" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
            <text x="140" y="93" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
              Engine
            </text>

            {/* Work Arrow Right */}
            <path d="M164 90 L220 90" stroke="#10b981" strokeWidth="2.5" />
            <polygon points="220,86 228,90 220,94" fill="#10b981" />
            <text x="195" y="80" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="bold" fontFamily="monospace">
              W
            </text>

            {/* Q_C Arrow Down to Sink */}
            <path d="M140 114 L140 142" stroke="#38bdf8" strokeWidth="2.5" />
            <polygon points="136,142 140,150 144,142" fill="#38bdf8" />
            <text x="155" y="132" fill="#7dd3fc" fontSize="10" fontWeight="bold" fontFamily="monospace">
              Q_C
            </text>

            {/* Cold Reservoir */}
            <rect x="50" y="150" width="180" height="24" rx="6" fill="#0284c7" fillOpacity="0.2" stroke="#0284c7" strokeWidth="1.5" />
            <text x="140" y="166" textAnchor="middle" fill="#7dd3fc" fontSize="11" fontWeight="600" fontFamily="sans-serif">
              Cold Sink T_C ({results.valid ? `${results.tcK.toFixed(1)} K` : '--'})
            </text>
          </svg>
        </div>
      </div>

      {/* Error or Results */}
      {!results.valid ? (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{results.error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <span className="block text-xs font-medium text-indigo-300 mb-1">
              Carnot Efficiency (η<sub>max</sub>)
            </span>
            <span className="text-xl font-bold font-mono text-indigo-400">
              {results.efficiency.toFixed(2)}%
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="block text-xs font-medium text-emerald-300 mb-1">
              Maximum Work Output (W)
            </span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {results.work.toFixed(2)} kJ
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="block text-xs font-medium text-slate-400 mb-1">
              Rejected Heat (Q<sub>C</sub>)
            </span>
            <span className="text-xl font-bold font-mono text-sky-400">
              {results.qc.toFixed(2)} kJ
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
