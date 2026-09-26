import React, { useState } from 'react';
import { Database, Search, ArrowRight, Shield, Droplets, Thermometer, Gauge } from 'lucide-react';

export const ConstantsView: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState('');

  const materials = [
    { name: 'Structural Steel (A36 / S275)', E: '200 GPa', yield: '250 MPa', uts: '400 MPa', rho: '7850 kg/m³', nu: '0.28' },
    { name: 'Aluminum Alloy 6061-T6', E: '68.9 GPa', yield: '276 MPa', uts: '310 MPa', rho: '2700 kg/m³', nu: '0.33' },
    { name: 'Titanium Grade 5 (Ti-6Al-4V)', E: '114 GPa', yield: '880 MPa', uts: '950 MPa', rho: '4430 kg/m³', nu: '0.34' },
    { name: 'Brass (Cartridge C26000)', E: '110 GPa', yield: '110 MPa', uts: '310 MPa', rho: '8530 kg/m³', nu: '0.37' },
    { name: 'Gray Cast Iron (Class 40)', E: '124 GPa', yield: '—', uts: '275 MPa', rho: '7150 kg/m³', nu: '0.26' },
    { name: 'Stainless Steel (AISI 304)', E: '193 GPa', yield: '205 MPa', uts: '515 MPa', rho: '8000 kg/m³', nu: '0.29' },
    { name: 'Carbon Fiber Reinforced Polymer (CFRP)', E: '150 GPa', yield: '—', uts: '1200 MPa', rho: '1600 kg/m³', nu: '0.30' },
  ];

  const physicalConstants = [
    { symbol: 'g', name: 'Standard Acceleration of Gravity', value: '9.80665 m/s²', notes: 'Sea level, 45° latitude' },
    { symbol: 'R_u', name: 'Universal Gas Constant', value: '8.31446 J/(mol·K)', notes: 'Ideal gas law PV = nRT' },
    { symbol: 'P_atm', name: 'Standard Atmospheric Pressure', value: '101.325 kPa (1 atm)', notes: '1.01325 bar / 14.696 psi' },
    { symbol: 'σ', name: 'Stefan-Boltzmann Constant', value: '5.67037 × 10⁻⁸ W/(m²·K⁴)', notes: 'Blackbody thermal radiation' },
    { symbol: 'ρ_water', name: 'Water Density @ 4°C', value: '1000 kg/m³ (1.00 g/cm³)', notes: 'Standard fluid reference' },
    { symbol: 'ρ_air', name: 'Dry Air Density @ STP', value: '1.225 kg/m³', notes: '15°C, 101.325 kPa' },
    { symbol: 'T_abs', name: 'Absolute Zero', value: '-273.15 °C (0 K)', notes: 'Zero thermodynamic kinetic state' },
  ];

  const unitConversions = [
    { from: '1 Megapascal (MPa)', to: '1,000,000 Pa = 1 N/mm² = 10 bar = 145.038 psi' },
    { from: '1 Bar', to: '100,000 Pa = 0.1 MPa = 14.5038 psi = 750.06 mmHg' },
    { from: '1 Horsepower (hp)', to: '745.7 Watts (W) = 0.7457 kW = 550 ft·lbf/s' },
    { from: '1 Newton-meter (N·m)', to: '0.73756 ft·lbf = 8.8507 in·lbf' },
    { from: '1 Liter / second (L/s)', to: '0.001 m³/s = 60 L/min = 15.8503 US gpm' },
    { from: '1 Kilowatt-hour (kWh)', to: '3.6 × 10⁶ Joules (J) = 3600 kJ = 3412.14 BTU' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-200">
      <header className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-2">
          <span>Engineering Constants & Materials Database</span>
          <span className="text-slate-600">·</span>
          <span>SI Reference Values</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
          Mechanical Engineering Constants & Material Tables
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-3xl">
          Standardized material properties, physical constants, and SI unit transformation ratios utilized in structural, thermodynamic, and fluid dynamic analyses.
        </p>
      </header>

      {/* Section 1: Engineering Materials */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-100">
            Standard Engineering Materials Properties (Room Temp 20°C)
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono">
                  <th className="p-3.5 pl-5">Material Specification</th>
                  <th className="p-3.5">Young&apos;s Modulus (E)</th>
                  <th className="p-3.5">Yield Strength (σ_y)</th>
                  <th className="p-3.5">Tensile Strength (UTS)</th>
                  <th className="p-3.5">Density (ρ)</th>
                  <th className="p-3.5 pr-5">Poisson&apos;s Ratio (ν)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {materials.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 pl-5 font-sans font-semibold text-slate-200">
                      {m.name}
                    </td>
                    <td className="p-3.5 text-indigo-400 font-bold tabular-nums">{m.E}</td>
                    <td className="p-3.5 text-slate-300 tabular-nums">{m.yield}</td>
                    <td className="p-3.5 text-slate-300 tabular-nums">{m.uts}</td>
                    <td className="p-3.5 text-slate-400 tabular-nums">{m.rho}</td>
                    <td className="p-3.5 pr-5 text-slate-400 tabular-nums">{m.nu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 2: Fundamental Constants */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Gauge className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-slate-100">
            Fundamental Thermodynamic & Physical Constants
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {physicalConstants.map((c, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-cyan-400">{c.symbol}</span>
                <span className="text-[11px] text-slate-400">{c.notes}</span>
              </div>
              <h3 className="text-xs font-semibold text-slate-200">{c.name}</h3>
              <p className="font-mono text-sm font-bold text-slate-100 tabular-nums">{c.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Engineering Unit Transformations */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-slate-100">
            Essential Unit Conversion Equivalencies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unitConversions.map((conv, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3"
            >
              <span className="font-bold text-emerald-400 mt-0.5">⇄</span>
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-slate-200">{conv.from}</div>
                <div className="font-mono text-xs text-indigo-300 font-medium">{conv.to}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
