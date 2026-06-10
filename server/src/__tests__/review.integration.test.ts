import request from 'supertest';
import express from 'express';
import { createReviewRouter } from '../modules/review/review.route';
import { ReviewService } from '../modules/review/review.service';
import { errorHandler } from '../middleware/error.middleware';

const mockReviewService = {
  createReview: jest.fn(),
  getDueReviews: jest.fn(),
  processReview: jest.fn()
} as unknown as jest.Mocked<ReviewService>;

const app = documentApp();
function documentApp() {
  const appInstance = express();
  appInstance.use(express.json());
  appInstance.use('/api/reviews', createReviewRouter(mockReviewService));
  appInstance.use(errorHandler);
  return appInstance;
}

describe('Review Route Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/reviews — tạo mới review thành công', async () => {
    const mockRes = {
      wordId: '686000000000000000000001',
      wordReviewId: '687000000000000000000001',
      word: 'abandon',
      meaning: 'từ bỏ',
      nextReview: new Date()
    };
    (mockReviewService.createReview as jest.Mock).mockResolvedValueOnce(mockRes);

    const res = await request(app).post('/api/reviews').send({ wordId: '686000000000000000000001' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('wordReviewId', '687000000000000000000001');
  });

  it('POST /api/reviews/feedback — xử lý phản hồi thành công', async () => {
    (mockReviewService.processReview as jest.Mock).mockResolvedValueOnce({ message: 'Review processed successfully' });

    const res = await request(app).post('/api/reviews/feedback').send({
      wordReviewId: '687000000000000000000001',
      difficulty: 'easy'
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Review processed successfully');
  });

  it('GET /api/reviews/due — lấy danh sách các từ cần review', async () => {
    const dueReviews = [
      {
        wordReviewId: '687000000000000000000001',
        wordId: '686000000000000000000001',
        word: 'abandon',
        meaning: 'từ bỏ',
        nextReview: new Date()
      }
    ];
    (mockReviewService.getDueReviews as jest.Mock).mockResolvedValueOnce(dueReviews);

    const res = await request(app).get('/api/reviews/due');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].word).toBe('abandon');
  });
});
