import React, { useState } from 'react';
import { MermaidViewer } from './MermaidViewer';
import { GitBranch, Workflow, Cpu, Layers, ShieldCheck, ArrowRight, Code } from 'lucide-react';

interface DiagramPreset {
  id: string;
  title: string;
  subtitle: string;
  category: 'core' | 'mcp' | 'multi' | 'hitl';
  description: string;
  keyPoints: string[];
  code: string;
}

const DIAGRAM_PRESETS: DiagramPreset[] = [
  {
    id: 'react-loop',
    title: 'ReAct 자율 추론 & 도구 실행 루프 (ReAct Loop)',
    subtitle: 'Thought ➔ Action ➔ Observation 반복 피드백 구조',
    category: 'core',
    description: '사용자의 요청을 받아 생각을 정리하고, 도구를 선택하여 실행한 뒤 그 결과를 관찰하여 목표를 달성할 때까지 자가 교정하는 단일 에이전트의 핵심 생명주기입니다.',
    keyPoints: [
      'Thinking: 복합 목표를 실행 가능한 단위 작업으로 분해',
      'Tool Calling: JSON 스키마 기반 함수 호출 파라미터 생성',
      'Observation: 실제 API 또는 DB 반환값을 컨텍스트로 역주입',
      'Termination Check: 목표 충족 시 사용자에게 최종 응답 출력'
    ],
    code: `flowchart TD
    User([사용자 질의 입력]) --> Brain[LLM 인지 두뇌 Core]
    
    subgraph AutonomousLoop [ReAct 자율 추론 루프]
        Brain -->|1. Thought| Plan[추론 및 계획 수립]
        Plan -->|2. Action| ToolSelect{도구 호출 필요 여부}
        
        ToolSelect -->|Yes| ExecTool[외부 도구 실행 Tools/API/DB]
        ExecTool -->|3. Observation| Feedback[결과 관찰 및 메모리 적재]
        Feedback --> Brain
    end
    
    ToolSelect -->|No: 목표 달성| Response([최종 검증 답변 반환])

    style Brain fill:#fbf9f5,stroke:#d97706,stroke-width:2px
    style AutonomousLoop fill:#f5f5f4,stroke:#78716c,stroke-dasharray: 5 5
    style ExecTool fill:#ffffff,stroke:#4f46e5,stroke-width:1.5px
    style Response fill:#ecfdf5,stroke:#059669,stroke-width:2px`
  },
  {
    id: 'mcp-architecture',
    title: 'Model Context Protocol (MCP) 표준 프로토콜 흐름',
    subtitle: 'Host ➔ Client ➔ Server 간 JSON-RPC 2.0 상호작용',
    category: 'mcp',
    description: 'Anthropic이 제안한 개방형 표준으로, AI 어플리케이션(Host)이 일관된 프로토콜 클라이언트를 통해 로컬/원격 MCP 서버의 자원(Resources), 프롬프트(Prompts), 도구(Tools)를 호출하는 구조입니다.',
    keyPoints: [
      'Host Application: Claude Desktop 또는 Cursor 등 사용자와 대화하는 물리적 UI',
      'MCP Client: 자연어 의도를 JSON-RPC 2.0 표준 규격 메시지로 변환',
      'Transport Layer: Stdio (로컬 프로세스) 또는 SSE (원격 네트워크 HTTP)',
      'MCP Server: PostgreSQL, GitHub, Slack 등 격리된 도구 실행기'
    ],
    code: `flowchart LR
    subgraph HostEnv [Host 애플리케이션: Claude Desktop / Cursor]
        User[사용자] <--> LLM[LLM Engine]
        LLM <--> Client[MCP Client 브릿지]
    end

    subgraph Protocol [JSON-RPC 2.0 Transport: stdio / SSE]
        Client <-->|tools/call & resources/read| Router[표준 메시지 라우터]
    end

    subgraph MCPServers [독립 MCP 서버 생태계]
        Router <--> ServerDB[Database MCP Server\\nPostgreSQL/SQLite]
        Router <--> ServerGit[GitHub MCP Server\\nRepos/Issues/PR]
        Router <--> ServerSlack[Slack MCP Server\\nMessages/Channels]
    end

    style HostEnv fill:#fbf9f5,stroke:#1e293b,stroke-width:1.5px
    style MCPServers fill:#f5f5f4,stroke:#4f46e5,stroke-width:1.5px
    style Protocol fill:#ffffff,stroke:#d97706,stroke-dasharray: 4 4`
  },
  {
    id: 'multi-agent-orchestration',
    title: '계층적 멀티 에이전트 오케스트레이션 (Hierarchical Handoff)',
    subtitle: 'Triage 라우터와 특화 서브 에이전트 간 제어권 위임',
    category: 'multi',
    description: '단일 에이전트의 컨텍스트 비대화를 방지하기 위해 분류 에이전트(Triage)가 사용자 의도를 파악하고, 연구원·코더·검수자 에이전트로 제어권을 핸드오프(Handoff)하는 구조입니다.',
    keyPoints: [
      'Triage Orchestrator: 사용자 입력을 분석해 최적의 담당 서브 에이전트 배정',
      'Researcher Agent: 웹 검색 및 사내 벡터 RAG 지식 수집 전담',
      'Coder Agent: 코드 작성 및 샌드박스 테스팅 전담',
      'Critic & Reviewer: 산출물의 비즈니스 룰 및 보안 가드레일 최종 검증'
    ],
    code: `flowchart TD
    UserReq([복합 업무 요청]) --> Triage[오케스트레이터 / Triage Agent]
    
    Triage -->|의도 분기 및 Handoff| AgentPool
    
    subgraph AgentPool [특화 서브 에이전트 풀]
        direction TB
        AgentResearch[리서치 에이전트\\n웹/문서 검색]
        AgentCode[코딩 에이전트\\n코드 생성/실행]
        AgentReview[리뷰어 에이전트\\n팩트체크 & Critic]
    end
    
    AgentResearch -->|자료 전달| AgentCode
    AgentCode -->|초안 전달| AgentReview
    
    AgentReview -->|결함 발견 시 피드백| AgentCode
    AgentReview -->|검증 통과| Synthesizer[결과 통합기]
    Synthesizer --> FinalResult([최종 종합 보고서])

    style Triage fill:#fbf9f5,stroke:#d97706,stroke-width:2px
    style AgentPool fill:#fafaf9,stroke:#78716c,stroke-width:1.5px
    style AgentReview fill:#ffffff,stroke:#059669,stroke-width:2px
    style FinalResult fill:#ecfdf5,stroke:#059669,stroke-width:2px`
  },
  {
    id: 'hitl-gate',
    title: '런타임 거버넌스 승인 게이트 (HITL State Machine)',
    subtitle: 'State Graph 인터럽트 및 Slack/Webhook 승인 흐름',
    category: 'hitl',
    description: 'LangGraph의 interrupt() 또는 휴먼 게이트웨이를 활용하여, 위험 동작(결제, DB 변경, 대량 발송) 직전에 실행을 일시 정지하고 사람의 승인을 받아 재개하는 아키텍처입니다.',
    keyPoints: [
      'Risk Classification: 도구 매개변수가 특정 임계치(금액, 수신자 수)를 넘는지 검사',
      'State Snapshot: 현재 에이전트의 실행 상태와 변수를 DB에 동결(Freeze) 저장',
      'Approval Channel: 슬랙 또는 관리자 웹 대시보드로 승인 요청 발송',
      'Resume Execution: 승인 웹훅 수신 시 동결된 상태를 언프리즈하여 이어서 실행'
    ],
    code: `sequenceDiagram
    autonumber
    actor User as 사용자
    participant Agent as 에이전트 두뇌 (State Graph)
    participant Gate as 위험 감지 가드레일
    actor Admin as 인간 승인자 (Slack/대시보드)
    participant System as 프로덕션 DB / 외부 API

    User->>Agent: "고객 500명에게 환불 알림 발송 요청"
    Agent->>Gate: 도구 호출 검증 (send_email_bulk, N=500)
    
    critical 위험 임계치 초과 (High-Risk Action)
        Gate-->>Agent: interrupt() 실행 중지 신호 발생
        Agent->>Agent: 상태 스냅샷 저장 및 실행 일시 동결
        Agent->>Admin: Slack 웹훅: "[승인] 또는 [거부] 버튼 요청"
        
        Note over Admin: 인간 관리자가 대상자 명단 및 문구 검토
        
        alt 승인 (Approved)
            Admin->>Agent: 승인 웹훅 전송 (Resume Signal)
            Agent->>System: send_email_bulk() 실제 안전 실행
            System-->>Agent: 발송 완료 성공 반환
            Agent-->>User: "500명 발송이 관리자 승인 하에 완료되었습니다."
        else 거절 (Rejected)
            Admin->>Agent: 거부 사유 전달 ("문구 수정 필요")
            Agent->>Agent: 거부 피드백 메모리 반영
            Agent-->>User: "관리자에 의해 취소되었습니다: 문구 수정 필요"
        end
    end`
  }
];

