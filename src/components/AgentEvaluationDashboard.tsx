import React, { useState } from 'react';
import { AGENT_METRICS_DATA, BENCHMARK_SCENARIOS_DATA } from '../data';
import { AgentMetricSimulation } from '../types';
import { BarChart3, TrendingUp, Clock, AlertTriangle, DollarSign, Target, CheckCircle2, XCircle, ArrowUpRight, Cpu, Layers } from 'lucide-react';

export const AgentEvaluationDashboard: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(AGENT_METRICS_DATA[2].id); // Self-Reflecting ReAct default
  const [activeScenarioId, setActiveScenarioId] = useState<string>(BENCHMARK_SCENARIOS_DATA[1].scenarioId);

  const selectedAgent = AGENT_METRICS_DATA.find((a) => a.id === selectedAgentId) || AGENT_METRICS_DATA[0];
  const activeScenario = BENCHMARK_SCENARIOS_DATA.find((s) => s.scenarioId === activeScenarioId) || BENCHMARK_SCENARIOS_DATA[0];

  return (
    <div className="space-y-8">
      {/* Header and KPI Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              가상 에이전트 성능 평가 및 관제 대시보드 (Agent Evaluation & Benchmark Ops)
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              단일 제로샷 에이전트부터 계층적 멀티 에이전트까지 4대 아키텍처의 <strong>과업 성공률(Success Rate)</strong>, 
              <strong>응답 지연시간(Latency)</strong>, <strong>환각 발생률(Hallucination Rate)</strong> 및 
              <strong>운영 비용(Token Cost)</strong>을 다각도로 시뮬레이션 비교합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg shrink-0">
            <span>Benchmark Dataset: 1,000 Synthetic Production Tasks</span>
          </div>
        </div>
      </div>

      {/* 4 Agent Architecture Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {AGENT_METRICS_DATA.map((agent) => {
          const isSelected = agent.id === selectedAgent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-amber-600 bg-amber-50/70 shadow-xs ring-1 ring-amber-600'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-medium text-stone-500">
                    {agent.architectureType}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      agent.successRate >= 90
                        ? 'bg-emerald-100 text-emerald-800'
                        : agent.successRate >= 70
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    성공률 {agent.successRate}%
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm leading-snug">{agent.name}</h4>
                <div className="text-[11px] font-mono text-stone-500">
                  엔진: {agent.modelEngine}
                </div>
              </div>

              {/* Mini Metric Grid */}
              <div className="grid grid-cols-3 gap-1 pt-3 border-t border-stone-200/80 text-center">
                <div className="p-1.5 bg-stone-50/70 rounded-lg">
                  <div className="text-[10px] text-stone-500">지연시간</div>
                  <div className="font-mono font-bold text-xs text-stone-900 tabular-nums">
                    {agent.avgLatencySeconds}s
                  </div>
                </div>
                <div className="p-1.5 bg-stone-50/70 rounded-lg">
                  <div className="text-[10px] text-stone-500">환각률</div>
                  <div className="font-mono font-bold text-xs text-rose-700 tabular-nums">
                    {agent.hallucinationRate}%
                  </div>
                </div>
                <div className="p-1.5 bg-stone-50/70 rounded-lg">
                  <div className="text-[10px] text-stone-500">1천회 비용</div>
                  <div className="font-mono font-bold text-xs text-emerald-800 tabular-nums">
                    ${agent.tokenCostPer1kRuns}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Dual-Column Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Deep Dive Metric Breakdown (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
                Selected Architecture Profile
              </span>
              <h4 className="text-xl font-bold text-stone-900 mt-0.5">{selectedAgent.name}</h4>
              <div className="text-xs text-stone-600 mt-1">
                권장 모델 스택: <strong className="text-stone-800">{selectedAgent.modelEngine}</strong>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-extrabold text-stone-900 font-mono tabular-nums">
                {selectedAgent.successRate}%
              </div>
              <div className="text-xs text-stone-500">종합 과업 완수율</div>
            </div>
          </div>

          {/* Metric Bar Visualizers */}
          <div className="space-y-4">
            {/* Success Rate Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-600" />
                  과업 성공률 (Task Completion Rate)
                </span>
                <span className="font-mono font-bold text-stone-900">{selectedAgent.successRate}%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedAgent.successRate}%` }}
                />
              </div>
            </div>

            {/* Hallucination Rate Bar (Inverted: lower is better) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  환각 발생률 (Hallucination Frequency - 낮을수록 안전)
                </span>
                <span className="font-mono font-bold text-rose-700">{selectedAgent.hallucinationRate}%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedAgent.hallucinationRate * 4}%` }} // scaled for visibility
                />
              </div>
            </div>

            {/* Tool Call Accuracy */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  도구 호출 스키마 정확도 (Tool Call Parameter Accuracy)
                </span>
                <span className="font-mono font-bold text-indigo-800">{selectedAgent.toolCallAccuracy}%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedAgent.toolCallAccuracy}%` }}
                />
              </div>
            </div>
          </div>

          {/* Operational Context Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="font-semibold text-stone-900">최적 적용 시나리오</span>
              <p className="text-stone-600 leading-relaxed">{selectedAgent.bestFitScenario}</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-1">
              <span className="font-semibold text-amber-950">운영 트레이드오프 분석</span>
              <p className="text-stone-700 leading-relaxed">{selectedAgent.operationalTradeoff}</p>
            </div>
          </div>

          {/* Summary Stat Strip */}
          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-stone-500">평균 턴(Turns): </span>
              <strong className="text-stone-900">{selectedAgent.avgTurns}회</strong>
            </div>
            <div>
              <span className="text-stone-500">평균 지연시간: </span>
              <strong className="text-stone-900">{selectedAgent.avgLatencySeconds}초</strong>
            </div>
            <div>
              <span className="text-stone-500">1,000회 실행 예상 비용: </span>
              <strong className="text-emerald-800">${selectedAgent.tokenCostPer1kRuns}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Scenario Stress Test Comparison (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6">
          <div className="space-y-2 border-b border-stone-200 pb-4">
            <h4 className="text-base font-bold text-stone-900">
              실무 과업 스트레스 테스트 시뮬레이터 (Scenario Matrix)
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              난이도별 4대 실무 시나리오에서 각 에이전트의 통과 여부와 지연시간을 실시간 비교합니다.
            </p>
          </div>

          {/* Scenario Selector */}
          <div className="space-y-2">
            {BENCHMARK_SCENARIOS_DATA.map((sc) => {
              const isCurrent = sc.scenarioId === activeScenario.scenarioId;
              return (
                <button
                  key={sc.scenarioId}
                  onClick={() => setActiveScenarioId(sc.scenarioId)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <span className="text-xs font-medium">{sc.scenarioName}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isCurrent
                        ? 'bg-stone-800 text-stone-200'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    난이도: {sc.difficulty}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scenario Results Table for Active Scenario */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-stone-800">
              선택된 과업 시뮬레이션 결과 ({activeScenario.scenarioName.split('(')[0]})
            </span>

            <div className="space-y-2">
              {activeScenario.agentResults.map((result) => {
                const agentMeta = AGENT_METRICS_DATA.find((a) => a.id === result.agentId);
                const isCurrentAgent = selectedAgent.id === result.agentId;

                return (
                  <div
                    key={result.agentId}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      isCurrentAgent
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                        {result.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        )}
                        <span>{agentMeta?.architectureType}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        {result.turnsTaken}턴 소요 · {result.tokensUsed.toLocaleString()} 토큰
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-stone-800">
                        {result.latency}초
                      </div>
                      <span
                        className={`text-[10px] font-mono ${
                          result.passed ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {result.passed ? '과업 완수' : '실패 / 환각'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
