import type { Category, SiteData, TopicDetail, TopicMeta, RoadmapStep } from '../types';
import rawIndexData from '../../data/index.json';

// Last 3 categories only as requested
export const THREE_CATEGORIES: Category[] = [
  {
    id: 'product-design',
    name: 'Product Design & CAD',
    description: 'Design methodology, 3D CAD modeling, GD&T tolerancing, specifications, and mechanical joints.',
    icon: 'design',
  },
  {
    id: 'cae',
    name: 'Simulation & Analysis (CAE)',
    description: 'Finite element analysis (FEA), stress-strain mechanics, thermodynamics, CFD fluids, and fatigue.',
    icon: 'computer',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & CAM',
    description: 'CNC machining, CAM toolpaths, power transmission, sheet metal, casting, 3D printing, and SPC quality.',
    icon: 'factory',
  },
];

// Mapping every topic to one of the 3 categories
export const TOPIC_CATEGORY_REASSIGNMENT: Record<string, { categoryId: string; category: string }> = {
  // Product Design & CAD
  'engineering-specifications': { categoryId: 'product-design', category: 'Product Design & CAD' },
  'new-product-design': { categoryId: 'product-design', category: 'Product Design & CAD' },
  'cad-computer-aided-design': { categoryId: 'product-design', category: 'Product Design & CAD' },
  'engineering-drawings-and-bom': { categoryId: 'product-design', category: 'Product Design & CAD' },
  'iso-fits-and-surface-finish': { categoryId: 'product-design', category: 'Product Design & CAD' },
  'gdnt-fundamentals': { categoryId: 'product-design', category: 'Product Design & CAD' },
  'tolerance-stack-up-analysis': { categoryId: 'product-design', category: 'Product Design & CAD' },
  'fasteners-and-threaded-joints': { categoryId: 'product-design', category: 'Product Design & CAD' },
  'springs-seals-and-keys': { categoryId: 'product-design', category: 'Product Design & CAD' },
  'prototype-testing-and-validation': { categoryId: 'product-design', category: 'Product Design & CAD' },
  'cad-customization-automation': { categoryId: 'product-design', category: 'Product Design & CAD' },

  // Simulation & Analysis (CAE)
  'stress-strain-analysis': { categoryId: 'cae', category: 'Simulation & Analysis (CAE)' },
  'thermodynamics-laws': { categoryId: 'cae', category: 'Simulation & Analysis (CAE)' },
  'bernoulli-fluid-mechanics': { categoryId: 'cae', category: 'Simulation & Analysis (CAE)' },
  'mechanism-and-kinematics-analysis': { categoryId: 'cae', category: 'Simulation & Analysis (CAE)' },
  'cae-analysis': { categoryId: 'cae', category: 'Simulation & Analysis (CAE)' },
  'thermal-and-cfd-analysis': { categoryId: 'cae', category: 'Simulation & Analysis (CAE)' },
  'fatigue-and-failure-analysis': { categoryId: 'cae', category: 'Simulation & Analysis (CAE)' },

  // Manufacturing & CAM
  'manufacturing-process-selection': { categoryId: 'manufacturing', category: 'Manufacturing & CAM' },
  'machining-fundamentals': { categoryId: 'manufacturing', category: 'Manufacturing & CAM' },
  'cam-computer-aided-manufacturing': { categoryId: 'manufacturing', category: 'Manufacturing & CAM' },
  'spur-gear-design': { categoryId: 'manufacturing', category: 'Manufacturing & CAM' },
  'bearings-and-shafts': { categoryId: 'manufacturing', category: 'Manufacturing & CAM' },
  'mechanical-power-transmission': { categoryId: 'manufacturing', category: 'Manufacturing & CAM' },
  'sheet-metal-manufacturing': { categoryId: 'manufacturing', category: 'Manufacturing & CAM' },
  'casting-forging-and-molding': { categoryId: 'manufacturing', category: 'Manufacturing & CAM' },
  'welding-and-joining': { categoryId: 'manufacturing', category: 'Manufacturing & CAM' },
  'additive-manufacturing': { categoryId: 'manufacturing', category: 'Manufacturing & CAM' },
  'metrology-and-inspection': { categoryId: 'manufacturing', category: 'Manufacturing & CAM' },
  'quality-control-and-spc': { categoryId: 'manufacturing', category: 'Manufacturing & CAM' },
};

