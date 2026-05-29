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

import { processReview } from "./review.service";

const router = Router();

router.post("/review", async (req, res) => {
  try {
    // req.body chứa { cardId, difficulty } gửi từ client
    const result = await processReview(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({
      error: err.message
    });
  }
});

export default router;