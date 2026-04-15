import { insertWord } from "./vocabulary.repository";

/* =========================
   GET ALL WORDS
========================= */

export const getAllWords = async () => {
  // nếu chưa có logic DB thì tạm return []
  return [];
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