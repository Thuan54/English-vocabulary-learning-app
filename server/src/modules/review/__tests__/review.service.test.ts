import { ReviewService } from '../review.service';
import { ReviewRepository } from '../review.repo';
import { WordRepository } from '../../word/word.repo';
import { AppError } from '../../../middleware/error';
import { ObjectId } from 'mongodb';

describe('ReviewService Unit', () => {
    let mockRepo: jest.Mocked<ReviewRepository>;
    let mockWordRepo: jest.Mocked<WordRepository>;
    let service: ReviewService;

    beforeEach(() => {
        mockRepo = {
            insert: jest.fn(),
            findDueReviews: jest.fn(),
            findByWordId: jest.fn(),
            updateReview: jest.fn(),
            insertRaw: jest.fn(),
        } as any;
        mockWordRepo = {
            updateReviewData: jest.fn()
        } as any;
        service = new ReviewService(mockRepo, mockWordRepo);
    });

    describe('createReview', () => {
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

    describe('getDueReviews', () => {
        it('should return due reviews with all fields filled', async () => {
            const mockDbResult = [
                {
                    wordId: new ObjectId('507f1f77bcf86cd799439011'),
                    nextReview: new Date('2026-04-14T00:00:00Z'),
                    srs: { interval: 1, repetition: 0, ease: 2.5 },
                    wordDetails: {
                        word: 'hello',
                        meaning: 'xin chào',
                        pronunciation: '/həˈloʊ/',
                        examples: ['hello world'],
                        synonyms: ['hi'],
                        topics: ['greeting']
                    }
                }
            ];
            mockRepo.findDueReviews.mockResolvedValue(mockDbResult);

            const result = await service.getDueReviews();

            expect(result).toEqual([
                {
                    id: '507f1f77bcf86cd799439011',
                    word: 'hello',
                    meaning: 'xin chào',
                    pronunciation: '/həˈloʊ/',
                    examples: ['hello world'],
                    synonyms: ['hi'],
                    topics: ['greeting'],
                    nextReview: mockDbResult[0].nextReview,
                    srs: { interval: 1, repetition: 0, ease: 2.5 }
                }
            ]);
        });

        it('should return due reviews with default values for missing optional fields', async () => {
            const mockDbResult = [
                {
                    wordId: new ObjectId('507f1f77bcf86cd799439011'),
                    nextReview: new Date('2026-04-14T00:00:00Z'),
                    srs: undefined,
                    wordDetails: {
                        word: 'hello',
                        meaning: 'xin chào',
                    }
                }
            ];
            mockRepo.findDueReviews.mockResolvedValue(mockDbResult);

            const result = await service.getDueReviews();

            expect(result).toEqual([
                {
                    id: '507f1f77bcf86cd799439011',
                    word: 'hello',
                    meaning: 'xin chào',
                    pronunciation: '',
                    examples: [],
                    synonyms: [],
                    topics: [],
                    nextReview: mockDbResult[0].nextReview,
                    srs: undefined
                }
            ]);
        });
    });

    describe('processReview', () => {
        const wordId = '507f1f77bcf86cd799439011';

        it('throws AppError for invalid wordId', async () => {
            await expect(service.processReview('invalid-id', 'easy')).rejects.toThrow(AppError);
        });

        it('throws AppError for invalid difficulty', async () => {
            await expect(service.processReview(wordId, 'invalid-difficulty')).rejects.toThrow(AppError);
        });

        it('handles difficulty "forget" for new reviews', async () => {
            mockRepo.findByWordId.mockResolvedValue(null);
            
            const result = await service.processReview(wordId, 'forget');
            
            expect(mockRepo.insertRaw).toHaveBeenCalledWith(expect.objectContaining({
                wordId: new ObjectId(wordId),
                srs: { interval: 0, repetition: 0, ease: 2.5 }
            }));
            expect(result.message).toBe('Review submitted successfully');
        });

        it('handles difficulty "again" for existing reviews', async () => {
            const existingReview = {
                _id: new ObjectId(),
                wordId: new ObjectId(wordId),
                nextReview: new Date(),
                srs: { interval: 6, repetition: 2, ease: 2.3 }
            };
            mockRepo.findByWordId.mockResolvedValue(existingReview);

            await service.processReview(wordId, 'again');

            expect(mockRepo.updateReview).toHaveBeenCalledWith(
                existingReview._id.toString(),
                expect.objectContaining({
                    srs: { interval: 0, repetition: 0, ease: 2.3 }
                })
            );
        });

        it('handles difficulty "easy" for new reviews', async () => {
            mockRepo.findByWordId.mockResolvedValue(null);

            await service.processReview(wordId, 'easy');

            expect(mockRepo.insertRaw).toHaveBeenCalledWith(expect.objectContaining({
                srs: { interval: 1, repetition: 1, ease: 2.65 } // 2.5 + 0.15
            }));
        });

        it('handles difficulty "hard" for existing reviews with repetition = 0', async () => {
            const existingReview = {
                _id: new ObjectId(),
                wordId: new ObjectId(wordId),
                srs: { interval: 1, repetition: 0, ease: 2.5 }
            };
            mockRepo.findByWordId.mockResolvedValue(existingReview);

            await service.processReview(wordId, 'hard');

            expect(mockRepo.updateReview).toHaveBeenCalledWith(
                existingReview._id.toString(),
                expect.objectContaining({
                    srs: { interval: 1, repetition: 1, ease: 2.35 } // repetition was 0, so interval becomes 1, and repetition becomes 1
                })
            );
        });

        it('handles difficulty "medium" for existing reviews with repetition = 1', async () => {
            const existingReview = {
                _id: new ObjectId(),
                wordId: new ObjectId(wordId),
                srs: { interval: 6, repetition: 1, ease: 2.5 }
            };
            mockRepo.findByWordId.mockResolvedValue(existingReview);

            await service.processReview(wordId, 'medium');

            expect(mockRepo.updateReview).toHaveBeenCalledWith(
                existingReview._id.toString(),
                expect.objectContaining({
                    srs: { interval: 6, repetition: 2, ease: 2.5 } // repetition was 1, so interval becomes 6, and repetition becomes 2
                })
            );
        });

        it('ensures ease does not drop below 1.3', async () => {
            const existingReview = {
                _id: new ObjectId(),
                wordId: new ObjectId(wordId),
                srs: { interval: 15, repetition: 2, ease: 1.4 }
            };
            mockRepo.findByWordId.mockResolvedValue(existingReview);

            await service.processReview(wordId, 'hard');

            expect(mockRepo.updateReview).toHaveBeenCalledWith(
                existingReview._id.toString(),
                expect.objectContaining({
                    srs: { interval: 21, repetition: 3, ease: 1.3 } // Math.round(15 * 1.4) = 21, ease is capped at 1.3 (1.4 - 0.15 = 1.25 -> 1.3)
                })
            );
        });
        it('marks the word as learned once it reaches mastery', async () => {
            const existingReview = {
                _id: new ObjectId(),
                wordId: new ObjectId(wordId),
                srs: { interval: 15, repetition: 4, ease: 2.9 }
            };
            mockRepo.findByWordId.mockResolvedValue(existingReview);

            await service.processReview(wordId, 'easy');

            expect(mockWordRepo.updateReviewData).toHaveBeenCalledWith(
                wordId,
                expect.objectContaining({
                    category: 'learned',
                    reviewCount: 5,
                    nextReview: expect.any(Date),
                    lastReviewed: expect.any(Date)
                })
            );
        });    });
});