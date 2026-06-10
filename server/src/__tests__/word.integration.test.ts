import request from 'supertest';
import express from 'express';
import { startTestDB, clearTestDB, stopTestDB, testDb, ObjectId } from '../test/db-test-helper';
import { WordRepository } from '../modules/word/word.repo';
import { WordService } from '../modules/word/word.service';
import { createWordRouter } from '../modules/word/word.route';
import { ReviewRepository } from '../modules/review/review.repo';
import { errorHandler } from '../middleware/error.middleware';

const mockMlClient = {
  getEmbedding: jest.fn().mockResolvedValue(Array.from({ length: 384 }, () => 0.2))
} as any;

let wordRepo: WordRepository;
let reviewRepo: ReviewRepository;
let wordService: WordService;
const app = express();

beforeAll(async () => {
  await startTestDB();
  wordRepo = new WordRepository(testDb!);
  reviewRepo = new ReviewRepository(testDb!);
  wordService = new WordService(wordRepo, reviewRepo, mockMlClient);
  
  app.use(express.json());
  app.use('/api/words', createWordRouter(wordService));
  app.use(errorHandler);
});

beforeEach(async () => {
  await clearTestDB();
  jest.clearAllMocks();
});

afterAll(async () => {
  await stopTestDB();
});

describe('Word Integration Tests (Lookup & search_count)', () => {
  it('db-test-helper — gọi startTestDB lần 2 không khởi chạy lại', async () => {
    await expect(startTestDB()).resolves.toBeUndefined();
  });

  it('createWord — hoạt động bình thường khi không có mlClient', async () => {
    const serviceNoMl = new WordService(wordRepo, reviewRepo);
    const result = await serviceNoMl.createWord({ word: 'no-ml', meaning: 'không ml' });
    expect(result).toHaveProperty('wordId');
    const dbWord = await testDb!.collection('words').findOne({ word: 'no-ml' });
    expect(dbWord?.embedding).toBeFalsy();
  });

  it('POST /api/words — tạo từ mới thành công và sinh embedding', async () => {
    const payload = { word: 'test', meaning: 'bản kiểm thử' };
    const res = await request(app).post('/api/words').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      word: 'test',
      meaning: 'bản kiểm thử'
    });
    expect(res.body).toHaveProperty('wordId');
    expect(mockMlClient.getEmbedding).toHaveBeenCalledWith('test');

    // Check in database
    const dbWord = await testDb!.collection('words').findOne({ _id: new ObjectId(res.body.wordId) });
    expect(dbWord).toBeTruthy();
    expect(dbWord?.embedding).toBeDefined();
    expect(dbWord?.search_count).toBe(0);
  });

  it('GET /api/words — lấy danh sách tất cả các từ', async () => {
    await testDb!.collection('words').insertMany([
      { word: 'one', meaning: 'một', pronunciation: '', example: '', search_count: 0 },
      { word: 'two', meaning: 'hai', pronunciation: '', example: '', search_count: 0 }
    ]);

    const res = await request(app).get('/api/words');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('GET /api/words/word?q=... — Tra cứu từ thành công, search_count tăng lên 1, không phân biệt chữ hoa thường', async () => {
    // 1. Seed a word into the database
    const wordDoc = {
      _id: new ObjectId("686000000000000000000001"),
      word: "hello",
      meaning: "xin chào",
      pronunciation: "/həˈloʊ/",
      example: "Hello, how are you?",
      search_count: 0
    };
    await testDb!.collection('words').insertOne(wordDoc);

    // 2. Tra cứu từ lần thứ nhất (chữ hoa thường và khoảng trắng thừa)
    const res1 = await request(app).get('/api/words/word?q=  HeLLo  ');
    expect(res1.status).toBe(200);
    expect(res1.body).toMatchObject({
      word: "hello",
      meaning: "xin chào",
      search_count: 1
    });

    // 3. Tra cứu từ lần thứ hai
    const res2 = await request(app).get('/api/words/word?q=hello');
    expect(res2.status).toBe(200);
    expect(res2.body.search_count).toBe(2);

    // 4. Kiểm tra trong database thật
    const dbWord = await testDb!.collection('words').findOne({ _id: wordDoc._id });
    expect(dbWord?.search_count).toBe(2);
  });

  it('GET /api/words/word?q=... — Trả về 404 khi không tìm thấy từ trong DB', async () => {
    const res = await request(app).get('/api/words/word?q=nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toHaveProperty('code', 'NOT_FOUND');
    expect(res.body.error.message).toContain('Word not found');
  });

  it('GET /api/words/word?q=... — Trả về 400 khi q rỗng', async () => {
    const res = await request(app).get('/api/words/word?q=   ');
    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });
});
