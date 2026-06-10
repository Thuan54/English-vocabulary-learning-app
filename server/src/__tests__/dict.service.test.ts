import { DictService } from '../modules/dictionary/dict.service';

describe('DictService Unit Tests', () => {
  let originalEnv: NodeJS.ProcessEnv;
  let originalFetch: typeof fetch;

  beforeAll(() => {
    originalEnv = { ...process.env };
    originalFetch = global.fetch;
  });

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      DICT_API_URL: 'http://dict.com',
      TRANSLATE_URL: 'http://translate.com/'
    };
  });

  afterAll(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  it('constructor — ném Error khi thiếu DICT_API_URL', () => {
    delete process.env.DICT_API_URL;
    expect(() => new DictService()).toThrow('DICT_API_URL is not defined in environment variables');
  });

  it('fetchWordSearch — Gọi API ngoài và trả về định nghĩa đã dịch', async () => {
    const mockWordResult = { definition: 'some english definition', word: 'hello' };
    const mockTranslationResult = ['xin chào'];

    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockWordResult)
      } as any)
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockTranslationResult)
      } as any);

    const service = new DictService();
    const result = await service.fetchWordSearch('hello');

    expect(global.fetch).toHaveBeenNthCalledWith(1, 'http://dict.com?word=hello');
    expect(global.fetch).toHaveBeenNthCalledWith(2, 'http://translate.com/some english definition');
    expect(result).toEqual({
      word: 'hello',
      definition: 'xin chào'
    });
  });
});
