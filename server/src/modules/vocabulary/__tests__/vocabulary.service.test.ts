import { createWord } from "../vocabulary.service";

jest.mock("../vocabulary.repository", () => ({
  insertWord: jest.fn().mockResolvedValue({ id: "123", word: "apple", meaning: "a fruit" })
}));

describe("createWord", () => {

  it("should create word", async () => {

    const result = await createWord({
      word: "apple",
      meaning: "a fruit"
    });

    expect(result.word).toBe("apple");

  });

  it("should throw error if input is invalid", async () => {
    // Thêm meaning: "" để khớp với định nghĩa của hàm createWord
    await expect(
      createWord({ word: "", meaning: "" })
    ).rejects.toThrow("Invalid input");
  });

});

import { lookupWord } from '../vocabulary.service';
import { findWordByQuery, incrementSearchCount } from '../vocabulary.repository';

jest.mock('../vocabulary.repository', () => ({
  insertWord: jest.fn().mockResolvedValue({ id: '123', word: 'apple', meaning: 'a fruit' }),
  findWordByQuery: jest.fn(),
  incrementSearchCount: jest.fn().mockResolvedValue(undefined),
}));

const mockFindWord = findWordByQuery as jest.MockedFunction<typeof findWordByQuery>;

describe('lookupWord', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('trả về từ khi tìm thấy', async () => {
    mockFindWord.mockResolvedValue({
      _id: '1', word: 'apple', meaning: 'a fruit', search_count: 0
    } as any);

    const result = await lookupWord('apple');
    expect(result.word).toBe('apple');
  });

  it('tăng search_count khi tìm thấy từ', async () => {
    mockFindWord.mockResolvedValue({
      _id: '1', word: 'apple', meaning: 'a fruit', search_count: 0
    } as any);

    await lookupWord('apple');
    expect(incrementSearchCount).toHaveBeenCalledTimes(1);
  });

  it('throw 404 khi không tìm thấy từ', async () => {
    mockFindWord.mockResolvedValue(null);

    await expect(lookupWord('xyz123')).rejects.toMatchObject({
      statusCode: 404
    });
  });

  it('throw 400 khi query rỗng', async () => {
    await expect(lookupWord('')).rejects.toMatchObject({
      statusCode: 400
    });
  });

  it('throw 400 khi query không phải string', async () => {
    await expect(lookupWord(undefined)).rejects.toMatchObject({
      statusCode: 400
    });
  });

  it('không tăng search_count khi không tìm thấy từ', async () => {
    mockFindWord.mockResolvedValue(null);

    await expect(lookupWord('notexist')).rejects.toThrow();
    expect(incrementSearchCount).not.toHaveBeenCalled();
  });

});