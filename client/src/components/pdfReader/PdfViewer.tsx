import { useState, useRef } from 'react';
import { Document, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import { PdfUploader } from './PdfUploader';
import { PdfPage } from './PdfPage';
import { PdfSelectionToolbar } from './PdfSelectionToolbar';
import { usePdfSelection } from '../../hooks/usePdfSelection';
import { usePdfHighlights } from '../../hooks/usePdfHighlights';
import { addWordAPI, fetchStoredWord } from '../../api/vocabulary.api';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  onExplainRequest: (text: string, pageNumber?: number) => Promise<void>;
  onContextSet?: (text: string, pageNumber?: number) => void;
}

export default function PdfViewer({ onExplainRequest, onContextSet }: PdfViewerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);
  const pageContainerRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { highlights, addHighlight, removeHighlight } = usePdfHighlights(fileName);
  
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
  };

  const onClear = () => {
    setFile(null);
    setFileName('');
    setPdfError(null);
    setNumPages(null);
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

  const addWord = async (word: string, meaning: string) => {
    await addWordAPI(word, meaning);
  };

  return (
    <div className="flex flex-col h-full">
      <PdfUploader 
        numPages={numPages} 
        fileName={fileName} 
        pdfError={pdfError} 
        fileInputRef={fileInputRef} 
        onFileChange={onFileChange} 
        onClear={onClear} 
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
              {numPages && Array.from(new Array(numPages), (el, index) => (
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
            onAddWord={addWord}
            isAlreadySaved={false}
          />
        )}
      </div>
    </div>
  );
}