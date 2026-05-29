import { insertWord, findWordByQuery, incrementSearchCount, findAllWords } from './vocabulary.repository';
import { validateString, normalizeWord } from '../../utils/validation';
import { AppError } from '../../middleware/error';

/* =========================
   GET ALL WORDS
========================= */

export const getAllWords = async () => {
  return await findAllWords();
};

/* =========================
   CREATE WORD
========================= */

// src/modules/vocabulary/vocabulary.service.ts
export async function createWord(data: { word: string; meaning: string }) {
  const { word, meaning } = data;

  if (!word || !meaning) {
    throw new Error("Invalid input");
  }

  return await insertWord(word, meaning);
}

/* =========================
   LOOKUP WORD — Issue #8
========================= */
export async function lookupWord(query: unknown) {
  // 1. Validate: query không được rỗng
  const rawQuery = validateString(query, 'query');

  // 2. Normalize: lowercase, trim, bỏ ký tự đặc biệt
  const normalized = normalizeWord(rawQuery);

  // 3. Tìm trong DB
  const word = await findWordByQuery(normalized);

  // 4. Không tìm thấy → trả lỗi 404
  if (!word) {
    throw new AppError(`Word "${normalized}" not found`, 'NOT_FOUND', 404);
  }

  // 5. Tăng search_count
  await incrementSearchCount(normalized);

  return word;
}