import { useState, useEffect, useCallback } from 'react';

const HIGHLIGHT_KEY = 'pdf-highlights-v1';

export type HighlightType = 'user' | 'collocation' | 'signal-word';

export interface PdfHighlight {
  id: string;
  pageNumber: number;
  rects: Array<{ left: number; top: number; width: number; height: number }>;
  text: string;
  type: HighlightType;
  category?: string;
}

export function usePdfHighlights(fileName: string) {
  const [highlights, setHighlights] = useState<PdfHighlight[]>([]);

  useEffect(() => {
    if (!fileName) {
      setHighlights([]);
      return;
    }
    try {
      const raw = localStorage.getItem(`${HIGHLIGHT_KEY}:${fileName}`);
      const parsed = raw ? JSON.parse(raw) : [];
      // Ensure backwards compatibility: old highlights without type default to 'user'
      setHighlights(parsed.map((h: any) => ({ ...h, type: h.type || 'user' })));
    } catch {
      setHighlights([]);
    }
  }, [fileName]);

  const persistHighlights = useCallback((next: PdfHighlight[]) => {
    setHighlights(next);
    try {
      // Only persist user highlights to localStorage (system highlights are ephemeral)
      const userHighlights = next.filter(h => h.type === 'user');
      if (fileName) localStorage.setItem(`${HIGHLIGHT_KEY}:${fileName}`, JSON.stringify(userHighlights));
    } catch {}
  }, [fileName]);

  const addHighlight = useCallback((rects: any[], text: string, pageNumber: number) => {
    const newH: PdfHighlight = { id: `h-${Date.now()}`, pageNumber, rects, text, type: 'user' };
    persistHighlights([...highlights, newH]);
  }, [highlights, persistHighlights]);

  const removeHighlight = useCallback((id: string) => {
    persistHighlights(highlights.filter(h => h.id !== id));
  }, [highlights, persistHighlights]);

  /**
   * Add system-generated highlights from scan patterns.
   * These are text-based (no rects) and will be matched by PdfPage.
   */
  const addSystemHighlights = useCallback((
    patterns: Array<{ text: string; type: 'collocation' | 'signal-word'; category?: string }>
  ) => {
    const systemHighlights: PdfHighlight[] = patterns.map((p, i) => ({
      id: `sys-${Date.now()}-${i}`,
      pageNumber: 0, // 0 means "apply to all pages"
      rects: [], // Will be computed by PdfPage via text matching
      text: p.text,
      type: p.type,
      category: p.category,
    }));
    const currentUserHighlights = highlights.filter(h => h.type === 'user');
    setHighlights([...currentUserHighlights, ...systemHighlights]);
  }, [highlights]);

  /**
   * Clear all system-generated highlights, keeping user highlights intact.
   */
  const clearSystemHighlights = useCallback(() => {
    const userHighlights = highlights.filter(h => h.type === 'user');
    setHighlights(userHighlights);
  }, [highlights]);

  return { highlights, addHighlight, removeHighlight, addSystemHighlights, clearSystemHighlights };
}