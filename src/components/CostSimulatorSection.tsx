import React, { useState } from 'react';
import { MODEL_PRICING_DATA } from '../data';
import { ModelPricingTier, CostCalculationResult } from '../types';
import { Calculator, DollarSign, TrendingDown, Layers, HelpCircle, ArrowRight, Zap, RefreshCw, BarChart2 } from 'lucide-react';

interface ArchitectureProfilePreset {
  id: string;
  name: string;
  defaultTurns: number;
  systemPromptBaseTokens: number;
  tokensPerTurnInput: number;
  tokensPerTurnOutput: number;
  toolCallFrequency: number;
  reflectionPasses: number;
  description: string;
}

const ARCHITECTURE_PRESETS: ArchitectureProfilePreset[] = [
  {
    id: 'single',
    name: '단일 기본 챗봇 (Single Zero-Shot)',
    defaultTurns: 1,
    systemPromptBaseTokens: 400,
    tokensPerTurnInput: 250,
    tokensPerTurnOutput: 300,
    toolCallFrequency: 0.2,
    reflectionPasses: 0,
    description: '단 1회의 요청-응답. 도구 호출이 거의 없고 자가 비평 루프가 없어 가장 저렴합니다.'
  },
  {
    id: 'sequential',
    name: '선형 파이프라인 (Sequential Chain)',
    defaultTurns: 3,
    systemPromptBaseTokens: 800,
    tokensPerTurnInput: 600,
    tokensPerTurnOutput: 450,
    toolCallFrequency: 1.0,
    reflectionPasses: 0,
    description: '검색 ➔ 정리 ➔ 작성을 순차 실행. 단계별 컨텍스트가 누적되어 토큰 소모가 3~4배 증가합니다.'
  },
  {
    id: 'react-loop',
    name: '자가 교정 ReAct (Self-Reflecting ReAct)',
    defaultTurns: 6,
    systemPromptBaseTokens: 1500,
    tokensPerTurnInput: 1200,
    tokensPerTurnOutput: 500,
    toolCallFrequency: 2.5,
    reflectionPasses: 1.5,
    description: 'Thought-Action-Observation 루프 및 에러 발생 시 재시도. 토큰 소모량이 약 8~10배로 상승합니다.'
  },
  {
    id: 'multi-agent',
    name: '계층적 멀티 에이전트 (Hierarchical Multi-Agent)',
    defaultTurns: 12,
    systemPromptBaseTokens: 3500,
    tokensPerTurnInput: 2200,
    tokensPerTurnOutput: 800,
    toolCallFrequency: 4.0,
    reflectionPasses: 3.0,
    description: 'Triage 라우팅 + 서브에이전트 페르소나 + Critic 검수. 대화 및 핸드오프 오버헤드로 약 15~20배 토큰 소모.'
  }
];

