import { useState, useCallback, type RefObject } from 'react';

export function usePdfSelection(
  pdfContainerRef: RefObject<HTMLDivElement | null>,
  pageContainerRefs: RefObject<Record<number, HTMLDivElement | null>>,
  numPages: number | null
) {
  const [selectedText, setSelectedText] = useState('');
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [selectionPosition, setSelectionPosition] = useState<{ top: number; left: number } | null>(null);

  const handleSelection = useCallback(() => {
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

      for (let i = 1; i <= (numPages || 0); i++) {
        const pageEl = pageContainerRefs.current[i];
        if (!pageEl) continue;
        const box = pageEl.getBoundingClientRect();
        if (centerY >= box.top && centerY <= box.bottom) {
          detectedPage = i;
          break;
        }
      }

      // FIX: Since react-pdf renders a native text layer, we just use the browser's selection!
      // This completely eliminates the "selecting extra words" bug.
      let extractedText = range.toString();
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
  }, [pdfContainerRef, pageContainerRefs, numPages]);

  return { selectedText, selectedPage, selectionPosition, handleSelection };
}