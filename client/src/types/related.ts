export interface RelatedWordData {
  word: string;
  meaning: string;
  pronunciation?: string;
  synonyms?: string[];
  example?: string;
  topics?: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  words?: RelatedWordData[];
  relatedTopics?: string[];
  topic?: string;
}

export interface RelatedWordsResponse {
  words: RelatedWordData[];
  relatedTopics: string[];
  topic: string;
  description: string;
}
