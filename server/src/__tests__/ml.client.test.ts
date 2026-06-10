import { MlClient } from '../modules/ai/ml.client';
import { AppError } from '../middleware/error';

describe('MlClient Unit Tests', () => {
  let client: MlClient;
  let originalFetch: typeof fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  beforeEach(() => {
    client = new MlClient('http://localhost:8001');
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('constructor — loại bỏ dấu gạch chéo cuối URL', () => {
    const clientWithSlash = new MlClient('http://localhost:8001/');
    expect((clientWithSlash as any).baseUrl).toBe('http://localhost:8001');
  });

  it('explainWord — Gọi đúng POST /explain/ và trả về giải nghĩa', async () => {
    const mockResponse = { explanation: 'test explanation' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await client.explainWord('test');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8001/explain/',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: 'test', text: 'test' }),
      })
    );
    expect(result).toEqual({ explanation: 'test explanation' });
  });

  it('getEmbedding — Gọi đúng POST /embedding/ và trả về vector', async () => {
    const mockResponse = { embedding: [0.1, 0.2] };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await client.getEmbedding('hello');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8001/embedding/?word=hello',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
    );
    expect(result).toEqual([0.1, 0.2]);
  });

  it('suggestTags — Gọi đúng POST /search/ và trả về tags', async () => {
    const mockResponse = { top_results: [{ word: 'dog', score: 0.9 }] };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await client.suggestTags('pet', 5);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8001/search/',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'pet', top_k: 5 }),
      })
    );
    expect(result).toEqual([{ word: 'dog', score: 0.9 }]);
  });

  it('post helper — ném AppError 503 khi fetch bị thất bại kết nối', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Connection refused'));

    await expect(client.explainWord('test')).rejects.toThrow(AppError);
    await expect(client.explainWord('test')).rejects.toThrow('Không thể kết nối đến ML server');
  });

  it('post helper — ném AppError 502 khi response status không ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue('Internal error detail'),
    } as any);

    await expect(client.explainWord('test')).rejects.toThrow(AppError);
    await expect(client.explainWord('test')).rejects.toThrow('ML server trả lỗi 500');
  });
});
