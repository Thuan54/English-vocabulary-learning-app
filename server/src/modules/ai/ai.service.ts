import { MlClient } from './ml.client';

export interface TagSuggestion {
  word: string;
  score: number;
}

export class AiService {
  constructor(private readonly mlClient: MlClient) {}

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
}