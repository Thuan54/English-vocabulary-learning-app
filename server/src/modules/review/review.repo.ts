import { Db, ObjectId, Collection } from 'mongodb';
import {
  WordReviewDocument,
  ReviewRecordDocument,
  DueReviewDTO,
  CreateReviewInputDTO,
} from './review.dto';
import { WordResponseDTO } from '../word/word.dto';
import { WordService } from '../word/word.service';

export class ReviewRepository {
  private wordReviewCollection: Collection;
  private reviewRecordsCollection: Collection;

  constructor(db: Db) {
    this.wordReviewCollection = db.collection('word_review');
    this.reviewRecordsCollection = db.collection('review_records');
  }

  // Create a review record and word_review entry
  async createReview(wordId: string)
    : Promise<{wordReviewId: string, nextReview: Date}> {

    const reviewId = null;

    // Create word_review entry
    const wordReview: WordReviewDocument = {
      reviewId: null,
      wordId: new ObjectId(wordId),
      nextReview: new Date(),
      interval: 1,
      ease: 2.5,
      repetition: 0,
    };
    const res = await this.wordReviewCollection.insertOne(wordReview);

    return {wordReviewId: res.insertedId.toString(),nextReview: wordReview.nextReview};
  }

  // Get word review by ID
  async getWordReviewById(wordReviewId: string): Promise<WordReviewDocument | null> {
    return this.wordReviewCollection.findOne<WordReviewDocument>({ _id: new ObjectId(wordReviewId) });
  }

  // Get all due reviews (where nextReview <= now and not mastered)
  async findDueReviews(): Promise<DueReviewDTO[]> {
  const now = new Date();

  const result = this.wordReviewCollection
    .aggregate<DueReviewDTO>([
      {
        $match: {
          nextReview: { $lte: now },
          $or: [
            { repetition: { $lt: 5 } },
            { ease: { $lt: 3.0 } }
          ]
        }
      },
      {
        $lookup: {
          from: "words",
          localField: "wordId",
          foreignField: "_id",
          as: "word"
        }
      },
      {
        $unwind: "$word"
      },
      {
        $project: {
          _id: 0,
          wordReviewId: { $toString: "$_id" },
          wordId: { $toString: "$word._id" },
          meaning: "$word.meaning",
          word: "$word.word",
          nextReview: 1
        }
      }
    ])
    .toArray();
  if(!result) return []
  return result;
}

  // Get all learned words (repetition >= 1) with their embeddings and details
  async getLearnedWordsWithEmbeddings(): Promise<(WordResponseDTO & { embedding?: number[] })[]> {
    const result = await this.wordReviewCollection
      .aggregate<any>([
        {
          $match: {
            repetition: { $gte: 1 }
          }
        },
        {
          $lookup: {
            from: "words",
            localField: "wordId",
            foreignField: "_id",
            as: "word"
          }
        },
        {
          $unwind: "$word"
        },
        {
          $project: {
            _id: 0,
            wordId: { $toString: "$word._id" },
            word: "$word.word",
            meaning: "$word.meaning",
            pronunciation: "$word.pronunciation",
            example: "$word.example",
            embedding: "$word.embedding",
            search_count: "$word.search_count"
          }
        }
      ])
      .toArray();

    return result || [];
  }

  // Update word_review after feedback
  async updateWordReview(
    wordReviewId: string,
    updates: {
      reviewId: ObjectId,
      nextReview: Date;
      interval: number;
      ease: number;
      repetition: number;
    }
  ): Promise<void> {
    await this.wordReviewCollection.updateOne(
      { _id: new ObjectId(wordReviewId) },
      { $set: updates }
    );
  }

  // Create a review_record entry
  async recordReview(wordId: ObjectId): Promise<ObjectId> {
    const reviewRecord: ReviewRecordDocument = {
      wordId: wordId,
      reviewed_at: new Date(),
    };
    const res = await this.reviewRecordsCollection.insertOne(reviewRecord);
    return res.insertedId;
  }

  // Get review history count for stats
  async countReviewRecords(): Promise<number> {
    return this.reviewRecordsCollection.countDocuments();
  }

  // Get total reviews (word_review entries) for stats
  async countWordReviews(): Promise<number> {
    return this.wordReviewCollection.countDocuments();
  }
}