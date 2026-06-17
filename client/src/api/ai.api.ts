import { Word } from "../types/review";

export async function chatWithAi(word: string, _history: { role: string, content: string }[]): Promise<string> {
  const response = await fetch('/api/ai/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word })
  });
  
  if (!response.ok) throw new Error('AI request failed');
  
  const data = await response.json();
  return data.explanation;
}

export async function fetchRelatedWords(term: string, category: "topics" | "synonyms"): Promise<Word[]> {
  const res = await fetch(`/api/ai/related`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ term, category }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.error || "Failed to fetch related words";
    throw new Error(message);
  }

  return res.json();
}

export async function translateText(text: string): Promise<string> {
  const res = await fetch('/api/ai/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.error || "Failed to translate text";
    throw new Error(message);
  }
  const data = await res.json();
  return data.translation;
}

// ─── CT Grammar API Functions ──────────────────────────────────────────────

export interface GrammarAnalysis {
  analysis: {
    mainClause: string;
    dependentClauses: string[];
    subject: string;
    mainVerb: string;
    object: string;
    posLabels: { word: string; pos: string }[];
  };
}

export interface ScanPatternsResult {
  collocations: { phrase: string; type: string; category?: string }[];
  signalWords: { phrase: string; type: string; category?: string }[];
}

export interface FlashcardData {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  contextSentence: string;
  minimalContext: string;
}

export interface ParaphraseStep {
  step: number;
  title: string;
  content: string;
  explanation: string;
}

/** CT Step 1 — Decomposition: Phân tích cấu trúc ngữ pháp */
export async function analyzeGrammar(sentence: string): Promise<GrammarAnalysis> {
  const res = await fetch('/api/ai/grammar/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentence }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const errMsg = body?.error?.message || body?.detail || 'Failed to analyze grammar';
    throw new Error(errMsg);
  }
  return res.json();
}

/** CT Step 2 — Pattern Recognition: Quét cụm từ học thuật */
export async function scanPatterns(text: string): Promise<ScanPatternsResult> {
  const res = await fetch('/api/ai/grammar/scan-patterns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const errMsg = body?.error?.message || body?.detail || 'Failed to scan patterns';
    throw new Error(errMsg);
  }
  return res.json();
}

/** CT Step 3 — Abstraction: Tạo flashcard thông minh */
export async function smartFlashcard(word: string, surroundingText: string): Promise<{ flashcard: FlashcardData }> {
  const res = await fetch('/api/ai/grammar/smart-flashcard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, surroundingText }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const errMsg = body?.error?.message || body?.detail || 'Failed to create flashcard';
    throw new Error(errMsg);
  }
  return res.json();
}

/** CT Step 4 — Algorithm Design: Paraphrase 3 bước */
export async function paraphraseText(sentence: string): Promise<{ steps: ParaphraseStep[] }> {
  const res = await fetch('/api/ai/grammar/paraphrase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentence }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const errMsg = body?.error?.message || body?.detail || 'Failed to paraphrase';
    throw new Error(errMsg);
  }
  return res.json();
}
