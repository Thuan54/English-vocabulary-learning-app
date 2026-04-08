import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, Db, ObjectId } from 'mongodb';

let mongoServer: MongoMemoryServer | null = null;
let client: MongoClient | null = null;
export let testDb: Db | null = null;
export {ObjectId}

/** Start in-memory DB once per test suite */
export async function startTestDB(): Promise<void> {
  if (mongoServer) return; // Prevent duplicate starts in parallel runs
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  client = new MongoClient(uri);
  await client.connect();
  testDb = client.db('integration_test');
}

/** Reset all collections between tests */
export async function clearTestDB(): Promise<void> {
  if (!testDb) return;
  const collections = await testDb.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
}

/** Stop DB after suite */
export async function stopTestDB(): Promise<void> {
  if (client) await client.close();
  if (mongoServer) await mongoServer.stop();
  client = null;
  mongoServer = null;
  testDb = null;
}