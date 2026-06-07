import { Page } from 'react-pdf';
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
  const pageHighlights = highlights.filter((h) => h.pageNumber === pageNumber);

  return (
    <div
      ref={pageContainerRef}
      className="relative mx-auto shadow-md bg-white"
    >
      <Page
        pageNumber={pageNumber}
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
                onClick={() => { if (confirm('Remove this highlight?')) onRemoveHighlight(h.id); }}
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