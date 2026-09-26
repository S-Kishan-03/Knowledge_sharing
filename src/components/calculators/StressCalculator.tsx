import React, { useState, useMemo } from 'react';
import { Shield, RotateCcw } from 'lucide-react';

export const StressCalculator: React.FC = () => {
  const [force, setForce] = useState<number>(50); // kN
  const [diameter, setDiameter] = useState<number>(20); // mm
  const [length, setLength] = useState<number>(1000); // mm
  const [modulusChoice, setModulusChoice] = useState<string>('200'); // GPa
  const [modulusCustom, setModulusCustom] = useState<number>(200);

  const results = useMemo(() => {
    const E_GPa = modulusChoice === 'custom' ? modulusCustom : parseFloat(modulusChoice);
    const force_N = force * 1000;
    const area_mm2 = (Math.PI / 4) * (diameter * diameter);
    const E_MPa = E_GPa * 1000;

    const stress_MPa = force_N / area_mm2;
    const strain = stress_MPa / E_MPa;
    const elongation_mm = strain * length;

    return {
      area_mm2,
      stress_MPa,
      strain,
      elongation_mm,
      E_GPa,
    };
  }, [force, diameter, length, modulusChoice, modulusCustom]);

  const handleReset = () => {
    setForce(50);
    setDiameter(20);
    setLength(1000);
    setModulusChoice('200');
    setModulusCustom(200);
  };

  return (
    <div className="my-6 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-100">
              Axial Stress, Strain & Elongation Calculator
            </h4>
            <p className="text-xs text-slate-400">
              Direct tensile/compressive normal stress and Hooke&apos;s Law deflection
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
              Axial Tensile Load (F) in kN
            </label>
            <input
              type="number"
              min={0.1}
              step={5}
              value={force}
              onChange={(e) => setForce(Math.max(0.01, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bar Diameter (d) mm
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={diameter}
                onChange={(e) => setDiameter(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Original Length (L₀) mm
              </label>
              <input
                type="number"
                min={10}
                step={100}
                value={length}
                onChange={(e) => setLength(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Material & Young&apos;s Modulus (E)
            </label>
            <div className="flex gap-2">
              <select
                value={modulusChoice}
                onChange={(e) => setModulusChoice(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono cursor-pointer"
              >
                <option value="200">Structural Steel (200 GPa)</option>
                <option value="70">Aluminum Alloy (70 GPa)</option>
                <option value="110">Titanium Grade 5 (110 GPa)</option>
                <option value="105">Brass / Bronze (105 GPa)</option>
                <option value="45">Cast Iron (120 GPa)</option>
                <option value="custom">Custom Modulus...</option>
              </select>

              {modulusChoice === 'custom' && (
                <input
                  type="number"
                  min={1}
                  placeholder="GPa"
                  value={modulusCustom}
                  onChange={(e) => setModulusCustom(parseFloat(e.target.value) || 1)}
                  className="w-28 px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono"
                />
              )}
            </div>
          </div>
        </div>

        {/* Tensile Rod SVG Visualization */}
        <div className="lg:col-span-6 rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col items-center justify-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Tensile Specimen & Elongation State
          </span>
          <svg viewBox="0 0 300 140" className="w-full max-w-[280px] h-auto">
            {/* Fixed Wall Support */}
            <line x1="30" y1="20" x2="30" y2="120" stroke="#94a3b8" strokeWidth="4" />
            <path d="M 22 25 L 30 35 M 22 45 L 30 55 M 22 65 L 30 75 M 22 85 L 30 95 M 22 105 L 30 115" stroke="#64748b" strokeWidth="1.5" />

            {/* Specimen Bar */}
            <rect
              x="30"
              y="50"
              width="190"
              height="40"
              rx="4"
              fill="#4338ca"
              fillOpacity="0.4"
              stroke="#6366f1"
              strokeWidth="2"
            />

            {/* Elongation deltaL extension zone (animated/highlighted) */}
            <rect
              x="220"
              y="50"
              width="24"
              height="40"
              rx="2"
              fill="#ec4899"
              fillOpacity="0.4"
              stroke="#ec4899"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />

            {/* Force Arrow */}
            <line x1="246" y1="70" x2="285" y2="70" stroke="#f43f5e" strokeWidth="3" />
            <polygon points="283,64 293,70 283,76" fill="#f43f5e" />
            <text x="268" y="58" fill="#fda4af" fontSize="10" fontWeight="bold" fontFamily="monospace">
              F={force}kN
            </text>

            {/* Dimension indicators */}
            <line x1="30" y1="105" x2="220" y2="105" stroke="#94a3b8" strokeWidth="1" />
            <text x="125" y="120" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
              L₀ = {length} mm
            </text>

            <line x1="220" y1="105" x2="244" y2="105" stroke="#ec4899" strokeWidth="1.5" />
            <text x="232" y="120" textAnchor="middle" fill="#f472b6" fontSize="10" fontWeight="bold" fontFamily="monospace">
              ΔL
            </text>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <span className="block text-xs font-medium text-indigo-300 mb-1">
            Normal Stress (σ)
          </span>
          <span className="text-xl font-bold font-mono text-indigo-400">
            {results.stress_MPa.toFixed(2)} MPa
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Area: {results.area_mm2.toFixed(1)} mm²
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <span className="block text-xs font-medium text-purple-300 mb-1">
            Normal Strain (ε)
          </span>
          <span className="text-xl font-bold font-mono text-purple-400">
            {results.strain.toExponential(3)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {(results.strain * 100).toFixed(4)}% strain
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20">
          <span className="block text-xs font-medium text-pink-300 mb-1">
            Total Elongation (ΔL)
          </span>
          <span className="text-xl font-bold font-mono text-pink-400">
            {results.elongation_mm.toFixed(3)} mm
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            Final: {(length + results.elongation_mm).toFixed(3)} mm
          </span>
        </div>
      </div>
    </div>
  );
};
