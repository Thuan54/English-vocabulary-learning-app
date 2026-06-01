export const addWordAPI = async (word: string, meaning: string) => {
    const res = await fetch('/api/word', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ word, meaning })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Error');
    }

    return res.json();
};

import { Word } from "../types/word";

export async function fetchWordsFromApi(): Promise<Word[]> {
  const res = await fetch("/api/words");
  if (!res.ok) {
    throw new Error("Failed to fetch words");
  }

  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => ({
    id: item._id || item.id,
    word: item.word,
    meaning: item.meaning,
    pronunciation: item.pronunciation || "",
    examples: item.examples || [],
    synonyms: item.synonyms || [],
    topics: item.topics || [],
    category: item.category || "want-to-learn",
    addedDate: item.createdAt ? new Date(item.createdAt) : new Date(),
    lastReviewed: item.lastReviewed ? new Date(item.lastReviewed) : undefined,
    reviewCount: item.reviewCount || 0,
    nextReview: item.nextReview ? new Date(item.nextReview) : undefined,
  }));
}

export async function fetchWordSearch(word: string): Promise<Word> {
  const res = await fetch(`/api/words?q=${encodeURIComponent(word)}`);

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.error || "Failed to fetch word";
    throw new Error(message);
  }

  const item = await res.json();

  return {
    id: item._id || item.id,
    word: item.word,
    meaning: item.meaning,
    pronunciation: item.pronunciation || "",
    examples: item.examples || [],
    synonyms: item.synonyms || [],
    topics: item.topics || [],
    category: item.category || "want-to-learn",
    addedDate: item.createdAt ? new Date(item.createdAt) : new Date(),
    lastReviewed: item.lastReviewed ? new Date(item.lastReviewed) : undefined,
    reviewCount: item.reviewCount || 0,
    nextReview: item.nextReview ? new Date(item.nextReview) : undefined,
  };
}