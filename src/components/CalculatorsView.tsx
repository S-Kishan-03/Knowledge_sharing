import React, { useState } from 'react';
import { CalculatorDispatcher } from './calculators/CalculatorDispatcher';
import { Flame, Waves, Shield, Cog, Hammer, Target, BookOpen, ArrowRight } from 'lucide-react';

interface CalculatorsViewProps {
  initialCalcId?: string;
  onNavigateTopic: (topicId: string) => void;
}

interface CalcTab {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  discipline: string;
  relatedTopicId: string;
  desc: string;
}

export const CalculatorsView: React.FC<CalculatorsViewProps> = ({
  initialCalcId = 'carnot_calculator',
  onNavigateTopic,
}) => {
  const [activeId, setActiveId] = useState<string>(initialCalcId);

  const calcTabs: CalcTab[] = [
    {
      id: 'carnot_calculator',
      name: 'Carnot Engine',
      icon: Flame,
      discipline: 'Thermodynamics',
      relatedTopicId: 'thermodynamics-laws',
      desc: 'Calculate maximum theoretical thermodynamic efficiency & work output',
    },
    {
      id: 'bernoulli_calculator',
      name: 'Bernoulli Venturi Flow',
      icon: Waves,
      discipline: 'Fluid Mechanics',
      relatedTopicId: 'bernoulli-fluid-mechanics',
      desc: 'Constriction velocity and dynamic pressure drop in tapering conduits',
    },
    {
      id: 'stress_calculator',
      name: 'Stress & Hooke’s Law',
      icon: Shield,
      discipline: 'Solid Mechanics',
      relatedTopicId: 'stress-strain-analysis',
      desc: 'Normal tensile stress, strain, and bar elongation under axial load',
    },
    {
      id: 'gear_calculator',
      name: 'Spur Gear Kinematics',
      icon: Cog,
      discipline: 'Machine Design',
      relatedTopicId: 'spur-gear-design',
      desc: 'Center distance, pitch diameters, velocity reduction ratio, and torque',
    },
    {
      id: 'machining_calculator',
      name: 'Speeds & Feeds (Milling)',
      icon: Hammer,
      discipline: 'Manufacturing & CAM',
      relatedTopicId: 'machining-fundamentals',
      desc: 'Spindle RPM, table feed rate, and material removal rate (MRR)',
    },
    {
      id: 'gdnt_position_calculator',
      name: 'GD&T True Position',
      icon: Target,
      discipline: 'Product Design & CAD',
      relatedTopicId: 'gdnt-fundamentals',
      desc: 'Bonus tolerance and total allowable true position cylindrical zone at MMC',
    },
  ];

  const currentTab = calcTabs.find((t) => t.id === activeId) || calcTabs[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <header className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-2">
          <span>Interactive Engineering Suite</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">Unit-Aware & Formula-Grounded</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
          Mechanical Engineering Live Calculators
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-3xl">
          Execute real-time calculations with parameter sweeps, material presets, SI unit conversions, and interactive physical diagrams.
        </p>
      </header>

      {/* Calculator Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {calcTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                />
                <span className="text-[10px] font-mono text-slate-500">
                  {tab.discipline.split(' ')[0]}
                </span>
              </div>
              <div>
                <span
                  className={`block text-xs font-bold leading-tight ${
                    isActive ? 'text-indigo-300' : 'text-slate-200'
                  }`}
                >
                  {tab.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Calculator Active Card */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              {currentTab.discipline}
            </span>
            <h2 className="text-xl font-bold text-slate-100">{currentTab.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{currentTab.desc}</p>
          </div>

          <button
            onClick={() => onNavigateTopic(currentTab.relatedTopicId)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Associated Theory Topic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dispatcher loads current calculator component */}
        <CalculatorDispatcher type={activeId} />
      </div>
    </div>
  );
};
