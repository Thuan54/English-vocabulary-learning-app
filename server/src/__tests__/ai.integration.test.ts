import request from 'supertest';
import express from 'express';
import { createAiRouter } from '../modules/ai/ai.route';
import { AiService } from '../modules/ai/ai.service';
import { errorHandler } from '../middleware/error.middleware';

const aiService = new AiService();
const aiRouter = createAiRouter(aiService);

const app = express();
app.use(express.json());
app.use('/api/ai', aiRouter);
app.use(errorHandler);

describe('AI Explain Endpoint Integration', () => {
  it('returns a mock explanation for a valid word and status 200', async () => {
    const payload = { word: 'test' };
    const res = await request(app).post('/api/ai/explain').send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('explanation');
    expect(res.body.explanation).toEqual(expect.stringContaining('mock explanation for the word \'test\''));
  });

  it('returns 400 on missing or invalid word', async () => {
    // Empty string
    const res1 = await request(app).post('/api/ai/explain').send({ word: '   ' }); 
    expect(res1.status).toBe(400);
    expect(res1.body.error).toHaveProperty('code', 'VALIDATION_ERROR');

    // Missing field
    const res2 = await request(app).post('/api/ai/explain').send({ somethingElse: 'test' }); 
    expect(res2.status).toBe(400);
    expect(res2.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });
});