export const CostSimulatorSection: React.FC = () => {
  const [selectedArchId, setSelectedArchId] = useState<string>('react-loop');
  const [selectedModelId, setSelectedModelId] = useState<string>('claude-3-5-sonnet');
  const [dailyTaskVolume, setDailyTaskVolume] = useState<number>(500); // 500 tasks per day
  const [customTurns, setCustomTurns] = useState<number>(6);
  const [useRoutingOptimization, setUseRoutingOptimization] = useState<boolean>(true);

  const selectedArch = ARCHITECTURE_PRESETS.find((a) => a.id === selectedArchId) || ARCHITECTURE_PRESETS[2];
  const selectedModel = MODEL_PRICING_DATA.find((m) => m.id === selectedModelId) || MODEL_PRICING_DATA[3];

  // Handle Architecture change with default turns
  const handleArchChange = (archId: string) => {
    setSelectedArchId(archId);
    const target = ARCHITECTURE_PRESETS.find((a) => a.id === archId);
    if (target) {
      setCustomTurns(target.defaultTurns);
    }
  };

  // Calculate Tokens per Run
  const systemPromptTokens = selectedArch.systemPromptBaseTokens;
  const turns = customTurns;
  
  // History tokens accumulate across turns
  // turn 1: input + output
  // turn 2: turn 1 history + input + output, etc.
  const historyTurnsTokens = Math.round((turns * (turns + 1) / 2) * (selectedArch.tokensPerTurnInput * 0.4));
  const toolCallPayloadTokens = Math.round(selectedArch.toolCallFrequency * 350 * turns);
  const reflectionLoopTokens = Math.round(selectedArch.reflectionPasses * 800);

  const totalInputTokensPerRun = systemPromptTokens + historyTurnsTokens + toolCallPayloadTokens + reflectionLoopTokens;
  const totalOutputTokensPerRun = Math.round(selectedArch.tokensPerTurnOutput * turns);

  const monthlyRuns = dailyTaskVolume * 30;

  // Cost calculation
  // If routing optimization is enabled: 70% of simple turns routed to small model (gpt-4o-mini / haiku), 30% to primary model
  let effectiveInputCostPerM = selectedModel.inputPerMillionUSD;
  let effectiveOutputCostPerM = selectedModel.outputPerMillionUSD;

  if (useRoutingOptimization && (selectedArch.id === 'react-loop' || selectedArch.id === 'multi-agent')) {
    const cheapModel = MODEL_PRICING_DATA[0]; // gpt-4o-mini
    effectiveInputCostPerM = (selectedModel.inputPerMillionUSD * 0.4) + (cheapModel.inputPerMillionUSD * 0.6);
    effectiveOutputCostPerM = (selectedModel.outputPerMillionUSD * 0.4) + (cheapModel.outputPerMillionUSD * 0.6);
  }

  const costPerTaskUSD =
    ((totalInputTokensPerRun / 1_000_000) * effectiveInputCostPerM) +
    ((totalOutputTokensPerRun / 1_000_000) * effectiveOutputCostPerM);

  const monthlyCostUSD = costPerTaskUSD * monthlyRuns;
  const annualCostUSD = monthlyCostUSD * 12;

  // Unoptimized cost comparison (for showing savings)
  const unoptimizedCostPerTask =
    ((totalInputTokensPerRun / 1_000_000) * selectedModel.inputPerMillionUSD) +
    ((totalOutputTokensPerRun / 1_000_000) * selectedModel.outputPerMillionUSD);
  const unoptimizedMonthlyCost = unoptimizedCostPerTask * monthlyRuns;
  const monthlySavingsUSD = Math.max(0, unoptimizedMonthlyCost - monthlyCostUSD);
  const savingsPercent = unoptimizedMonthlyCost > 0 ? Math.round((monthlySavingsUSD / unoptimizedMonthlyCost) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-600" />
              에이전트 토큰 소모량 및 API 운영 비용 시뮬레이터 (Agent FinOps Simulator)
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              에이전트 아키텍처에 따른 컨텍스트 누적 회차(Turns), 도구 호출 페이로드, 모델 티어별 단가를 기반으로
              월간 예상 토큰 사용량과 API 청구 금액을 정량 산출하고 라우팅 최적화 절감액을 예측합니다.
            </p>
          </div>

          <div className="text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg shrink-0">
            실시간 토큰 비용 예측 공식 반영
          </div>
        </div>
      </div>

      {/* Main Dual-Column Simulator Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Parameter Controls (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Architecture Selector */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
              1. 아키텍처 패턴 선택 (Architecture Preset)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ARCHITECTURE_PRESETS.map((arch) => {
                const isSelected = arch.id === selectedArch.id;
                return (
                  <button
                    key={arch.id}
                    onClick={() => handleArchChange(arch.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100'
                    }`}
                  >
                    <div className="font-bold text-stone-900 text-xs mb-1">{arch.name}</div>
                    <p className="text-[11px] text-stone-500 leading-snug line-clamp-2">
                      {arch.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Pricing Selection */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
                2. 주력 파운데이션 모델 엔진 (Primary LLM Engine)
              </label>
              <span className="text-[11px] font-mono text-stone-400">
                1M 토큰당 단가
              </span>
            </div>

            <div className="space-y-2">
              {MODEL_PRICING_DATA.map((model) => {
                const isSelected = model.id === selectedModel.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModelId(model.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-900'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-xs flex items-center gap-2">
                        <span>{model.name}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {model.provider}
                        </span>
                      </div>
                      <div className={`text-[11px] ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        {model.recommendedRole}
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs tabular-nums shrink-0 pl-3">
                      <div>입력 ${model.inputPerMillionUSD}</div>
                      <div className={isSelected ? 'text-amber-300' : 'text-stone-500'}>
                        출력 ${model.outputPerMillionUSD}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume and Tuners */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
              3. 트래픽 볼륨 및 실행 파라미터 (Volume & Execution Parameters)
            </label>

            <div className="space-y-4 text-xs">
              {/* Daily Volume Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-600">일일 과업 처리량 (Daily Task Volume):</span>
                  <span className="font-mono font-bold text-stone-900">
                    {dailyTaskVolume.toLocaleString()} 건 / 일 (월 {monthlyRuns.toLocaleString()} 건)
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={dailyTaskVolume}
                  onChange={(e) => setDailyTaskVolume(Number(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>

              {/* Turns Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-600">과업당 평균 에이전트 추론 턴(Turns):</span>
                  <span className="font-mono font-bold text-stone-900">{customTurns} 턴 (Turns)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={customTurns}
                  onChange={(e) => setCustomTurns(Number(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>

              {/* Optimization Checkbox */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-900">
                    소형 모델 계층형 라우팅 최적화 (Model Cascading Routing)
                  </div>
                  <div className="text-[11px] text-stone-500">
                    단순 분류/데이터 파싱 60%를 경량 모델(GPT-4o-mini)로 오프로딩
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useRoutingOptimization}
                  onChange={(e) => setUseRoutingOptimization(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Projected Financial & Token Report (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6 sticky top-24">
          <div className="border-b border-stone-200 pb-4">
            <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
              FinOps Estimated Billing
            </span>
            <h4 className="text-xl font-bold text-stone-900 mt-0.5">
              월간 예상 API 운영 비용 보고서
            </h4>
          </div>

          {/* Top Big Number Cards */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-1">
              <div className="text-[11px] text-stone-400 font-mono">예상 월간 청구 비용</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
                ${monthlyCostUSD.toFixed(2)}
              </div>
              <div className="text-[10px] text-stone-400 font-mono">
                (연간 약 ${(annualCostUSD).toLocaleString(undefined, { maximumFractionDigits: 0 })})
              </div>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
              <div className="text-[11px] text-stone-500 font-mono">과업 1회당 비용</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-stone-900 tabular-nums">
                ${costPerTaskUSD.toFixed(4)}
              </div>
              <div className="text-[10px] text-stone-500 font-mono">
                약 {Math.round(costPerTaskUSD * 1400)} 원 / 건
              </div>
            </div>
          </div>

          {/* Model Cascading Savings Banner */}
          {useRoutingOptimization && (selectedArch.id === 'react-loop' || selectedArch.id === 'multi-agent') && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold">모델 라우팅으로 월 ${monthlySavingsUSD.toFixed(2)} 절감</span>
                  <div className="text-[11px] text-emerald-800">단일 고가 모델 독점 대비 약 {savingsPercent}% 비용 감소</div>
                </div>
              </div>
              <span className="font-mono font-bold text-emerald-700 text-sm">-{savingsPercent}%</span>
            </div>
          )}

          {/* Token Breakdown Tree */}
          <div className="space-y-3">
            <span className="font-bold text-stone-900 text-xs">
              과업 1회당 토큰 소모 구성 (Token Consumption per Task)
            </span>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex justify-between">
                <span className="text-stone-600">시스템 헌법 및 도구 스키마 (System Invariants)</span>
                <span className="font-mono font-bold text-stone-900">{systemPromptTokens.toLocaleString()} tokens</span>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex justify-between">
                <span className="text-stone-600">누적 턴 컨텍스트 히스토리 ({customTurns} 턴 대화)</span>
                <span className="font-mono font-bold text-stone-900">{historyTurnsTokens.toLocaleString()} tokens</span>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex justify-between">
                <span className="text-stone-600">도구 호출 페이로드 & DB/웹 검색 결과 수신</span>
                <span className="font-mono font-bold text-stone-900">{toolCallPayloadTokens.toLocaleString()} tokens</span>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex justify-between">
                <span className="text-stone-600">자가 비평(Critic) & 에러 재시도 루프</span>
                <span className="font-mono font-bold text-stone-900">{reflectionLoopTokens.toLocaleString()} tokens</span>
              </div>

              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 flex justify-between font-bold text-stone-900">
                <span>총 입력 / 출력 토큰 합계</span>
                <span className="font-mono">
                  {(totalInputTokensPerRun + totalOutputTokensPerRun).toLocaleString()} tokens
                </span>
              </div>
            </div>
          </div>

          {/* Architecture Overhead Comparative Ratio */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-1.5 text-xs text-amber-950">
            <span className="font-bold flex items-center gap-1.5 text-amber-900">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              일반 챗봇 대비 오버헤드 배수:
            </span>
            <p className="text-[11px] leading-relaxed text-stone-700">
              현재 설정은 일반 1회성 챗봇(약 550 토큰) 대비{' '}
              <strong className="text-amber-900 font-mono">
                {((totalInputTokensPerRun + totalOutputTokensPerRun) / 550).toFixed(1)}배
              </strong>{' '}
              의 토큰을 소비합니다. 업무 중요도가 높은 영역에 한하여 단계적 배포를 권장합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
