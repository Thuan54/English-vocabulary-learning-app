export interface Word {
  id: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  examples?: string[];
  synonyms?: string[];
  topics?: string[];
  category: "learned" | "want-to-learn" | "planned";
  addedDate: Date;
  lastReviewed?: Date;
  reviewCount: number;
  nextReview?: Date;
}

export interface VocabularyContextType {
  words: Word[];
  addWord: (word: Word) => void;
  updateWord: (id: string, updates: Partial<Word>) => void;
  moveWord: (id: string, category: Word['category']) => void;
  deleteWord: (id: string) => void;
  streak: number;
  totalLearned: number;
  reviewDue: number;
  scheduleReview: (wordId: string, date: Date) => void;
}
