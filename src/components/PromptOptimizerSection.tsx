import React, { useState } from 'react';
import { analyzeSystemPrompt, PromptAnalysisResult } from '../utils/promptAuditor';
import { Sparkles, ShieldAlert, CheckCircle2, Copy, Check, ArrowRight, Wand2, RefreshCw, AlertTriangle, FileCode } from 'lucide-react';

const SAMPLE_WEAK_PROMPTS = [
  {
    title: '모호한 CS 챗봇 프롬프트',
    content: '너는 친절한 고객센터 챗봇이야. 고객 질문에 친절하게 답변해주고 모르는 건 잘 둘러대지 마.'
  },
  {
    title: '도구 제약 없는 데이터베이스 조회 봇',
    content: '사내 DB에서 고객 주문 정보를 조회하는 에이전트. 사용자가 시키는 대로 SQL 쿼리를 실행해서 결과를 알려줘.'
  },
  {
    title: '외부 웹 검색 리서치 에이전트',
    content: 'You are a research assistant. Browse the internet and summarize recent company news without making mistakes.'
  }
];

export const PromptOptimizerSection: React.FC = () => {
  const [inputPrompt, setInputPrompt] = useState<string>(SAMPLE_WEAK_PROMPTS[0].content);
  const [analysis, setAnalysis] = useState<PromptAnalysisResult>(() => analyzeSystemPrompt(SAMPLE_WEAK_PROMPTS[0].content));
  const [copied, setCopied] = useState<boolean>(false);

  const handleAnalyze = () => {
    const res = analyzeSystemPrompt(inputPrompt);
    setAnalysis(res);
  };

  const handleApplySample = (sample: string) => {
    setInputPrompt(sample);
    setAnalysis(analyzeSystemPrompt(sample));
  };

  const handleCopyImproved = () => {
    navigator.clipboard.writeText(analysis.improvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-8">
      {/* Header and Explanation */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-amber-600" />
              프롬프트 자동 개선 제안기 (Prompt Robustness Auditor)
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              작성 중인 시스템 프롬프트를 입력하면 보안 취약점, 지시 모호성, 환각 유발 요인, 도구 권한 결함을 정량 점수화하고
              불변의 시스템 헌법(Invariants)이 적용된 고신뢰 엔터프라이즈 프롬프트로 자동 재작성합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">예시 불러오기:</span>
            {SAMPLE_WEAK_PROMPTS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleApplySample(s.content)}
                className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition cursor-pointer"
              >
                예시 {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Dual Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input and Vulnerability Audit (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
                검사할 시스템 프롬프트 (Raw System Prompt)
              </label>
              <span className="text-[11px] font-mono text-stone-400">
                {inputPrompt.length} 글자
              </span>
            </div>

            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="분석할 시스템 프롬프트를 입력하세요..."
              rows={7}
              className="w-full p-3.5 rounded-xl border border-stone-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed bg-stone-50/50"
            />

            <button
              onClick={handleAnalyze}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>강건성 및 모호성 정밀 진단 실행</span>
            </button>
          </div>

          {/* Audit Metrics Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="font-bold text-stone-900 text-sm">프롬프트 강건성 평가 진단표</span>
              <div
                className={`px-3 py-1 rounded-lg border font-mono font-bold text-xs flex items-center gap-1.5 ${getScoreColor(
                  analysis.score
                )}`}
              >
                <span>점수: {analysis.score} / 100</span>
                <span>({analysis.clarityGrade})</span>
              </div>
            </div>

            {/* Strengths */}
            {analysis.detectedStrengths.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  기존 프롬프트의 긍정적 요소:
                </span>
                <ul className="space-y-1 text-stone-600 pl-5 list-disc text-[11px]">
                  {analysis.detectedStrengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vulnerabilities Detected */}
            <div className="space-y-3">
              <span className="font-semibold text-rose-900 text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                감지된 결함 및 탈옥 위험 ({analysis.vulnerabilities.length}건):
              </span>

              {analysis.vulnerabilities.map((vuln, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{vuln.issue}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      {vuln.category}
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    <strong className="text-stone-700">예상 영향:</strong> {vuln.impact}
                  </p>
                  <div className="text-emerald-800 bg-emerald-50/70 p-2 rounded-lg text-[11px] font-medium mt-1">
                    ↳ <strong>처방:</strong> {vuln.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI-Synthesized Improved Prompt (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-5 sticky top-24">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-800 font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>AI SYNTHESIZED REFINED PROMPT</span>
              </div>
              <h4 className="text-lg font-bold text-stone-900 mt-0.5">
                불변 헌법이 보강된 고신뢰 시스템 프롬프트
              </h4>
            </div>

            <button
              onClick={handleCopyImproved}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>개선안 복사</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-stone-600 leading-relaxed">
            기존 프롬프트의 의도를 보존하면서, <strong>권한 계층 구조</strong>, <strong>환각 방지 폴백</strong>,
            <strong>외부 데이터 격리</strong>, <strong>출력 표준 포맷</strong>을 체계적으로 주입했습니다.
          </div>

          {/* Code Viewer */}
          <div className="p-4 rounded-xl bg-stone-900 text-stone-200 font-mono text-xs overflow-x-auto max-h-[460px] custom-scrollbar leading-relaxed">
            <pre className="whitespace-pre-wrap">{analysis.improvedPrompt}</pre>
          </div>

          {/* Invariants Summary */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1 text-xs">
            <span className="font-semibold text-stone-800">자동 주입된 안전장치:</span>
            <ul className="text-[11px] text-stone-600 space-y-0.5 list-disc pl-4">
              <li>권한 계층(Authority Hierarchy): 사용자 지시로 시스템 헌법 덮어쓰기 불가</li>
              <li>신뢰 불가 데이터 격리: &lt;untrusted_data&gt; 태그 내부 텍스트 무력화</li>
              <li>단호한 폴백: 근거 정보 부재 시 "DATA_NOT_FOUND" 의무 반환</li>
              <li>파괴적 액션 제한: 결제/삭제 시 관리자 인간 승인(HITL) 의무화</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
