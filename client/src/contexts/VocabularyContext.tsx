import React, { createContext, useContext, useState } from "react";

export interface Word {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  examples: string[];
  synonyms: string[];
  topics: string[];
  category: "learned" | "want-to-learn" | "planned";
  addedDate: Date;
  lastReviewed?: Date;
  reviewCount: number;
  nextReview?: Date;
}

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

// Sample data
const sampleWords: Word[] = [
  {
    id: "1",
    word: "Ephemeral",
    meaning: "Lasting for a very short time; temporary",
    pronunciation: "/ɪˈfɛm(ə)rəl/",
    examples: [
      "The beauty of cherry blossoms is ephemeral, lasting only a few weeks.",
      "Social media posts often have an ephemeral nature."
    ],
    synonyms: ["transient", "fleeting", "momentary", "brief"],
    topics: ["Time", "Nature"],
    category: "learned",
    addedDate: new Date("2026-03-10"),
    lastReviewed: new Date("2026-03-17"),
    reviewCount: 5,
    nextReview: new Date("2026-03-20")
  },
  {
    id: "2",
    word: "Serendipity",
    meaning: "The occurrence of finding pleasant things by chance",
    pronunciation: "/ˌsɛr(ə)nˈdɪpɪti/",
    examples: [
      "Meeting my best friend was pure serendipity.",
      "The scientist's discovery was a result of serendipity."
    ],
    synonyms: ["chance", "fortune", "luck"],
    topics: ["Emotions", "Life"],
    category: "learned",
    addedDate: new Date("2026-03-12"),
    lastReviewed: new Date("2026-03-18"),
    reviewCount: 3,
    nextReview: new Date("2026-03-19")
  },
  {
    id: "3",
    word: "Eloquent",
    meaning: "Fluent or persuasive in speaking or writing",
    pronunciation: "/ˈɛləkwənt/",
    examples: [
      "The speaker gave an eloquent speech about climate change.",
      "Her eloquent writing style captivated readers."
    ],
    synonyms: ["articulate", "fluent", "persuasive", "expressive"],
    topics: ["Communication", "Skills"],
    category: "want-to-learn",
    addedDate: new Date("2026-03-15"),
    reviewCount: 0
  },
  {
    id: "4",
    word: "Perseverance",
    meaning: "Persistence in doing something despite difficulty",
    pronunciation: "/ˌpəːsɪˈvɪər(ə)ns/",
    examples: [
      "Success requires perseverance and dedication.",
      "Her perseverance paid off when she finally graduated."
    ],
    synonyms: ["persistence", "determination", "tenacity", "resilience"],
    topics: ["Character", "Success"],
    category: "want-to-learn",
    addedDate: new Date("2026-03-16"),
    reviewCount: 0
  },
  {
    id: "5",
    word: "Ambiguous",
    meaning: "Open to more than one interpretation; unclear",
    pronunciation: "/amˈbɪɡjʊəs/",
    examples: [
      "The professor's instructions were ambiguous and confusing.",
      "The ending of the movie was deliberately ambiguous."
    ],
    synonyms: ["unclear", "vague", "uncertain", "equivocal"],
    topics: ["Communication", "Understanding"],
    category: "planned",
    addedDate: new Date("2026-03-17"),
    reviewCount: 0,
    nextReview: new Date("2026-03-22")
  },
  {
    id: "6",
    word: "Resilient",
    meaning: "Able to recover quickly from difficulties",
    pronunciation: "/rɪˈzɪlɪənt/",
    examples: [
      "Children are remarkably resilient after traumatic events.",
      "The company proved resilient during the economic downturn."
    ],
    synonyms: ["strong", "tough", "adaptable", "flexible"],
    topics: ["Character", "Strength"],
    category: "planned",
    addedDate: new Date("2026-03-18"),
    reviewCount: 0,
    nextReview: new Date("2026-03-25")
  },
  {
    id: "7",
    word: "Meticulous",
    meaning: "Showing great attention to detail; very careful",
    pronunciation: "/mɪˈtɪkjʊləs/",
    examples: [
      "She was meticulous in her research methodology.",
      "The architect's meticulous planning ensured project success."
    ],
    synonyms: ["careful", "thorough", "precise", "detailed"],
    topics: ["Work", "Skills"],
    category: "learned",
    addedDate: new Date("2026-03-08"),
    lastReviewed: new Date("2026-03-16"),
    reviewCount: 4,
    nextReview: new Date("2026-03-21")
  },
  {
    id: "8",
    word: "Innovative",
    meaning: "Featuring new methods; advanced and original",
    pronunciation: "/ˈɪnəveɪtɪv/",
    examples: [
      "The startup developed an innovative solution to food waste.",
      "His innovative approach changed the industry."
    ],
    synonyms: ["creative", "original", "inventive", "novel"],
    topics: ["Business", "Creativity"],
    category: "learned",
    addedDate: new Date("2026-03-09"),
    lastReviewed: new Date("2026-03-17"),
    reviewCount: 6,
    nextReview: new Date("2026-03-19")
  }
];

export function VocabularyProvider({ children }: { children: React.ReactNode }) {
  const [words, setWords] = useState<Word[]>(sampleWords);
  const [streak] = useState(7);

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
