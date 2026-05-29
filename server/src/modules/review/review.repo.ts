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
      { $match: { nextReview: { $lte: now } } },
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

import { getDB } from "../../config/db";

export async function findCardById(cardId: string) {
  const db = getDB();
  // Tìm từ vựng trong collection vocabulary
  return await db.collection("vocabulary").findOne({ _id: new ObjectId(cardId) });
}

export async function updateCardReview(
  cardId: string, 
  updateData: { lastReviewed: Date; nextReview: Date; reviewCount: number }
) {
  const db = getDB();
  return await db.collection("vocabulary").updateOne(
    { _id: new ObjectId(cardId) },
    { $set: updateData }
  );
}