import { MlClient } from './ml.client';
import { ReviewRepository } from '../review/review.repo';
import { WordResponseDTO } from '../word/word.dto';

export interface TagSuggestion {
  word: string;
  score: number;
}

export class AiService {
  constructor(
    private readonly mlClient: MlClient,
    private readonly reviewRepo: ReviewRepository
  ) {}

  /**
   * Giải nghĩa từ vựng bằng AI (Groq/LLaMA qua ml_server).
   */
  async explainWord(word: string): Promise<{ explanation: string }> {
    return this.mlClient.explainWord(word);
  }

  /**
   * Gợi ý các tag/từ liên quan dựa trên embedding similarity.
   * Dùng khi thêm từ mới để tự động đề xuất category phù hợp.
   */
  async suggestTags(word: string, topK: number = 10): Promise<TagSuggestion[]> {
    return this.mlClient.suggestTags(word, topK);
  }

  /**
   * Tìm kiếm các từ vựng liên quan đã học dựa trên cosine similarity.
   */
  async getRelatedWords(term: string, category: 'topics' | 'synonyms'): Promise<WordResponseDTO[]> {
    const termEmbedding = await this.mlClient.getEmbedding(term);
    const learnedWords = await this.reviewRepo.getLearnedWordsWithEmbeddings();
    
    if (learnedWords.length === 0) {
      return [];
    }

    const dotProduct = (a: number[], b: number[]) => a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitude = (a: number[]) => Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const cosineSimilarity = (a: number[], b: number[]) => {
      const magA = magnitude(a);
      const magB = magnitude(b);
      return magA && magB ? dotProduct(a, b) / (magA * magB) : 0;
    };

    const results = learnedWords.map(word => {
      let similarity = 0;
      if (word.embedding) {
        similarity = cosineSimilarity(termEmbedding, word.embedding);
      }
      return { word, similarity };
    });

    // Sắp xếp theo độ tương đồng giảm dần
    results.sort((a, b) => b.similarity - a.similarity);

    return results.map(r => {
      const { embedding, ...rest } = r.word as any;
      return rest;
    });
  }
}