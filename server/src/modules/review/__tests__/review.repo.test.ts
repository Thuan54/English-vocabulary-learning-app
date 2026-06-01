import { ReviewRepository } from '../review.repo';
import { Collection, Db } from 'mongodb';

describe('ReviewRepository', () => {
  let mockCollection: jest.Mocked<Collection>;
  let mockDb: jest.Mocked<Db>;
  let repository: ReviewRepository;

  beforeEach(() => {
    mockCollection = {
      aggregate: jest.fn()
    } as unknown as jest.Mocked<Collection>;

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    } as unknown as jest.Mocked<Db>;

    repository = new ReviewRepository(mockDb);
  });

  it('excludes mastered / too-easy reviews from due results', async () => {
    const toArray = jest.fn().mockResolvedValue([]);
    mockCollection.aggregate.mockReturnValue({ toArray } as any);

    await repository.findDueReviews();

    expect(mockCollection.aggregate).toHaveBeenCalledTimes(1);
    const pipeline = mockCollection.aggregate.mock.calls[0][0];

    expect(pipeline).toEqual([
      {
        $match: {
          nextReview: { $lte: expect.any(Date) },
          $or: [
            { srs: { $exists: false } },
            { srs: null },
            { 'srs.ease': { $lt: 3.0 } },
            { 'srs.repetition': { $lt: 5 } }
          ]
        }
      },
      {
        $lookup: {
          from: 'words',
          localField: 'wordId',
          foreignField: '_id',
          as: 'wordDetails'
        }
      },
      { $unwind: '$wordDetails' }
    ]);
  });
});
