import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidViewerProps {
  chart: string;
  id?: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, id = 'mermaid-diagram' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: 'Plus Jakarta Sans, Pretendard, system-ui, sans-serif',
      themeVariables: {
        primaryColor: '#fbf9f5',
        primaryTextColor: '#1c1917',
        primaryBorderColor: '#78716c',
        lineColor: '#57534e',
        secondaryColor: '#f5f5f4',
        tertiaryColor: '#fafaf9'
      }
    });

    let isMounted = true;
    const renderChart = async () => {
      try {
        setError(null);
        const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const { svg } = await mermaid.render(uniqueId, chart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || '다이어그램 렌더링 중 오류가 발생했습니다.');
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
        <div className="font-semibold mb-1">다이어그램 렌더링 오류</div>
        <p className="font-mono text-[11px]">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto p-4 bg-white rounded-xl border border-stone-200 flex items-center justify-center min-h-[300px]"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