export const ArchitectureDiagramSection: React.FC = () => {
  const [selectedDiagramId, setSelectedDiagramId] = useState<string>(DIAGRAM_PRESETS[0].id);
  const [showRawCode, setShowRawCode] = useState<boolean>(false);

  const activeDiagram = DIAGRAM_PRESETS.find((d) => d.id === selectedDiagramId) || DIAGRAM_PRESETS[0];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <Workflow className="w-5 h-5 text-amber-600" />
              Mermaid 기반 아키텍처 흐름도 (Interactive Flowcharts)
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              에이전트 인지 두뇌의 ReAct 루프, Anthropic MCP 프로토콜 표준, 계층적 멀티 에이전트 핸드오프,
              그리고 HITL 거버넌스 승인 게이트의 동작 원리를 다이어그램으로 시각화합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawCode(!showRawCode)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
                showRawCode
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showRawCode ? '다이어그램 보기' : 'Mermaid 코드 보기'}</span>
            </button>
          </div>
        </div>

        {/* Preset Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DIAGRAM_PRESETS.map((preset) => {
            const isSelected = preset.id === activeDiagram.id;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedDiagramId(preset.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100'
                }`}
              >
                <div className="font-bold text-stone-900 text-xs leading-snug mb-1">
                  {preset.title.split('(')[0]}
                </div>
                <div className="text-[11px] text-stone-500 line-clamp-1">{preset.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Diagram Details Banner */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-stone-900 text-sm">{activeDiagram.title}</h4>
            <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
              {activeDiagram.description}
            </p>
          </div>
          <span className="text-[11px] font-mono font-medium text-stone-600 bg-white px-2.5 py-1 rounded border border-stone-200 shrink-0">
            {activeDiagram.subtitle}
          </span>
        </div>

        {/* Diagram Canvas or Raw Code */}
        {showRawCode ? (
          <div className="p-4 rounded-xl bg-stone-900 text-stone-200 font-mono text-xs overflow-x-auto space-y-2">
            <div className="text-stone-400 text-[11px] border-b border-stone-800 pb-2">
              # Mermaid Raw Definition
            </div>
            <pre className="whitespace-pre">{activeDiagram.code}</pre>
          </div>
        ) : (
          <div className="space-y-4">
            <MermaidViewer chart={activeDiagram.code} id={activeDiagram.id} />

            {/* Engineering Key Points Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {activeDiagram.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1"
                >
                  <span className="font-bold text-stone-900 flex items-center gap-1.5 text-[11px]">
                    <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-mono text-[10px]">
                      {idx + 1}
                    </span>
                    {point.split(':')[0]}
                  </span>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {point.split(':')[1] || point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
