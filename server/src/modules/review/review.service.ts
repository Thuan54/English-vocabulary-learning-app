import { ObjectId } from 'mongodb';
import { ReviewRepository } from './review.repo';
import { ReviewResponseDTO } from './review.dto';
import { validateString } from '../../utils/validation';
import { AppError } from '../../middleware/error';

export class ReviewService {
  constructor(private repo: ReviewRepository) {}

  async createReview(rawWordId: unknown, rawNextReview: unknown): Promise<ReviewResponseDTO> {
    const wordId = validateString(rawWordId, 'wordId');
    if (!ObjectId.isValid(wordId)) {
      throw new AppError('Invalid wordId format', 'VALIDATION_ERROR', 400);
    }

    const nextReviewStr = validateString(rawNextReview, 'nextReview');
    const nextReviewDate = new Date(nextReviewStr);
    if (isNaN(nextReviewDate.getTime())) {
      throw new AppError('Invalid nextReview date', 'VALIDATION_ERROR', 400);
    }

    return this.repo.insert({ wordId: wordId, nextReview: nextReviewStr });
  }

  async getDueReviews(): Promise<any[]> {
    const reviews = await this.repo.findDueReviews();
    return reviews.map(r => ({
      id: r.wordId.toString(),
      word: r.wordDetails.word,
      meaning: r.wordDetails.meaning,
      pronunciation: r.wordDetails.pronunciation || '',
      examples: r.wordDetails.examples || [],
      synonyms: r.wordDetails.synonyms || [],
      topics: r.wordDetails.topics || [],
      nextReview: r.nextReview,
      srs: r.srs
    }));
  }

  async processReview(rawWordId: unknown, rawDifficulty: unknown): Promise<any> {
    const wordId = validateString(rawWordId, 'wordId');
    if (!ObjectId.isValid(wordId)) {
      throw new AppError('Invalid wordId format', 'VALIDATION_ERROR', 400);
    }

    const difficulty = validateString(rawDifficulty, 'difficulty');
    const allowedDifficulties = ['easy', 'medium', 'hard', 'forget', 'again'];
    if (!allowedDifficulties.includes(difficulty)) {
      throw new AppError('Invalid difficulty level', 'VALIDATION_ERROR', 400);
    }

    const review = await this.repo.findByWordId(wordId);
    let interval = 1;
    let repetition = 0;
    let ease = 2.5;

    if (review && review.srs) {
      interval = review.srs.interval || 1;
      repetition = review.srs.repetition || 0;
      ease = review.srs.ease || 2.5;
    }

    if (difficulty === 'forget' || difficulty === 'again') {
      repetition = 0;
      interval = 0;
    } else {
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * ease);
      }
      repetition++;
    }

    if (difficulty === 'easy') ease += 0.15;
    else if (difficulty === 'hard') ease -= 0.15;
    if (ease < 1.3) ease = 1.3;

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    const doc = {
      wordId: new ObjectId(wordId),
      nextReview,
      srs: { interval, repetition, ease },
      createdAt: new Date()
    };

    if (review) {
      await this.repo.updateReview(review._id.toString(), doc);
    } else {
      await this.repo.insertRaw(doc);
    }

    return { message: 'Review submitted successfully', nextReview };
  }
}