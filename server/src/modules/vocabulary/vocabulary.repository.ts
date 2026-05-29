import { getDB } from "../../config/db";

export async function insertWord(word: string, meaning: string) {
  const db = getDB();
  const collection = db.collection("words");

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

export async function findWordByQuery(query: string) {
  const db = getDB();
  const collection = db.collection('words');

  return collection.findOne({
    word: { $regex: new RegExp(`^${query}$`, 'i') }
  });
}

export async function incrementSearchCount(query: string) {
  const db = getDB();
  const collection = db.collection('words');

  await collection.updateOne(
    { word: { $regex: new RegExp(`^${query}$`, 'i') } },
    { $inc: { search_count: 1 } }
  );
}

export async function findAllWords() {
  const db = getDB();
  const collection = db.collection('words');
  return collection.find({}).toArray();
}