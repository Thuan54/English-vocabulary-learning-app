import { useState, useRef, useCallback } from 'react';
import { Document, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import { PdfUploader } from './PdfUploader';
import { PdfPage } from './PdfPage';
import { PdfSelectionToolbar } from './PdfSelectionToolbar';
import { usePdfSelection } from '../../hooks/usePdfSelection';
import { usePdfHighlights } from '../../hooks/usePdfHighlights';
import { addWordAPI } from '../../api/vocabulary.api';
import { scanPatterns, type ScanPatternsResult } from '../../api/ai.api';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  onExplainRequest: (text: string, pageNumber?: number) => Promise<void>;
  onContextSet?: (text: string, pageNumber?: number) => void;
  onAnalyzeRequest: (text: string) => void;
  onParaphraseRequest: (text: string) => void;
  onSmartAdd: (word: string, surroundingText: string) => void;
}

export default function PdfViewer({ onExplainRequest, onContextSet, onAnalyzeRequest, onParaphraseRequest, onSmartAdd }: PdfViewerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isScanMode, setIsScanMode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const pdfContainerRef = useRef<HTMLDivElement | null>(null);
  const pageContainerRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { highlights, addHighlight, removeHighlight, addSystemHighlights, clearSystemHighlights } = usePdfHighlights(fileName);

  // Simplified: no longer needs textContentMap or pageDimensions
  const { selectedText, selectedPage, selectionPosition, handleSelection } = usePdfSelection(
    pdfContainerRef,
    pageContainerRefs,
    numPages
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      setPdfError('Please upload a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setPdfError(null);
    // Reset scan mode when new file loaded
    setIsScanMode(false);
  };

  const onClear = () => {
    setFile(null);
    setFileName('');
    setPdfError(null);
    setNumPages(null);
    setIsScanMode(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    setPdfError('Unable to load this PDF. Try a different file.');
    console.error('PDF load error', error);
  };

  const handleAddHighlightFromSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const rects = Array.from(range.getClientRects());
    if (!rects.length || !selectedPage) return;

    const pageContainer = pageContainerRefs.current[selectedPage];
    const pdfContainer = pdfContainerRef.current;
    if (!pageContainer || !pdfContainer) return;

    const pageBox = pageContainer.getBoundingClientRect();
    const normalized = rects.map((r) => ({
      left: (r.left - pageBox.left) / pageBox.width,
      top: (r.top - pageBox.top) / pageBox.height,
      width: r.width / pageBox.width,
      height: r.height / pageBox.height,
    }));

    addHighlight(normalized, selectedText, selectedPage);
    window.getSelection()?.removeAllRanges();
  };

  const handleAddWord = async (word: string, surroundingText: string) => {
    // Call smart add (AI flashcard) via parent
    onSmartAdd(word, surroundingText);
    // Also save to DB
    await addWordAPI(word, '');
  };

  // ─── Scan Patterns ──────────────────────────────────────────────────────────

  const extractPageText = useCallback((pageNumber: number): string => {
    const pageEl = pageContainerRefs.current[pageNumber];
    if (!pageEl) return '';
    const textLayer = pageEl.querySelector('.react-pdf__Page__textContent');
    if (!textLayer) return '';
    return textLayer.textContent || '';
  }, []);

  const handleScanToggle = useCallback(async () => {
    if (isScanMode) {
      // Turn off: remove system highlights
      setIsScanMode(false);
      clearSystemHighlights();
      return;
    }

    // Turn on: scan visible pages
    setIsScanMode(true);
    setIsScanning(true);

    try {
      // Collect text from all pages
      const allPageTexts: string[] = [];
      for (let i = 1; i <= (numPages || 0); i++) {
        allPageTexts.push(extractPageText(i));
      }
      const fullText = allPageTexts.join('\n\n');
      if (!fullText.trim()) {
        setIsScanning(false);
        return;
      }

      const result = await scanPatterns(fullText);

      // Convert scan results to system highlights
      // We'll create text-based highlights that PdfPage can render
      const systemHighlights: Array<{
        text: string;
        type: 'collocation' | 'signal-word';
        category?: string;
      }> = [];

      result.collocations.forEach((c) => {
        systemHighlights.push({
          text: c.phrase,
          type: 'collocation',
          category: c.category,
        });
      });

      result.signalWords.forEach((s) => {
        systemHighlights.push({
          text: s.phrase,
          type: 'signal-word',
          category: s.category,
        });
      });

      addSystemHighlights(systemHighlights);
    } catch (error) {
      console.error('Scan patterns failed:', error);
    } finally {
      setIsScanning(false);
    }
  }, [isScanMode, numPages, extractPageText, clearSystemHighlights, addSystemHighlights]);

  return (
    <div className="flex flex-col h-full">
      <PdfUploader
        numPages={numPages}
        fileName={fileName}
        pdfError={pdfError}
        fileInputRef={fileInputRef}
        onFileChange={onFileChange}
        onClear={onClear}
        isScanMode={isScanMode}
        isScanning={isScanning}
        onScanToggle={handleScanToggle}
      />

      <div
        ref={pdfContainerRef}
        className="relative flex-1 overflow-y-auto bg-gray-100 p-4"
        onMouseUp={handleSelection}
        onKeyUp={handleSelection}
      >
        {pdfError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-red-600 font-semibold">
            {pdfError}
          </div>
        )}

        {!file && !pdfError && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="text-4xl mb-3 opacity-40">📄</div>
            <p className="text-sm">Open a PDF to get started</p>
          </div>
        )}

        {file && (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-gray-700 font-semibold">Loading PDF...</div>}
          >
            <div className="space-y-4">
              {numPages && Array.from(new Array(numPages), (_el, index) => (
                <PdfPage
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  highlights={highlights}
                  onRemoveHighlight={removeHighlight}
                  pageContainerRef={(el) => { pageContainerRefs.current[index + 1] = el; }}
                />
              ))}
            </div>
          </Document>
        )}

        {selectionPosition && selectedText && (
          <PdfSelectionToolbar
            selectedText={selectedText}
            selectedPage={selectedPage}
            selectionPosition={selectionPosition}
            onExplainRequest={onExplainRequest}
            onContextSet={onContextSet}
            onHighlight={handleAddHighlightFromSelection}
            onAddWord={handleAddWord}
            onAnalyzeRequest={onAnalyzeRequest}
            onParaphraseRequest={onParaphraseRequest}
            isAlreadySaved={false}
          />
        )}
      </div>
    </div>
  );
}