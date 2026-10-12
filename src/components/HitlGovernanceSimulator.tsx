import React, { useState } from 'react';
import { HitlGovernanceThresholds, HitlScenario, HitlExecutionStatus, HitlAuditEntry } from '../types';
import { UserCheck, ShieldAlert, ShieldCheck, Pause, Play, RotateCcw, AlertTriangle, Sliders, Bell, Check, X, Edit3, ArrowRight, Layers, FileCode, CheckCircle2 } from 'lucide-react';

const PRESET_SCENARIOS: HitlScenario[] = [
  {
    id: 'scen-refund',
    title: '1. VIP 고객 분쟁 건 즉시 보상 송금 (Customer Compensation)',
    category: 'Finance',
    description: '고객 센터 클레임 접수 후 에이전트가 자동 보상 절차에 따라 금융 게이트웨이를 통해 해외 송금을 지시합니다.',
    proposedAction: {
      toolName: 'finance_gateway.execute_wire_transfer',
      dollarAmount: 1850,
      riskScore: 78,
      targetResource: 'Bank Account #KR-992-0192 (Beneficiary: Alpha Corp)',
      explanation: '고객 클레임 처리 규정에 따른 보상 지급 처리 요청',
      argumentsPayload: {
        amount_usd: 1850,
        currency: 'USD',
        recipient_id: 'CUST-88391',
        reason: 'Service SLA breach compensation',
        auth_level: 'standard_agent'
      }
    }
  },
  {
    id: 'scen-export',
    title: '2. 마케팅 캠페인용 고객 개인정보 대량 추출 (Bulk PII Export)',
    category: 'Customer PII',
    description: '마케팅 리드 생성 에이전트가 고객 DB에서 이메일 및 전화번호 15,000건을 CSV로 덤프하여 외부 웹훅으로 전송하려 합니다.',
    proposedAction: {
      toolName: 'customer_db.export_pii_contacts',
      dollarAmount: 0,
      riskScore: 89,
      targetResource: 'PostgreSQL: tbl_customers (Rows: 15,000)',
      explanation: '개인정보(PII) 대량 외부 반출 시도',
      argumentsPayload: {
        table: 'tbl_customers',
        fields: ['name', 'phone', 'email', 'social_sec_hash'],
        row_count: 15000,
        destination_webhook: 'https://external-marketing-hub.com/webhook'
      }
    }
  },
  {
    id: 'scen-infra',
    title: '3. 클라우드 인프라 캐시 클러스터 재생성 (Infra Purge)',
    category: 'Infrastructure',
    description: '성능 최적화 에이전트가 레이턴시 지연을 해결하기 위해 프로덕션 레디스 클러스터를 삭제 후 재프로비저닝을 시도합니다.',
    proposedAction: {
      toolName: 'cloud_infra.deprovision_redis_cluster',
      dollarAmount: 250,
      riskScore: 62,
      targetResource: 'AWS ElastiCache: prod-cache-cluster-01',
      explanation: '캐시 메모리 조각화 해소를 위한 인프라 리소스 재생성',
      argumentsPayload: {
        cluster_id: 'prod-cache-cluster-01',
        action: 'TERMINATE_AND_RECREATE',
        skip_final_snapshot: true
      }
    }
  },
  {
    id: 'scen-faq',
    title: '4. 일반 기술 문서 및 FAQ 벡터 검색 (Safe Knowledge Base)',
    category: 'Finance',
    description: '에이전트가 사내 표준 운영 가이드(SOP) 문서를 단순 인출하기 위해 벡터 검색 도구를 호출합니다.',
    proposedAction: {
      toolName: 'knowledge_base.vector_search',
      dollarAmount: 0,
      riskScore: 15,
      targetResource: 'Pinecone: enterprise-sop-index',
      explanation: '읽기 전용 문서 인출',
      argumentsPayload: {
        query: '고객 온보딩 체크리스트',
        top_k: 5
      }
    }
  }
];

