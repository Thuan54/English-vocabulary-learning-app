import { ObjectId } from 'mongodb';
import { ReviewRepository } from './review.repo';
import { WordService } from '../word/word.service';
import {
  CreateReviewResponseDTO,
  DueReviewDTO,
  ReviewFeedbackDTO,
} from './review.dto';
import { validateString } from '../../utils/validation';
import { AppError } from '../../middleware/error';

export class ReviewService {
  private static readonly MASTERED_EASE = 3.0;
  private static readonly MASTERED_REPETITION = 5;

  constructor(private reviewRepo: ReviewRepository, private wordService: WordService) {}

  async createReview(rawWordId: unknown): Promise<CreateReviewResponseDTO> {
    const wordId = validateString(rawWordId, 'wordId');
    if (!ObjectId.isValid(wordId)) {
      throw new AppError('Invalid wordId format', 'VALIDATION_ERROR', 400);
    }

    // Verify word exists
    const word = await this.wordService.getWordById(wordId);
    if (!word) {
      throw new AppError('Word not found', 'NOT_FOUND', 404);
    }

    // Create review records
    const {reviewId, nextReview} = await this.reviewRepo.createReview(wordId);

    return {
      wordId: word.wordId,
      reviewId: reviewId,
      word: word.word,
      meaning: word.meaning,
      nextReview: nextReview,
    };
  }

  async getDueReviews(): Promise<DueReviewDTO[]> {
    return this.reviewRepo.findDueReviews();
  }

  async processReview(
    rawWordReviewId: unknown,
    rawDifficulty: unknown
  ): Promise<{ message: string }> {
    const wordReviewId = validateString(rawWordReviewId, 'wordReviewId');
    if (!ObjectId.isValid(wordReviewId)) {
      throw new AppError('Invalid wordReviewId format', 'VALIDATION_ERROR', 400);
    }

    const difficulty = validateString(rawDifficulty, 'difficulty');
    const allowedDifficulties = ['easy', 'medium', 'hard', 'forget'];
    if (!allowedDifficulties.includes(difficulty)) {
      throw new AppError('Invalid difficulty level', 'VALIDATION_ERROR', 400);
    }

    // Get current word review
    const wordReview = await this.reviewRepo.getWordReviewById(wordReviewId);
    if (!wordReview) {
      throw new AppError('Word review not found', 'NOT_FOUND', 404);
    }

    // Calculate SRS metrics
    const srsUpdate = this.calculateSRS(
      wordReview.interval,
      wordReview.repetition,
      wordReview.ease,
      difficulty as 'easy' | 'medium' | 'hard' | 'forget'
    );

    // Update word_review
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + srsUpdate.interval);

    await this.reviewRepo.updateWordReview(wordReviewId, {
      nextReview,
      interval: srsUpdate.interval,
      ease: srsUpdate.ease,
      repetition: srsUpdate.repetition,
    });

    // Record the review
    await this.reviewRepo.recordReview(wordReviewId);

    return { message: 'Review processed successfully' };
  }

  private calculateSRS(
    interval: number,
    repetition: number,
    ease: number,
    difficulty: 'easy' | 'medium' | 'hard' | 'forget'
  ): { interval: number; repetition: number; ease: number } {
    let newInterval = interval;
    let newRepetition = repetition;
    let newEase = ease;

    if (difficulty === 'forget') {
      newRepetition = 0;
      newInterval = 0;
    } else {
      if (newRepetition === 0) {
        newInterval = 1;
      } else if (newRepetition === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(newInterval * newEase);
      }
      newRepetition++;
    }

    if (difficulty === 'easy') {
      newEase += 0.15;
    } else if (difficulty === 'hard') {
      newEase -= 0.15;
    }

    if (newEase < 1.3) {
      newEase = 1.3;
    }

    return {
      interval: newInterval,
      repetition: newRepetition,
      ease: newEase,
    };
  }
}
