import React, { useState, useMemo } from 'react';
import { Waves, RotateCcw } from 'lucide-react';

export const BernoulliCalculator: React.FC = () => {
  const [d1, setD1] = useState<number>(100);
  const [d2, setD2] = useState<number>(50);
  const [v1, setV1] = useState<number>(2.0);
  const [rhoChoice, setRhoChoice] = useState<string>('1000');
  const [rhoCustom, setRhoCustom] = useState<number>(1000);

  const results = useMemo(() => {
    const rho = rhoChoice === 'custom' ? rhoCustom : parseFloat(rhoChoice);
    const r1 = (d1 / 1000) / 2;
    const r2 = (d2 / 1000) / 2;
    const a1 = Math.PI * r1 * r1;
    const a2 = Math.PI * r2 * r2;

    const v2 = (a1 * v1) / a2;
    const q_m3s = a1 * v1;
    const q_Ls = q_m3s * 1000;
    const deltaP_Pa = 0.5 * rho * (v2 * v2 - v1 * v1);
    const deltaP_kPa = deltaP_Pa / 1000;

    return {
      v2,
      q_Ls,
      deltaP_kPa,
      a1_mm2: a1 * 1e6,
      a2_mm2: a2 * 1e6,
    };
  }, [d1, d2, v1, rhoChoice, rhoCustom]);

  const handleReset = () => {
    setD1(100);
    setD2(50);
    setV1(2.0);
    setRhoChoice('1000');
    setRhoCustom(1000);
  };

  return (
    <div className="my-6 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-100">
              Fluid Continuity & Venturi Pressure Drop Calculator
            </h4>
            <p className="text-xs text-slate-400">
              Compute constriction velocity, volumetric flow rate, and Bernoulli pressure differential
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

      {/* Grid: Inputs & Venturi Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Inlet Diameter (D₁) mm
              </label>
              <input
                type="number"
                min={5}
                value={d1}
                onChange={(e) => setD1(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Throat Diameter (D₂) mm
              </label>
              <input
                type="number"
                min={5}
                value={d2}
                onChange={(e) => setD2(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Inlet Fluid Velocity (v₁) in m/s
            </label>
            <input
              type="number"
              min={0.1}
              step={0.5}
              value={v1}
              onChange={(e) => setV1(Math.max(0.01, parseFloat(e.target.value) || 0.1))}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Fluid Medium & Density (ρ)
            </label>
            <div className="flex gap-2">
              <select
                value={rhoChoice}
                onChange={(e) => setRhoChoice(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono cursor-pointer"
              >
                <option value="1000">Water (1000 kg/m³)</option>
                <option value="1.225">Air @ STP (1.225 kg/m³)</option>
                <option value="870">Hydraulic Oil ISO VG 46 (870 kg/m³)</option>
                <option value="789">Ethanol (789 kg/m³)</option>
                <option value="custom">Custom Density...</option>
              </select>

              {rhoChoice === 'custom' && (
                <input
                  type="number"
                  min={0.1}
                  placeholder="kg/m³"
                  value={rhoCustom}
                  onChange={(e) => setRhoCustom(parseFloat(e.target.value) || 1)}
                  className="w-28 px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono"
                />
              )}
            </div>
          </div>
        </div>

        {/* Venturi Tube SVG Simulation */}
        <div className="lg:col-span-6 rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col items-center justify-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Venturi Constriction & Pressure Gradient
          </span>
          <svg viewBox="0 0 320 160" className="w-full max-w-[300px] h-auto">
            <defs>
              <linearGradient id="fluidFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0891b2" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Manometer tubes */}
            {/* Inlet Manometer Tube (P1 is higher, so liquid is pushed higher or reads high head) */}
            <rect x="70" y="20" width="16" height="50" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <rect x="71" y="35" width="14" height="35" fill="#0284c7" fillOpacity="0.7" />
            <text x="78" y="16" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">P₁</text>

            {/* Throat Manometer Tube (P2 is lower due to higher velocity v2) */}
            <rect x="152" y="35" width="16" height="40" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <rect x="153" y="55" width="14" height="20" fill="#0284c7" fillOpacity="0.7" />
            <text x="160" y="30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">P₂</text>

            {/* Venturi Pipe Profile */}
            <path
              d="M 20 70 L 120 70 L 145 82 L 175 82 L 200 70 L 300 70 L 300 130 L 200 130 L 175 118 L 145 118 L 120 130 L 20 130 Z"
              fill="url(#fluidFlow)"
              stroke="#38bdf8"
              strokeWidth="2"
            />

            {/* Streamlines */}
            <path d="M 30 85 L 120 85 L 145 91 L 175 91 L 200 85 L 290 85" stroke="#e0f2fe" strokeWidth="1" strokeDasharray="4 2" />
            <path d="M 30 100 L 120 100 L 145 100 L 175 100 L 200 100 L 290 100" stroke="#e0f2fe" strokeWidth="1.5" strokeDasharray="6 3" />
            <path d="M 30 115 L 120 115 L 145 109 L 175 109 L 200 115 L 290 115" stroke="#e0f2fe" strokeWidth="1" strokeDasharray="4 2" />

            {/* Velocity vectors */}
            <text x="50" y="145" fill="#38bdf8" fontSize="10" fontFamily="monospace">v₁={v1} m/s</text>
            <text x="135" y="145" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">v₂={results.v2.toFixed(1)} m/s</text>
          </svg>
        </div>
      </div>

      {/* Results Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <span className="block text-xs font-medium text-cyan-300 mb-1">
            Constriction Velocity (v₂)
          </span>
          <span className="text-xl font-bold font-mono text-cyan-400">
            {results.v2.toFixed(2)} m/s
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Speed ratio: {(results.v2 / v1).toFixed(2)}×
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="block text-xs font-medium text-emerald-300 mb-1">
            Volumetric Flow Rate (Q)
          </span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            {results.q_Ls.toFixed(2)} L/s
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            {(results.q_Ls / 1000).toFixed(4)} m³/s
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <span className="block text-xs font-medium text-indigo-300 mb-1">
            Dynamic Pressure Drop (ΔP)
          </span>
          <span className="text-xl font-bold font-mono text-indigo-400">
            {results.deltaP_kPa.toFixed(2)} kPa
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            {(results.deltaP_kPa * 10).toFixed(1)} mbar
          </span>
        </div>
      </div>
    </div>
  );
};
