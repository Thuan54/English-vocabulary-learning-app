import { useState, useEffect, useCallback } from 'react';

const HIGHLIGHT_KEY = 'pdf-highlights-v1';

export function usePdfHighlights(fileName: string) {
  const [highlights, setHighlights] = useState<any[]>([]);

  useEffect(() => {
    if (!fileName) {
      setHighlights([]);
      return;
    }
    try {
      const raw = localStorage.getItem(`${HIGHLIGHT_KEY}:${fileName}`);
      setHighlights(raw ? JSON.parse(raw) : []);
    } catch {
      setHighlights([]);
    }
  }, [fileName]);

  const persistHighlights = useCallback((next: any[]) => {
    setHighlights(next);
    try {
      if (fileName) localStorage.setItem(`${HIGHLIGHT_KEY}:${fileName}`, JSON.stringify(next));
    } catch {}
  }, [fileName]);

  const addHighlight = useCallback((rects: any[], text: string, pageNumber: number) => {
    const newH = { id: `h-${Date.now()}`, pageNumber, rects, text };
    persistHighlights([...highlights, newH]);
  }, [highlights, persistHighlights]);

  const removeHighlight = useCallback((id: string) => {
    persistHighlights(highlights.filter(h => h.id !== id));
  }, [highlights, persistHighlights]);

  return { highlights, addHighlight, removeHighlight };
}