export const HitlGovernanceSimulator: React.FC = () => {
  // Threshold States
  const [thresholds, setThresholds] = useState<HitlGovernanceThresholds>({
    dollarAmountLimit: 1000,
    riskScoreLimit: 65,
    restrictedActions: ['finance_gateway.execute_wire_transfer', 'customer_db.export_pii_contacts'],
    requireDualApproval: false,
    notificationChannel: 'Slack Interactive Webhook'
  });

  // Selected Scenario
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(PRESET_SCENARIOS[0].id);
  const currentScenario = PRESET_SCENARIOS.find((s) => s.id === selectedScenarioId) || PRESET_SCENARIOS[0];

  // Editable parameters for current scenario
  const [editableAmount, setEditableAmount] = useState<number>(currentScenario.proposedAction.dollarAmount);
  const [editableRisk, setEditableRisk] = useState<number>(currentScenario.proposedAction.riskScore);

  // Execution State Machine
  const [status, setStatus] = useState<HitlExecutionStatus>('IDLE');
  const [auditLog, setAuditLog] = useState<HitlAuditEntry[]>([]);
  const [overrideNote, setOverrideNote] = useState<string>('');
  const [isEditingPayload, setIsEditingPayload] = useState<boolean>(false);

  // Switch Scenario handler
  const handleSelectScenario = (id: string) => {
    const scen = PRESET_SCENARIOS.find((s) => s.id === id);
    if (scen) {
      setSelectedScenarioId(id);
      setEditableAmount(scen.proposedAction.dollarAmount);
      setEditableRisk(scen.proposedAction.riskScore);
      setStatus('IDLE');
      setAuditLog([]);
      setIsEditingPayload(false);
    }
  };

  const addLog = (type: HitlAuditEntry['type'], message: string, badge?: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    const newEntry: HitlAuditEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: timeStr,
      type,
      message,
      badge
    };
    setAuditLog((prev) => [...prev, newEntry]);
  };

  // Run Mock Execution
  const handleStartExecution = () => {
    setStatus('ANALYZING');
    setAuditLog([]);
    addLog('INFO', `에이전트 과업 수신: "${currentScenario.title}" 실행 시작`);

    setTimeout(() => {
      setStatus('EVALUATING_RULES');
      addLog('RULE_EVAL', `거버넌스 인터셉터 작동: 대상 도구 [${currentScenario.proposedAction.toolName}] 분석`);

      // Evaluate Thresholds
      const exceedsDollar = editableAmount >= thresholds.dollarAmountLimit;
      const exceedsRisk = editableRisk >= thresholds.riskScoreLimit;
      const isRestrictedAction = thresholds.restrictedActions.includes(currentScenario.proposedAction.toolName);

      setTimeout(() => {
        if (exceedsDollar || exceedsRisk || isRestrictedAction) {
          // HITL Triggered!
          setStatus('PAUSED_AWAITING_APPROVAL');
          const reasons: string[] = [];
          if (exceedsDollar) reasons.push(`금액 $${editableAmount.toLocaleString()}가 임계값 $${thresholds.dollarAmountLimit.toLocaleString()} 초과`);
          if (exceedsRisk) reasons.push(`위험 점수 ${editableRisk}점이 임계값 ${thresholds.riskScoreLimit}점 초과`);
          if (isRestrictedAction) reasons.push('고위험 제한 도구 블랙리스트 등록');

          addLog(
            'PAUSE_FREEZE',
            `[실행 일시정지] 거버넌스 승인 게이트 도달: ${reasons.join(', ')}. 상태 체크포인트 저장 및 관리자 승인 대기.`,
            'HITL_PAUSED'
          );
        } else {
          // Auto-Execute
          setStatus('AUTO_EXECUTED');
          addLog(
            'EXECUTE_SUCCESS',
            `[자동 승인 실행] 금액 $${editableAmount.toLocaleString()} 및 위험도 ${editableRisk}점이 임계값 이하입니다. 자동 승인 완료.`,
            'AUTO_APPROVED'
          );
        }
      }, 700);
    }, 600);
  };

  // User Actions during Pause
  const handleApprove = () => {
    setStatus('APPROVED_RESUMING');
    addLog('USER_INTERVENTION', `관리자 승인 완료 (Operator: admin_lead@corp.ai) - 실행 재개 요청됨`, 'APPROVED');

    setTimeout(() => {
      setStatus('AUTO_EXECUTED');
      addLog('EXECUTE_SUCCESS', `도구 [${currentScenario.proposedAction.toolName}] 성공적으로 실행 완료. 트랜잭션 확정.`, 'COMPLETED');
    }, 800);
  };

  const handleReject = () => {
    setStatus('REJECTED_ROLLEDBACK');
    addLog('USER_INTERVENTION', `관리자 거부 처리 (사유: ${overrideNote || '보안 정책 위험 판단'})`, 'REJECTED');

    setTimeout(() => {
      addLog('SAFE_ROLLBACK', `트랜잭션 안전 롤백 완료. 시스템 원복 상태 보존.`, 'ROLLBACK_SUCCESS');
    }, 500);
  };

  const handleModifyAndApprove = () => {
    setIsEditingPayload(false);
    setStatus('APPROVED_RESUMING');
    addLog(
      'USER_INTERVENTION',
      `관리자 수정 후 조건부 승인: 금액을 $${editableAmount.toLocaleString()}로 조정하여 재개`,
      'MODIFIED_APPROVED'
    );

    setTimeout(() => {
      setStatus('AUTO_EXECUTED');
      addLog('EXECUTE_SUCCESS', `수정된 파라미터로 도구 실행 완료. 안전 승인 이력 적재.`, 'COMPLETED');
    }, 800);
  };

  const handleReset = () => {
    setStatus('IDLE');
    setAuditLog([]);
    setOverrideNote('');
    setIsEditingPayload(false);
    setEditableAmount(currentScenario.proposedAction.dollarAmount);
    setEditableRisk(currentScenario.proposedAction.riskScore);
  };

  const toggleRestrictedAction = (toolName: string) => {
    if (thresholds.restrictedActions.includes(toolName)) {
      setThresholds({
        ...thresholds,
        restrictedActions: thresholds.restrictedActions.filter((t) => t !== toolName)
      });
    } else {
      setThresholds({
        ...thresholds,
        restrictedActions: [...thresholds.restrictedActions, toolName]
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-600" />
              HITL 거버넌스 승인 시뮬레이터 (Human-in-the-Loop Approval Gate)
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              에이전트가 단독으로 처리하기 위험한 고액 결제, 대량 개인정보 추출, 인프라 파괴 명령 시
              <strong> 사용자 정의 승인 임계값(Thresholds)</strong>에 따라 실행을 <strong>일시정지(State Freeze)</strong>하고 승인을 기다리는 거버넌스 루프를 시뮬레이션합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">시나리오 선택:</span>
            {PRESET_SCENARIOS.map((scen, idx) => (
              <button
                key={scen.id}
                onClick={() => handleSelectScenario(scen.id)}
                className={`px-3 py-1.5 rounded-lg border font-medium text-xs transition cursor-pointer ${
                  selectedScenarioId === scen.id
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                시나리오 {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Scenario Preview */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-mono text-[10px] font-bold">
                {currentScenario.category}
              </span>
              <span className="font-bold text-stone-900">{currentScenario.title}</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">{currentScenario.description}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
            <div className="px-3 py-1.5 bg-white rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-500 block">예상 거래 금액</span>
              <span className="font-bold text-stone-900">${editableAmount.toLocaleString()}</span>
            </div>
            <div className="px-3 py-1.5 bg-white rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-500 block">위험 점수 (Risk)</span>
              <span className={`font-bold ${editableRisk >= 70 ? 'text-rose-600' : 'text-amber-600'}`}>
                {editableRisk}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Threshold Settings (Left) vs Execution & Intervention (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Threshold Customizer (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-stone-500" />
              거버넌스 승인 임계값 설정 (Custom Thresholds)
            </h4>
            <span className="text-[10px] font-mono text-stone-400">SOC2 / EU AI Act</span>
          </div>

          {/* Dollar Amount Threshold Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-stone-800">1. 금융/송금 금액 승인 임계값</span>
              <span className="font-mono font-bold text-amber-700">${thresholds.dollarAmountLimit.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={thresholds.dollarAmountLimit}
              onChange={(e) => setThresholds({ ...thresholds, dollarAmountLimit: Number(e.target.value) })}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>$100 (엄격)</span>
              <span>$1,000 (표준)</span>
              <span>$5,000 (관대)</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              * 에이전트가 지시하는 금액이 이 값을 초과하면 실행이 즉시 일시정지됩니다.
            </p>
          </div>

          {/* Risk Score Threshold Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-stone-800">2. 위험도 점수 임계값 (Risk Score Gate)</span>
              <span className="font-mono font-bold text-rose-700">{thresholds.riskScoreLimit} / 100</span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              step="5"
              value={thresholds.riskScoreLimit}
              onChange={(e) => setThresholds({ ...thresholds, riskScoreLimit: Number(e.target.value) })}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>30점 (사소한 위험도 차단)</span>
              <span>65점 (기본 권고)</span>
              <span>90점 (극단적 위험만 차단)</span>
            </div>
          </div>

          {/* Restricted Action Blacklist */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-stone-800 block">
              3. 무조건 인간 승인 필수 도구 (Restricted Tool Blacklist)
            </span>
            <div className="space-y-2 text-xs">
              {[
                { name: 'finance_gateway.execute_wire_transfer', label: '해외/고액 송금 게이트웨이' },
                { name: 'customer_db.export_pii_contacts', label: '고객 개인정보(PII) 대량 추출' },
                { name: 'cloud_infra.deprovision_redis_cluster', label: '프로덕션 인프라 리소스 영구 삭제' }
              ].map((item) => (
                <label key={item.name} className="flex items-center gap-2.5 p-2 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={thresholds.restrictedActions.includes(item.name)}
                    onChange={() => toggleRestrictedAction(item.name)}
                    className="accent-stone-900"
                  />
                  <div>
                    <span className="font-semibold text-stone-900">{item.label}</span>
                    <span className="block font-mono text-[10px] text-stone-400">{item.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Channel Notification Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-stone-800 block">4. 알림 및 승인 채널</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setThresholds({ ...thresholds, notificationChannel: 'Slack Interactive Webhook' })}
                className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                  thresholds.notificationChannel === 'Slack Interactive Webhook'
                    ? 'border-stone-900 bg-stone-900 text-white font-medium'
                    : 'border-stone-200 bg-stone-50 text-stone-700'
                }`}
              >
                Slack 인터랙티브
                <span className="block text-[10px] opacity-75 font-mono">웹훅 승인 버튼</span>
              </button>
              <button
                type="button"
                onClick={() => setThresholds({ ...thresholds, notificationChannel: 'Admin Security Portal' })}
                className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                  thresholds.notificationChannel === 'Admin Security Portal'
                    ? 'border-stone-900 bg-stone-900 text-white font-medium'
                    : 'border-stone-200 bg-stone-50 text-stone-700'
                }`}
              >
                보안 관제 포털
                <span className="block text-[10px] opacity-75 font-mono">관리자 팝업 승인</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Runtime & Human Intervention Window (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Execution Control & Current Status Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
                Agent Execution Runtime
              </span>

              {/* Status Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                status === 'PAUSED_AWAITING_APPROVAL'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                  : status === 'AUTO_EXECUTED'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : status === 'REJECTED_ROLLEDBACK'
                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                  : 'bg-stone-100 text-stone-700 border border-stone-200'
              }`}>
                {status === 'IDLE' && '대기 중 (Ready)'}
                {status === 'ANALYZING' && '과업 분석 중...'}
                {status === 'EVALUATING_RULES' && '거버넌스 룰 평가 중...'}
                {status === 'PAUSED_AWAITING_APPROVAL' && '⏸️ 실행 정지: 관리자 승인 대기'}
                {status === 'APPROVED_RESUMING' && '승인 접수: 재개 진행 중...'}
                {status === 'AUTO_EXECUTED' && '✅ 실행 성공 완료'}
                {status === 'REJECTED_ROLLEDBACK' && '❌ 거부 및 롤백 완료'}
              </span>
            </div>

            {/* Target Tool Action Overview */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-stone-500 text-[11px]">
                <span>실행 대상 도구:</span>
                <span className="text-stone-900 font-bold">{currentScenario.proposedAction.toolName}</span>
              </div>
              <div className="flex justify-between items-center text-stone-500 text-[11px]">
                <span>대상 리소스:</span>
                <span className="text-stone-900">{currentScenario.proposedAction.targetResource}</span>
              </div>
              <div className="flex justify-between items-center text-stone-500 text-[11px]">
                <span>실행 요청 금액 / 위험도:</span>
                <span className="text-stone-900 font-bold">${editableAmount.toLocaleString()} / {editableRisk}점</span>
              </div>
            </div>

            {/* Control Trigger Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleStartExecution}
                disabled={status === 'ANALYZING' || status === 'EVALUATING_RULES' || status === 'APPROVED_RESUMING'}
                className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-stone-800 transition cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                모의 에이전트 실행 시작
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-xs font-medium hover:bg-stone-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> 초기화
              </button>
            </div>
          </div>

          {/* HITL HUMAN INTERVENTION PANEL (Appears when paused!) */}
          {status === 'PAUSED_AWAITING_APPROVAL' && (
            <div className="bg-amber-50/70 border-2 border-amber-400 p-6 rounded-2xl space-y-5 animate-fade-in shadow-sm">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <div className="flex items-center gap-2">
                  <Pause className="w-5 h-5 text-amber-700 animate-bounce" />
                  <h4 className="font-bold text-amber-950 text-sm">
                    [승인 게이트 작동] 에이전트 상태가 동결되었습니다
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
                  Checkpoint #CHK-8942
                </span>
              </div>

              <div className="text-xs text-amber-900 leading-relaxed space-y-1">
                <p>
                  에이전트가 실행하려는 작업이 관리자 승인 임계값을 초과했습니다. 작업 승인 또는 거부 결정을 내려주십시오.
                </p>
                <p className="font-semibold text-stone-800">
                  승인 통지 채널: {thresholds.notificationChannel}
                </p>
              </div>

              {/* Payload Parameters Inspector / Editor */}
              <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-800 font-mono text-[11px]">실행 페이로드 매개변수:</span>
                  <button
                    onClick={() => setIsEditingPayload(!isEditingPayload)}
                    className="text-stone-600 hover:text-stone-900 text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> {isEditingPayload ? '편집 닫기' : '파라미터 수정'}
                  </button>
                </div>

                {isEditingPayload ? (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-stone-700 text-[11px]">승인 허용 금액 조정 ($)</label>
                      <input
                        type="number"
                        value={editableAmount}
                        onChange={(e) => setEditableAmount(Number(e.target.value))}
                        className="w-full p-2 border border-stone-200 rounded-lg font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-stone-700 text-[11px]">위험도 재산정 (0-100)</label>
                      <input
                        type="number"
                        value={editableRisk}
                        onChange={(e) => setEditableRisk(Number(e.target.value))}
                        className="w-full p-2 border border-stone-200 rounded-lg font-mono text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <pre className="text-[11px] font-mono text-stone-800 bg-stone-50 p-2.5 rounded-lg overflow-x-auto">
                    {JSON.stringify(
                      {
                        ...currentScenario.proposedAction.argumentsPayload,
                        amount_usd: editableAmount,
                        evaluated_risk: editableRisk
                      },
                      null,
                      2
                    )}
                  </pre>
                )}
              </div>

              {/* Optional Rejection Reason / Note */}
              <input
                type="text"
                placeholder="승인 또는 반려 사유 입력 (선택사항)..."
                value={overrideNote}
                onChange={(e) => setOverrideNote(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
              />

              {/* Action Buttons: Approve / Reject / Modify */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  onClick={handleApprove}
                  className="flex-1 w-full py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-800 transition cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" /> 승인하고 즉시 실행 (Approve)
                </button>

                {isEditingPayload && (
                  <button
                    onClick={handleModifyAndApprove}
                    className="flex-1 w-full py-2.5 bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-amber-700 transition cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" /> 수정값으로 승인
                  </button>
                )}

                <button
                  onClick={handleReject}
                  className="flex-1 w-full py-2.5 bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-rose-800 transition cursor-pointer shadow-xs"
                >
                  <X className="w-4 h-4" /> 반려 및 안전 롤백 (Reject)
                </button>
              </div>
            </div>
          )}

          {/* Real-Time Audit Log Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
                거버넌스 실행 감사 로그 (Governance Audit Trail)
              </span>
              <span className="text-[10px] font-mono text-stone-400">SOC2 Type II Audit</span>
            </div>

            {auditLog.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-400">
                실행 버튼을 클릭하면 거버넌스 인터셉터의 단계별 감사 로그가 여기에 실시간 기록됩니다.
              </div>
            ) : (
              <div className="space-y-2 font-mono text-xs max-h-60 overflow-y-auto pr-1">
                {auditLog.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border flex items-start gap-2.5 text-[11px] leading-relaxed ${
                      log.type === 'PAUSE_FREEZE'
                        ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
                        : log.type === 'EXECUTE_SUCCESS'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : log.type === 'SAFE_ROLLBACK'
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : log.type === 'USER_INTERVENTION'
                        ? 'bg-blue-50 border-blue-200 text-blue-900'
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="text-stone-400 shrink-0">[{log.timestamp}]</span>
                    <span className="flex-1">{log.message}</span>
                    {log.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-stone-200 font-bold shrink-0">
                        {log.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
