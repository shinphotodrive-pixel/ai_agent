import React, { useState } from 'react';
import { AgentNode, AgentEdge } from '../types';
import { Network, Plus, Trash2, ArrowRight, UserCheck, Cpu, Shield, Bot, Sparkles, Layers, Play } from 'lucide-react';

const INITIAL_NODES: AgentNode[] = [
  {
    id: 'node-orchestrator',
    name: 'Triage Orchestrator',
    role: 'Orchestrator',
    model: 'GPT-4o',
    description: '전체 고객 의도 분석 및 과업 분해, 특화 서브에이전트 위임 총괄',
    x: 320,
    y: 30
  },
  {
    id: 'node-worker-research',
    name: 'Research Worker',
    role: 'Worker',
    model: 'Claude 3.5 Haiku',
    description: '사내 규정집 벡터 DB 및 웹 검색 쿼리 실행 전담',
    x: 100,
    y: 180
  },
  {
    id: 'node-worker-coder',
    name: 'Coder Worker',
    role: 'Worker',
    model: 'Claude 3.5 Sonnet',
    description: '샌드박스 파이썬 스크립트 작성 및 데이터 변환 실행',
    x: 540,
    y: 180
  },
  {
    id: 'node-critic',
    name: 'Critic Reviewer',
    role: 'Critic',
    model: 'Claude 3.5 Sonnet',
    description: '산출물의 비즈니스 룰, 개인정보(PII), 포맷 일치 여부 자가 비평',
    x: 320,
    y: 310
  },
  {
    id: 'node-human-gate',
    name: 'HITL Human Gate',
    role: 'Human Gate',
    model: 'Slack Approval Webhook',
    description: '고위험 결제 및 대량 발송 직전 관리자 최종 클릭 승인 게이트',
    x: 320,
    y: 440
  }
];

const INITIAL_EDGES: AgentEdge[] = [
  {
    id: 'e1',
    source: 'node-orchestrator',
    target: 'node-worker-research',
    channelType: 'Delegation',
    label: '1. 조사 과업 위임'
  },
  {
    id: 'e2',
    source: 'node-orchestrator',
    target: 'node-worker-coder',
    channelType: 'Delegation',
    label: '2. 코드 실행 위임'
  },
  {
    id: 'e3',
    source: 'node-worker-research',
    target: 'node-critic',
    channelType: 'Data Stream',
    label: '3. 조사 문서 전달'
  },
  {
    id: 'e4',
    source: 'node-worker-coder',
    target: 'node-critic',
    channelType: 'Data Stream',
    label: '4. 코드 결과 전달'
  },
  {
    id: 'e5',
    source: 'node-critic',
    target: 'node-human-gate',
    channelType: 'Approval Webhook',
    label: '5. 검증 완료 후 최종 승인 요청'
  }
];

