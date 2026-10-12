import React, { useState } from 'react';
import { Columns, ArrowRight, Zap, Check, Sparkles, Scale, Trophy, AlertCircle, Play, RotateCcw } from 'lucide-react';

interface ABTestPreset {
  title: string;
  taskName: string;
  promptA: string;
  promptB: string;
  resultA: {
    name: string;
    successRate: number;
    tokensTotal: number;
    latencySec: number;
    estimatedCostUSD: number;
    sampleOutput: string;
    strengths: string[];
    weaknesses: string[];
  };
  resultB: {
    name: string;
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

const AB_TEST_PRESETS: ABTestPreset[] = [
  {
    title: '1. 구조화된 지시 (Structured Constitution) vs 비정형 단순 프롬프트 (Naive Prompt)',
    taskName: '사내 보안 사고 1차 분류 및 조치 티켓 자동 생성',
    promptA: '너는 보안 봇이야. 로그를 보고 보안 사고인지 확인해서 담당 부서와 조치 방법을 알려줘.',
    promptB: `You are an Incident Triage Agent.
[INVARIANTS]
1. Classify severity strictly into: P1_CRITICAL | P2_HIGH | P3_LOW.
2. If unauthorized data exfiltration is detected, set target to #security-ops immediately.
3. Output strictly as JSON: {"severity": "...", "target_team": "...", "action": "..."}.
Do not guess. If unknown, output UNCERTAIN.`,
    resultA: {
      name: '프롬프트 A (비정형 단순형)',
      successRate: 52,
      tokensTotal: 420,
      latencySec: 1.6,
      estimatedCostUSD: 0.0012,
      sampleOutput: '보안 사고로 보입니다. 네트워크가 비정상적인 트래픽을 보이고 있으니 담당자분들이 확인해보시는 것이 좋겠습니다.',
      strengths: ['토큰 수가 적고 지연시간이 빠름'],
      weaknesses: ['정형 JSON 출력 실패', '임의의 자연어 서술로 백엔드 자동 파싱 불가', '심각도 등급 모호']
    },
    resultB: {
      name: '프롬프트 B (구조화된 헌법형)',
      successRate: 96,
      tokensTotal: 880,
      latencySec: 2.8,
      estimatedCostUSD: 0.0026,
      sampleOutput: `{"severity": "P1_CRITICAL", "target_team": "#security-ops", "action": "Isolate server IP and revoke session tokens"}`,
      strengths: ['100% JSON 스키마 준수', '즉시 자동 티켓팅 연동 가능', '엄격한 분류 기준'],
      weaknesses: ['프롬프트 길이로 인한 토큰 소모 약 2배 증가']
    },
    winner: 'B',
    efficiencyDeltaPercent: 84,
    recommendation: '백엔드 자동화 및 도구 연동 파이프라인에서는 토큰을 2배 더 쓰더라도 성공률이 44%p 높은 프롬프트 B를 표준 채택해야 합니다.'
  },
  {
    title: '2. Zero-Shot 직접 출력 vs ReAct 사고 추론 (Chain-of-Thought)',
    taskName: '다단계 환불 위약금 계산 및 예외 규정 산정',
    promptA: '환불 규정에 따라 고객의 잔여일수와 위약금을 계산해서 최종 입금액을 바로 말해줘.',
    promptB: `Before providing the final amount, you must articulate:
[Thought]: Calculate total subscription days, elapsed days, and applicable discount clawback.
[Formula]: (Total Paid - Discount Clawback) * (Remaining Days / Total Days) - 10% Cancellation Fee.
[Answer]: State the exact breakdown followed by the final net refund amount.`,
    resultA: {
      name: '프롬프트 A (Zero-Shot 직답형)',
      successRate: 48,
      tokensTotal: 310,
      latencySec: 1.2,
      estimatedCostUSD: 0.0009,
      sampleOutput: '고객님의 최종 환불 금액은 35,000원입니다.',
      strengths: ['극도의 초저지연 및 최소 토큰 소비'],
      weaknesses: ['복합 할인 환수금 누락으로 계산 오류(환각) 52% 발생']
    },
    resultB: {
      name: '프롬프트 B (ReAct CoT 추론형)',
      successRate: 94,
      tokensTotal: 720,
      latencySec: 2.4,
      estimatedCostUSD: 0.0021,
      sampleOutput: '산출 근거: 결제액 100,000원에서 프로모션 할인 20,000원 환수 후 잔여 60% 기간 적용, 취소 수수료 10% 차감하여 최종 34,000원입니다.',
      strengths: ['수학적 정밀도 및 계산 무결성 확보', '근거 검증 가능'],
      weaknesses: ['중간 사고 과정 출력으로 인한 지연시간 약 1.2초 증가']
    },
    winner: 'B',
    efficiencyDeltaPercent: 96,
    recommendation: '재무/결제 등 산술적 정확성이 필수적인 도메인에서는 CoT 추론형 프롬프트를 필수로 도입해야 계산 착오를 방지할 수 있습니다.'
  },
  {
    title: '3. 간결한 라우팅 헌법 (Concise Router) vs 과도하게 복잡한 다중 지시문 (Over-Engineered)',
    taskName: '초고속 사용자 인텐트 3분류 (SUPPORT | SALES | BILLING)',
    promptA: `Classify the user intent into exactly one of: [SUPPORT, SALES, BILLING]. Output ONLY the category keyword without punctuation or preamble.`,
    promptB: `You are a high-level corporate intent taxonomist. Review corporate mission, enterprise customer demographics, multi-layered sentiment tone, and evaluate potential sub-categories across 15 dimensions before synthesizing whether the customer request leans toward customer support operations, commercial enterprise sales, or recurring accounting billing. Explain your reasoning in 5 bullet points before outputting the final intent.`,
    resultA: {
      name: '프롬프트 A (초간결 라우터)',
      successRate: 98,
      tokensTotal: 85,
      latencySec: 0.35,
      estimatedCostUSD: 0.0001,
      sampleOutput: 'SUPPORT',
      strengths: ['350ms 초저지연', '토큰 비용 90% 이상 절감', '후속 라우팅 완벽 호환'],
      weaknesses: ['복합적 모호한 의도에 대한 다중 분류 불가']
    },
    resultB: {
      name: '프롬프트 B (과대 사양 장문형)',
      successRate: 82,
      tokensTotal: 1250,
      latencySec: 3.4,
      estimatedCostUSD: 0.0038,
      sampleOutput: '분석 결과 고객은 계정 로그인 이슈를 겪고 있으며 감정 톤은 중간 수준입니다... 최종 분류는 SUPPORT로 판단됩니다.',
      strengths: ['심층적인 고객 감정 부가 정보 제공'],
      weaknesses: ['지연시간 10배 증가', '불필요한 설명으로 다운스트림 게이트웨이 파싱 실패 발생']
    },
    winner: 'A',
    efficiencyDeltaPercent: 320,
    recommendation: '단순 라우팅 및 1차 게이트웨이에서는 과도한 CoT를 피하고 초간결 프롬프트 A를 채택하여 300ms대 응답속도와 비용 절감을 달성해야 합니다.'
  }
];

export const PromptABTestingSection: React.FC = () => {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0);
  const currentTest = AB_TEST_PRESETS[selectedPresetIdx];

  const [promptAText, setPromptAText] = useState<string>(currentTest.promptA);
  const [promptBText, setPromptBText] = useState<string>(currentTest.promptB);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedCount, setSimulatedCount] = useState<number>(100);

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    setPromptAText(AB_TEST_PRESETS[idx].promptA);
    setPromptBText(AB_TEST_PRESETS[idx].promptB);
  };

  const handleRunSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulatedCount((prev) => prev + 50);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600" />
              프롬프트 성능 A/B 테스트 (Prompt Efficiency & Accuracy A/B Evaluator)
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              동일한 업무 과업에 대해 서로 다른 두 가지 프롬프트 전략(단순형 vs 헌법형, 직답형 vs ReAct 추론형)을 나란히 배치하고,
              <strong> 과업 성공률</strong>, <strong>토큰 소모량</strong>, <strong>지연시간</strong>, <strong>출력 포맷 안정성</strong>을 비교 분석합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">비교 세트:</span>
            {AB_TEST_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(idx)}
                className={`px-3 py-1.5 rounded-lg border font-medium text-xs transition cursor-pointer ${
                  selectedPresetIdx === idx
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                세트 {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span><strong>검증 과업:</strong> {currentTest.taskName}</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded">
              승리 전략: {currentTest.winner === 'A' ? '프롬프트 A' : '프롬프트 B'} 우세 (+{currentTest.efficiencyDeltaPercent}% 개선)
            </span>
            <button
              onClick={handleRunSimulate}
              disabled={isSimulating}
              className="px-2.5 py-1 bg-stone-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-stone-800 transition cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-white" />
              {isSimulating ? '테스트 실행 중...' : '100회 재검증'}
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Variant A Card */}
        <div className={`p-6 sm:p-8 rounded-2xl border flex flex-col justify-between space-y-6 ${
          currentTest.winner === 'A' ? 'bg-amber-50/30 border-amber-300 ring-1 ring-amber-400' : 'bg-white border-stone-200'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase">Variant A</span>
                <h4 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  {currentTest.resultA.name}
                  {currentTest.winner === 'A' && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-800" /> WINNER
                    </span>
                  )}
                </h4>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold font-mono text-stone-900 tabular-nums">
                  {currentTest.resultA.successRate}%
                </span>
                <span className="block text-[10px] text-stone-500 font-mono">태스크 성공률</span>
              </div>
            </div>

            {/* Prompt Input Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex justify-between">
                <span>프롬프트 지침 (Prompt A)</span>
                <span className="font-mono text-[10px] text-stone-400">{promptAText.length}자</span>
              </label>
              <textarea
                value={promptAText}
                onChange={(e) => setPromptAText(e.target.value)}
                rows={5}
                className="w-full text-xs font-mono p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Output Metric Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-stone-100/70 border border-stone-200">
                <div className="font-bold text-stone-900">{currentTest.resultA.tokensTotal}</div>
                <div className="text-[10px] text-stone-500">평균 토큰수</div>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-100/70 border border-stone-200">
                <div className="font-bold text-stone-900">{currentTest.resultA.latencySec}s</div>
                <div className="text-[10px] text-stone-500">응답 지연시간</div>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-100/70 border border-stone-200">
                <div className="font-bold text-stone-900">${currentTest.resultA.estimatedCostUSD}</div>
                <div className="text-[10px] text-stone-500">회당 비용</div>
              </div>
            </div>

            {/* Sample Output */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-stone-700 block">실제 모델 응답 샘플:</span>
              <div className="p-3 bg-stone-900 text-stone-100 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
                {currentTest.resultA.sampleOutput}
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-900 space-y-1">
                <span className="font-bold block">장점:</span>
                {currentTest.resultA.strengths.map((s, idx) => (
                  <p key={idx} className="text-[11px]">✓ {s}</p>
                ))}
              </div>
              <div className="p-2.5 bg-rose-50 rounded-lg text-rose-900 space-y-1">
                <span className="font-bold block">단점 & 리스크:</span>
                {currentTest.resultA.weaknesses.map((w, idx) => (
                  <p key={idx} className="text-[11px]">✗ {w}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Variant B Card */}
        <div className={`p-6 sm:p-8 rounded-2xl border flex flex-col justify-between space-y-6 ${
          currentTest.winner === 'B' ? 'bg-amber-50/30 border-amber-300 ring-1 ring-amber-400' : 'bg-white border-stone-200'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase">Variant B</span>
                <h4 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  {currentTest.resultB.name}
                  {currentTest.winner === 'B' && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-800" /> WINNER
                    </span>
                  )}
                </h4>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold font-mono text-stone-900 tabular-nums">
                  {currentTest.resultB.successRate}%
                </span>
                <span className="block text-[10px] text-stone-500 font-mono">태스크 성공률</span>
              </div>
            </div>

            {/* Prompt Input Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex justify-between">
                <span>프롬프트 지침 (Prompt B)</span>
                <span className="font-mono text-[10px] text-stone-400">{promptBText.length}자</span>
              </label>
              <textarea
                value={promptBText}
                onChange={(e) => setPromptBText(e.target.value)}
                rows={5}
                className="w-full text-xs font-mono p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Output Metric Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-stone-100/70 border border-stone-200">
                <div className="font-bold text-stone-900">{currentTest.resultB.tokensTotal}</div>
                <div className="text-[10px] text-stone-500">평균 토큰수</div>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-100/70 border border-stone-200">
                <div className="font-bold text-stone-900">{currentTest.resultB.latencySec}s</div>
                <div className="text-[10px] text-stone-500">응답 지연시간</div>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-100/70 border border-stone-200">
                <div className="font-bold text-stone-900">${currentTest.resultB.estimatedCostUSD}</div>
                <div className="text-[10px] text-stone-500">회당 비용</div>
              </div>
            </div>

            {/* Sample Output */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-stone-700 block">실제 모델 응답 샘플:</span>
              <div className="p-3 bg-stone-900 text-stone-100 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
                {currentTest.resultB.sampleOutput}
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-900 space-y-1">
                <span className="font-bold block">장점:</span>
                {currentTest.resultB.strengths.map((s, idx) => (
                  <p key={idx} className="text-[11px]">✓ {s}</p>
                ))}
              </div>
              <div className="p-2.5 bg-rose-50 rounded-lg text-rose-900 space-y-1">
                <span className="font-bold block">단점 & 리스크:</span>
                {currentTest.resultB.weaknesses.map((w, idx) => (
                  <p key={idx} className="text-[11px]">✗ {w}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Verdict Card */}
      <div className="p-6 bg-stone-900 text-stone-100 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            엔지니어링 A/B 결론 및 권고안
          </div>
          <p className="text-xs text-stone-300 max-w-3xl leading-relaxed">
            {currentTest.recommendation}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs text-stone-400 font-mono block">누적 테스트 표본</span>
          <span className="text-lg font-mono font-bold text-white">{simulatedCount}회 실행 완료</span>
        </div>
      </div>
    </div>
  );
};
