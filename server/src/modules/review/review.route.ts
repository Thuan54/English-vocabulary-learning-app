import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/error';
import { ReviewService } from './review.service';
import { DueReviewDTO } from './review.dto';

export const createReviewRouter = (service: ReviewService) => {
  const router = Router();

  // POST /reviews - Create a new review
  router.post('/', asyncHandler(async (req: Request, res: Response) => {
    const { wordId } = req.body;
    const result = await service.createReview(wordId);
    res.status(201).json(result);
  }));

  // POST /reviews/feedback - Submit review feedback
  router.post('/feedback', asyncHandler(async (req: Request, res: Response) => {
    const { wordReviewId, difficulty } = req.body;
    const result = await service.processReview(wordReviewId, difficulty);
    res.status(200).json(result);
  }));

  // GET /reviews/due - Get due reviews
  router.get('/due', asyncHandler(async (req: Request, res: Response) => {
    const dueReview = await service.getDueReviews();
    const result = dueReview.map((review) => ({
      wordReviewId: review.wordReviewId,
      wordId: review.wordId,
      word: review.word,
      meaning: review.meaning,
      nextReview: review.nextReview,
    }));
    res.status(200).json(result);
  }));

  return router;
};