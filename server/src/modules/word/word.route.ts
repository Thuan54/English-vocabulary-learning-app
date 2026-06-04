import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/error';
import { WordService } from './word.service';

export const createWordRouter = (service: WordService) => {
    const router = Router();

    // POST /word
    router.post('/', asyncHandler(async (req: Request, res: Response) => {
        const result = await service.createWord(req.body);
        res.status(201).json(result);
    }));

    // GET /words
    router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const result = await service.getWords();
        res.status(200).json(result);
    }));

    return router;
};