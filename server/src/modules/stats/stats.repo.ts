import { Db } from 'mongodb';

export class StatsRepository {
  constructor(private db: Db) {}

  async countWords(): Promise<number> {
    return this.db.collection('words').countDocuments();
  }

  async countWordReviews(): Promise<number> {
    return this.db.collection('word_review').countDocuments();
  }

  async countReviewRecords(): Promise<number> {
    return this.db.collection('review_records').countDocuments();
  }
}