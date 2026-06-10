import { AppError } from '../../middleware/error';

// DTO khớp với response của ml_server
interface ExplainResponse {
  explanation: string;
}

interface SearchResult {
  word: string;
  score: number;
}

interface SearchResponse {
  top_results: SearchResult[];
}

/**
 * HTTP client gọi sang ml_server (FastAPI, Python).
 * Mọi lời gọi ra ngoài đều đi qua đây — dễ mock khi test.
 */
export class MlClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    // Bỏ dấu / cuối nếu có để tránh double-slash
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  /**
   * Gọi POST /explain/ của ml_server.
   * Gửi cả `word` và `text` — ml_server sẽ ưu tiên `text`.
   * @throws AppError 503 nếu ml_server không phản hồi
   */
  async explainWord(input: string): Promise<{ explanation: string }> {
    const res = await this.post<ExplainResponse>('/explain/', { word: input, text: input });
    return { explanation: res.explanation };
  }

  /**
   * Gọi POST /embedding/ của ml_server.
   * Trả về vector embedding của từ khóa.
   * @throws AppError 503 nếu ml_server không phản hồi
   */
  async getEmbedding(word: string): Promise<number[]> {
    const res = await this.post<{ embedding: number[] }>(`/embedding/?word=${encodeURIComponent(word)}`, {});
    return res.embedding;
  }

  /**
   * Gọi POST /search/ của ml_server.
   * Trả về danh sách từ có embedding gần nhất với topic.
   * @throws AppError 503 nếu ml_server không phản hồi
   */
  async suggestTags(
    topic: string,
    topK: number = 10
  ): Promise<SearchResult[]> {
    const res = await this.post<SearchResponse>('/search/', {
      topic,
      top_k: topK,
    });
    return res.top_results;
  }

  // ─── helper ────────────────────────────────────────────────────────────────

  private async post<T>(path: string, body: object): Promise<T> {
    let res: Response;

    try {
      res = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (err) {
      // Không kết nối được (ml_server chưa chạy, sai port, ...)
      throw new AppError(
        'Không thể kết nối đến ML server. Vui lòng thử lại sau.',
        'ML_SERVER_UNAVAILABLE',
        503
      );
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => res.statusText);
      throw new AppError(
        `ML server trả lỗi ${res.status}: ${detail}`,
        'ML_SERVER_ERROR',
        502
      );
    }

    return res.json() as Promise<T>;
  }
}
