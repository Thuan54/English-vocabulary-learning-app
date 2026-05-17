import request from 'supertest';
import express from 'express';
import { createAiRouter } from '../modules/ai/ai.route';
import { AiService } from '../modules/ai/ai.service';
import { MlClient } from '../modules/ai/ml.client';
import { errorHandler } from '../middleware/error.middleware';

// Mock MlClient để test không cần ml_server thật chạy
const mockMlClient = {
  explainWord: jest.fn().mockResolvedValue({
    explanation: "mock explanation for the word 'test'",
  }),
  suggestTags: jest.fn().mockResolvedValue([
    { word: 'animal', score: 0.95 },
    { word: 'pet', score: 0.87 },
  ]),
} as unknown as MlClient;

const aiService = new AiService(mockMlClient);
const aiRouter = createAiRouter(aiService);

const app = express();
app.use(express.json());
app.use('/api/ai', aiRouter);
app.use(errorHandler);

describe('AI Endpoints Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
});
