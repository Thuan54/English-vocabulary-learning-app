import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { Upload, RefreshCcw, Search, BookmarkPlus, Check, MessageSquareQuote } from 'lucide-react';
import { useVocabulary, type Word } from '../contexts/VocabularyContext';

type PdfPageData = {
  page: any;
  viewport: any;
  textContent: any;
  pageNumber: number;
  width: number;
  height: number;
};

interface PdfViewerProps {
  onExplainRequest: (text: string, pageNumber?: number) => Promise<void>;
  onContextSet?: (text: string, pageNumber?: number) => void;
}

export default function PdfViewer({ onExplainRequest, onContextSet }: PdfViewerProps) {
  const { words, addWord } = useVocabulary();
  const [pages, setPages] = useState<PdfPageData[]>([]);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [selectionPosition, setSelectionPosition] = useState<{ top: number; left: number } | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [highlights, setHighlights] = useState<Array<any>>([]);

  const pdfContainerRef = useRef<HTMLDivElement | null>(null);
  const pageContainerRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const innerDivRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const canvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfjsLibRef = useRef<any>(null);
  const pdfjsViewerRef = useRef<any>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pages.length) return;

    let cancelled = false;

    (async () => {
      for (const pageData of pages) {
        if (cancelled) return;

        const canvas = canvasRefs.current[pageData.pageNumber];
        if (canvas) {
          const context = canvas.getContext('2d');
          if (context) {
            const outputScale = window.devicePixelRatio || 1;
            canvas.width = Math.floor(pageData.width * outputScale);
            canvas.height = Math.floor(pageData.height * outputScale);
            canvas.style.width = `${pageData.width}px`;
            canvas.style.height = `${pageData.height}px`;
            context.setTransform(outputScale, 0, 0, outputScale, 0, 0);
            pageData.page.render({ canvasContext: context, viewport: pageData.viewport });
          }
        }

        const innerDiv = innerDivRefs.current[pageData.pageNumber];
        const viewer = pdfjsViewerRef.current;

        if (innerDiv && viewer) {
          innerDiv.querySelectorAll('.textLayer').forEach((el) => el.remove());

          try {
            const textLayerBuilder = new viewer.TextLayerBuilder({
              pdfPage: pageData.page,
              onAppend: (div: HTMLDivElement) => {
                div.style.zIndex = '2';
                innerDiv.appendChild(div);
              },
            });

            await textLayerBuilder.render(pageData.viewport);
          } catch (e) {
            console.warn('TextLayerBuilder render failed', e);
          }
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pages]);

  const clearPdf = () => {
    setPages([]);
    setSelectedText('');
    setSelectionPosition(null);
    setPdfError(null);
    setFileName('');
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setPdfError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setPdfError('Please upload a valid PDF file.');
      return;
    }

    clearPdf();
    setFileName(file.name);
    setPdfLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const viewer = await import('pdfjs-dist/legacy/web/pdf_viewer.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString();
      pdfjsLibRef.current = pdfjs;
      pdfjsViewerRef.current = viewer;

      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const loadedPages: PdfPageData[] = [];
      const scale = 1.35;
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const textContent = await page.getTextContent();
        loadedPages.push({ page, viewport, textContent, pageNumber, width: viewport.width, height: viewport.height });
      }
      setPages(loadedPages);
    } catch (err) {
      setPdfError('Unable to load this PDF. Try a different file.');
      console.error('PDF load error', err);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleSelection = () => {
    setTimeout(() => {
      const selection = window.getSelection?.();

      if (!selection || selection.isCollapsed) {
        setSelectedText('');
        setSelectionPosition(null);
        return;
      }

      const anchor = selection.anchorNode;
      if (!anchor || !pdfContainerRef.current?.contains(anchor)) return;

      const range = selection.getRangeAt(0);
      const rects = Array.from(range.getClientRects());
      if (rects.length === 0) return;

      const firstRect = rects[0];
      const centerY = firstRect.top + firstRect.height / 2;

      let detectedPage: number | null = null;
      for (const [num, el] of Object.entries(pageContainerRefs.current)) {
        const pageEl = el as HTMLDivElement | null;
        if (!pageEl) continue;
        const box = pageEl.getBoundingClientRect();
        if (centerY >= box.top && centerY <= box.bottom) {
          detectedPage = Number(num);
          break;
        }
      }

      let extractedText = '';

      if (detectedPage) {
        const pageData = pages.find(p => p.pageNumber === detectedPage);
        const pageContainer = pageContainerRefs.current[detectedPage];
        if (pageData && pageContainer && pageData.textContent?.items?.length) {
          const pageRect = pageContainer.getBoundingClientRect();

          // Normalize selection rects to 0–1 page coordinates
          const selNorm = rects.map(r => ({
            left: (r.left - pageRect.left) / pageRect.width,
            top: (r.top - pageRect.top) / pageRect.height,
            right: (r.right - pageRect.left) / pageRect.width,
            bottom: (r.bottom - pageRect.top) / pageRect.height,
          }));

          // Get PDF page dimensions at scale 1 (PDF user space)
          const baseVp = pageData.page.getViewport({ scale: 1 });
          const pdfW = baseVp.width;
          const pdfH = baseVp.height;

          const matched: Array<{ str: string; y: number; x: number }> = [];

          for (const item of pageData.textContent.items) {
            const txt = item.str;
            if (!txt) continue;

            const iw = (item.width || 0) / pdfW;
            const ih = (item.height || 0) / pdfH;
            if (iw === 0 && ih === 0) continue;

            // Center of item in normalized page coordinates (top-left origin)
            const cx = (item.transform[4] + item.width / 2) / pdfW;
            const cy = 1 - (item.transform[5] + (item.height || 0) / 2) / pdfH;

            if (selNorm.some(sr =>
              cx >= sr.left && cx <= sr.right &&
              cy >= sr.top && cy <= sr.bottom
            )) {
              matched.push({ str: txt, y: cy, x: cx });
            }
          }

          if (matched.length > 0) {
            matched.sort((a, b) => {
              const yd = a.y - b.y;
              if (Math.abs(yd) > 0.015) return yd;
              return a.x - b.x;
            });

            const lines: string[] = [];
            let cur: string[] = [];
            let prevY = matched[0].y;

            for (const m of matched) {
              if (Math.abs(m.y - prevY) > 0.015) {
                if (cur.length) lines.push(cur.join(' '));
                cur = [];
                prevY = m.y;
              }
              cur.push(m.str);
            }
            if (cur.length) lines.push(cur.join(' '));

            extractedText = lines.join('\n'); 
          }
        }
      }

      if (!extractedText) {
        extractedText = range.toString() || '';
      }

      extractedText = extractedText.replace(/\s+/g, ' ').trim();

      if (!extractedText) {
        setSelectedText('');
        setSelectionPosition(null);
        return;
      }

      setSelectedText(extractedText);
      setSelectedPage(detectedPage);

      const container = pdfContainerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();

      setSelectionPosition({
        top: firstRect.top - containerRect.top + container.scrollTop - 8,
        left: firstRect.left - containerRect.left + container.scrollLeft + (firstRect.width / 2)
      });
    }, 10);
  };

  const HIGHLIGHT_KEY = 'pdf-highlights-v1';
  useEffect(() => {
    if (!fileName) {
      setHighlights([]);
      return;
    }
    try {
      const raw = localStorage.getItem(`${HIGHLIGHT_KEY}:${fileName}`);
      if (raw) setHighlights(JSON.parse(raw));
      else setHighlights([]);
    } catch (e) {
      setHighlights([]);
    }
  }, [fileName]);

  const persistHighlights = (next: any[]) => {
    setHighlights(next);
    try {
      if (fileName) localStorage.setItem(`${HIGHLIGHT_KEY}:${fileName}`, JSON.stringify(next));
    } catch (e) {}
  };

  const addHighlightFromSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const rects = Array.from(range.getClientRects());
    if (!rects.length) return;
    
    const first = rects[0];
    const centerX = first.left + first.width / 2;
    const centerY = first.top + first.height / 2;
    
    let pageNumber: number | null = null;
    for (const [num, el] of Object.entries(pageContainerRefs.current)) {
      const container = el as HTMLDivElement | null;
      if (!container) continue;
      const box = container.getBoundingClientRect();
      if (centerX >= box.left && centerX <= box.right && centerY >= box.top && centerY <= box.bottom) {
        pageNumber = Number(num);
        break;
      }
    }
    
    if (!pageNumber) return;
    const pageContainer = pageContainerRefs.current[pageNumber];
    if (!pageContainer || !pdfContainerRef.current) return;
    
    const pageBox = pageContainer.getBoundingClientRect();
    
    // Normalize tọa độ của tất cả các dòng được bôi đen
    const normalized = rects.map((r) => ({ 
      left: (r.left - pageBox.left) / pageBox.width, 
      top: (r.top - pageBox.top) / pageBox.height, 
      width: r.width / pageBox.width, 
      height: r.height / pageBox.height 
    }));
    
    const newH = { id: `h-${Date.now()}`, pageNumber, rects: normalized, text: selectedText };
    persistHighlights([...highlights, newH]);
    
    window.getSelection()?.removeAllRanges();
    setSelectedText('');
    setSelectionPosition(null);
  };

  const removeHighlight = (id: string) => {
    persistHighlights(highlights.filter((h) => h.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        {!pages.length ? (
          <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white font-medium hover:bg-gray-800 transition">
            <Upload className="w-4 h-4" />
            Open PDF
            <input ref={(el) => { fileInputRef.current = el; }} type="file" accept="application/pdf" onChange={handleFileChange} hidden />
          </label>
        ) : (
          <>
            <span className="text-sm text-gray-600 truncate max-w-[200px]">{fileName}</span>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-600 hover:underline">Replace</button>
            <button type="button" onClick={clearPdf} className="text-xs text-gray-500 hover:text-red-500 transition ml-auto"><RefreshCcw className="w-3.5 h-3.5" /></button>
          </>
        )}
        {pdfError && <span className="text-xs text-red-600 ml-2">{pdfError}</span>}
      </div>

      <div ref={pdfContainerRef} className="relative flex-1 overflow-y-auto bg-gray-100 p-4" onMouseUp={handleSelection} onKeyUp={handleSelection}>
        {pdfLoading && <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-gray-700 font-semibold">Loading PDF...</div>}

        {!pages.length && !pdfLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Upload className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">Open a PDF to get started</p>
          </div>
        ) : null}

        <div className="space-y-4">
          {pages.map((pageData) => (
            <div key={pageData.pageNumber} className="relative mx-auto shadow-md" ref={(el) => { pageContainerRefs.current[pageData.pageNumber] = el; }} style={{ width: pageData.width, height: pageData.height }}>
              <div className="relative" style={{ width: pageData.width, height: pageData.height }} ref={(el) => { innerDivRefs.current[pageData.pageNumber] = el; }}>
                <canvas ref={(el) => { canvasRefs.current[pageData.pageNumber] = el; }} width={pageData.width} height={pageData.height} style={{ width: pageData.width, height: pageData.height }} className="block bg-white" />
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                  {highlights.filter((h) => h.pageNumber === pageData.pageNumber).map((h) => (
                    <div key={h.id} className="absolute pointer-events-auto">
                      {h.rects.map((r: any, i: number) => {
                        const left = r.left * pageData.width;
                        const top = r.top * pageData.height;
                        const w = r.width * pageData.width;
                        const hgt = r.height * pageData.height;
                        return <div key={i} onClick={() => { if (confirm('Remove this highlight?')) removeHighlight(h.id); }} style={{ left, top, width: w, height: hgt }} className="absolute bg-yellow-300/50 rounded-sm cursor-pointer" />;
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white">{pageData.pageNumber}</div>
            </div>
          ))}
        </div>

        {selectionPosition && selectedText ? (() => {
          const isSingleWord = selectedText.trim().split(/\s+/).length === 1;
          const isAlreadySaved = isSingleWord && words.some(w => w.word.toLowerCase() === selectedText.trim().toLowerCase());

          const handleAddToVocab = () => {
            if (isAlreadySaved) return;
            const newWord: Word = {
              id: Date.now().toString(),
              word: selectedText.trim(),
              meaning: '',
              pronunciation: '',
              examples: [],
              synonyms: [],
              topics: [],
              category: 'want-to-learn',
              addedDate: new Date(),
              reviewCount: 0,
            };
            addWord(newWord);
          };

          return (
            <div 
              ref={toolbarRef} 
              className="absolute z-20 inline-flex items-center gap-0.5 rounded-lg bg-white border border-gray-200 shadow-xl px-1 py-1" 
              style={{ 
                top: selectionPosition.top, 
                left: Math.max(selectionPosition.left, 130), 
                transform: 'translate(-50%, -100%)' // Popup luôn nổi LÊN TRÊN
              }}
            >
              <button type="button" onClick={() => onExplainRequest(selectedText, selectedPage ?? undefined)} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"><Search className="w-3.5 h-3.5" />Ask AI</button>
              {onContextSet && (
                <button type="button" onClick={() => { onContextSet(selectedText, selectedPage ?? undefined); window.getSelection()?.removeAllRanges(); setSelectedText(''); setSelectionPosition(null); }} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50 transition"><MessageSquareQuote className="w-3.5 h-3.5" />Context</button>
              )}
              <button type="button" onClick={addHighlightFromSelection} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 transition">Highlight</button>
              {isSingleWord && (
                <button
                  type="button"
                  onClick={handleAddToVocab}
                  disabled={isAlreadySaved}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                    isAlreadySaved ? 'text-green-700 bg-green-50' : 'text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  {isAlreadySaved ? <><Check className="w-3.5 h-3.5" />Saved</> : <><BookmarkPlus className="w-3.5 h-3.5" />Add</>}
                </button>
              )}
            </div>
          );
        })() : null}
      </div>
    </div>
  );
}