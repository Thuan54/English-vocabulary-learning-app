import { StatsRepository } from './stats.repo';

export class StatsService {
  constructor(private repo: StatsRepository) {}

  async getStats() {
    const [words, reviews] = await Promise.all([
      this.repo.countWords(),
      this.repo.countReviews(),
    ]);
    return { words, reviews };
  }
}