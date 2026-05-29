import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/error';
import { ReviewService } from './review.service';

export const createReviewRouter = (service: ReviewService) => {
  const router = Router();

  router.post('/', asyncHandler(async (req: Request, res: Response) => {
    const { wordId, nextReview, difficulty } = req.body;
    if (difficulty !== undefined) {
      const result = await service.processReview(wordId, difficulty);
      res.status(200).json(result);
    } else {
      const result = await service.createReview(wordId, nextReview);
      res.status(201).json(result);
    }
  }));

  router.get('/due', asyncHandler(async (req: Request, res: Response) => {
    const result = await service.getDueReviews();
    res.status(200).json(result);
  }));

  return router;
};