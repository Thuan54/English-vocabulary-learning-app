import express from 'express';
import request from 'supertest';
import { startTestDB, clearTestDB, stopTestDB, testDb } from '../../test/db-test-helper';
import { errorHandler } from '../../middleware/error.middleware';
import { WordRepository } from './word.repo';
import { WordService } from './word.service';
import { createWordRouter } from './word.route';

const app = express();
app.use(express.json());

beforeAll(async () => {
    await startTestDB();
    const repo = new WordRepository(testDb!);
    const service = new WordService(repo);
    app.use('/api/word', createWordRouter(service));
    app.use(errorHandler);
});

beforeEach(async () => await clearTestDB());
afterAll(async () => await stopTestDB());

describe('Word API', () => {
    it('should save synonyms & topics', async () => {
        const res = await request(app)
            .post('/api/word')
            .send({
                word: 'apple',
                meaning: 'fruit',
                synonyms: ['fruit'],
                topics: ['food']
            });

        expect(res.status).toBe(201);
        expect(res.body.synonyms).toEqual(['fruit']);
        expect(res.body.topics).toEqual(['food']);
    });

    it('should return words with arrays', async () => {
        await testDb!.collection('words').insertOne({
            word: 'banana',
            meaning: 'fruit',
            synonyms: ['fruit'],
            topics: ['food'],
            createdAt: new Date()
        });

        const res = await request(app).get('/api/word');

        expect(res.status).toBe(200);
        expect(res.body[0].synonyms).toEqual(['fruit']);
    });
});