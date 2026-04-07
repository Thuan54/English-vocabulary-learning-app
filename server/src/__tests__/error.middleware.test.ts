import request from 'supertest';
import express, { Request, Response } from 'express';
import { errorHandler } from '../middleware/error.middleware';
import { AppError } from '../middleware/app-error';
import { asyncHandler } from '../middleware/async-handler';

const app = express();
app.use(express.json());

// Mock routes to trigger different error types
app.get('/sync', () => { throw new AppError('Not found', 'NOT_FOUND', 404); });
app.get('/async', asyncHandler(async () => { throw new AppError('DB unavailable', 'DB_ERROR', 503); }));
app.get('/unknown', () => { throw new Error('Unexpected crash'); });

app.use(errorHandler);

describe('Centralized Error Handling', () => {
  it('returns 404 with consistent format for AppError', async () => {
    const res = await request(app).get('/sync');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: { message: 'Not found', code: 'NOT_FOUND' } });
  });

  it('catches async errors and returns consistent format', async () => {
    const res = await request(app).get('/async');
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ error: { message: 'DB unavailable', code: 'DB_ERROR' } });
  });

  it('falls back to 500 INTERNAL_ERROR for unknown errors', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: { message: 'Unexpected crash', code: 'INTERNAL_ERROR' } });
  });
});