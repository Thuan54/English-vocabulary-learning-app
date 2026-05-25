import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/error';
import { AiService } from './ai.service';
<<<<<<< HEAD
import { validateString, validateNumber, normalizeWord } from '../../utils/validation';
=======
import { validateString, normalizeWord } from '../../utils/validation';
>>>>>>> ducquan

export const createAiRouter = (service: AiService) => {
  const router = Router();

<<<<<<< HEAD
  /**
   * POST /api/ai/explain
   * Body: { word: string }
   * Response: { explanation: string }
   */
  router.post('/explain', asyncHandler(async (req: Request, res: Response) => {
    const rawWord = validateString(req.body.word, 'Word');
    const word = normalizeWord(rawWord);

    const result = await service.explainWord(word);

    res.status(200).json(result);
  }));

  /**
   * POST /api/ai/suggest-tags
   * Body: { word: string, top_k?: number }
   * Response: { suggestions: [{ word: string, score: number }] }
   */
  router.post('/suggest-tags', asyncHandler(async (req: Request, res: Response) => {
    const rawWord = validateString(req.body.word, 'Word');
    const word = normalizeWord(rawWord);

    const topK = req.body.top_k !== undefined
      ? validateNumber(req.body.top_k, 'top_k', 1, 50)
      : 10;

    const suggestions = await service.suggestTags(word, topK);

    res.status(200).json({ suggestions });
  }));

=======
  router.post('/explain', asyncHandler(async (req: Request, res: Response) => {
    const rawWord = validateString(req.body.word, 'Word');
    const word = normalizeWord(rawWord);
    
    const result = await service.explainWord(word);
    
    res.status(200).json(result);
  }));

>>>>>>> ducquan
  return router;
};
