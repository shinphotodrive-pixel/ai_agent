import React, { useState } from 'react';
import { GLOSSARY_TERMS_DATA } from '../data';
import { GlossaryTerm } from '../types';
import { Search, BookOpen, Sparkles, Tag, ArrowRight, Layers, Shield, Cpu, RefreshCw, BarChart2 } from 'lucide-react';

export const GlossarySection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTermId, setSelectedTermId] = useState<string>(GLOSSARY_TERMS_DATA[0].id);

  const filteredTerms = GLOSSARY_TERMS_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.termEn.toLowerCase().includes(q) ||
      item.termKo.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.deepDive.toLowerCase().includes(q) ||
      item.relatedTerms.some((t) => t.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const selectedTerm = GLOSSARY_TERMS_DATA.find((t) => t.id === selectedTermId) || filteredTerms[0] || GLOSSARY_TERMS_DATA[0];

  return (
    <div className="space-y-8">
      {/* Header and Filter Controls */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              에이전트 엔지니어링 용어 사전 (Agent Engineering Glossary)
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              자율 에이전트 개발, 상태 머신 오케스트레이션, 메모리 압축 관리, 다중 계층 보안 및 평가(Eval) 과정에서
              필수적으로 사용되는 핵심 엔지니어링 표준 개념을 체계적으로 학습하세요.
            </p>
          </div>

          {/* Search and Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="용어 검색 (예: MCP, ReAct, Handoff, HITL)..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-stone-600"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-stone-600 cursor-pointer"
            >
              <option value="all">전체 도메인</option>
              <option value="core">핵심 아키텍처</option>
              <option value="orchestration">오케스트레이션</option>
              <option value="memory">메모리 관리</option>
              <option value="security">보안 및 거버넌스</option>
              <option value="evaluation">평가 및 관제</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters (Zero-pill compliant clean segmented control) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            전체 ({GLOSSARY_TERMS_DATA.length})
          </button>
          <button
            onClick={() => setSelectedCategory('core')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'core' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            핵심 아키텍처 (Workflow/ReAct/MCP)
          </button>
          <button
            onClick={() => setSelectedCategory('orchestration')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'orchestration' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            오케스트레이션 (DAG/Handoff)
          </button>
          <button
            onClick={() => setSelectedCategory('memory')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'memory' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            메모리 관리 (Memory Rot)
          </button>
          <button
            onClick={() => setSelectedCategory('security')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'security' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            보안 & 거버넌스 (Injection/HITL)
          </button>
          <button
            onClick={() => setSelectedCategory('evaluation')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'evaluation' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            평가 & 피드백 (Reflection/Eval)
          </button>
        </div>
      </div>

      {/* Main Dual-Column Interactive Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List of Terms (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredTerms.map((term) => {
            const isSelected = selectedTerm.id === term.id;
            return (
              <button
                key={term.id}
                onClick={() => setSelectedTermId(term.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-stone-900 text-sm">{term.termEn}</span>
                  <span className="text-[11px] font-mono text-stone-500">
                    {term.categoryLabel}
                  </span>
                </div>
                <div className="text-xs font-semibold text-stone-700">{term.termKo}</div>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                  {term.summary}
                </p>
              </button>
            );
          })}

          {filteredTerms.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-500 bg-white rounded-xl border border-stone-200">
              일치하는 용어가 없습니다. 검색어를 변경해보세요.
            </div>
          )}
        </div>

        {/* Right Column: Deep-Dive Inspector (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6 sticky top-24">
          <div className="space-y-2 border-b border-stone-200 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
                {selectedTerm.categoryLabel} · Concept Specification
              </span>
              <span className="text-xs text-amber-800 bg-amber-100/60 font-mono px-2.5 py-0.5 rounded">
                Standard Definition
              </span>
            </div>
            <h4 className="text-2xl font-bold text-stone-900">{selectedTerm.termEn}</h4>
            <div className="text-sm font-semibold text-stone-700">{selectedTerm.termKo}</div>
          </div>

          {/* Quick Summary Box */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
            <span className="font-semibold text-stone-800">핵심 요약 (Executive Summary)</span>
            <p className="text-stone-700 leading-relaxed">{selectedTerm.summary}</p>
          </div>

          {/* Engineering Deep Dive */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-stone-900 text-sm">
              심층 엔지니어링 메커니즘 (Technical Mechanism)
            </span>
            <p className="text-stone-600 leading-relaxed">{selectedTerm.deepDive}</p>
          </div>

          {/* Real World Scenario */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-1.5 text-xs">
            <span className="font-semibold text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              실무 구현 시나리오 (Real-world Implementation)
            </span>
            <p className="text-stone-700 leading-relaxed font-mono text-[11px]">
              {selectedTerm.realWorldExample}
            </p>
          </div>

          {/* Related Terms Association */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">연관 엔지니어링 개념:</span>
            {selectedTerm.relatedTerms.map((rt, idx) => (
              <span
                key={idx}
                className="bg-stone-100 text-stone-700 font-mono text-[11px] px-2.5 py-1 rounded-md"
              >
                {rt}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
