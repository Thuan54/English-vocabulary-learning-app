import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/error';
import { StatsService } from './stats.service';

export const createStatsRouter = (service: StatsService) => {
  const router = Router();

  router.get('/', asyncHandler(async (_req: Request, res: Response) => {
    const stats = await service.getStats();
    res.status(200).json(stats);
  }));

  return router;
};