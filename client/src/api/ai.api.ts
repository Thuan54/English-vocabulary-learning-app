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