// Curated Sequential Roadmap: 3 structured phases
export const ROADMAP_STEPS: RoadmapStep[] = [
  // Phase 1: Foundations & Product Design
  { stepNumber: 1, topicId: 'engineering-specifications', phaseId: 'phase-1', phaseTitle: 'Phase 1: Product Design & Specification', focus: 'Requirements, design inputs, and specifications' },
  { stepNumber: 2, topicId: 'new-product-design', phaseId: 'phase-1', phaseTitle: 'Phase 1: Product Design & Specification', focus: 'Structured NPD workflow & DFM/DFA principles' },
  { stepNumber: 3, topicId: 'cad-computer-aided-design', phaseId: 'phase-1', phaseTitle: 'Phase 1: Product Design & Specification', focus: 'Parametric 3D solid and surface modeling' },
  { stepNumber: 4, topicId: 'engineering-drawings-and-bom', phaseId: 'phase-1', phaseTitle: 'Phase 1: Product Design & Specification', focus: 'Standard 2D orthographic drafting & BOM release' },
  { stepNumber: 5, topicId: 'iso-fits-and-surface-finish', phaseId: 'phase-1', phaseTitle: 'Phase 1: Product Design & Specification', focus: 'Hole/shaft fits, tolerance grades & surface roughness' },
  { stepNumber: 6, topicId: 'gdnt-fundamentals', phaseId: 'phase-1', phaseTitle: 'Phase 1: Product Design & Specification', focus: 'ASME Y14.5 feature control frames, datums & MMC' },
  { stepNumber: 7, topicId: 'tolerance-stack-up-analysis', phaseId: 'phase-1', phaseTitle: 'Phase 1: Product Design & Specification', focus: 'Worst-case & RSS dimensional accumulation' },
  { stepNumber: 8, topicId: 'fasteners-and-threaded-joints', phaseId: 'phase-1', phaseTitle: 'Phase 1: Product Design & Specification', focus: 'Bolted joint preload, tightening torque & shear' },
  { stepNumber: 9, topicId: 'springs-seals-and-keys', phaseId: 'phase-1', phaseTitle: 'Phase 1: Product Design & Specification', focus: 'Spring deflection, O-ring gland sizing & key connections' },
  { stepNumber: 10, topicId: 'prototype-testing-and-validation', phaseId: 'phase-1', phaseTitle: 'Phase 1: Product Design & Specification', focus: 'DVP&R physical testing & validation sign-off' },
  { stepNumber: 11, topicId: 'cad-customization-automation', phaseId: 'phase-1', phaseTitle: 'Phase 1: Product Design & Specification', focus: 'NXOpen, Creo, SolidWorks APIs & design automation' },

  // Phase 2: Simulation & Physics Analysis
  { stepNumber: 12, topicId: 'stress-strain-analysis', phaseId: 'phase-2', phaseTitle: 'Phase 2: Physics, Mechanics & Simulation (CAE)', focus: 'Normal/shear stress, Young’s Modulus & Hooke’s Law' },
  { stepNumber: 13, topicId: 'thermodynamics-laws', phaseId: 'phase-2', phaseTitle: 'Phase 2: Physics, Mechanics & Simulation (CAE)', focus: 'Energy conservation, entropy & Carnot cycle efficiency' },
  { stepNumber: 14, topicId: 'bernoulli-fluid-mechanics', phaseId: 'phase-2', phaseTitle: 'Phase 2: Physics, Mechanics & Simulation (CAE)', focus: 'Continuity, dynamic pressure drop & Venturi flow' },
  { stepNumber: 15, topicId: 'mechanism-and-kinematics-analysis', phaseId: 'phase-2', phaseTitle: 'Phase 2: Physics, Mechanics & Simulation (CAE)', focus: 'Degrees of freedom, four-bar linkages & cam motion' },
  { stepNumber: 16, topicId: 'thermal-and-cfd-analysis', phaseId: 'phase-2', phaseTitle: 'Phase 2: Physics, Mechanics & Simulation (CAE)', focus: 'Conduction, convection, radiation & CFD boundary flows' },
  { stepNumber: 17, topicId: 'cae-analysis', phaseId: 'phase-2', phaseTitle: 'Phase 2: Physics, Mechanics & Simulation (CAE)', focus: 'Finite element meshing, constraints & Von Mises stress' },
  { stepNumber: 18, topicId: 'fatigue-and-failure-analysis', phaseId: 'phase-2', phaseTitle: 'Phase 2: Physics, Mechanics & Simulation (CAE)', focus: 'S-N curves, endurance limits & Goodman cyclic fatigue' },

  // Phase 3: Manufacturing, CAM & Quality
  { stepNumber: 19, topicId: 'manufacturing-process-selection', phaseId: 'phase-3', phaseTitle: 'Phase 3: Manufacturing, CAM & Quality Control', focus: 'Process capability matrix & unit economics' },
  { stepNumber: 20, topicId: 'machining-fundamentals', phaseId: 'phase-3', phaseTitle: 'Phase 3: Manufacturing, CAM & Quality Control', focus: 'Milling/turning cutting speeds, feed per tooth & MRR' },
  { stepNumber: 21, topicId: 'cam-computer-aided-manufacturing', phaseId: 'phase-3', phaseTitle: 'Phase 3: Manufacturing, CAM & Quality Control', focus: 'CNC toolpath strategies, G-code & post-processing' },
  { stepNumber: 22, topicId: 'spur-gear-design', phaseId: 'phase-3', phaseTitle: 'Phase 3: Manufacturing, CAM & Quality Control', focus: 'Module, pitch diameter, gear reduction & torque' },
  { stepNumber: 23, topicId: 'bearings-and-shafts', phaseId: 'phase-3', phaseTitle: 'Phase 3: Manufacturing, CAM & Quality Control', focus: 'Rolling element bearings, L10 life & shaft stresses' },
  { stepNumber: 24, topicId: 'mechanical-power-transmission', phaseId: 'phase-3', phaseTitle: 'Phase 3: Manufacturing, CAM & Quality Control', focus: 'Belts, roller chains, couplings & drive ratios' },
  { stepNumber: 25, topicId: 'sheet-metal-manufacturing', phaseId: 'phase-3', phaseTitle: 'Phase 3: Manufacturing, CAM & Quality Control', focus: 'Bend allowance, K-factor, punching & laser nesting' },
  { stepNumber: 26, topicId: 'casting-forging-and-molding', phaseId: 'phase-3', phaseTitle: 'Phase 3: Manufacturing, CAM & Quality Control', focus: 'Sand/die casting, closed-die forging & plastic injection' },
  { stepNumber: 27, topicId: 'welding-and-joining', phaseId: 'phase-3', phaseTitle: 'Phase 3: Manufacturing, CAM & Quality Control', focus: 'GMAW/GTAW arc welding, joint symbols & heat distortion' },
  { stepNumber: 28, topicId: 'additive-manufacturing', phaseId: 'phase-3', phaseTitle: 'Phase 3: Manufacturing, CAM & Quality Control', focus: 'FDM, SLA, SLS, metal DMLS 3D printing & orientation' },
  { stepNumber: 29, topicId: 'metrology-and-inspection', phaseId: 'phase-3', phaseTitle: 'Phase 3: Manufacturing, CAM & Quality Control', focus: 'CMM inspection, measurement uncertainty & calibration' },
  { stepNumber: 30, topicId: 'quality-control-and-spc', phaseId: 'phase-3', phaseTitle: 'Phase 3: Manufacturing, CAM & Quality Control', focus: 'Cp/Cpk capability indices, Shewhart charts & Six Sigma' },
];