export const TopologyVisualizerSection: React.FC = () => {
  const [nodes, setNodes] = useState<AgentNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<AgentEdge[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(INITIAL_NODES[0].id);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isSimulatingPacket, setIsSimulatingPacket] = useState<boolean>(false);

  // Add new agent form states
  const [newAgentName, setNewAgentName] = useState<string>('Database Auditor');
  const [newAgentRole, setNewAgentRole] = useState<AgentNode['role']>('Worker');
  const [newAgentModel, setNewAgentModel] = useState<string>('GPT-4o-mini');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const handleAddNode = () => {
    setFeedbackMsg(null);
    const id = `node-${Date.now()}`;
    const newNode: AgentNode = {
      id,
      name: newAgentName,
      role: newAgentRole,
      model: newAgentModel,
      description: `${newAgentName} 특화 과업 수행 에이전트`,
      x: 180 + Math.random() * 260,
      y: 200 + Math.random() * 80
    };

    // Auto-connect to orchestrator
    const newEdge: AgentEdge = {
      id: `e-${Date.now()}`,
      source: 'node-orchestrator',
      target: id,
      channelType: 'Delegation',
      label: '태스크 위임'
    };

    setNodes([...nodes, newNode]);
    setEdges([...edges, newEdge]);
    setSelectedNodeId(id);
  };

  const handleDeleteNode = (idToDelete: string) => {
    if (idToDelete === 'node-orchestrator') {
      setFeedbackMsg('오케스트레이터 루트 노드는 시스템 핵심 노드이므로 삭제할 수 없습니다.');
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }
    setFeedbackMsg(null);
    setNodes(nodes.filter((n) => n.id !== idToDelete));
    setEdges(edges.filter((e) => e.source !== idToDelete && e.target !== idToDelete));
    setSelectedNodeId(nodes[0].id);
  };

  const handleSimulateFlow = () => {
    setIsSimulatingPacket(true);
    setTimeout(() => {
      setIsSimulatingPacket(false);
    }, 2500);
  };

  const getRoleBadgeColor = (role: AgentNode['role']) => {
    switch (role) {
      case 'Orchestrator':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Worker':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Critic':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Human Gate':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-stone-100 text-stone-900 border-stone-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <Network className="w-5 h-5 text-amber-600" />
              멀티 에이전트 위계 토폴로지 시각화기 (Multi-Agent Topology Visualizer)
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              중앙 오케스트레이터(Manager), 전문 작업자(Workers), 자가 비평가(Critic) 및 HITL 휴먼 승인 게이트 간의
              <strong>위계적 데이터 흐름선(Data Flow Lines)</strong>을 구성하고 실시간 패킷 전송을 시각화합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSimulateFlow}
              disabled={isSimulatingPacket}
              className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-800 transition cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {isSimulatingPacket ? '데이터 패킷 전송 중...' : '데이터 흐름선 시뮬레이션'}
            </button>
            <div className="text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg">
              {nodes.length}개 노드 · {edges.length}개 채널
            </div>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium flex items-center justify-between">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-amber-600 hover:text-amber-900 ml-2">닫기</button>
        </div>
      )}

      {/* Main Interactive Dual Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Topology Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
              위계적 에이전트 통신 캔버스 (Canvas)
            </span>
            <span className="text-[11px] text-stone-500">노드를 클릭하여 세부 사양 점검</span>
          </div>

          {/* SVG / HTML Topology Canvas */}
          <div className="relative w-full h-[520px] bg-stone-50/70 rounded-2xl border border-stone-200 overflow-hidden flex items-center justify-center">
            {/* SVG Connecting Flow Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#78716c" />
                </marker>
              </defs>

              {edges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source);
                const targetNode = nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const sx = sourceNode.x + 80;
                const sy = sourceNode.y + 35;
                const tx = targetNode.x + 80;
                const ty = targetNode.y + 35;

                return (
                  <g key={edge.id}>
                    <line
                      x1={sx}
                      y1={sy}
                      x2={tx}
                      y2={ty}
                      stroke={isSimulatingPacket ? '#f59e0b' : '#a8a29e'}
                      strokeWidth={isSimulatingPacket ? '2.5' : '1.5'}
                      strokeDasharray={isSimulatingPacket ? '4 2' : 'none'}
                      markerEnd="url(#arrow)"
                      className={isSimulatingPacket ? 'animate-pulse' : ''}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Agent Nodes */}
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{
                    position: 'absolute',
                    left: `${node.x}px`,
                    top: `${node.y}px`
                  }}
                  className={`w-44 p-3 rounded-xl border bg-white shadow-xs cursor-pointer transition-all hover:scale-105 select-none ${
                    isSelected
                      ? 'border-stone-900 ring-2 ring-stone-900 shadow-md z-20'
                      : 'border-stone-200 hover:border-stone-400 z-10'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${getRoleBadgeColor(node.role)}`}>
                      {node.role}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">{node.model.split(' ')[0]}</span>
                  </div>
                  <h5 className="font-bold text-xs text-stone-900 truncate mt-1">{node.name}</h5>
                  <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{node.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node Inspector & Add Worker (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Selected Node Inspector */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-bold font-mono text-stone-500 uppercase">Node Inspector</span>
              {selectedNode.id !== 'node-orchestrator' && (
                <button
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> 노드 삭제
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase">에이전트 이름</span>
                <h4 className="font-bold text-stone-900 text-base">{selectedNode.name}</h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">할당된 역할</span>
                  <span className="font-semibold text-stone-900">{selectedNode.role}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">LLM 엔진</span>
                  <span className="font-semibold text-stone-900">{selectedNode.model}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                <span className="font-semibold block text-stone-900 mb-1">책임 및 과업 스코프:</span>
                {selectedNode.description}
              </div>

              {/* Connected Edges */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold text-stone-800 block">연결된 통신 채널:</span>
                <div className="space-y-1 text-[11px] font-mono">
                  {edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id).map((e) => (
                    <div key={e.id} className="p-2 bg-stone-100 rounded-lg flex items-center justify-between">
                      <span>{e.source === selectedNode.id ? `→ ${nodes.find(n => n.id === e.target)?.name}` : `← ${nodes.find(n => n.id === e.source)?.name}`}</span>
                      <span className="text-stone-500 font-bold">{e.channelType}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Add New Agent Form */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
            <h5 className="font-bold text-stone-900 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-stone-700" />
              신규 서브에이전트 추가
            </h5>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-stone-700">에이전트 이름</label>
                <input
                  type="text"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-700">역할(Role)</label>
                <select
                  value={newAgentRole}
                  onChange={(e) => setNewAgentRole(e.target.value as AgentNode['role'])}
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white cursor-pointer"
                >
                  <option value="Worker">Worker (특화 작업자)</option>
                  <option value="Critic">Critic (평가 및 비평자)</option>
                  <option value="Tool Gateway">Tool Gateway (외부 API 프록시)</option>
                  <option value="Human Gate">Human Gate (휴먼 승인)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-700">모델 엔진</label>
                <input
                  type="text"
                  value={newAgentModel}
                  onChange={(e) => setNewAgentModel(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white font-mono"
                />
              </div>

              <button
                onClick={handleAddNode}
                className="w-full py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> 토폴로지에 추가하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
