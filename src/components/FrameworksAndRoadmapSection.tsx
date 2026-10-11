import React, { useState } from 'react';
import { Framework } from '../types';
import { FRAMEWORKS_DATA, GPTS_BUILD_STEPS, ENTERPRISE_PHASES_DATA } from '../data';
import { ExternalLink, Check, Clock, Users, Target, AlertTriangle } from 'lucide-react';

export const FrameworksAndRoadmapSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'complex' | 'team' | 'light' | 'enterprise'>('all');
  const [activePhaseNumber, setActivePhaseNumber] = useState<number>(1);
  const [activeStepNumber, setActiveStepNumber] = useState<number>(1);

  const filteredFrameworks = selectedFilter === 'all'
    ? FRAMEWORKS_DATA
    : FRAMEWORKS_DATA.filter((f) => f.category === selectedFilter);

  const activePhase = ENTERPRISE_PHASES_DATA.find((p) => p.phase === activePhaseNumber) || ENTERPRISE_PHASES_DATA[0];
  const activeStep = GPTS_BUILD_STEPS.find((s) => s.step === activeStepNumber) || GPTS_BUILD_STEPS[0];

  return (
    <div className="space-y-12">
      {/* 1. Framework Matrix */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg">
              주요 에이전트 개발 프레임워크 기술 분석
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              아키텍처 유형별 장단점과 프로덕션 적합성을 비교하여 팀 역량에 맞는 툴킷을 선정하세요.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                selectedFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedFilter('complex')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                selectedFilter === 'complex' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              복합 그래프 (LangGraph)
            </button>
            <button
              onClick={() => setSelectedFilter('team')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                selectedFilter === 'team' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              역할 분담 (CrewAI/AutoGen)
            </button>
            <button
              onClick={() => setSelectedFilter('light')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                selectedFilter === 'light' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              경량 SDK (OpenAI)
            </button>
            <button
              onClick={() => setSelectedFilter('enterprise')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                selectedFilter === 'enterprise' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              엔터프라이즈 (MS)
            </button>
          </div>
        </div>

        {/* Framework Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFrameworks.map((fw) => (
            <div
              key={fw.id}
              className="p-5 rounded-xl border border-stone-200 bg-stone-50/30 flex flex-col justify-between space-y-4 hover:border-stone-400 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h4 className="font-bold text-stone-900 text-base">{fw.name}</h4>
                    <span className="text-[11px] text-stone-500 font-mono">{fw.primaryLanguage}</span>
                  </div>
                  <span className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md">
                    {fw.categoryLabel}
                  </span>
                </div>

                <div className="text-xs text-stone-600 font-medium">
                  {fw.architecture}
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-800">핵심 장점:</span>
                    <ul className="mt-1 space-y-1 text-stone-600">
                      {fw.strengths.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 shrink-0">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-1">
                    <span className="font-semibold text-stone-600">주의 사항:</span>
                    <ul className="mt-1 space-y-1 text-stone-500">
                      {fw.weaknesses.map((w, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-stone-400 shrink-0">·</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 space-y-2">
                <div className="text-[11px] text-stone-700">
                  <strong className="text-stone-900">최적 적용 분야:</strong> {fw.bestUse}
                </div>
                {fw.link && (
                  <a
                    href={fw.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900 font-medium pt-1"
                  >
                    <span>공식 리포지토리 확인</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Dual Column: No-Code GPTs 6 Steps vs Enterprise 5-Phase Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* No-Code GPTs 6 Steps (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base">
                노코드: OpenAI GPTs 6단계 제작 절차
              </h3>
              <span className="text-xs text-stone-500 font-mono">No-Code</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              사내 데이터 유출을 방지하면서 사내 맞춤형 봇을 제작하고 배포하는 표준 순서입니다.
            </p>
          </div>

          <div className="space-y-2">
            {GPTS_BUILD_STEPS.map((s) => (
              <button
                key={s.step}
                onClick={() => setActiveStepNumber(s.step)}
                className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  activeStepNumber === s.step
                    ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/70'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold shrink-0 mt-0.5 ${
                    activeStepNumber === s.step
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {s.step}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-stone-900 text-xs">{s.title}</div>
                  <div className="text-[11px] text-stone-600 mt-0.5">{s.action}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Deep Dive Box */}
          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs space-y-1">
            <span className="font-semibold text-amber-900">
              {activeStep.step}단계 핵심 실무 팁:
            </span>
            <p className="text-stone-700 leading-relaxed">{activeStep.tip}</p>
          </div>
        </div>

        {/* Enterprise 5-Phase Roadmap (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base">
                엔터프라이즈 에이전트 도입 5단계 로드맵
              </h3>
              <span className="text-xs text-stone-500 font-mono">운영 모델 프레임워크</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              기술 도입 실패의 70%는 조직 문화와 프로세스 부재에 있습니다. 단계별 통과 게이트(Exit Criteria)를 충족해야 합니다.
            </p>
          </div>

          {/* Phase Tab Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs overflow-x-auto">
            {ENTERPRISE_PHASES_DATA.map((p) => (
              <button
                key={p.phase}
                onClick={() => setActivePhaseNumber(p.phase)}
                className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  activePhaseNumber === p.phase
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {p.phase}단계: {p.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Phase Detailed Content Card */}
          <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <h4 className="font-bold text-stone-900 text-sm">{activePhase.name}</h4>
              <div className="flex items-center gap-3 text-xs text-stone-600 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  소요 기간: {activePhase.duration}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-stone-500" />
                  권장 투입 인력
                </span>
                <p className="text-stone-600">{activePhase.team}</p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-stone-500" />
                  핵심 목표
                </span>
                <p className="text-stone-600">{activePhase.goal}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-stone-800">주요 산출물 (Deliverables)</span>
              <ul className="space-y-1 text-stone-600">
                {activePhase.deliverables.map((d, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200/60 text-xs space-y-1 text-rose-950">
              <span className="font-semibold flex items-center gap-1 text-rose-900">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                가장 흔한 실패 함정 (Common Pitfall)
              </span>
              <p className="leading-relaxed text-[11px]">{activePhase.pitfalls}</p>
            </div>

            <div className="text-[11px] text-stone-600 font-mono bg-white p-2.5 rounded-lg border border-stone-200">
              <strong>게이트 통과 조건 (Exit KPI):</strong> {activePhase.kpi}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
