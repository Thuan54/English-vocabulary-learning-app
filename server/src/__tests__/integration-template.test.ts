import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { startTestDB, clearTestDB, stopTestDB, testDb, ObjectId} from '../test/db-test-helper';
import { errorHandler } from '../middleware/error.middleware';
import { validateNumber, validateString } from '../utils/validation';

// Replace with your actual feature router import
const featureRouter = Router();
featureRouter.post('/items', async (req, res, next) => {
  try {
    const collection = testDb!.collection('items');
    const name = validateString(req.body.name);
    const value = validateNumber(req.body.value);
    const { insertedId } = await collection.insertOne({name,value});
    res.status(201).json({id: insertedId, ...req.body});
  } catch (err) {
    next(err);
  }
});

const app = express();
app.use(express.json());
app.use('/api', featureRouter);
app.use(errorHandler);

beforeAll(async () => { await startTestDB(); });
beforeEach(async () => { await clearTestDB(); });
afterAll(async () => { await stopTestDB(); });

describe('Feature Integration', () => {
  it('persists valid payload and returns 201', async () => {
    const payload = { name: 'test', value: 42 };
    const res = await request(app).post('/api/items').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'test', value: 42 });
    expect(res.body).toHaveProperty('id');

    // Verify actual DB state
    const doc = await testDb!.collection('items').findOne({ _id: new ObjectId(res.body.id) });
    expect(doc).toBeTruthy();
    expect(doc?.value).toBe(42);
  });

  it('returns 400 on missing required fields', async () => {
    const res = await request(app).post('/api/items').send({ name: 'incomplete' });
    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });
});