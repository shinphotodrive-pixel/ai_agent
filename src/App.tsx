import React, { useState } from 'react';
import { AgentComparisonSection } from './components/AgentComparisonSection';
import { RagAndMcpSection } from './components/RagAndMcpSection';
import { FrameworksAndRoadmapSection } from './components/FrameworksAndRoadmapSection';
import { RiskSecurityHitlSection } from './components/RiskSecurityHitlSection';
import { BenchmarksAndVideosSection } from './components/BenchmarksAndVideosSection';
import { GlossarySection } from './components/GlossarySection';
import { ArchitectureDiagramSection } from './components/ArchitectureDiagramSection';
import { PromptTemplatesSection } from './components/PromptTemplatesSection';
import { Bot, ArrowRight, Shield, Layers, BookOpen, Sparkles, CheckCircle2, Workflow, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'diagrams' | 'prompts' | 'frameworks' | 'security' | 'resources' | 'glossary'>('architecture');
  const [agentType, setAgentType] = useState<'single' | 'multi'>('single');

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 Nav Links) - Zone 3 (1 Action CTA) */}
      <header className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text wordmark */}
          <a href="#" className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 font-bold flex items-center justify-center text-sm shadow-xs">
              AI
            </span>
            <span>에이전트 실무 포털</span>
          </a>

          {/* Zone 2: Nav links, single-line */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'architecture' ? 'text-stone-900 font-semibold' : ''
              }`}
            >
              핵심 아키텍처
            </button>
            <button
              onClick={() => setActiveTab('diagrams')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'diagrams' ? 'text-stone-900 font-semibold' : ''
              }`}
            >
              흐름도
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'prompts' ? 'text-stone-900 font-semibold' : ''
              }`}
            >
              프롬프트 템플릿
            </button>
            <button
              onClick={() => setActiveTab('frameworks')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'frameworks' ? 'text-stone-900 font-semibold' : ''
              }`}
            >
              프레임워크
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'security' ? 'text-stone-900 font-semibold' : ''
              }`}
            >
              실패 & 보안
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'resources' ? 'text-stone-900 font-semibold' : ''
              }`}
            >
              영상 허브
            </button>
            <button
              onClick={() => setActiveTab('glossary')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'glossary' ? 'text-stone-900 font-semibold' : ''
              }`}
            >
              용어 사전
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('quick-start-anchor');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              실무 체크리스트
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 w-full">
        {/* Curatorial Hero Banner */}
        <section className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-sm">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-mono font-medium text-amber-400 uppercase tracking-widest">
              From Generative AI to Agentic AI Systems
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              대화형 챗봇에서 <span className="text-amber-400">자율 실행 에이전틱 AI</span>로의 전환
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              사용자의 단순 질문에 수동적으로 텍스트를 출력하던 LLM 시대를 지나, 목표를 분해하고 도구(Tools)를 자율 호출하며, 오류를 교정하고 외부 시스템을 직접 제어하는 AI 에이전트 시스템의 종합 엔지니어링 및 도입 가이드입니다.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs">
              <div className="text-stone-400">
                <strong className="text-white">멀티 에이전트 오버헤드:</strong> 일반 챗봇 대비 약 15배 토큰 소모
              </div>
              <span className="text-stone-600">·</span>
              <div className="text-stone-400">
                <strong className="text-rose-400">MIT NANDA 2025:</strong> 기업 파일럿 95% ROI 창출 실패
              </div>
              <span className="text-stone-600">·</span>
              <div className="text-stone-400">
                <strong className="text-emerald-400">3단계 방어:</strong> 인젝션 공격 성공률 8.7%로 통제
              </div>
            </div>
          </div>
        </section>

        {/* Global Navigation Tabs for High-Density Exploration */}
        <div className="flex border-b border-stone-200 gap-2 overflow-x-auto pb-1 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            01. 핵심 아키텍처 및 트레이드오프
          </button>
          <button
            onClick={() => setActiveTab('diagrams')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'diagrams'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            02. 아키텍처 흐름도 (Mermaid)
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'prompts'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            03. 실무 프롬프트 템플릿
          </button>
          <button
            onClick={() => setActiveTab('frameworks')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'frameworks'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            04. 프레임워크 선정 & 5단계 로드맵
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            05. 95% 실패 요인 & 보안 (HITL)
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'resources'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            06. 벤치마크 & 실무 영상 허브 (20선)
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'glossary'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            07. 에이전트 엔지니어링 용어 사전
          </button>
        </div>

        {/* Dynamic Section Rendering */}
        <div className="space-y-12">
          {activeTab === 'architecture' && (
            <div className="space-y-12">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-stone-900">
                  단일 에이전트 vs 멀티 에이전트 시스템 트레이드오프
                </h2>
                <p className="text-xs text-stone-600">
                  모든 문제에 멀티 에이전트를 적용하는 것은 과도한 토큰 낭비와 지연시간을 유발합니다. 과업 복잡성에 따른 분기 기준을 확인하세요.
                </p>
              </div>

              <AgentComparisonSection agentType={agentType} onSelectType={setAgentType} />

              <div className="pt-6">
                <RagAndMcpSection />
              </div>
            </div>
          )}

          {activeTab === 'diagrams' && (
            <div className="space-y-12">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-stone-900">
                  Mermaid 기반 에이전트 아키텍처 흐름도
                </h2>
                <p className="text-xs text-stone-600">
                  ReAct 루프, MCP 표준 프로토콜, 계층적 멀티 에이전트 오케스트레이션 및 HITL 거버넌스 승인 게이트의 전체 실행 흐름을 시각적으로 탐색하세요.
                </p>
              </div>

              <ArchitectureDiagramSection />
            </div>
          )}

          {activeTab === 'prompts' && (
            <div className="space-y-12">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-stone-900">
                  실무 에이전트 프롬프트 템플릿 모음 (Engineering Kit)
                </h2>
                <p className="text-xs text-stone-600">
                  불변 시스템 헌법, 엄격한 JSON ReAct 루프, 간접 인젝션 방역 격리, 에러 복구 자가 교정 및 핸드오프 이양 템플릿을 확인하고 바로 복사하세요.
                </p>
              </div>

              <PromptTemplatesSection />
            </div>
          )}

          {activeTab === 'frameworks' && (
            <div className="space-y-12">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-stone-900">
                  프레임워크 매트릭스 & 엔터프라이즈 도입 절차
                </h2>
                <p className="text-xs text-stone-600">
                  LangGraph, CrewAI, AutoGen, OpenAI Agents SDK 등 오픈소스 프레임워크 비교와 GPTs 노코드 제작, 엔터프라이즈 5단계 확산 전략입니다.
                </p>
              </div>

              <FrameworksAndRoadmapSection />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-12">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-stone-900">
                  실패 원인 분석, 간접 인젝션 방어 & HITL 거버넌스
                </h2>
                <p className="text-xs text-stone-600">
                  PocketOS의 DB 영구 삭제 참사에서 배운 4대 실패 모드, 3계층 프롬프트 인젝션 방어, 런타임 승인 게이트 설계입니다.
                </p>
              </div>

              <RiskSecurityHitlSection />
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-12">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-stone-900">
                  GAIA 벤치마크 평가 & 유튜브 실무 영상 리소스 (20선)
                </h2>
                <p className="text-xs text-stone-600">
                  도구 조작 지능을 측정하는 GAIA 및 SWE-bench 지표와 난이도별(입문, 노코드, Claude MCP, MS Agent) 엄선 튜토리얼을 제공합니다.
                </p>
              </div>

              <BenchmarksAndVideosSection />
            </div>
          )}

          {activeTab === 'glossary' && (
            <div className="space-y-12">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-stone-900">
                  에이전트 엔지니어링 표준 핵심 용어 사전
                </h2>
                <p className="text-xs text-stone-600">
                  ReAct, MCP, State DAG, Handoff, Reflection, Memory Rot, 간접 프롬프트 인젝션, HITL, AgentOps 등 실무 표준 용어를 상세히 해설합니다.
                </p>
              </div>

              <GlossarySection />
            </div>
          )}
        </div>

        {/* Operational Quick Start Checklist Section */}
        <section id="quick-start-anchor" className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                성공적인 에이전트 구축을 위한 사전 체크리스트 (Pre-Flight 6항목)
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                코드 작성 및 도구 배포 전 반드시 점검해야 할 엔지니어링 원칙입니다.
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg">
              Enterprise Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="font-semibold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-[11px]">1</span>
                골든 데이터셋 20건 구축
              </div>
              <p className="text-stone-600 leading-relaxed">
                출시 전 인간 전문가가 작성한 질문-모범답변 쌍 20건을 확정하여 정량적 평가(Eval) 지표를 수립했는가?
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="font-semibold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-[11px]">2</span>
                도구 권한 최소화 (Least Privilege)
              </div>
              <p className="text-stone-600 leading-relaxed">
                에이전트에게 불필요한 DB 쓰기/삭제 권한이나 임의 쉘(Shell) 실행 권한을 배제하고 읽기 전용으로 격리했는가?
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="font-semibold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-[11px]">3</span>
                외부 컨텍스트 격리
              </div>
              <p className="text-stone-600 leading-relaxed">
                검색된 비신뢰 문서가 최상위 시스템 헌법을 덮어쓰지 못하도록 엄격한 태그 격리 및 듀얼 LLM 방어를 적용했는가?
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="font-semibold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-[11px]">4</span>
                HITL 런타임 승인 게이트
              </div>
              <p className="text-stone-600 leading-relaxed">
                고위험 액션(대량 이메일 발송, 결제, 파괴적 트랜잭션) 수행 전 인간의 최종 검토를 거치는 브레이크가 걸려있는가?
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="font-semibold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-[11px]">5</span>
                작업 메모리 손실 압축 방지
              </div>
              <p className="text-stone-600 leading-relaxed">
                장기 실행 태스크에서 요약 시 핵심 규정과 제약 조건이 누락되지 않도록 영속 불변 컨텍스트에 앵커링했는가?
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="font-semibold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-[11px]">6</span>
                지속적 환류 (AgentOps)
              </div>
              <p className="text-stone-600 leading-relaxed">
                사용자의 거절/수정 피드백과 미답변 로그가 주기적으로 파인튜닝 또는 프롬프트 개선 데이터로 적재되는가?
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional Editorial Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800 mt-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">AI 에이전트 구축 실무 포털 (Agentic AI Engineering Portal)</div>
            <p className="text-stone-500">
              생성형 AI에서 자율 에이전트 AI로의 전환을 위한 엔지니어링 아키텍처 및 실무 가이드라인
            </p>
          </div>
          <div className="text-stone-500 font-mono text-[11px]">
            기반 연구: MIT NANDA (2025), Anthropic MCP (2024-2026), GAIA & SWE-bench Benchmarks.
          </div>
        </div>
      </footer>
    </div>
  );
}
