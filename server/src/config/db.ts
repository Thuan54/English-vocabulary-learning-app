import { MongoClient, Db } from "mongodb";

let db: Db;

export const connectDB = async (): Promise<Db> => {
  if (db) return db;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set");

  const client = new MongoClient(uri);
  try {
    await client.connect();
    db = client.db();
    console.log("MongoDB connected");
    return db;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error("DB not initialized. Call connectDB first.");
  }
  return db;
};