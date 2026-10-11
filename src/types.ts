export interface Framework {
  id: string;
  name: string;
  category: 'complex' | 'team' | 'light' | 'enterprise';
  categoryLabel: string;
  architecture: string;
  strengths: string[];
  weaknesses: string[];
  bestUse: string;
  repoStars?: string;
  primaryLanguage: string;
  link?: string;
}

export interface EnterprisePhase {
  phase: number;
  name: string;
  duration: string;
  team: string;
  goal: string;
  deliverables: string[];
  pitfalls: string;
  kpi: string;
}

export interface VideoResource {
  id: number;
  category: 'beginner' | 'nocode' | 'developer' | 'enterprise';
  categoryLabel: string;
  title: string;
  channelOrTopic: string;
  url: string;
  durationApprox: string;
  summary: string;
  keyTakeaways: string[];
}

export interface FailureMode {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  quote?: string;
  caseStudy: string;
  mechanism: string;
  remedy: string;
  severity: 'Critical' | 'High' | 'Systemic';
}

export interface SecurityLayer {
  level: number;
  name: string;
  phase: 'Input' | 'Execution' | 'Output';
  strategy: string;
  techStack: string;
  reductionEffect: string;
}

export interface BenchmarkItem {
  id: string;
  benchmark: string;
  dimension: string;
  humanBaseline: number;
  aiSota: number;
  evaluationFocus: string;
  coreChallenge: string;
}

export interface InteractiveChecklistStep {
  id: string;
  category: string;
  title: string;
  desc: string;
  critical: boolean;
}

export interface GlossaryTerm {
  id: string;
  termEn: string;
  termKo: string;
  category: 'core' | 'memory' | 'orchestration' | 'security' | 'evaluation';
  categoryLabel: string;
  summary: string;
  deepDive: string;
  realWorldExample: string;
  relatedTerms: string[];
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: 'system' | 'react' | 'guardrails' | 'self-correction' | 'handoff';
  categoryLabel: string;
  description: string;
  targetFramework: string;
  promptContent: string;
  variables: string[];
  engineeringNotes: string;
}
