/**
 * Calculator Registry
 * Central registry of all available calculators
 */

import type { Calculator } from './types.js';
import { carnotCalculator } from './carnot.js';
import { bernoulliCalculator } from './bernoulli.js';
import { stressCalculator } from './stress.js';
import { gearCalculator } from './gear.js';
import { machiningCalculator } from './machining.js';
import { gdntPositionCalculator } from './gdnt-position.js';

export const calculators = new Map<string, Calculator<any, any>>([
  ['carnot_calculator', carnotCalculator],
  ['bernoulli_calculator', bernoulliCalculator],
  ['stress_calculator', stressCalculator],
  ['gear_calculator', gearCalculator],
  ['machining_calculator', machiningCalculator],
  ['gdnt_position_calculator', gdntPositionCalculator],
]);

export function getCalculator(id: string): Calculator<any, any> | undefined {
  return calculators.get(id);
}

export function getAllCalculators(): Calculator<any, any>[] {
  return Array.from(calculators.values());
}

export function getCalculatorCount(): number {
  return calculators.size;
}

export function getCalculatorIds(): string[] {
  return Array.from(calculators.keys());
}

// Re-export types
export type {
  Calculator,
  CarnotInputsType,
  CarnotOutputsType,
  BernoulliInputsType,
  BernoulliOutputsType,
  StressInputsType,
  StressOutputsType,
  GearInputsType,
  GearOutputsType,
  MachiningInputsType,
  MachiningOutputsType,
  GdntPositionInputsType,
  GdntPositionOutputsType,
} from './types.js';