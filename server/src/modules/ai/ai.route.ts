import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/error';
import { AiService } from './ai.service';
import { validateString, normalizeWord } from '../../utils/validation';

export const createAiRouter = (service: AiService) => {
  const router = Router();

  router.post('/explain', asyncHandler(async (req: Request, res: Response) => {
    const rawWord = validateString(req.body.word, 'Word');
    const word = normalizeWord(rawWord);
    
    const result = await service.explainWord(word);
    
    res.status(200).json(result);
  }));

  return router;
};
