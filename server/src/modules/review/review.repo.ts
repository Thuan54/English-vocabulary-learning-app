import { Db, ObjectId, Collection } from 'mongodb';
import { ReviewInputDTO, ReviewResponseDTO } from './review.dto';

export class ReviewRepository {
  private collection: Collection;

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
}