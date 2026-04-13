import { StatsService } from '../stats.service';
import { StatsRepository } from '../stats.repo';

describe('StatsService Unit', () => {
    let mockRepo: jest.Mocked<StatsRepository>;
    let service: StatsService;

    beforeEach(() => {
        mockRepo = { countWords: jest.fn(), countReviews: jest.fn() } as any;
        service = new StatsService(mockRepo);
    });

    it('aggregates counts from repository and returns correct shape', async () => {
        mockRepo.countWords.mockResolvedValue(42);
        mockRepo.countReviews.mockResolvedValue(7);

        const result = await service.getStats();

        expect(result).toEqual({ words: 42, reviews: 7 });
        expect(mockRepo.countWords).toHaveBeenCalledTimes(1);
        expect(mockRepo.countReviews).toHaveBeenCalledTimes(1);
    });
});