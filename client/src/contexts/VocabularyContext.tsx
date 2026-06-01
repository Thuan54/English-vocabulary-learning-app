import React, { createContext, useContext, useState, useEffect } from "react";
import { Word } from "../types/word";
import { fetchWordsFromApi, addWordAPI } from "../api/vocabulary.api";
import { fetchDueCards, submitReview } from "../api/review.api";

interface VocabularyContextType {
  words: Word[];
  addWord: (word: Word) => void;
  updateWord: (id: string, updates: Partial<Word>) => void;
  moveWord: (id: string, category: Word["category"]) => void;
  deleteWord: (id: string) => void;
  streak: number;
  totalLearned: number;
  reviewDue: number;
  scheduleReview: (wordId: string, date: Date) => void;
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export function VocabularyProvider({ children }: { children: React.ReactNode }) {
  const [words, setWords] = useState<Word[]>([]);
  const [streak] = useState(7);

  useEffect(() => {
    fetchWordsFromApi()
      .then(mappedWords => setWords(mappedWords))
      .catch(err => console.error("Failed to fetch words:", err));
  }, []);

  const addWord = (word: Word) => {
    setWords([...words, word]);
  };

  const updateWord = (id: string, updates: Partial<Word>) => {
    setWords(words.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const moveWord = (id: string, category: Word["category"]) => {
    updateWord(id, { category });
  };

  const deleteWord = (id: string) => {
    setWords(words.filter(w => w.id !== id));
  };

  const scheduleReview = (wordId: string, date: Date) => {
    updateWord(wordId, { nextReview: date });
  };

  const totalLearned = words.filter(w => w.category === "learned").length;
  const reviewDue = words.filter(w => 
    w.nextReview && new Date(w.nextReview) <= new Date()
  ).length;

  return (
    <VocabularyContext.Provider
      value={{
        words,
        addWord,
        updateWord,
        moveWord,
        deleteWord,
        streak,
        totalLearned,
        reviewDue,
        scheduleReview
      }}
    >
      {children}
    </VocabularyContext.Provider>
  );
}

export function useVocabulary() {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error("useVocabulary must be used within VocabularyProvider");
  }
  return context;
}
