import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { Upload, RefreshCcw, AlertTriangle, Search } from 'lucide-react';

type PdfPageData = {
  page: any;
  viewport: any;
  textContent: any;
  pageNumber: number;
  width: number;
  height: number;
};

export default function PdfViewer({ onExplainRequest }: { onExplainRequest: (text: string) => Promise<void> }) {
  const [pages, setPages] = useState<PdfPageData[]>([]);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionPosition, setSelectionPosition] = useState<{ top: number; left: number } | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [highlights, setHighlights] = useState<Array<any>>([]);

  const pdfContainerRef = useRef<HTMLDivElement | null>(null);
  const pageContainerRefs = useRef<Record<number, HTMLDivElement | null>>({});
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

        const pageContainer = pageContainerRefs.current[pageData.pageNumber];
        let textLayerDiv = pageContainer?.querySelector('.pdfTextLayer') as HTMLDivElement | null;
        const viewer = pdfjsViewerRef.current;

        if (pageContainer) {
          // remove any stray pdf.js-created .textLayer containers to avoid overlapping text
          pageContainer.querySelectorAll('.textLayer').forEach((el) => {
            if (!el.classList.contains('pdfTextLayer')) el.remove();
          });

          // ensure our dedicated container exists
          if (!textLayerDiv) {
            textLayerDiv = document.createElement('div');
            textLayerDiv.className = 'pdfTextLayer absolute inset-0 pointer-events-auto';
            pageContainer.appendChild(textLayerDiv);
          }
        }

        if (textLayerDiv && viewer) {
          textLayerDiv.innerHTML = '';
          try {
            const textLayerBuilder = new viewer.TextLayerBuilder({
              pdfPage: pageData.page,
              onAppend: (div: HTMLDivElement) => {
                textLayerDiv!.appendChild(div);
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
    const selection = window.getSelection?.();
    if (!selection || selection.isCollapsed) {
      setSelectedText('');
      setSelectionPosition(null);
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setSelectedText('');
      setSelectionPosition(null);
      return;
    }

    const anchor = selection.anchorNode;
    if (!anchor || !pdfContainerRef.current?.contains(anchor)) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = pdfContainerRef.current.getBoundingClientRect();

    setSelectedText(text);
    setSelectionPosition({ top: rect.bottom - containerRect.top + pdfContainerRef.current.scrollTop + 8, left: rect.right - containerRect.left + pdfContainerRef.current.scrollLeft - 44 });
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
    const rects = Array.from(range.getClientRects()).map((r) => ({ top: r.top, left: r.left, width: r.width, height: r.height }));
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
    const normalized = rects.map((r) => ({ left: (r.left - pageBox.left) / pageBox.width, top: (r.top - pageBox.top) / pageBox.height, width: r.width / pageBox.width, height: r.height / pageBox.height }));
    const newH = { id: `h-${Date.now()}`, pageNumber, rects: normalized, text: sel.toString().trim() };
    persistHighlights([...highlights, newH]);
    window.getSelection()?.removeAllRanges();
    setSelectedText('');
    setSelectionPosition(null);
  };

  const removeHighlight = (id: string) => {
    persistHighlights(highlights.filter((h) => h.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-blue-500/10 text-blue-600 p-3">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Upload your PDF</h2>
            <p className="text-sm text-gray-500 mt-1">Only PDF files are supported. Highlight text in the viewer to explain words or phrases.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center">
          {!pages.length ? (
            <label className="cursor-pointer inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-white font-semibold hover:opacity-95 transition">
              Choose PDF
              <input ref={(el) => { fileInputRef.current = el; }} type="file" accept="application/pdf" onChange={handleFileChange} hidden />
            </label>
          ) : (
            <div className="inline-flex items-center gap-3">
              <div className="text-sm text-gray-700">Loaded: <span className="font-medium">{fileName}</span></div>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center justify-center rounded-2xl border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-50 transition">Replace</button>
            </div>
          )}

          <button type="button" onClick={clearPdf} disabled={!pages.length} className="inline-flex items-center justify-center rounded-2xl border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Clear
          </button>
        </div>

        {pdfError && (
          <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>{pdfError}</p>
          </div>
        )}

        {fileName && <div className="mt-4 text-sm text-gray-600">Loaded file: {fileName}</div>}
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 min-h-[520px] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">PDF Viewer</h3>
        </div>

        <div ref={pdfContainerRef} className="relative flex-1 overflow-y-auto rounded-3xl border border-gray-200 bg-gray-50 p-4" onMouseUp={handleSelection} onKeyUp={handleSelection}>
          {pdfLoading && <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-gray-700 font-semibold">Loading PDF...</div>}

          {!pages.length && !pdfLoading ? <div className="h-full flex items-center justify-center text-gray-500">Upload a PDF to display pages here.</div> : null}

          <div className="space-y-8">
            {pages.map((pageData) => (
              <div key={pageData.pageNumber} className="relative mx-auto w-full max-w-[900px] rounded-3xl border border-gray-200 bg-white shadow-sm" ref={(el) => { pageContainerRefs.current[pageData.pageNumber] = el; }}>
                <div className="relative">
                  <canvas ref={(el) => { canvasRefs.current[pageData.pageNumber] = el; }} width={pageData.width} height={pageData.height} className="w-full h-auto block" />
                  <div className="pdfTextLayer absolute inset-0 pointer-events-auto" />
                  <div className="absolute inset-0 pointer-events-none">
                    {highlights.filter((h) => h.pageNumber === pageData.pageNumber).map((h) => (
                      <div key={h.id} className="absolute z-10 pointer-events-auto">
                        {h.rects.map((r: any, i: number) => {
                          const left = r.left * pageData.width;
                          const top = r.top * pageData.height;
                          const w = r.width * pageData.width;
                          const hgt = r.height * pageData.height;
                          return <div key={i} onClick={() => { if (confirm('Remove this highlight?')) removeHighlight(h.id); }} style={{ left, top, width: w, height: hgt }} className="absolute bg-yellow-300/50 rounded-sm" />;
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute left-4 top-4 rounded-full bg-white/90 border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">Page {pageData.pageNumber}</div>
              </div>
            ))}
          </div>

          {selectionPosition && selectedText ? (
            <div ref={toolbarRef} className="absolute z-20 inline-flex items-center gap-2 rounded-full bg-white border shadow-lg" style={{ top: selectionPosition.top, left: Math.max(selectionPosition.left, 16) }}>
              <button type="button" onClick={() => onExplainRequest(selectedText)} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"><Search className="w-4 h-4" />Explain</button>
              <button type="button" onClick={addHighlightFromSelection} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Highlight</button>
            </div>
          ) : null}
        </div>

        <div className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600">Highlight a word or phrase inside the PDF viewer and then click the Explain button.</div>
      </div>
    </div>
  );
}
