import { Page } from 'react-pdf';
import { useState, useRef, useEffect } from 'react';
import 'react-pdf/dist/Page/TextLayer.css';

interface Props {
  pageNumber: number;
  highlights: any[];
  onRemoveHighlight: (id: string) => void;
  pageContainerRef: (el: HTMLDivElement | null) => void;
}

export function PdfPage({
  pageNumber,
  highlights,
  onRemoveHighlight,
  pageContainerRef,
}: Props) {
  // Default width fallback
  const [pageWidth, setPageWidth] = useState<number>(800);
  const innerRef = useRef<HTMLDivElement>(null);

  // Dynamically update width on mount and window resize
  useEffect(() => {
    const updateWidth = () => {
      if (innerRef.current) {
        // Use the container's current width, which is constrained by max-w-4xl
        setPageWidth(innerRef.current.clientWidth);
      }
    };

    // Initial measurement (small timeout ensures DOM is ready)
    setTimeout(updateWidth, 50);
    
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const pageHighlights = highlights.filter((h) => h.pageNumber === pageNumber);

  return (
    <div
      ref={(el) => {
        innerRef.current = el;
        // Pass the ref up to the parent for selection tracking
        pageContainerRef(el);
      }}
      // Added w-full and max-w-4xl to make it responsive but constrained on huge screens
      className="relative mx-auto shadow-md bg-white w-full max-w-4xl mb-4"
    >
      <Page
        pageNumber={pageNumber}
        width={pageWidth} // <-- This makes the PDF scale responsively
        renderTextLayer={true}
        renderAnnotationLayer={false}
        className="react-pdf__Page"
      />
      
      {/* Highlights Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        {pageHighlights.map((h) => (
          <div key={h.id} className="absolute pointer-events-auto">
            {h.rects.map((r: any, i: number) => (
              <div
                key={i}
                onClick={() => { 
                  if (confirm('Remove this highlight?')) onRemoveHighlight(h.id); 
                }}
                style={{
                  left: `${r.left * 100}%`,
                  top: `${r.top * 100}%`,
                  width: `${r.width * 100}%`,
                  height: `${r.height * 100}%`,
                }}
                className="absolute bg-yellow-300/50 rounded-sm cursor-pointer"
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