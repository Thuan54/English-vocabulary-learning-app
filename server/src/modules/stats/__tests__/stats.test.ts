import request from 'supertest';
import express from 'express';
import { startTestDB, clearTestDB, stopTestDB, testDb } from '../../../test/db-test-helper';
import { errorHandler } from '../../../middleware/error.middleware';
import { requestLogger } from '../../../middleware/logger.middleware';
import { StatsRepository } from '../stats.repo';
import { StatsService } from '../stats.service';
import { createStatsRouter } from '../stats.route';

const app = express();
app.use(express.json());
app.use(requestLogger); // Logs appear for requests

app.use(errorHandler);

beforeAll(async () => {
  await startTestDB();
  // Wire real dependencies using test DB
  const repo = new StatsRepository(testDb!);
  const service = new StatsService(repo);
  app.use('/api/stats', createStatsRouter(service));
});
beforeEach(async () => await clearTestDB());
afterAll(async () => await stopTestDB());

describe('Stats Integration & Logging', () => {
  it('returns correct counts for empty DB', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const res = await request(app).get('/api/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ words: 0, reviews: 0 });
    
    // Verify logger format
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\[GET\] \/api\/stats 200 - \d+ms/)
    );
    consoleSpy.mockRestore();
  });

  it('returns accurate counts after inserting documents', async () => {
    // Seed test data
    await testDb!.collection('words').insertMany([
      { word: 'apple', meaning: 'fruit' },
      { word: 'banana', meaning: 'fruit' },
    ]);
    await testDb!.collection('reviews').insertOne({ word: 'apple', quality: 4 });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const res = await request(app).get('/api/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ words: 2, reviews: 1 });
    consoleSpy.mockRestore();
  });
});