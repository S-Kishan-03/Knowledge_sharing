import React from 'react';
import { CarnotCalculator } from './CarnotCalculator';
import { BernoulliCalculator } from './BernoulliCalculator';
import { StressCalculator } from './StressCalculator';
import { GearCalculator } from './GearCalculator';
import { MachiningCalculator } from './MachiningCalculator';
import { GdntCalculator } from './GdntCalculator';

interface CalculatorDispatcherProps {
  type: string;
}

export const CalculatorDispatcher: React.FC<CalculatorDispatcherProps> = ({ type }) => {
  switch (type) {
    case 'carnot_calculator':
      return <CarnotCalculator />;
    case 'bernoulli_calculator':
      return <BernoulliCalculator />;
    case 'stress_calculator':
      return <StressCalculator />;
    case 'gear_calculator':
      return <GearCalculator />;
    case 'machining_calculator':
      return <MachiningCalculator />;
    case 'gdnt_position_calculator':
      return <GdntCalculator />;
    default:
      return (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-sm">
          Calculator <code className="font-mono text-indigo-400">{type}</code> is loaded.
        </div>
      );
  }
};
