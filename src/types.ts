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

// 1. Memory Retention Types
export interface MemoryRetentionTestConfig {
  contextDepthTokens: number; // 2k, 8k, 32k, 64k, 128k
  needlePlacement: 'beginning' | 'middle_25' | 'middle_50' | 'middle_75' | 'end';
  compactionStrategy: 'Raw Full Context' | 'Lossy Rolling Summary' | 'Hierarchical RAG Anchor';
}

export interface MemoryRetentionResult {
  score: number; // 0-100%
  lostInTheMiddleDegree: number; // %
  recalledKeyDetails: string[];
  forgottenConstraints: string[];
  status: 'PERFECT_RECALL' | 'PARTIAL_ATTENUATION' | 'CRITICAL_ROT';
}

// 2. Prompt AB Testing Types
export interface PromptABTestResult {
  variantA: {
    name: string;
    prompt: string;
    successRate: number;
    tokensTotal: number;
    latencySec: number;
    estimatedCostUSD: number;
    sampleOutput: string;
    strengths: string[];
    weaknesses: string[];
  };
  variantB: {
    name: string;
    prompt: string;
    successRate: number;
    tokensTotal: number;
    latencySec: number;
    estimatedCostUSD: number;
    sampleOutput: string;
    strengths: string[];
    weaknesses: string[];
  };
  winner: 'A' | 'B' | 'TIE';
  efficiencyDeltaPercent: number;
  recommendation: string;
}

// 3. Agent Injection Simulator Types
export interface InjectionAttempt {
  id: string;
  category: 'Direct Jailbreak' | 'Indirect Context Poisoning' | 'Roleplay Persona Hijack' | 'Encoded Cipher Exploit';
  payload: string;
  severity: 'Critical' | 'High' | 'Medium';
  defenseBlocked: boolean;
  agentResponse: string;
  guardrailLayerTriggered?: string;
  threatLog: string[];
}

// 4. Topology Visualizer Types
export interface AgentNode {
  id: string;
  name: string;
  role: 'Orchestrator' | 'Worker' | 'Critic' | 'Tool Gateway' | 'Human Gate';
  model: string;
  description: string;
  x: number;
  y: number;
}

export interface AgentEdge {
  id: string;
  source: string;
  target: string;
  channelType: 'Delegation' | 'Data Stream' | 'Critique Feedback' | 'Approval Webhook';
  label: string;
}

// 5. HITL Governance Simulator Types
export interface HitlGovernanceThresholds {
  dollarAmountLimit: number; // e.g. $1,000
  riskScoreLimit: number; // e.g. 65 / 100
  restrictedActions: string[];
  requireDualApproval: boolean;
  notificationChannel: 'Slack Interactive Webhook' | 'Admin Security Portal' | 'Email Escalate';
}

export interface HitlScenario {
  id: string;
  title: string;
  description: string;
  category: 'Finance' | 'Database' | 'Infrastructure' | 'Customer PII';
  proposedAction: {
    toolName: string;
    dollarAmount: number;
    riskScore: number;
    targetResource: string;
    argumentsPayload: Record<string, any>;
    explanation: string;
  };
}

export type HitlExecutionStatus =
  | 'IDLE'
  | 'ANALYZING'
  | 'EVALUATING_RULES'
  | 'PAUSED_AWAITING_APPROVAL'
  | 'APPROVED_RESUMING'
  | 'REJECTED_ROLLEDBACK'
  | 'AUTO_EXECUTED';

export interface HitlAuditEntry {
  id: string;
  timestamp: string;
  type: 'INFO' | 'RULE_EVAL' | 'PAUSE_FREEZE' | 'USER_INTERVENTION' | 'EXECUTE_SUCCESS' | 'SAFE_ROLLBACK';
  message: string;
  operator?: string;
  badge?: string;
}
