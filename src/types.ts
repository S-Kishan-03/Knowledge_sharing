export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface TopicMeta {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  readTime: string;
  difficulty: Difficulty;
  icon: string;
  summary: string;
  tags: string[];
  lastUpdated?: string;
}

export interface FormulaSpec {
  label: string;
  math: string;
  description?: string;
}

export interface InfoboxData {
  title: string;
  imageSymbol?: string;
  keyFormulas?: FormulaSpec[];
  siUnits?: string;
  primaryFields?: string;
  keyConstants?: string;
}

export interface TopicSection {
  id: string;
  heading: string;
  content: string;
  calculator?: string;
}

export interface TopicDetail extends TopicMeta {
  infobox?: InfoboxData;
  sections: TopicSection[];
  keyTakeaways?: string[];
  relatedTopics?: string[];
}

export interface SiteData {
  siteTitle: string;
  subtitle: string;
  categories: Category[];
  topics: TopicMeta[];
}

export type ActiveView = 
  | { type: 'home'; categoryId?: string }
  | { type: 'topic'; topicId: string }
  | { type: 'calculators'; activeCalcId?: string }
  | { type: 'formulas' }
  | { type: 'constants' }
  | { type: 'bookmarks' }
  | { type: 'roadmap' };

export interface RoadmapStep {
  stepNumber: number;
  topicId: string;
  phaseId: 'phase-1' | 'phase-2' | 'phase-3';
  phaseTitle: string;
  focus: string;
}

export interface BookmarkItem {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  dateAdded: number;
}
