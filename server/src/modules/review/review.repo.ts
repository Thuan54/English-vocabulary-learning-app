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
  private wordService: WordService;
  private wordReviewCollection: Collection;
  private reviewRecordsCollection: Collection;

  constructor(db: Db, wordService: WordService) {
    this.wordService = wordService;
    this.wordReviewCollection = db.collection('word_review');
    this.reviewRecordsCollection = db.collection('review_records');
  }

  // Create a review record and word_review entry
  async createReview(wordId: string)
    : Promise<{reviewId: string, nextReview: Date}> {

    // Create review_records entry
    const reviewRecord: ReviewRecordDocument = {
      reviewed_at: new Date(),
    };
    const reviewResult = await this.reviewRecordsCollection.insertOne(reviewRecord);
    const reviewId = reviewResult.insertedId.toString();

    // Create word_review entry
    const wordReview: WordReviewDocument = {
      reviewId: new ObjectId(reviewId),
      wordId: new ObjectId(wordId),
      nextReview: new Date(),
      interval: 1,
      ease: 2.5,
      repetition: 0,
    };
    const wordReviewResult = await this.wordReviewCollection.insertOne(wordReview);

    return {reviewId: reviewId, nextReview: wordReview.nextReview};
  }

  // Get word review by ID
  async getWordReviewById(wordReviewId: string): Promise<WordReviewDocument | null> {
    return this.wordReviewCollection.findOne<WordReviewDocument>({ _id: new ObjectId(wordReviewId) });
  }

  // Get all due reviews (where nextReview <= now and not mastered)
  async findDueReviews(): Promise<DueReviewDTO[]> {
  const date10_6 = new Date("2026-10-06T00:00:00Z");

  const result = this.wordReviewCollection
    .aggregate<DueReviewDTO>([
      {
        $match: {
          nextReview: { $lte: date10_6 },
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
  return result;
}

  // Update word_review after feedback
  async updateWordReview(
    wordReviewId: string,
    updates: {
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
  async recordReview(wordReviewId: string): Promise<void> {
    const reviewRecord: ReviewRecordDocument = {
      _id: new ObjectId(wordReviewId),
      reviewed_at: new Date(),
    };
    await this.reviewRecordsCollection.insertOne(reviewRecord);
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