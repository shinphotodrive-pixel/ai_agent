import React, { useState } from 'react';
import { BENCHMARKS_DATA, YOUTUBE_RESOURCES_DATA } from '../data';
import { VideoResource } from '../types';
import { Search, ExternalLink, Play, Bookmark, Award, HelpCircle } from 'lucide-react';

export const BenchmarksAndVideosSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredVideos = YOUTUBE_RESOURCES_DATA.filter((video) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'saved'
        ? bookmarkedIds.includes(video.id)
        : video.category === selectedCategory);

    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.keyTakeaways.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* 1. GAIA & SWE-bench Benchmarks Analysis */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6">
        <div>
          <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            에이전트 성능 평가 벤치마크 (GAIA & SWE-bench)
          </h3>
          <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
            단순 암기력 평가인 MMLU와 달리, 실제 멀티모달 도구 조작 역량과 장기 계획 능력을 검증하는
            GAIA 벤치마크와 오픈소스 버그 해결율을 측정하는 SWE-bench 지표 분석입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENCHMARKS_DATA.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-xl border border-stone-200 bg-stone-50/40 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="font-bold text-stone-900 text-sm">{b.benchmark}</span>
                  <span className="text-[10px] text-stone-500 font-mono">{b.dimension}</span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">인간 수행 기준 (Human):</span>
                    <span className="font-mono font-bold text-stone-700">{b.humanBaseline}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-stone-500 h-full rounded-full"
                      style={{ width: `${b.humanBaseline}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-amber-800 font-medium">최상위 SOTA AI:</span>
                    <span className="font-mono font-bold text-amber-600">{b.aiSota}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full"
                      style={{ width: `${b.aiSota}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed pt-2">
                  {b.evaluationFocus}
                </p>
              </div>

              <div className="text-[11px] text-rose-900 bg-rose-50/70 p-2 rounded-lg border border-rose-200/60">
                <strong>핵심 난관:</strong> {b.coreChallenge}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. YouTube Video Resource Hub */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
              <Play className="w-5 h-5 text-rose-600" />
              실무 및 학습을 위한 유튜브 영상 리소스 가이드 (20선)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              보고서에 수록된 고품질 튜토리얼 영상을 유형별로 검색하고 학습 리스트를 관리하세요.
            </p>
          </div>

          {/* Search Input & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="도구, 주제 검색 (예: MCP, Dify, OpenAI)..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-stone-600"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-stone-600 cursor-pointer"
            >
              <option value="all">전체 난이도 / 분야</option>
              <option value="beginner">입문 및 기본 개념</option>
              <option value="nocode">노코드 (Make, n8n, Dify)</option>
              <option value="developer">Claude MCP & OpenAI SDK</option>
              <option value="enterprise">MS Agent & 엔터프라이즈</option>
              <option value="saved">북마크 보관함 ({bookmarkedIds.length})</option>
            </select>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => {
            const isBookmarked = bookmarkedIds.includes(video.id);
            return (
              <div
                key={video.id}
                className="p-5 rounded-xl border border-stone-200 bg-stone-50/20 hover:border-stone-400 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-stone-600">
                      {video.categoryLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-stone-400">
                        {video.durationApprox}
                      </span>
                      <button
                        onClick={() => toggleBookmark(video.id)}
                        className="text-stone-400 hover:text-amber-600 transition cursor-pointer"
                        title={isBookmarked ? '북마크 해제' : '북마크 추가'}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            isBookmarked ? 'fill-amber-500 text-amber-500' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm leading-snug">
                    {video.title}
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {video.summary}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {video.keyTakeaways.map((takeaway, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded font-mono"
                      >
                        #{takeaway}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>유튜브 영상 시청하기</span>
                    <ExternalLink className="w-3 h-3 text-stone-400 ml-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredVideos.length === 0 && (
          <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-xl border border-stone-200">
            검색어 또는 선택한 카테고리에 해당하는 영상이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
