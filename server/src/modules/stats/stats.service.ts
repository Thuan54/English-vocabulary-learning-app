import { StatsRepository } from './stats.repo';

export class StatsService {
  constructor(private repo: StatsRepository) {}

  async getStats() {
    const [words, wordReviews, reviewRecords] = await Promise.all([
      this.repo.countWords(),
      this.repo.countWordReviews(),
      this.repo.countReviewRecords(),
    ]);
    return {
      totalWords: words,
      totalWordReviews: wordReviews,
      totalReviewRecords: reviewRecords,
    };
  }
}