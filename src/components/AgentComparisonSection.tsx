import React from 'react';
import { Layers, Workflow, Bot, Cpu } from 'lucide-react';

interface AgentComparisonProps {
  agentType: 'single' | 'multi';
  onSelectType: (type: 'single' | 'multi') => void;
}

export const AgentComparisonSection: React.FC<AgentComparisonProps> = ({
  agentType,
  onSelectType,
}) => {
  return (
    <div className="space-y-6">
      {/* Selector Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onSelectType('single')}
          className={`flex-1 p-4 rounded-xl border text-left transition-all cursor-pointer ${
            agentType === 'single'
              ? 'border-amber-600 bg-amber-50/70 shadow-xs'
              : 'border-stone-200 bg-white hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-stone-900 text-sm flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-700" />
              단일 에이전트 (Single Agent)
            </span>
            <span className="text-xs text-stone-500 font-mono">1x ~ 2x Tokens</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            하나의 LLM 인스턴스가 플래닝부터 실행, 도구 호출, 응답 생성을 순차적으로 전담하는 구조.
          </p>
        </button>

        <button
          onClick={() => onSelectType('multi')}
          className={`flex-1 p-4 rounded-xl border text-left transition-all cursor-pointer ${
            agentType === 'multi'
              ? 'border-amber-600 bg-amber-50/70 shadow-xs'
              : 'border-stone-200 bg-white hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-stone-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-700" />
              멀티 에이전트 (Multi-Agent System)
            </span>
            <span className="text-xs text-stone-500 font-mono">~15x Tokens</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            기획자, 연구원, 코더, 검수자 등 특화된 서브 에이전트들이 메시지를 교환하며 분업하는 구조.
          </p>
        </button>
      </div>

      {/* Deep Dive Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5">
          <div className="text-xs font-medium text-stone-500">토큰 소모 오버헤드</div>
          <div className="text-lg font-bold text-stone-900 font-mono tabular-nums">
            {agentType === 'single' ? '1.0x ~ 2.5x' : '12.0x ~ 18.5x (평균 15배)'}
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {agentType === 'single'
              ? '사용자 요청과 도구 결과만 컨텍스트에 유지되므로 토큰 소비가 매우 경제적입니다.'
              : '에이전트 간 역할 정의 프롬프트, 중간 합의 메시지, 핸드오프 페이로드가 누적되어 폭증합니다.'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5">
          <div className="text-xs font-medium text-stone-500">종단 간 응답 지연시간 (Latency)</div>
          <div className="text-lg font-bold text-stone-900 font-mono tabular-nums">
            {agentType === 'single' ? '1.5초 ~ 4초' : '15초 ~ 60초+'}
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {agentType === 'single'
              ? '단일 체인으로 즉각적인 스트리밍 답변 출력이 가능하여 실시간 대화에 적합합니다.'
              : '비동기 큐잉과 다단계 에이전트 추론 회차(Turns)로 인해 백그라운드 배치 작업에 권장됩니다.'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5">
          <div className="text-xs font-medium text-stone-500">컨텍스트 과부하 및 환각 위험</div>
          <div className="text-lg font-bold text-stone-900">
            {agentType === 'single' ? '중간 ~ 높음 (장기 과업)' : '낮음 ~ 제어됨'}
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {agentType === 'single'
              ? '과업이 10단계를 넘어가면 지시사항과 중간 결과가 엉켜 "Lost in the Middle" 현상이 발생합니다.'
              : '각 서브 에이전트가 좁고 명확한 도메인 지침만 주입받으므로 단위 작업의 정확도가 높습니다.'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5">
          <div className="text-xs font-medium text-stone-500">디버깅 및 프로덕션 유지보수</div>
          <div className="text-lg font-bold text-stone-900">
            {agentType === 'single' ? '명확함 (직선형 트레이스)' : '복잡함 (비결정적 상호작용)'}
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {agentType === 'single'
              ? '어떤 도구에서 왜 실패했는지 로그 1개로 추적 가능하여 초기 PoC 개발에 유리합니다.'
              : '에이전트 간 무한 대화 루프, 책임 회피 핑퐁을 방지하기 위한 가드레일이 필수적입니다.'}
          </p>
        </div>
      </div>

      {/* Decision Guide Callout */}
      <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            실무 의사결정 권고안
          </div>
          <div className="text-sm font-semibold text-stone-900 mt-0.5">
            {agentType === 'single'
              ? '처음 시작하거나 단순 조회/정형 문서 요약이라면 단일 에이전트부터 시작하십시오.'
              : '시장 조사, 다단계 코드 작성, 교차 검증이 필수적인 복합 연구 과업에 멀티 에이전트를 도입하십시오.'}
          </div>
        </div>
        <div className="text-xs text-stone-600 font-mono bg-white px-3 py-1.5 rounded-lg border border-stone-200 whitespace-nowrap">
          권장 도입 순서: 단일 도구 호출 ➔ 선형 체인 ➔ 에이전틱 루프 ➔ 멀티 에이전트
        </div>
      </div>
    </div>
  );
};
