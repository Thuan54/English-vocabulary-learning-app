import request from 'supertest';
import express from 'express';
import { createStatsRouter } from '../modules/stats/stats.route';
import { StatsService } from '../modules/stats/stats.service';
import { errorHandler } from '../middleware/error.middleware';

const mockStatsService = {
  getStats: jest.fn()
} as unknown as jest.Mocked<StatsService>;

const app = express();
app.use(express.json());
app.use('/api/stats', createStatsRouter(mockStatsService));
app.use(errorHandler);

describe('Stats Route', () => {
  it('GET /api/stats — Trả về số liệu thống kê thành công', async () => {
    (mockStatsService.getStats as jest.Mock).mockResolvedValueOnce({
      totalWords: 5,
      totalWordReviews: 3,
      totalReviewRecords: 10
    });

    const res = await request(app).get('/api/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      totalWords: 5,
      totalWordReviews: 3,
      totalReviewRecords: 10
    });
  });
});
