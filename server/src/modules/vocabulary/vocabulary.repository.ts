import { getDB } from "../../config/db";

export async function insertWord(word: string, meaning: string) {
  const db = getDB();
  const collection = db.collection("vocabulary");

  const result = await collection.insertOne({
    word,
    meaning,
    createdAt: new Date()
  });

  return {
    id: result.insertedId,
    word,
    meaning
  };
}