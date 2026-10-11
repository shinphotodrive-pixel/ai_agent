import React, { useState } from 'react';
import { Database, Search, ArrowRight, RefreshCw, Cpu, Server, Laptop, ShieldCheck } from 'lucide-react';

export const RagAndMcpSection: React.FC = () => {
  const [ragTab, setRagTab] = useState<'static' | 'agentic'>('agentic');
  const [mcpComponent, setMcpComponent] = useState<'host' | 'client' | 'server'>('server');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      {/* RAG vs Agentic RAG Box */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-600" />
              검색 증강 생성(RAG)의 세대별 진화
            </h3>
            {/* Segmented Tab */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs">
              <button
                onClick={() => setRagTab('static')}
                className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                  ragTab === 'static'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                정적 RAG (1세대)
              </button>
              <button
                onClick={() => setRagTab('agentic')}
                className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                  ragTab === 'agentic'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                에이전틱 RAG (2세대)
              </button>
            </div>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            단방향 텍스트 주입 방식에서 벗어나, 에이전트가 검색 쿼리를 스스로 분해하고 결과를 자가 평가하는 루프로 진화했습니다.
          </p>
        </div>

        {/* Content Panel */}
        {ragTab === 'static' ? (
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-4 text-xs">
            <div className="flex items-center justify-between text-stone-700 font-semibold border-b border-stone-200 pb-2">
              <span>정적 RAG (Static Retrieval)</span>
              <span className="font-mono text-stone-500">단방향 파이프라인</span>
            </div>

            <div className="flex items-center justify-between gap-2 py-2">
              <div className="flex-1 p-3 bg-white rounded-lg border border-stone-200 text-center">
                <div className="font-semibold text-stone-900 mb-0.5">1. 질문 수신</div>
                <div className="text-[11px] text-stone-500">단일 입력 프롬프트</div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
              <div className="flex-1 p-3 bg-white rounded-lg border border-stone-200 text-center">
                <div className="font-semibold text-stone-900 mb-0.5">2. 유사도 검색</div>
                <div className="text-[11px] text-stone-500">Top-k 고정 청크 추출</div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
              <div className="flex-1 p-3 bg-white rounded-lg border border-stone-200 text-center">
                <div className="font-semibold text-stone-900 mb-0.5">3. 답변 생성</div>
                <div className="text-[11px] text-stone-500">단 1회 LLM 호출</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/70 text-amber-900 border border-amber-200/70 text-[11px] leading-relaxed">
              <strong>치명적 한계:</strong> 첫 검색 결과에 유효한 정보가 없거나 질문이 모호할 경우, 모델이 환각을 일으키거나 "알 수 없습니다"로 즉시 종결됩니다.
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 space-y-4 text-xs">
            <div className="flex items-center justify-between text-stone-900 font-semibold border-b border-amber-200 pb-2">
              <span>에이전틱 RAG (Agentic Self-Correction)</span>
              <span className="font-mono text-amber-800">동적 반복 평가 루프</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-white rounded-lg border border-amber-200 flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <div className="font-semibold text-stone-900">다단계 질의 분해 (Query Decomposition)</div>
                  <div className="text-[11px] text-stone-600 mt-0.5">
                    "2025년 대비 2026년 마케팅비 증감률과 원인은?" ➔ [2025 예산 DB 조회]와 [2026 결산 보고서]로 쿼리를 다원 분할.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-amber-200 flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <div className="font-semibold text-stone-900">검색 충실도 자가 평가 (Relevance Evaluation)</div>
                  <div className="text-[11px] text-stone-600 mt-0.5">
                    반환된 문서 청크가 질문에 정확히 답변할 수 있는지 에이전트가 자체 비평(Critic) 수행.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-amber-200 flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <div className="font-semibold text-stone-900">동적 재검색 및 다중 도구 연동 (Iterative Fallback)</div>
                  <div className="text-[11px] text-stone-600 mt-0.5">
                    정보 부족 시 검색 키워드를 변형하여 외부 웹 검색이나 사내 SQL 쿼리로 우회 조회 후 합성.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] leading-relaxed">
              <strong>핵심 가치:</strong> 정답 도출률이 단순 RAG 대비 35% 이상 개선되며, 실패율이 극적으로 낮아집니다.
            </div>
          </div>
        )}

        <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-3">
          기술 스택 예시: LangGraph Routing Nodes, LlamaIndex Sub-Question Query Engine, Dify Workflow Routing.
        </div>
      </div>

      {/* MCP (Model Context Protocol) Architecture Box */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              MCP (Model Context Protocol) 개방형 표준
            </h3>
            <span className="text-xs text-stone-500 font-mono">Anthropic JSON-RPC 2.0</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            과거에는 모델마다 API 연동 코드를 별도 작성해야 했으나, MCP는 AI 앱과 데이터 소스를 ‘USB-C 포트’처럼 1:N으로 단일 표준 연결합니다.
          </p>
        </div>

        {/* 3 Interactive Cards */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <button
            onClick={() => setMcpComponent('host')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              mcpComponent === 'host'
                ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
            }`}
          >
            <Laptop className="w-4 h-4 text-indigo-700 mb-1" />
            <div className="font-bold text-stone-900 text-xs">1. Host</div>
            <div className="text-[10px] text-stone-500 mt-0.5">Claude Desktop, Cursor</div>
          </button>

          <button
            onClick={() => setMcpComponent('client')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              mcpComponent === 'client'
                ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-700 mb-1" />
            <div className="font-bold text-stone-900 text-xs">2. Client</div>
            <div className="text-[10px] text-stone-500 mt-0.5">프로토콜 브릿지</div>
          </button>

          <button
            onClick={() => setMcpComponent('server')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              mcpComponent === 'server'
                ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
            }`}
          >
            <Server className="w-4 h-4 text-indigo-700 mb-1" />
            <div className="font-bold text-stone-900 text-xs">3. Server</div>
            <div className="text-[10px] text-stone-500 mt-0.5">사내 DB, Slack, Git</div>
          </button>
        </div>

        {/* Detail Panel */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
          {mcpComponent === 'host' && (
            <>
              <div className="font-semibold text-stone-900">Host (호스트 애플리케이션)의 역할</div>
              <p className="text-stone-600 leading-relaxed">
                사용자가 에이전트와 대화하는 런타임 환경입니다. Claude Desktop, Zed, Cursor, Sourcegraph 등이 대표적이며,
                로컬 설정 파일(<code>claude_desktop_config.json</code>)을 통해 어떤 MCP 서버 프로세스를 자식으로 실행할지 지정합니다.
              </p>
              <div className="p-2.5 rounded bg-white border border-stone-200 font-mono text-[11px] text-stone-700">
                인증 관리 ➔ 도구 호출 권한 팝업 제시 ➔ 사용자 최종 승인(HITL) 수렴
              </div>
            </>
          )}

          {mcpComponent === 'client' && (
            <>
              <div className="font-semibold text-stone-900">Client (MCP 클라이언트)의 프로토콜 중계</div>
              <p className="text-stone-600 leading-relaxed">
                호스트 내부에서 실행되는 프로토콜 클라이언트입니다. LLM의 자연어 도구 요청을 JSON-RPC 2.0 표준 규격
                (stdio 또는 SSE 전송)으로 직렬화하여 서버에 전달하고, 반환된 출력을 다시 모델 컨텍스트로 역직렬화합니다.
              </p>
              <div className="p-2.5 rounded bg-white border border-stone-200 font-mono text-[11px] text-stone-700">
                표준 메시지: tools/list, tools/call, resources/read, prompts/get
              </div>
            </>
          )}

          {mcpComponent === 'server' && (
            <>
              <div className="font-semibold text-stone-900">Server (MCP 서버)의 3대 노출 프리미티브 (Primitives)</div>
              <p className="text-stone-600 leading-relaxed">
                외부 데이터 소스나 도구를 감싸는 경량 프로세스입니다. 모델에게 다음 3가지 핵심 역량을 안전하게 제공합니다.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div className="p-2 bg-white rounded border border-stone-200">
                  <div className="font-bold text-stone-900 text-[11px]">Resources</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">파일, DB 레코드 등 읽기 전용 데이터</div>
                </div>
                <div className="p-2 bg-white rounded border border-stone-200">
                  <div className="font-bold text-stone-900 text-[11px]">Prompts</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">미리 작성된 재사용 가능한 대화 템플릿</div>
                </div>
                <div className="p-2 bg-white rounded border border-stone-200">
                  <div className="font-bold text-stone-900 text-[11px]">Tools</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">API 호출, 쿼리 실행 등 실행 가능 함수</div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-3">
          보안 원칙: MCP 서버는 최소 권한(Least Privilege) 원칙으로 격리 구동되며, 모든 도구 호출은 호스트 클라이언트를 통해 사용자에게 명시적으로 고지됩니다.
        </div>
      </div>
    </div>
  );
};
