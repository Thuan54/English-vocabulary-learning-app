import request from 'supertest';
import express from 'express';
import { ObjectId } from 'mongodb';
import { startTestDB, clearTestDB, stopTestDB, testDb } from '../../../test/db-test-helper';
import { errorHandler } from '../../../middleware/error.middleware';
import { createReviewRouter } from '../review.route';
import { ReviewService } from '../review.service';
import { ReviewRepository } from '../review.repo';

const app = express();
app.use(express.json());

beforeAll(async () => {
  await startTestDB();
  // Wire dependencies once per suite
  const repo = new ReviewRepository(testDb!);
  const service = new ReviewService(repo);
  app.use('/api/reviews', createReviewRouter(service));
  app.use(errorHandler);
});
beforeEach(async () => await clearTestDB());
afterAll(async () => await stopTestDB());


describe('POST /api/reviews', () => {
  const validWordId = new ObjectId().toString();
  const validNextReview = new Date(Date.now() + 86400000).toISOString();

  it('stores review and returns 201 with linked wordId', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ wordId: validWordId, nextReview: validNextReview });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.wordId).toBe(validWordId);
    expect(new Date(res.body.nextReview).toISOString()).toBe(validNextReview);

    // Verify DB persistence
    const doc = await testDb!.collection('reviews').findOne({ wordId: new ObjectId(validWordId) });
    expect(doc).toBeTruthy();
    expect(doc?.nextReview.toISOString()).toBe(validNextReview);
  });

  it('returns 400 VALIDATION_ERROR when wordId is missing', async () => {
    const res = await request(app).post('/api/reviews').send({ nextReview: validNextReview });
    console.log(res.status)
    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({ message: 'wordId must be a non-empty string', code: 'VALIDATION_ERROR' });
  });

  it('returns 400 VALIDATION_ERROR when nextReview is invalid', async () => {
    const res = await request(app).post('/api/reviews').send({ wordId: validWordId, nextReview: 'not-a-date' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});