import React, { useState } from 'react';
import { REFLECTION_SCENARIOS_DATA } from '../data';
import { ReflectionScenario } from '../types';
import { RefreshCw, CheckCircle2, AlertOctagon, Terminal, ArrowRight, Play, RotateCcw, Sparkles, HelpCircle } from 'lucide-react';

export const ReflectionSimulatorSection: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(REFLECTION_SCENARIOS_DATA[0].id);
  const [currentStepProgress, setCurrentStepProgress] = useState<number>(1); // 1, 2, 3, 4
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const scenario = REFLECTION_SCENARIOS_DATA.find((s) => s.id === selectedScenarioId) || REFLECTION_SCENARIOS_DATA[0];

  const handleNextStep = () => {
    if (currentStepProgress < 4) {
      setCurrentStepProgress((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStepProgress(1);
    setIsAutoPlaying(false);
  };

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setCurrentStepProgress(1);
    setIsAutoPlaying(false);
  };

  const runAllSteps = () => {
    setIsAutoPlaying(true);
    let step = 1;
    const interval = setInterval(() => {
      step += 1;
      setCurrentStepProgress(step);
      if (step >= 4) {
        clearInterval(interval);
        setIsAutoPlaying(false);
      }
    }, 1000);
  };

  const getStageBadgeStyle = (stage: string) => {
    switch (stage) {
      case 'Draft Generation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tool Execution & Error':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Critic Reflection':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Refined Output':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-amber-600" />
              에이전트 자가 교정 (Reflection & Self-Correction) 인터랙티브 시뮬레이터
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              에이전트가 단일 시도로 정답을 맞추는 것이 아니라, <strong>1차 초안 생성 ➔ 도구 실행 및 에러 감지 ➔ 
              비평자(Critic) 피드백 ➔ 2차 최종 교정</strong>에 이르는 순환형 반성(Reflection) 메커니즘을 단계별로 시뮬레이션합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runAllSteps}
              disabled={isAutoPlaying || currentStepProgress === 4}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                currentStepProgress === 4
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>전체 자가교정 자동 재생</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>초기화</span>
            </button>
          </div>
        </div>

        {/* Scenario Selector Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {REFLECTION_SCENARIOS_DATA.map((sc) => {
            const isSelected = sc.id === scenario.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/70 shadow-xs ring-1 ring-amber-600'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-medium text-stone-500 uppercase">
                    {sc.category}
                  </span>
                  <span className="text-[10px] font-mono text-rose-700 font-bold">
                    {sc.errorType.split('&')[0]}
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 text-xs leading-snug">{sc.title}</h4>
                <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">{sc.userGoal}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-stone-900">
            반성 루프 진행 상태: {currentStepProgress} / 4 단계
          </span>
          <span className="text-stone-500">
            {currentStepProgress === 1 && '1단계: 생성자 에이전트 초안 작성'}
            {currentStepProgress === 2 && '2단계: 도구 실행 환경에서의 에러/결함 포착'}
            {currentStepProgress === 3 && '3단계: 비평자(Critic) 에이전트의 원인 진단 및 처방'}
            {currentStepProgress === 4 && '4단계: 피드백이 반영된 무결점 최종 결과물'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((stepIdx) => {
            const isReached = currentStepProgress >= stepIdx;
            const isCurrent = currentStepProgress === stepIdx;
            return (
              <div
                key={stepIdx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'bg-amber-600'
                    : isReached
                    ? 'bg-stone-800'
                    : 'bg-stone-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 4-Step Interactive Visual Timeline */}
      <div className="space-y-4">
        {scenario.steps.map((step) => {
          const isVisible = currentStepProgress >= step.stepIndex;
          if (!isVisible) return null;

          return (
            <div
              key={step.stepIndex}
              className={`p-6 rounded-2xl border transition-all animate-fadeIn ${
                step.stage === 'Tool Execution & Error'
                  ? 'border-rose-200 bg-rose-50/30'
                  : step.stage === 'Critic Reflection'
                  ? 'border-amber-200 bg-amber-50/30'
                  : step.stage === 'Refined Output'
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-stone-200 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-900 text-white font-mono font-bold text-xs">
                    {step.stepIndex}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStageBadgeStyle(step.stage)}`}>
                    {step.stage}
                  </span>
                  <span className="text-xs text-stone-600 font-medium">
                    주체: <strong>{step.actor}</strong>
                  </span>
                </div>

                <div className="text-[11px] font-mono text-stone-500">
                  {step.stepIndex === 1 && '1차 시도 (Initial Guess)'}
                  {step.stepIndex === 2 && '실행 피드백 수신 (Execution Failure)'}
                  {step.stepIndex === 3 && '자가 비평 (Self-Reflective Critic)'}
                  {step.stepIndex === 4 && '완전 교정 완료 (Self-Healed)'}
                </div>
              </div>

              {/* Step Content Details */}
              <div className="space-y-3 text-xs">
                {step.thought && (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-700">
                    <strong className="text-stone-900">내부 추론(Thought):</strong> {step.thought}
                  </div>
                )}

                {step.actionCode && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono text-stone-500">
                      {step.stepIndex === 1 ? '작성된 1차 코드 / 도구 호출 페이로드:' : '교정된 2차 코드 / 확정 페이로드:'}
                    </div>
                    <div className="p-4 bg-stone-900 text-stone-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                      <pre className="whitespace-pre-wrap">{step.actionCode}</pre>
                    </div>
                  </div>
                )}

                {step.observation && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono text-rose-700 font-semibold flex items-center gap-1.5">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>환경 샌드박스 에러 트레이스백 (Error Traceback):</span>
                    </div>
                    <div className="p-4 bg-rose-950 text-rose-200 rounded-xl font-mono text-xs overflow-x-auto border border-rose-800 leading-relaxed">
                      <pre className="whitespace-pre-wrap">{step.observation}</pre>
                    </div>
                  </div>
                )}

                {step.critique && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2 text-amber-950">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      비평자(Critic) 에이전트의 심층 결함 분석 및 처방전:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div className="p-2.5 bg-white rounded-lg border border-amber-200">
                        <span className="font-bold text-rose-800 text-[11px]">발견된 결함:</span>
                        <p className="text-[11px] text-stone-700 mt-0.5">{step.critique.flawDetected}</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-amber-200">
                        <span className="font-bold text-amber-800 text-[11px]">근본 원인 (Root Cause):</span>
                        <p className="text-[11px] text-stone-700 mt-0.5">{step.critique.rootCause}</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-amber-200">
                        <span className="font-bold text-emerald-800 text-[11px]">권장 수정안 (Remedy):</span>
                        <p className="text-[11px] text-stone-700 mt-0.5 whitespace-pre-line">{step.critique.recommendedFix}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Step Forward Button */}
        {currentStepProgress < 4 && (
          <div className="text-center pt-2">
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer inline-flex items-center gap-2"
            >
              <span>다음 반성 단계 진행하기 (Step {currentStepProgress + 1} / 4)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {currentStepProgress === 4 && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">자가 교정 완료 (Self-Healing Loop Completed)</span>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  인간의 수동 개입 없이, Critic 비평과 실행 피드백을 통해 2회차 루프에서 오류를 완전히 해결했습니다.
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-900 transition cursor-pointer shrink-0"
            >
              다시 시뮬레이션
            </button>
          </div>
        )}
      </div>

      {/* Engineering Takeaway Box */}
      <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-1.5 text-xs">
        <span className="font-bold text-stone-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Reflection 아키텍처의 엔지니어링 교훈 (Key Architectural Takeaway):
        </span>
        <p className="text-stone-600 leading-relaxed text-[11px]">
          {scenario.engineeringInsight}
        </p>
      </div>
    </div>
  );
};
