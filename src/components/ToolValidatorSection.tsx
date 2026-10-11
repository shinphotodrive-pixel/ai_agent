import React, { useState, useEffect } from 'react';
import { TOOL_PRESETS_DATA } from '../data/toolPresets';
import { validateToolInvocation } from '../utils/schemaValidator';
import { SchemaValidationReport } from '../types';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertOctagon, Terminal, Play, RotateCcw, Copy, Check, Sparkles, Code2, ArrowRight } from 'lucide-react';

export const ToolValidatorSection: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(TOOL_PRESETS_DATA[0].id);
  const currentPreset = TOOL_PRESETS_DATA.find((p) => p.id === selectedPresetId) || TOOL_PRESETS_DATA[0];

  const [schemaText, setSchemaText] = useState<string>(currentPreset.schemaJson);
  const [payloadText, setPayloadText] = useState<string>(currentPreset.sampleInvalidPayload);
  const [report, setReport] = useState<SchemaValidationReport>(() =>
    validateToolInvocation(currentPreset.schemaJson, currentPreset.sampleInvalidPayload)
  );
  const [copiedRepaired, setCopiedRepaired] = useState<boolean>(false);

  // Re-run validation on preset change or text change
  useEffect(() => {
    const res = validateToolInvocation(schemaText, payloadText);
    setReport(res);
  }, [schemaText, payloadText]);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const target = TOOL_PRESETS_DATA.find((p) => p.id === presetId) || TOOL_PRESETS_DATA[0];
    setSchemaText(target.schemaJson);
    setPayloadText(target.sampleInvalidPayload);
  };

  const handleLoadValidSample = () => {
    setPayloadText(currentPreset.sampleValidPayload);
  };

  const handleLoadInvalidSample = () => {
    setPayloadText(currentPreset.sampleInvalidPayload);
  };

  const handleApplyRepaired = () => {
    if (report.repairedPayload) {
      setPayloadText(report.repairedPayload);
    }
  };

  const handleCopyRepaired = () => {
    if (report.repairedPayload) {
      navigator.clipboard.writeText(report.repairedPayload);
      setCopiedRepaired(true);
      setTimeout(() => setCopiedRepaired(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              도구 호출 JSON 스키마 실시간 유효성 검증기 (Tool Schema Validator)
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              에이전트가 외부 API나 DB를 호출할 때 생성한 JSON 페이로드가 정의된 파라미터 스키마(타입, 최댓값/최솟값, 필수값, Enum)를
              엄격히 준수하는지 실시간 런타임 인터셉터 수준에서 검증하고 자동 복구(Auto-Repair)합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">실무 도구 프리셋:</span>
            {TOOL_PRESETS_DATA.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition cursor-pointer ${
                  selectedPresetId === p.id
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                {p.toolName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dual-Column Interactive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Schema and Invocation Payload Editors (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Tool Schema Editor */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-stone-600" />
                <span>1. 도구 정의 JSON 스키마 (Tool Definition Schema)</span>
              </label>
              <span className="text-[11px] font-mono text-stone-400">OpenAPI / JSON Schema</span>
            </div>

            <textarea
              value={schemaText}
              onChange={(e) => setSchemaText(e.target.value)}
              rows={9}
              className="w-full p-3.5 rounded-xl border border-stone-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed bg-stone-50/50"
            />
          </div>

          {/* Actual Tool Call Payload Editor */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-stone-600" />
                <span>2. 에이전트 생성 호출 페이로드 (Agent Tool Invocation)</span>
              </label>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={handleLoadValidSample}
                  className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition cursor-pointer font-medium"
                >
                  정상 예시
                </button>
                <button
                  onClick={handleLoadInvalidSample}
                  className="px-2.5 py-1 rounded bg-rose-50 text-rose-800 hover:bg-rose-100 transition cursor-pointer font-medium"
                >
                  오류 예시
                </button>
              </div>
            </div>

            <textarea
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              rows={8}
              className="w-full p-3.5 rounded-xl border border-stone-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed bg-stone-50/50"
            />
          </div>
        </div>

        {/* Right Column: Live Validation Report & Auto-Repair (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6 sticky top-24">
          {/* Status Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                Real-Time Guardrail Gate
              </span>
              <h4 className="text-xl font-bold text-stone-900 mt-0.5">
                런타임 인터셉터 검증 결과 보고서
              </h4>
            </div>

            <div
              className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-xs flex items-center gap-1.5 ${
                report.isValid
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}
            >
              {report.isValid ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>호출 승인 (VALID)</span>
                </>
              ) : (
                <>
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <span>실행 차단 ({report.issues.length}건 위반)</span>
                </>
              )}
            </div>
          </div>

          {/* Validation Issues List */}
          <div className="space-y-3">
            <span className="font-bold text-stone-900 text-xs">
              감지된 스키마 위반 사항 (Detected Violations)
            </span>

            {report.issues.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>모든 필수 매개변수, 허용 범위 및 열거형 제약조건을 완벽히 충족합니다. 즉시 외부 시스템으로 디스패치 가능합니다.</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                {report.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 text-xs space-y-1.5 text-rose-950"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-stone-900">
                        {issue.path}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        {issue.errorType}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-700 leading-relaxed">
                      {issue.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 pt-0.5 border-t border-rose-200/60">
                      <span>기대 스키마: {issue.expected}</span>
                      <span className="text-rose-700">실제 입력: {issue.received}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auto-Repaired Payload Preview */}
          {!report.isValid && report.repairedPayload && (
            <div className="space-y-3 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5 text-emerald-900">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  가드레일 자동 보정 제안 (Self-Healed Payload)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleApplyRepaired}
                    className="px-2.5 py-1 rounded bg-stone-900 text-white text-[11px] font-medium hover:bg-stone-800 transition cursor-pointer"
                  >
                    입력창에 즉시 적용
                  </button>
                  <button
                    onClick={handleCopyRepaired}
                    className="px-2.5 py-1 rounded border border-stone-300 text-stone-700 text-[11px] font-medium hover:bg-stone-50 transition cursor-pointer flex items-center gap-1"
                  >
                    {copiedRepaired ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedRepaired ? '복사됨' : '복사'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-stone-900 text-stone-200 rounded-xl font-mono text-xs overflow-x-auto max-h-[160px] custom-scrollbar">
                <pre className="whitespace-pre-wrap">{report.repairedPayload}</pre>
              </div>
            </div>
          )}

          {/* Operational Best Practice Banner */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1 text-stone-700">
            <span className="font-bold text-stone-900">엔지니어링 보안 원칙 (Pydantic / Zod Integration):</span>
            <p className="text-[11px] leading-relaxed text-stone-600">
              프로덕션 에이전트는 모델이 생성한 도구 매개변수를 절대로 신뢰하지 말고,
              실제 함수 호출 직전에 Pydantic(Python) 또는 Zod(TypeScript) 스키마 검증기를 거쳐
              유효하지 않은 호출을 사전 차단(Circuit Breaker)해야 합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
