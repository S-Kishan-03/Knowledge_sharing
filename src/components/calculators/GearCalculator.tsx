import React, { useState, useMemo } from 'react';
import { Cog, RotateCcw } from 'lucide-react';

export const GearCalculator: React.FC = () => {
  const [z1, setZ1] = useState<number>(20);
  const [z2, setZ2] = useState<number>(60);
  const [moduleVal, setModuleVal] = useState<number>(3);
  const [rpm1, setRpm1] = useState<number>(1440);
  const [torque1, setTorque1] = useState<number>(50);

  const results = useMemo(() => {
    const ratio = z2 / z1;
    const rpm2 = rpm1 / ratio;
    const torque2 = torque1 * ratio;
    const centerDist = (moduleVal * (z1 + z2)) / 2;
    const d1 = moduleVal * z1;
    const d2 = moduleVal * z2;

    return {
      ratio,
      rpm2,
      torque2,
      centerDist,
      d1,
      d2,
    };
  }, [z1, z2, moduleVal, rpm1, torque1]);

  const handleReset = () => {
    setZ1(20);
    setZ2(60);
    setModuleVal(3);
    setRpm1(1440);
    setTorque1(50);
  };

  return (
    <div className="my-6 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Cog className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-100">
              Spur Gear Ratio & Torque Transformer
            </h4>
            <p className="text-xs text-slate-400">
              Compute pitch diameters, center distance, output speed, and output torque
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
                Pinion Teeth (Z₁)
              </label>
              <input
                type="number"
                min={10}
                max={150}
                step={1}
                value={z1}
                onChange={(e) => setZ1(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Gear Teeth (Z₂)
              </label>
              <input
                type="number"
                min={10}
                max={300}
                step={1}
                value={z2}
                onChange={(e) => setZ2(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Module (m) mm
              </label>
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={moduleVal}
                onChange={(e) => setModuleVal(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Input RPM (N₁)
              </label>
              <input
                type="number"
                min={1}
                step={50}
                value={rpm1}
                onChange={(e) => setRpm1(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Input Torque (T₁) N·m
              </label>
              <input
                type="number"
                min={1}
                step={5}
                value={torque1}
                onChange={(e) => setTorque1(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Animated Spur Gear Pair SVG */}
        <div className="lg:col-span-6 rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col items-center justify-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Kinematic Gear Mesh Visualization
          </span>
          <svg viewBox="0 0 320 160" className="w-full max-w-[280px] h-auto">
            {/* Center line connecting gear axes */}
            <line x1="85" y1="80" x2="230" y2="80" stroke="#475569" strokeWidth="1" strokeDasharray="4 2" />

            {/* Pinion 1 */}
            <g transform="translate(85, 80)">
              <circle r="40" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
              <circle r="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="-35" y1="0" x2="35" y2="0" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="0" y1="-35" x2="0" y2="35" stroke="#f59e0b" strokeWidth="1.5" />
              <text y="4" textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="bold" fontFamily="monospace">
                Z₁={z1}
              </text>
            </g>

            {/* Driven Gear 2 */}
            <g transform="translate(215, 80)">
              <circle r="65" fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 3" />
              <circle r="18" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
              <line x1="-55" y1="0" x2="55" y2="0" stroke="#3b82f6" strokeWidth="1.5" />
              <line x1="0" y1="-55" x2="0" y2="55" stroke="#3b82f6" strokeWidth="1.5" />
              <text y="4" textAnchor="middle" fill="#bfdbfe" fontSize="9" fontWeight="bold" fontFamily="monospace">
                Z₂={z2}
              </text>
            </g>

            {/* Pitch Point label */}
            <circle cx="125" cy="80" r="3.5" fill="#ef4444" />
            <text x="125" y="65" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="sans-serif">
              Pitch Point
            </text>

            {/* Dimension Center Distance */}
            <text x="150" y="105" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              a = {results.centerDist.toFixed(1)} mm
            </text>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="block text-xs font-medium text-amber-300 mb-1">
            Gear Ratio (i)
          </span>
          <span className="text-xl font-bold font-mono text-amber-400">
            {results.ratio.toFixed(2)} : 1
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <span className="block text-xs font-medium text-blue-300 mb-1">
            Output Speed (N₂)
          </span>
          <span className="text-xl font-bold font-mono text-blue-400">
            {results.rpm2.toFixed(1)} RPM
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="block text-xs font-medium text-emerald-300 mb-1">
            Output Torque (T₂)
          </span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            {results.torque2.toFixed(1)} N·m
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="block text-xs font-medium text-slate-400 mb-1">
            Center Distance (a)
          </span>
          <span className="text-xl font-bold font-mono text-slate-200">
            {results.centerDist.toFixed(1)} mm
          </span>
        </div>
      </div>
    </div>
  );
};
