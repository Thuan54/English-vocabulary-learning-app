import { useEffect, useRef, useMemo } from 'react';
import { Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import type { PdfHighlight, HighlightType } from '../../hooks/usePdfHighlights';

const HIGHLIGHT_COLORS: Record<HighlightType, string> = {
  'user': 'bg-yellow-300/50',
  'collocation': 'bg-emerald-300/50 border border-emerald-400/30',
  'signal-word': 'bg-purple-300/50 border border-purple-400/30',
};

interface Props {
  pageNumber: number;
  highlights: PdfHighlight[];
  onRemoveHighlight: (id: string) => void;
  pageContainerRef: (el: HTMLDivElement | null) => void;
}

export function PdfPage({ 
  pageNumber, 
  highlights, 
  onRemoveHighlight, 
  pageContainerRef, 
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Rect-based highlights for this page (user-created)
  const pageHighlights = highlights.filter(
    (h) => h.pageNumber === pageNumber && h.type === 'user' && h.rects.length > 0
  );

  // System pattern highlights (pageNumber === 0 means all pages)
  const systemPatterns = useMemo(() => 
    highlights.filter(h => (h.type === 'collocation' || h.type === 'signal-word') && h.rects.length === 0),
    [highlights]
  );

  // Apply text-based highlighting for system patterns
  useEffect(() => {
    if (systemPatterns.length === 0) return;
    const el = containerRef.current;
    if (!el) return;

    // Wait for text layer to render
    const timer = setTimeout(() => {
      const textLayer = el.querySelector('.react-pdf__Page__textContent');
      if (!textLayer) return;

      // Remove previous system marks
      textLayer.querySelectorAll('mark[data-system-highlight]').forEach(m => {
        const parent = m.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(m.textContent || ''), m);
          parent.normalize();
        }
      });

      // Apply new marks using TreeWalker for text nodes
      const walker = document.createTreeWalker(textLayer, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      let node: Text | null;
      while ((node = walker.nextNode() as Text | null)) {
        textNodes.push(node);
      }

      for (const pattern of systemPatterns) {
        const searchText = pattern.text.toLowerCase();
        const colorClass = pattern.type === 'collocation'
          ? 'background: rgba(52, 211, 153, 0.4); border-radius: 2px; padding: 0 1px;'
          : 'background: rgba(192, 132, 252, 0.4); border-radius: 2px; padding: 0 1px;';

        for (const textNode of textNodes) {
          const content = textNode.textContent || '';
          const idx = content.toLowerCase().indexOf(searchText);
          if (idx === -1) continue;

          const before = content.slice(0, idx);
          const match = content.slice(idx, idx + pattern.text.length);
          const after = content.slice(idx + pattern.text.length);

          const mark = document.createElement('mark');
          mark.setAttribute('data-system-highlight', pattern.type);
          mark.setAttribute('title', `${pattern.type}: ${pattern.category || ''}`);
          mark.style.cssText = colorClass;
          mark.textContent = match;

          const parent = textNode.parentNode;
          if (!parent) continue;

          if (before) parent.insertBefore(document.createTextNode(before), textNode);
          parent.insertBefore(mark, textNode);
          if (after) parent.insertBefore(document.createTextNode(after), textNode);
          parent.removeChild(textNode);
          break; // One match per text node to avoid issues
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [systemPatterns]);

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        pageContainerRef(el);
      }}
      className="relative mx-auto shadow-md bg-white"
    >
      <Page
        pageNumber={pageNumber}
        renderTextLayer={true}
        renderAnnotationLayer={false}
        className="react-pdf__Page"
      />
      
      {/* User Highlights Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        {pageHighlights.map((h) => (
          <div key={h.id} className="absolute pointer-events-auto">
            {h.rects.map((r: any, i: number) => (
              <div
                key={i}
                onClick={() => { if (confirm('Remove this highlight?')) onRemoveHighlight(h.id); }}
                style={{
                  left: `${r.left * 100}%`,
                  top: `${r.top * 100}%`,
                  width: `${r.width * 100}%`,
                  height: `${r.height * 100}%`,
                }}
                className={`absolute ${HIGHLIGHT_COLORS[h.type] || HIGHLIGHT_COLORS['user']} rounded-sm cursor-pointer`}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white pointer-events-none">
        {pageNumber}
      </div>
    </div>
  );
}