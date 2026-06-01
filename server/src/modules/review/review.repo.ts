import { Db, ObjectId, Collection } from 'mongodb';
import { ReviewInputDTO, ReviewResponseDTO } from './review.dto';

export class ReviewRepository {
  private collection: Collection;
  private static readonly TOO_EASY_EASE_THRESHOLD = 3.0;
  private static readonly MIN_REPETITION_FOR_MASTERED = 5;

  constructor(db: Db) {
    this.collection = db.collection('reviews');
  }

  async insert(dto: ReviewInputDTO): Promise<ReviewResponseDTO> {
    const doc = {
      wordId: new ObjectId(dto.wordId),
      nextReview: new Date(dto.nextReview),
      createdAt: new Date(),
    };
    const result = await this.collection.insertOne(doc);
    
    return {
      id: result.insertedId.toString(),
      wordId: dto.wordId,
      nextReview: doc.nextReview,
      createdAt: doc.createdAt,
    };
  }

  async findByWordId(wordId: string): Promise<any> {
    return this.collection.findOne({ wordId: new ObjectId(wordId) });
  }

  async updateReview(id: string, doc: any): Promise<void> {
    await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: doc });
  }

  async insertRaw(doc: any): Promise<void> {
    await this.collection.insertOne(doc);
  }

  async findDueReviews(): Promise<any[]> {
    const now = new Date();
    return this.collection.aggregate([
      {
        $match: {
          nextReview: { $lte: now },
          $or: [
            { srs: { $exists: false } },
            { srs: null },
            { 'srs.ease': { $lt: ReviewRepository.TOO_EASY_EASE_THRESHOLD } },
            { 'srs.repetition': { $lt: ReviewRepository.MIN_REPETITION_FOR_MASTERED } }
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
    ]).toArray();
  }
}