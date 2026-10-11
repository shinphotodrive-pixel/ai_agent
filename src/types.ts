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

export interface AgentMetricSimulation {
  id: string;
  name: string;
  architectureType: 'Single Agent' | 'Sequential Chain' | 'Self-Reflecting ReAct' | 'Hierarchical Multi-Agent';
  modelEngine: string;
  successRate: number; // %
  avgLatencySeconds: number; // sec
  hallucinationRate: number; // %
  tokenCostPer1kRuns: number; // USD
  toolCallAccuracy: number; // %
  avgTurns: number;
  bestFitScenario: string;
  operationalTradeoff: string;
}

export interface SimulationBenchmarkRun {
  scenarioId: string;
  scenarioName: string;
  difficulty: 'Low' | 'Medium' | 'High' | 'Extreme';
  agentResults: {
    agentId: string;
    passed: boolean;
    latency: number;
    tokensUsed: number;
    hallucinationDetected: boolean;
    turnsTaken: number;
  }[];
}

export interface ModelPricingTier {
  id: string;
  name: string;
  provider: string;
  inputPerMillionUSD: number;
  outputPerMillionUSD: number;
  recommendedRole: string;
}

export interface CostCalculationResult {
  monthlyRuns: number;
  totalInputTokensPerRun: number;
  totalOutputTokensPerRun: number;
  monthlyCostUSD: number;
  costPerTaskUSD: number;
  annualCostUSD: number;
  tokenBreakdown: {
    systemPromptTokens: number;
    historyTurnsTokens: number;
    toolCallPayloadTokens: number;
    reflectionLoopTokens: number;
  };
}

export interface ReflectionStep {
  stepIndex: number;
  stage: 'Draft Generation' | 'Tool Execution & Error' | 'Critic Reflection' | 'Refined Output';
  actor: 'Generator (Generator Agent)' | 'Environment / Sandbox' | 'Critic (Evaluator Agent)' | 'Self-Correction Agent';
  thought?: string;
  actionCode?: string;
  observation?: string;
  critique?: {
    flawDetected: string;
    rootCause: string;
    recommendedFix: string;
  };
  revisedPayload?: string;
}

export interface ReflectionScenario {
  id: string;
  title: string;
  category: 'Code Runtime Error' | 'Schema Validation' | 'Factual Hallucination' | 'Policy Violation';
  userGoal: string;
  errorType: string;
  steps: ReflectionStep[];
  engineeringInsight: string;
}

export interface ValidationIssue {
  path: string;
  errorType: 'MISSING_REQUIRED' | 'TYPE_MISMATCH' | 'RANGE_VIOLATION' | 'UNAUTHORIZED_TOOL' | 'JSON_SYNTAX_ERROR';
  message: string;
  expected: string;
  received: string;
}

export interface SchemaValidationReport {
  isValid: boolean;
  toolName: string;
  issues: ValidationIssue[];
  repairedPayload?: string;
  executionStatus: 'READY_TO_DISPATCH' | 'BLOCKED_BY_GUARDRAIL' | 'SYNTAX_REJECTED';
}

export interface ToolDefinitionPreset {
  id: string;
  toolName: string;
  description: string;
  schemaJson: string;
  sampleValidPayload: string;
  sampleInvalidPayload: string;
}
