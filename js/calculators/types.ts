/**
 * Calculator Types - Shared interfaces and Zod schemas
 * Provides type-safe input/output validation for all calculators
 */

import { z } from 'zod';

// Carnot Calculator
export const CarnotInputs = z.object({
  th: z.number().min(-100).max(3000),
  thUnit: z.enum(['C', 'K']),
  tc: z.number().min(-273).max(1000),
  tcUnit: z.enum(['C', 'K']),
  qh: z.number().min(1),
});

export type CarnotInputsType = z.infer<typeof CarnotInputs>;

export const CarnotOutputs = z.object({
  efficiency: z.number(),      // percentage
  work: z.number(),            // kJ
  qc: z.number(),              // kJ
  valid: z.boolean(),
});

export type CarnotOutputsType = z.infer<typeof CarnotOutputs>;


// Bernoulli Calculator
export const BernoulliInputs = z.object({
  d1: z.number().min(5),       // mm
  d2: z.number().min(5),       // mm
  v1: z.number().min(0.1),     // m/s
  rho: z.number().positive(),  // kg/m³
});

export type BernoulliInputsType = z.infer<typeof BernoulliInputs>;

export const BernoulliOutputs = z.object({
  v2: z.number(),              // m/s
  flowRate: z.number(),        // L/s
  deltaP: z.number(),          // kPa
});

export type BernoulliOutputsType = z.infer<typeof BernoulliOutputs>;


// Stress Calculator
export const StressInputs = z.object({
  force: z.number().min(0.1),   // kN
  diameter: z.number().min(1),  // mm
  length: z.number().min(10),   // mm
  youngsModulus: z.number().positive(), // GPa
});

export type StressInputsType = z.infer<typeof StressInputs>;

export const StressOutputs = z.object({
  stress: z.number(),           // MPa
  strain: z.number(),           // dimensionless
  elongation: z.number(),       // mm
});

export type StressOutputsType = z.infer<typeof StressOutputs>;


// Gear Calculator
export const GearInputs = z.object({
  z1: z.number().int().min(10),      // pinion teeth
  z2: z.number().int().min(10),      // gear teeth
  module: z.number().min(0.5),       // mm
  rpm1: z.number().min(1),           // RPM
  torque1: z.number().min(1),        // N·m
});

export type GearInputsType = z.infer<typeof GearInputs>;

export const GearOutputs = z.object({
  ratio: z.number(),             // z2/z1
  rpm2: z.number(),              // RPM
  torque2: z.number(),           // N·m
  centerDistance: z.number(),    // mm
});

export type GearOutputsType = z.infer<typeof GearOutputs>;


// Machining Calculator
export const MachiningInputs = z.object({
  cuttingSpeed: z.number().positive(),  // m/min
  diameter: z.number().min(1),          // mm
  flutes: z.number().int().min(1),
  feedPerTooth: z.number().min(0.001),  // mm/tooth
  depthOfCut: z.number().min(0.1),      // mm
  widthOfCut: z.number().min(0.1),      // mm
});

export type MachiningInputsType = z.infer<typeof MachiningInputs>;

export const MachiningOutputs = z.object({
  spindleSpeed: z.number(),      // RPM
  feedRate: z.number(),          // mm/min
  mrr: z.number(),               // cm³/min
});

export type MachiningOutputsType = z.infer<typeof MachiningOutputs>;


// GD&T Position Calculator
export const GdntPositionInputs = z.object({
  specifiedTol: z.number().min(0.001),  // mm
  mmcSize: z.number().min(0.1),         // mm
  actualSize: z.number().min(0.1),      // mm
  positionError: z.number().min(0),     // mm
});

export type GdntPositionInputsType = z.infer<typeof GdntPositionInputs>;

export const GdntPositionOutputs = z.object({
  bonus: z.number(),             // mm
  total: z.number(),             // mm
  pass: z.boolean(),
});

export type GdntPositionOutputsType = z.infer<typeof GdntPositionOutputs>;


// Calculator Registry Types
export interface Calculator<
  Inputs extends z.ZodTypeAny,
  Outputs extends z.ZodTypeAny
> {
  id: string;
  label: string;
  icon: string;
  description: string;
  inputSchema: Inputs;
  outputSchema: Outputs;
  compute: (inputs: z.infer<Inputs>) => z.infer<Outputs>;
  render: (container: HTMLElement, initialInputs?: Partial<z.infer<Inputs>>) => void;
}