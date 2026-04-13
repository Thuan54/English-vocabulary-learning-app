import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/error';
import { ReviewService } from './review.service';

export const createReviewRouter = (service: ReviewService) => {
  const router = Router();

  router.post('/', asyncHandler(async (req: Request, res: Response) => {
    const { wordId, nextReview } = req.body;
    const result = await service.createReview(wordId, nextReview);
    res.status(201).json(result);
  }));

  return router;
};