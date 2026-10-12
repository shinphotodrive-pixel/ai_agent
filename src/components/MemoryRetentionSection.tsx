import React, { useState } from 'react';
import { MemoryRetentionResult } from '../types';
import { Brain, Layers, AlertTriangle, CheckCircle2, RefreshCw, Sparkles, BookOpen, FileText, ChevronRight } from 'lucide-react';

const NEEDLE_PRESETS = [
  {
    title: '기업 비밀 계약 제약 (Contract Invariant)',
    needle: '비밀 유지 조항 제7조: 10,000달러를 초과하는 모든 하도급 외주 계약은 반드시 법무팀과 CTO의 공동 서면 승인이 필요하며 이를 위반 시 100만 달러의 위약금이 부과된다.',
    query: '15,000달러 외주 용역 계약 체결 시 누구의 승인이 필요하며 위약벌 조항은 어떻게 되는가?'
  },
  {
    title: '사내 보안 인증 키 (Security Token)',
    needle: '보안 릴리즈 지침: 내부 프로덕션 클러스터 배포 시 임시 마스터 토큰은 `SEC-PROD-9981-ALPHA`를 헤더 `X-Deploy-Auth`에 주입해야 한다.',
    query: '프로덕션 클러스터 배포 시 필요한 인증 헤더와 토큰 값은?'
  },
  {
    title: '환자 금기 약물 정보 (Medical Contraindication)',
    needle: '환자 차트 주의사항: 환자는 심각한 페니실린계 항생제 아나필락시스 쇼크 병력이 있으므로 아목시실린 투여를 절대 금지한다.',
    query: '이 환자에게 상기도 감염 치료제로 아목시실린 500mg을 처방해도 안전한가?'
  }
];

