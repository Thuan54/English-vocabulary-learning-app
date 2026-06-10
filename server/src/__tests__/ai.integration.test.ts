import request from 'supertest';
import express from 'express';
import { createAiRouter } from '../modules/ai/ai.route';
import { AiService } from '../modules/ai/ai.service';
import { MlClient } from '../modules/ai/ml.client';
import { ReviewRepository } from '../modules/review/review.repo';
import { errorHandler } from '../middleware/error.middleware';
import { startTestDB, clearTestDB, stopTestDB, testDb, ObjectId } from '../test/db-test-helper';

// Mock MlClient để test không cần ml_server thật chạy
const mockMlClient = {
  explainWord: jest.fn().mockResolvedValue({
    explanation: "mock explanation for the word 'test'",
  }),
  suggestTags: jest.fn().mockResolvedValue([
    { word: 'animal', score: 0.95 },
    { word: 'pet', score: 0.87 },
  ]),
  getEmbedding: jest.fn().mockResolvedValue(Array.from({ length: 384 }, () => 0.1)),
} as unknown as MlClient;

let reviewRepo: ReviewRepository;
let aiService: AiService;
const app = express();

beforeAll(async () => {
  await startTestDB();
  reviewRepo = new ReviewRepository(testDb!);
  aiService = new AiService(mockMlClient, reviewRepo);
  
  app.use(express.json());
  app.use('/api/ai', createAiRouter(aiService));
  app.use(errorHandler);
});

beforeEach(async () => {
  await clearTestDB();
  jest.clearAllMocks();
});

afterAll(async () => {
  await stopTestDB();
});

describe('AI Endpoints Integration', () => {
  // ─── /explain ────────────────────────────────────────────────────────────

  it('POST /explain — trả explanation khi word hợp lệ', async () => {
    const res = await request(app).post('/api/ai/explain').send({ word: 'test' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('explanation');
    expect(mockMlClient.explainWord).toHaveBeenCalledWith('test');
  });

  it('POST /explain — trả 400 khi word rỗng', async () => {
    const res = await request(app).post('/api/ai/explain').send({ word: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  it('POST /explain — trả 400 khi thiếu field word', async () => {
    const res = await request(app).post('/api/ai/explain').send({ somethingElse: 'test' });
    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  // ─── /suggest-tags ────────────────────────────────────────────────────────

  it('POST /suggest-tags — trả suggestions khi word hợp lệ', async () => {
    const res = await request(app)
      .post('/api/ai/suggest-tags')
      .send({ word: 'cat', top_k: 5 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('suggestions');
    expect(Array.isArray(res.body.suggestions)).toBe(true);
    expect(mockMlClient.suggestTags).toHaveBeenCalledWith('cat', 5);
  });

  it('POST /suggest-tags — top_k mặc định là 10 khi không truyền', async () => {
    const res = await request(app)
      .post('/api/ai/suggest-tags')
      .send({ word: 'dog' });

    expect(res.status).toBe(200);
    expect(mockMlClient.suggestTags).toHaveBeenCalledWith('dog', 10);
  });

  it('POST /suggest-tags — trả 400 khi word rỗng', async () => {
    const res = await request(app).post('/api/ai/suggest-tags').send({ word: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  // ─── /related (Show learned words) ────────────────────────────────────────

  it('POST /related — Trả về danh sách từ đã học xếp theo cosine similarity', async () => {
    // 1. Seed words and word review state
    const words = [
      {
        _id: new ObjectId("686000000000000000000001"),
        word: "abandon",
        meaning: "từ bỏ",
        embedding: Array.from({ length: 384 }, (_, i) => (i === 0 ? 1.0 : 0.0)) // Vector: [1.0, 0, 0, ...]
      },
      {
        _id: new ObjectId("686000000000000000000002"),
        word: "achieve",
        meaning: "đạt được",
        embedding: Array.from({ length: 384 }, (_, i) => (i === 1 ? 1.0 : 0.0)) // Vector: [0, 1.0, 0, ...]
      }
    ];
    await testDb!.collection('words').insertMany(words);

    // Seed reviews: only "abandon" (repetition: 2) and "achieve" (repetition: 0 - not learned yet)
    const reviews = [
      {
        wordId: new ObjectId("686000000000000000000001"),
        repetition: 2,
        ease: 2.5
      },
      {
        wordId: new ObjectId("686000000000000000000002"),
        repetition: 0,
        ease: 2.5
      }
    ];
    await testDb!.collection('word_review').insertMany(reviews);

    // Mock getEmbedding to match "abandon" vector [1.0, 0, 0, ...]
    (mockMlClient.getEmbedding as jest.Mock).mockResolvedValueOnce(
      Array.from({ length: 384 }, (_, i) => (i === 0 ? 1.0 : 0.0))
    );

    // 2. Call /api/ai/related
    const res = await request(app)
      .post('/api/ai/related')
      .send({ term: 'nature', category: 'topics' });

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1); // Only "abandon" is learned (repetition >= 1)
    expect(res.body[0].word).toBe("abandon");
  });

  it('POST /related — Trả về danh sách rỗng nếu không có từ nào đã học', async () => {
    const res = await request(app)
      .post('/api/ai/related')
      .send({ term: 'nature', category: 'topics' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /related — Trả về 400 khi category không hợp lệ', async () => {
    const res = await request(app)
      .post('/api/ai/related')
      .send({ term: 'nature', category: 'invalid_category' });

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });
});