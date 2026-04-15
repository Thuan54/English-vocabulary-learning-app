import { Db } from 'mongodb';

export class StatsRepository {
  constructor(private db: Db) {}

  async countWords(): Promise<number> {
    return this.db.collection('words').countDocuments();
  }

  async countReviews(): Promise<number> {
    return this.db.collection('reviews').countDocuments();
  }
}