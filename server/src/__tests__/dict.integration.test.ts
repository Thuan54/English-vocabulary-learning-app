import request from 'supertest';
import express from 'express';
import { createDictRouter } from '../modules/dictionary/dict.route';
import { DictService } from '../modules/dictionary/dict.service';
import { errorHandler } from '../middleware/error.middleware';

const mockDictService = {
  fetchWordSearch: jest.fn()
} as unknown as jest.Mocked<DictService>;

const app = express();
app.use(express.json());
app.use('/api/search', createDictRouter(mockDictService));
app.use(errorHandler);

describe('Dictionary Search Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/search/word?q=... — Trả về định nghĩa thành công từ API ngoài', async () => {
    (mockDictService.fetchWordSearch as jest.Mock).mockResolvedValueOnce({
      word: 'developer',
      definition: 'người lập trình'
    });

    const res = await request(app).get('/api/search/word?q=developer');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      word: 'developer',
      meaning: 'người lập trình'
    });
    expect(mockDictService.fetchWordSearch).toHaveBeenCalledWith('developer');
  });

  it('GET /api/search/word?q=... — Trả về 404 khi từ không được tìm thấy', async () => {
    (mockDictService.fetchWordSearch as jest.Mock).mockResolvedValueOnce({
      error: 'Word not found'
    });

    const res = await request(app).get('/api/search/word?q=unknown_word');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: 'Word not found'
    });
  });

  it('GET /api/search/word?q=... — Trả về 400 khi q rỗng', async () => {
    const res = await request(app).get('/api/search/word?q=  ');
    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });
});
