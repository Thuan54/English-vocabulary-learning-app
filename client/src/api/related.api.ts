import { fetchWordsFromApi } from "./vocabulary.api";
import { RelatedWordData, RelatedWordsResponse } from "../types/related";

export async function fetchRelatedWords(topic: string): Promise<RelatedWordsResponse> {
  const normalizedTopic = topic.trim().toLowerCase();
  const allWords = await fetchWordsFromApi();

  const words = allWords
    .filter((word) =>
      word.topics?.some((t) => t.toLowerCase() === normalizedTopic)
    )
    .map<RelatedWordData>((word) => ({
      word: word.word,
      meaning: word.meaning,
      pronunciation: word.pronunciation,
      synonyms: word.synonyms || [],
      example: word.examples?.[0] || "",
      topics: word.topics,
    }));

  const relatedTopics = Array.from(
    new Set(
      allWords
        .flatMap((word) => word.topics || [])
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t && t !== normalizedTopic)
    )
  ).slice(0, 8);

  return {
    words,
    relatedTopics,
    topic,
    description: words.length
      ? `These words were found in your vocabulary database under the topic "${topic}".`
      : `No words were found in your vocabulary database for "${topic}". Here are some other topics to explore.`,
  };
}
