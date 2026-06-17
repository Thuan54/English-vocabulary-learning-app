import { AppError } from '../../middleware/error';

// DTO khớp với response của ml_server
interface ExplainResponse {
  explanation: string;
}

interface SearchResult {
  wordId: string;
  score: number;
}

interface SearchResponse {
  top_results: SearchResult[];
}

type EmbeddingResponse = {
  embedding: Array<Float32Array>
}

// ─── CT Grammar Types ──────────────────────────────────────────────────────

interface PosLabel {
  word: string;
  pos: string;
}

interface GrammarAnalysisResult {
  mainClause: string;
  dependentClauses: string[];
  subject: string;
  mainVerb: string;
  object: string;
  posLabels: PosLabel[];
}

interface GrammarAnalysisResponse {
  analysis: GrammarAnalysisResult;
}

interface PatternMatch {
  phrase: string;
  type: string;
  category?: string;
}

interface ScanPatternsResponse {
  collocations: PatternMatch[];
  signalWords: PatternMatch[];
}

interface FlashcardData {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  contextSentence: string;
  minimalContext: string;
}

interface SmartFlashcardResponse {
  flashcard: FlashcardData;
}

interface ParaphraseStep {
  step: number;
  title: string;
  content: string;
  explanation: string;
}

interface ParaphraseResponse {
  steps: ParaphraseStep[];
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
    const res = await this.post<ExplainResponse>('/explain', { word: input, text: input });
    return { explanation: res.explanation };
  }

  
  async embeding(word: string) {
    const res = await this.post<EmbeddingResponse>('/embedding',{word: word})
    return res
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
    const res = await this.post<SearchResponse>('/search', {
      topic,
      top_k: topK,
    });
    
    return res.top_results;
  }

  // ─── CT Grammar Endpoints ────────────────────────────────────────────────

  /**
   * CT Step 1 — Decomposition: Phân tích cấu trúc ngữ pháp.
   */
  async analyzeGrammar(sentence: string): Promise<GrammarAnalysisResponse> {
    return this.post<GrammarAnalysisResponse>('/grammar/analyze', { sentence });
  }

  /**
   * CT Step 2 — Pattern Recognition: Quét cụm từ học thuật.
   */
  async scanPatterns(text: string): Promise<ScanPatternsResponse> {
    return this.post<ScanPatternsResponse>('/grammar/scan-patterns', { text });
  }

  /**
   * CT Step 3 — Abstraction: Tạo flashcard thông minh.
   */
  async smartFlashcard(word: string, surroundingText: string): Promise<SmartFlashcardResponse> {
    return this.post<SmartFlashcardResponse>('/grammar/smart-flashcard', { word, surroundingText });
  }

  /**
   * CT Step 4 — Algorithm Design: Hướng dẫn paraphrase 3 bước.
   */
  async paraphrase(sentence: string): Promise<ParaphraseResponse> {
    return this.post<ParaphraseResponse>('/grammar/paraphrase', { sentence });
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
