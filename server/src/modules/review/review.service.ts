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
}