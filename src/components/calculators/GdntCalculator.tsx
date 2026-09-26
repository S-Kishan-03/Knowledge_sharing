import React, { useState, useMemo } from 'react';
import { Target, CheckCircle2, XCircle, RotateCcw, AlertCircle } from 'lucide-react';

type GdntResult =
  | { valid: false; error: string }
  | { valid: true; bonus: number; total: number; pass: boolean };

export const GdntCalculator: React.FC = () => {
  const [specifiedTol, setSpecifiedTol] = useState<number>(0.1);
  const [mmcSize, setMmcSize] = useState<number>(10.0);
  const [actualSize, setActualSize] = useState<number>(10.15);
  const [posError, setPosError] = useState<number>(0.08);

  const results: GdntResult = useMemo(() => {
    if (actualSize < mmcSize) {
      return {
        valid: false,
        error: 'Actual hole size cannot be smaller than MMC (Maximum Material Condition)',
      };
    }

    const bonus = actualSize - mmcSize;
    const total = specifiedTol + bonus;
    const pass = posError <= total;

    return {
      valid: true,
      bonus,
      total,
      pass,
    };
  }, [specifiedTol, mmcSize, actualSize, posError]);

  const handleReset = () => {
    setSpecifiedTol(0.1);
    setMmcSize(10.0);
    setActualSize(10.15);
    setPosError(0.08);
  };

  return (
    <div className="my-6 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-100">
              GD&T Position Tolerance @ MMC Bonus Calculator
            </h4>
            <p className="text-xs text-slate-400">
              Compute bonus tolerance and total allowable true position cylindrical tolerance zone
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Specified Pos Tol (T<sub>spec</sub>) mm
              </label>
              <input
                type="number"
                min={0.001}
                step={0.01}
                value={specifiedTol}
                onChange={(e) => setSpecifiedTol(Math.max(0.001, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hole Size @ MMC (D<sub>MMC</sub>) mm
              </label>
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={mmcSize}
                onChange={(e) => setMmcSize(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Actual Measured Hole (D<sub>act</sub>) mm
              </label>
              <input
                type="number"
                min={0.1}
                step={0.01}
                value={actualSize}
                onChange={(e) => setActualSize(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Measured Deviation mm
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={posError}
                onChange={(e) => setPosError(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bullseye GD&T True Position Zone SVG */}
        <div className="lg:col-span-6 rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col items-center justify-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            True Position Tolerance Zone & Bonus Radius
          </span>
          <svg viewBox="0 0 240 160" className="w-full max-w-[240px] h-auto">
            {/* Center Grid Lines */}
            <line x1="20" y1="80" x2="220" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="4 2" />
            <line x1="120" y1="10" x2="120" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="4 2" />

            {/* Total Tolerance Zone (Outer) */}
            <circle
              cx="120"
              cy="80"
              r="62"
              fill="#a855f7"
              fillOpacity="0.1"
              stroke="#a855f7"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />

            {/* Basic MMC Tolerance Zone (Inner) */}
            <circle
              cx="120"
              cy="80"
              r="38"
              fill="#6366f1"
              fillOpacity="0.15"
              stroke="#6366f1"
              strokeWidth="1.5"
            />

            {/* Actual Hole Center Location */}
            {results.valid && (
              <g
                transform={`translate(${
                  120 + (results.total > 0 ? (posError / results.total) * 45 : 0)
                }, 80)`}
              >
                <circle
                  r="5"
                  fill={results.pass ? '#10b981' : '#ef4444'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <line x1="-8" y1="0" x2="8" y2="0" stroke="#ffffff" strokeWidth="1" />
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#ffffff" strokeWidth="1" />
              </g>
            )}

            <text x="120" y="70" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="monospace">
              MMC Zone
            </text>
            <text x="120" y="152" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              Total = {results.valid ? `${results.total.toFixed(3)} mm` : '--'}
            </text>
          </svg>
        </div>
      </div>

      {!results.valid ? (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{results.error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <span className="block text-xs font-medium text-purple-300 mb-1">
              Bonus Tolerance (T<sub>bonus</sub>)
            </span>
            <span className="text-xl font-bold font-mono text-purple-400">
              +{results.bonus.toFixed(3)} mm
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <span className="block text-xs font-medium text-indigo-300 mb-1">
              Total Allowable Position
            </span>
            <span className="text-xl font-bold font-mono text-indigo-400">
              {results.total.toFixed(3)} mm
            </span>
          </div>

          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              results.pass
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            <div>
              <span className="block text-xs font-medium opacity-80 mb-0.5">
                Inspection Verdict
              </span>
              <span className="text-base font-bold">
                {results.pass ? 'Within Tolerance' : 'Out of Tolerance'}
              </span>
            </div>
            {results.pass ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            ) : (
              <XCircle className="w-7 h-7 text-rose-400" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