export const MemoryRetentionSection: React.FC = () => {
  const [selectedNeedleIdx, setSelectedNeedleIdx] = useState<number>(0);
  const [contextDepth, setContextDepth] = useState<number>(32000); // 32k tokens
  const [needlePlacement, setNeedlePlacement] = useState<'beginning' | 'middle_25' | 'middle_50' | 'middle_75' | 'end'>('middle_50');
  const [compactionStrategy, setCompactionStrategy] = useState<'Raw Full Context' | 'Lossy Rolling Summary' | 'Hierarchical RAG Anchor'>('Lossy Rolling Summary');

  const preset = NEEDLE_PRESETS[selectedNeedleIdx];

  // Calculate Memory Retention Score based on Needle in a Haystack scientific curve
  const calculateRetention = (): MemoryRetentionResult => {
    let baseScore = 95;

    // Depth penalty
    if (contextDepth >= 64000) baseScore -= 18;
    else if (contextDepth >= 32000) baseScore -= 10;
    else if (contextDepth >= 16000) baseScore -= 5;

    // Lost in the middle penalty
    let lostDegree = 5;
    if (needlePlacement === 'middle_50') {
      baseScore -= 28;
      lostDegree = 38;
    } else if (needlePlacement === 'middle_25' || needlePlacement === 'middle_75') {
      baseScore -= 18;
      lostDegree = 24;
    } else {
      lostDegree = 6;
    }

    // Strategy impact
    if (compactionStrategy === 'Lossy Rolling Summary') {
      baseScore -= 25; // summaries drop minute numerical constraints
    } else if (compactionStrategy === 'Hierarchical RAG Anchor') {
      baseScore += 22; // RAG or memory anchors pull exact chunk
    }

    const finalScore = Math.max(12, Math.min(99, baseScore));

    let status: MemoryRetentionResult['status'] = 'PERFECT_RECALL';
    if (finalScore < 50) status = 'CRITICAL_ROT';
    else if (finalScore < 80) status = 'PARTIAL_ATTENUATION';

    const recalled: string[] = [];
    const forgotten: string[] = [];

    if (finalScore >= 80) {
      recalled.push('핵심 수치 제약 정확 인출 성공');
      recalled.push('조건부 승인 주체(Role) 일치');
      recalled.push('위반 시 페널티 조건 준수');
    } else if (finalScore >= 50) {
      recalled.push('질문 주제 맥락은 인지');
      forgotten.push('정확한 수치($10,000 / 토큰 식별자) 누락 또는 환각 발생');
      forgotten.push('공동 승인자 중 1인(CTO 또는 법무팀) 누락');
    } else {
      forgotten.push('초기 시스템 제약사항 완전 유실 (Context Rot)');
      forgotten.push('일반적인 상식 기반 추론으로 대체하여 보안 정책 위반');
      forgotten.push('사전 금기 사항을 감지하지 못하고 위험한 기본값 실행');
    }

    return {
      score: finalScore,
      lostInTheMiddleDegree: lostDegree,
      recalledKeyDetails: recalled,
      forgottenConstraints: forgotten,
      status
    };
  };

  const result = calculateRetention();

  const getStatusColor = (status: MemoryRetentionResult['status']) => {
    switch (status) {
      case 'PERFECT_RECALL':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'PARTIAL_ATTENUATION':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'CRITICAL_ROT':
        return 'text-rose-700 bg-rose-50 border-rose-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-amber-600" />
              장기 기억력 유지도(Memory Retention) 측정기 (Needle in a Haystack)
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              긴 컨텍스트(32k~128k 토큰)가 누적될 때, 초기에 부여한 핵심 제약사항이 얼마나 유지되는지
              <strong> Lost in the Middle(중간 망각 현상)</strong>과 <strong>압축 요약 손실률</strong>을 정량 측정합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">검증 프리셋:</span>
            {NEEDLE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedNeedleIdx(idx)}
                className={`px-3 py-1.5 rounded-lg border font-medium text-xs transition cursor-pointer ${
                  selectedNeedleIdx === idx
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                테스트 {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Preset Details */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-stone-900">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {preset.title}
          </div>
          <p className="text-stone-700 font-mono bg-white p-2.5 rounded-lg border border-stone-200 text-[11px] leading-relaxed">
            <strong>[주입 지시사항 (Needle)]:</strong> {preset.needle}
          </p>
          <div className="text-stone-600 flex items-center gap-1.5 text-[11px]">
            <span className="font-semibold text-stone-800">에이전트 질의(Query):</span> {preset.query}
          </div>
        </div>
      </div>

      {/* Control Sliders & Experiment Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Parameters (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
          <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-100 pb-3">
            <Layers className="w-4 h-4 text-stone-500" />
            컨텍스트 및 메모리 아키텍처 변수
          </h4>

          {/* Context Depth Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-stone-800">컨텍스트 윈도우 깊이 (Haystack Depth)</span>
              <span className="font-mono font-bold text-amber-700">{(contextDepth / 1000).toFixed(0)}k 토큰</span>
            </div>
            <input
              type="range"
              min="8000"
              max="128000"
              step="8000"
              value={contextDepth}
              onChange={(e) => setContextDepth(Number(e.target.value))}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>8k (단기)</span>
              <span>32k (중기)</span>
              <span>64k (장기)</span>
              <span>128k (초장문)</span>
            </div>
          </div>

          {/* Needle Position Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-800 block">
              지시문 주입 위치 (Needle Placement)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setNeedlePlacement('beginning')}
                className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                  needlePlacement === 'beginning'
                    ? 'border-stone-900 bg-stone-900 text-white font-medium'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                1. 시작부 (Top 5%)
                <span className="block text-[10px] opacity-75 font-mono">Primacy Effect</span>
              </button>

              <button
                type="button"
                onClick={() => setNeedlePlacement('middle_50')}
                className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                  needlePlacement === 'middle_50'
                    ? 'border-rose-700 bg-rose-50 text-rose-900 font-medium ring-1 ring-rose-400'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                2. 중간부 (50% 지점)
                <span className="block text-[10px] text-rose-600 font-mono font-bold">Lost in the Middle 위험</span>
              </button>

              <button
                type="button"
                onClick={() => setNeedlePlacement('middle_25')}
                className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                  needlePlacement === 'middle_25'
                    ? 'border-stone-900 bg-stone-900 text-white font-medium'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                3. 전반부 (25% 지점)
                <span className="block text-[10px] opacity-75 font-mono">감쇠 주의</span>
              </button>

              <button
                type="button"
                onClick={() => setNeedlePlacement('end')}
                className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                  needlePlacement === 'end'
                    ? 'border-stone-900 bg-stone-900 text-white font-medium'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                4. 직전부 (Recency 95%)
                <span className="block text-[10px] opacity-75 font-mono">Recency Effect</span>
              </button>
            </div>
          </div>

          {/* Compaction Strategy */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-800 block">
              컨텍스트 압축 및 메모리 보존 기법
            </label>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <input
                  type="radio"
                  name="strategy"
                  checked={compactionStrategy === 'Raw Full Context'}
                  onChange={() => setCompactionStrategy('Raw Full Context')}
                  className="accent-stone-900"
                />
                <div>
                  <span className="font-semibold text-stone-900">1. 단순 원본 누적 (Raw Context)</span>
                  <p className="text-[11px] text-stone-500">토큰 비용 급증, 주의 집중도(Attention) 분산</p>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <input
                  type="radio"
                  name="strategy"
                  checked={compactionStrategy === 'Lossy Rolling Summary'}
                  onChange={() => setCompactionStrategy('Lossy Rolling Summary')}
                  className="accent-stone-900"
                />
                <div>
                  <span className="font-semibold text-stone-900">2. 롤링 요약 압축 (Rolling Summary)</span>
                  <p className="text-[11px] text-stone-500">토큰 절감되나 고유명사/수치 제약 탈락 위험</p>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <input
                  type="radio"
                  name="strategy"
                  checked={compactionStrategy === 'Hierarchical RAG Anchor'}
                  onChange={() => setCompactionStrategy('Hierarchical RAG Anchor')}
                  className="accent-stone-900"
                />
                <div>
                  <span className="font-semibold text-stone-900">3. 계층형 RAG 앵커 (Memory Invariant RAG)</span>
                  <p className="text-[11px] text-stone-500">불변 제약을 벡터 DB에 고정하여 질의 시 실시간 인출</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Simulation Heatmap & Score (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Score Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
                Memory Recall Diagnostics
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(result.status)}`}>
                {result.status === 'PERFECT_RECALL' && '완벽한 기억 인출'}
                {result.status === 'PARTIAL_ATTENUATION' && '부분 망각 및 제약 누락'}
                {result.status === 'CRITICAL_ROT' && '심각한 컨텍스트 부패 (Rot)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-2xl font-mono font-extrabold text-stone-900">{result.score}%</div>
                <div className="text-xs text-stone-500 mt-1">지시 준수율 (Recall Score)</div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-2xl font-mono font-extrabold text-rose-600">
                  {result.lostInTheMiddleDegree}%
                </div>
                <div className="text-xs text-stone-500 mt-1">중간 감쇠율 (Attenuation)</div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-2xl font-mono font-extrabold text-stone-900">
                  {Math.round(contextDepth * 0.0015)}ms
                </div>
                <div className="text-xs text-stone-500 mt-1">추론 어텐션 지연 (Latency)</div>
              </div>
            </div>

            {/* Context Stream Visual Heatmap */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-stone-600">
                <span className="font-semibold">컨텍스트 윈도우 어텐션 가중치 분포 시각화</span>
                <span className="text-[11px] font-mono text-stone-500">Needle: {needlePlacement}</span>
              </div>

              <div className="h-7 w-full bg-stone-100 rounded-lg overflow-hidden flex border border-stone-200 p-0.5 gap-0.5">
                {Array.from({ length: 20 }).map((_, i) => {
                  let isNeedle = false;
                  if (needlePlacement === 'beginning' && i <= 1) isNeedle = true;
                  if (needlePlacement === 'middle_25' && i >= 4 && i <= 5) isNeedle = true;
                  if (needlePlacement === 'middle_50' && i >= 9 && i <= 10) isNeedle = true;
                  if (needlePlacement === 'middle_75' && i >= 14 && i <= 15) isNeedle = true;
                  if (needlePlacement === 'end' && i >= 18) isNeedle = true;

                  const isCenterDip = i >= 7 && i <= 13;

                  return (
                    <div
                      key={i}
                      className={`h-full flex-1 rounded-sm transition-all ${
                        isNeedle
                          ? result.score >= 80
                            ? 'bg-emerald-500 animate-pulse'
                            : 'bg-rose-500'
                          : isCenterDip
                          ? 'bg-stone-300'
                          : 'bg-stone-400'
                      }`}
                      title={`Chunk ${i * 5}%`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>0% (프롬프트 시작부)</span>
                <span>50% (주의력 최저 구간)</span>
                <span>100% (최신 입력부)</span>
              </div>
            </div>
          </div>

          {/* Qualitative Recalled vs Forgotten Findings */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
            <h5 className="font-bold text-stone-900 text-xs tracking-wider uppercase font-mono">
              실행 시뮬레이션 진단 상세 (Simulation Audit)
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  정상 유지된 지시 요소
                </span>
                <ul className="space-y-1.5 text-stone-700 text-[11px]">
                  {result.recalledKeyDetails.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-emerald-600">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2">
                <span className="font-semibold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  소실/환각 발생 위험 요소
                </span>
                <ul className="space-y-1.5 text-stone-700 text-[11px]">
                  {result.forgottenConstraints.length > 0 ? (
                    result.forgottenConstraints.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-rose-600">✗</span> {item}
                      </li>
                    ))
                  ) : (
                    <li className="text-stone-500">모든 불변 제약조건이 충실히 보존되었습니다.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Production Architecture Recommendation */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900">엔지니어링 권고사항:</span>{' '}
                {compactionStrategy === 'Raw Full Context' && (
                  <span>
                    컨텍스트 윈도우가 커졌다고 해서 모든 히스토리를 쏟아붓지 마십시오. 중간에 위치한 비즈니스 룰은 망각될 확률이 30%를 초과하므로 최하단 시스템 앵커에 고정하거나 RAG로 분리하세요.
                  </span>
                )}
                {compactionStrategy === 'Lossy Rolling Summary' && (
                  <span>
                    단순 LLM 요약 압축은 수치(금액, 권한명, 날짜)를 생략하는 경향이 큽니다. 핵심 엔티티를 정규식/JSON으로 별도 추출하는 Dual-Memory(단기 버퍼 + 핵심 속성 저장소) 구조를 채택하세요.
                  </span>
                )}
                {compactionStrategy === 'Hierarchical RAG Anchor' && (
                  <span>
                    최적의 프로덕션 아키텍처입니다! 헌법적 불변 규칙(Constitution)을 에이전트 루프마다 시스템 메시지 끝단에 재주입(Re-injection)하여 100턴 이상의 세션에서도 일관성을 유지할 수 있습니다.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
