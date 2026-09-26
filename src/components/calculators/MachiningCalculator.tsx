import React, { useState, useMemo } from 'react';
import { Hammer, RotateCcw } from 'lucide-react';

export const MachiningCalculator: React.FC = () => {
  const [vcChoice, setVcChoice] = useState<string>('120');
  const [vcCustom, setVcCustom] = useState<number>(120);
  const [diameter, setDiameter] = useState<number>(16);
  const [flutes, setFlutes] = useState<number>(4);
  const [feedPerTooth, setFeedPerTooth] = useState<number>(0.08);
  const [depthOfCut, setDepthOfCut] = useState<number>(6); // ap
  const [widthOfCut, setWidthOfCut] = useState<number>(12); // ae

  const results = useMemo(() => {
    const vc = vcChoice === 'custom' ? vcCustom : parseFloat(vcChoice);
    const rpm = (vc * 1000) / (Math.PI * diameter);
    const feedRate = feedPerTooth * flutes * rpm;
    const mrr = (depthOfCut * widthOfCut * feedRate) / 1000;

    return {
      rpm,
      feedRate,
      mrr,
      vc,
    };
  }, [vcChoice, vcCustom, diameter, flutes, feedPerTooth, depthOfCut, widthOfCut]);

  const handleReset = () => {
    setVcChoice('120');
    setVcCustom(120);
    setDiameter(16);
    setFlutes(4);
    setFeedPerTooth(0.08);
    setDepthOfCut(6);
    setWidthOfCut(12);
  };

  return (
    <div className="my-6 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-100">
              Machining Cutting Speed & Feed Rate Calculator
            </h4>
            <p className="text-xs text-slate-400">
              Compute CNC spindle speed, table feed rate, and material removal rate (MRR) for milling
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
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Workpiece Material & Surface Speed (V<sub>c</sub>) m/min
            </label>
            <div className="flex gap-2">
              <select
                value={vcChoice}
                onChange={(e) => setVcChoice(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono cursor-pointer"
              >
                <option value="300">Aluminum 6061-T6 (300 m/min)</option>
                <option value="120">Mild Carbon Steel (120 m/min)</option>
                <option value="80">Alloy Steel 4140 (80 m/min)</option>
                <option value="60">Stainless Steel 304 (60 m/min)</option>
                <option value="40">Titanium Ti-6Al-4V (40 m/min)</option>
                <option value="custom">Custom Speed...</option>
              </select>

              {vcChoice === 'custom' && (
                <input
                  type="number"
                  min={1}
                  placeholder="m/min"
                  value={vcCustom}
                  onChange={(e) => setVcCustom(parseFloat(e.target.value) || 1)}
                  className="w-28 px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cutter Diameter (D) mm
              </label>
              <input
                type="number"
                min={1}
                value={diameter}
                onChange={(e) => setDiameter(Math.max(0.5, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Number of Flutes (z)
              </label>
              <input
                type="number"
                min={1}
                max={16}
                value={flutes}
                onChange={(e) => setFlutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Feed/Tooth (f<sub>z</sub>) mm
              </label>
              <input
                type="number"
                min={0.001}
                step={0.01}
                value={feedPerTooth}
                onChange={(e) => setFeedPerTooth(Math.max(0.001, parseFloat(e.target.value) || 0.01))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Axial Depth (a<sub>p</sub>) mm
              </label>
              <input
                type="number"
                min={0.1}
                step={0.5}
                value={depthOfCut}
                onChange={(e) => setDepthOfCut(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Radial Width (a<sub>e</sub>) mm
              </label>
              <input
                type="number"
                min={0.1}
                step={0.5}
                value={widthOfCut}
                onChange={(e) => setWidthOfCut(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Milling Tool & Workpiece Diagram */}
        <div className="lg:col-span-6 rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col items-center justify-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            End Mill Engagement Profile
          </span>
          <svg viewBox="0 0 280 150" className="w-full max-w-[260px] h-auto">
            {/* Workpiece */}
            <rect x="20" y="80" width="240" height="55" rx="4" fill="#334155" stroke="#475569" strokeWidth="1.5" />
            <text x="140" y="115" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
              Workpiece Block
            </text>

            {/* Endmill tool body */}
            <rect x="105" y="15" width="70" height="75" rx="2" fill="#f97316" fillOpacity="0.3" stroke="#f97316" strokeWidth="2" />
            <line x1="105" y1="45" x2="175" y2="45" stroke="#ea580c" strokeWidth="1" strokeDasharray="3 2" />
            <line x1="105" y1="65" x2="175" y2="65" stroke="#ea580c" strokeWidth="1" strokeDasharray="3 2" />

            {/* Rotation symbol */}
            <path d="M 125 35 A 15 15 0 0 1 155 35" fill="none" stroke="#fde047" strokeWidth="2" />
            <polygon points="155,30 162,35 155,40" fill="#fde047" />

            <text x="140" y="28" textAnchor="middle" fill="#fdba74" fontSize="10" fontWeight="bold" fontFamily="monospace">
              D = {diameter}mm
            </text>

            {/* Depth of cut marker */}
            <line x1="185" y1="80" x2="185" y2="90" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="195" y="87" fill="#38bdf8" fontSize="9" fontFamily="monospace">
              ap={depthOfCut}
            </text>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
        <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <span className="block text-xs font-medium text-orange-300 mb-1">
            Spindle Speed (N)
          </span>
          <span className="text-xl font-bold font-mono text-orange-400">
            {results.rpm.toFixed(0)} RPM
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="block text-xs font-medium text-emerald-300 mb-1">
            Table Feed Rate (F)
          </span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            {results.feedRate.toFixed(1)} mm/min
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <span className="block text-xs font-medium text-indigo-300 mb-1">
            Material Removal Rate (MRR)
          </span>
          <span className="text-xl font-bold font-mono text-indigo-400">
            {results.mrr.toFixed(2)} cm³/min
          </span>
        </div>
      </div>
    </div>
  );
};
