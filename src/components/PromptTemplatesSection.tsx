import React, { useState } from 'react';
import { PROMPT_TEMPLATES_DATA } from '../data';
import { PromptTemplate } from '../types';
import { Terminal, Copy, Check, Shield, RefreshCw, Cpu, Layers, Sparkles, Filter, Code } from 'lucide-react';

export const PromptTemplatesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(PROMPT_TEMPLATES_DATA[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = PROMPT_TEMPLATES_DATA.filter((tmpl) => {
    return selectedCategory === 'all' || tmpl.category === selectedCategory;
  });

  const selectedTemplate =
    PROMPT_TEMPLATES_DATA.find((t) => t.id === selectedTemplateId) ||
    filteredTemplates[0] ||
    PROMPT_TEMPLATES_DATA[0];

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header and Category Filter */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-600" />
              실무 에이전트 프롬프트 템플릿 모음 (Agent Prompt Engineering Kit)
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              불변의 시스템 헌법, 엄격한 ReAct 도구 호출, 간접 인젝션 방역 격리, 에러 자가 교정 및 멀티에이전트
              핸드오프에 즉시 복사하여 사용할 수 있는 검증된 프로덕션 템플릿입니다.
            </p>
          </div>

          <span className="text-xs font-mono text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg shrink-0">
            {PROMPT_TEMPLATES_DATA.length} Production Ready Blueprints
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            전체 템플릿
          </button>
          <button
            onClick={() => setSelectedCategory('system')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'system' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            시스템 헌법 (Constitution)
          </button>
          <button
            onClick={() => setSelectedCategory('react')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'react' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            엄격한 ReAct 도구 호출
          </button>
          <button
            onClick={() => setSelectedCategory('guardrails')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'guardrails' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            보안 방역 가드레일
          </button>
          <button
            onClick={() => setSelectedCategory('self-correction')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'self-correction' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            에러 복구 & 자가 교정
          </button>
          <button
            onClick={() => setSelectedCategory('handoff')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'handoff' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            멀티에이전트 핸드오프
          </button>
        </div>
      </div>

      {/* Main Dual-Column Selector and Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Template Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplate.id === template.id;
            return (
              <button
                key={template.id}
                onClick={() => setSelectedTemplateId(template.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-stone-500">
                    {template.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    {template.targetFramework.split('(')[0]}
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm">{template.title}</h4>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Code Viewer & Engineering Notes (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6 sticky top-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                {selectedTemplate.categoryLabel} · Blueprint
              </span>
              <h4 className="text-xl font-bold text-stone-900 mt-0.5">{selectedTemplate.title}</h4>
              <div className="text-xs text-stone-600 mt-1">
                적합 프레임워크: <strong className="text-stone-800">{selectedTemplate.targetFramework}</strong>
              </div>
            </div>

            <button
              onClick={() => handleCopy(selectedTemplate.promptContent, selectedTemplate.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition cursor-pointer shrink-0"
            >
              {copiedId === selectedTemplate.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>프롬프트 복사하기</span>
                </>
              )}
            </button>
          </div>

          {/* Description & Engineering Note */}
          <div className="space-y-3 text-xs">
            <p className="text-stone-700 leading-relaxed">{selectedTemplate.description}</p>
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                엔지니어링 팁 & 베스트 프랙티스:
              </span>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                {selectedTemplate.engineeringNotes}
              </p>
            </div>
          </div>

          {/* Template Variables */}
          <div className="space-y-1.5 text-xs">
            <span className="font-semibold text-stone-800">치환 필수 변수 (Placeholders):</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedTemplate.variables.map((v, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[11px] px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Prompt Code Block View */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
              <span>PROMPT_TEXT</span>
              <span>UTF-8 Plain Text</span>
            </div>
            <div className="p-4 rounded-xl bg-stone-900 text-stone-200 font-mono text-xs overflow-x-auto max-h-[380px] custom-scrollbar leading-relaxed">
              <pre className="whitespace-pre-wrap">{selectedTemplate.promptContent}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
