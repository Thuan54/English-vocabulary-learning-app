import { ReviewService } from '../review.service';
import { ReviewRepository } from '../review.repo';
import { AppError } from '../../../middleware/error';

describe('ReviewService Unit', () => {
    let mockRepo: jest.Mocked<ReviewRepository>;
    let service: ReviewService;

    beforeEach(() => {
        mockRepo = { insert: jest.fn() } as any;
        service = new ReviewService(mockRepo);
    });

    it('validates input and calls repo with correct data', async () => {
        const wordId = '507f1f77bcf86cd799439011';
        const nextReview = '2026-04-14T00:00:00Z';
        mockRepo.insert.mockResolvedValue({ id: '1', wordId, nextReview: new Date(nextReview), createdAt: new Date() });

        const result = await service.createReview(wordId, nextReview);

        expect(mockRepo.insert).toHaveBeenCalledWith({ wordId, nextReview });
        expect(result).toHaveProperty('id');
        expect(result.wordId).toBe(wordId);
    });

    it('throws VALIDATION_ERROR for missing or invalid wordId', async () => {
        await expect(service.createReview(null, '2026-04-14T00:00:00Z')).rejects.toThrow(AppError);
        await expect(service.createReview('not-an-objectid', '2026-04-14T00:00:00Z')).rejects.toThrow(AppError);
    });

    it('throws VALIDATION_ERROR for invalid nextReview date', async () => {
        await expect(service.createReview('507f1f77bcf86cd799439011', 'not-a-date')).rejects.toThrow(AppError);
    });
});