// Eagerly import all topic JSONs
const topicModules = import.meta.glob<TopicDetail>('../../data/topics/*.json', {
  eager: true,
  import: 'default',
});

// Map topic id -> TopicDetail (normalized with reassigned category)
export const topicsMap = new Map<string, TopicDetail>();

for (const path in topicModules) {
  const rawTopic = topicModules[path];
  if (rawTopic && rawTopic.id) {
    const reassignment = TOPIC_CATEGORY_REASSIGNMENT[rawTopic.id];
    const normalized: TopicDetail = {
      ...rawTopic,
      categoryId: reassignment ? reassignment.categoryId : rawTopic.categoryId,
      category: reassignment ? reassignment.category : rawTopic.category,
    };
    topicsMap.set(rawTopic.id, normalized);
  }
}

// Normalized Site Data featuring only the 3 categories
export const siteData: SiteData = {
  siteTitle: rawIndexData.siteTitle,
  subtitle: rawIndexData.subtitle,
  categories: THREE_CATEGORIES,
  topics: Array.from(topicsMap.values()).map((t) => ({
    id: t.id,
    title: t.title,
    category: t.category,
    categoryId: t.categoryId,
    readTime: t.readTime,
    difficulty: t.difficulty,
    icon: t.icon,
    summary: t.summary,
    tags: t.tags,
    lastUpdated: t.lastUpdated,
  })),
};

export function getTopicById(id: string): TopicDetail | undefined {
  return topicsMap.get(id);
}

export function getAllTopics(): TopicMeta[] {
  return siteData.topics;
}

export function getCategoryById(id: string): Category | undefined {
  return THREE_CATEGORIES.find((c) => c.id === id);
}

// Sequential helper functions for the roadmap
export function getRoadmapStepForTopic(topicId: string): RoadmapStep | undefined {
  return ROADMAP_STEPS.find((s) => s.topicId === topicId);
}

export function getNextTopicInRoadmap(currentTopicId: string): TopicDetail | undefined {
  const currentStep = getRoadmapStepForTopic(currentTopicId);
  if (!currentStep) return undefined;
  const nextStep = ROADMAP_STEPS.find((s) => s.stepNumber === currentStep.stepNumber + 1);
  return nextStep ? topicsMap.get(nextStep.topicId) : undefined;
}

export function getPreviousTopicInRoadmap(currentTopicId: string): TopicDetail | undefined {
  const currentStep = getRoadmapStepForTopic(currentTopicId);
  if (!currentStep) return undefined;
  const prevStep = ROADMAP_STEPS.find((s) => s.stepNumber === currentStep.stepNumber - 1);
  return prevStep ? topicsMap.get(prevStep.topicId) : undefined;
}
