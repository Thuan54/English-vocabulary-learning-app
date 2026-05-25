import { Word } from "../contexts/VocabularyContext";

export const dictionaryData: { [key: string]: Omit<Word, "id" | "category" | "addedDate" | "reviewCount"> } = {
  "tenacious": {
    word: "Tenacious",
    meaning: "Tending to keep a firm hold of something; persistent",
    pronunciation: "/təˈneɪʃəs/",
    examples: [
      "She was tenacious in her pursuit of excellence.",
      "The team showed tenacious spirit despite losing."
    ],
    synonyms: ["persistent", "determined", "resolute", "steadfast"],
    topics: ["Character", "Determination"]
  },
  "benevolent": {
    word: "Benevolent",
    meaning: "Well meaning and kindly; showing goodwill",
    pronunciation: "/bəˈnevələnt/",
    examples: [
      "The benevolent ruler was loved by all citizens.",
      "She made a benevolent donation to the charity."
    ],
    synonyms: ["kind", "generous", "compassionate", "charitable"],
    topics: ["Character", "Kindness"]
  },
  "ubiquitous": {
    word: "Ubiquitous",
    meaning: "Present, appearing, or found everywhere",
    pronunciation: "/juːˈbɪkwɪtəs/",
    examples: [
      "Smartphones have become ubiquitous in modern society.",
      "Coffee shops are ubiquitous in this neighborhood."
    ],
    synonyms: ["omnipresent", "everywhere", "pervasive", "universal"],
    topics: ["Description", "Common"]
  },
  "eloquent": {
    word: "Eloquent",
    meaning: "Fluent or persuasive in speaking or writing",
    pronunciation: "/ˈɛləkwənt/",
    examples: [
      "The speaker gave an eloquent speech about climate change.",
      "Her eloquent writing style captivated readers."
    ],
    synonyms: ["articulate", "fluent", "persuasive", "expressive"],
    topics: ["Communication", "Skills"]
  }
};
