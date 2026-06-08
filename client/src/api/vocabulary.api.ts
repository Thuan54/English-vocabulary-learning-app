import { Word } from "../types/review";

export const addWordAPI = async (word: string, meaning: string) => {
    const res = await fetch('/api/words', {
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

export async function fetchStoredWord(word: string) {
  const res = await fetch(`/api/words/word?q=${word}`)
  if(!res.ok){
    const err = await res.json()
    throw new Error(err.error?.message || 'Error')
  }

  const storedWord: Word = await res.json()
  return storedWord
}

export async function fetchWordSearch(word: string): Promise<Omit<Word,"wordId">> {
  const res = await fetch(`/api/search/word?q=${encodeURIComponent(word)}`);

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.error || "Failed to fetch word";
    throw new Error(message);
  }

  const item = await res.json();

  return {
    word: item.word,
    meaning: item.meaning,
  };
}