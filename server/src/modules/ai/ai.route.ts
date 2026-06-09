import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/error';
import { AiService } from './ai.service';
import { validateString, validateNumber, normalizeWord } from '../../utils/validation';
import { MlClient } from './ml.client';

export const createAiRouter = (service: AiService) => {
  const router = Router();

  /**
   * POST /api/ai/explain
   * Body: { word: string } hoặc { text: string }
   * - "word" dùng cho trang Vocabulary Search (1 từ)
   * - "text" dùng cho trang PDF Explainer (từ hoặc câu/đoạn)
   * Response: { explanation: string }
   */
  router.post('/explain', asyncHandler(async (req: Request, res: Response) => {
    // Ưu tiên "text" (từ PDF Explainer), fallback sang "word" (từ Vocabulary Search)
    const rawInput = req.body.text || req.body.word;
    const input = validateString(rawInput, 'Word or text');

    const result = await service.explainWord(input);

    res.status(200).json(result);
  }));

  /**
   * POST /api/ai/suggest-tags
   * Body: { word: string, top_k?: number }
   * Response: { suggestions: [{ word: string, score: number }] }
   */
  router.post('/related', asyncHandler(async (req: Request, res: Response) => {
    const rawWord = validateString(req.body.word, 'Word');
    const word = normalizeWord(rawWord);

    const topK = req.body.top_k !== undefined
      ? validateNumber(req.body.top_k, 'top_k', 1, 50)
      : 10;

    const suggestions = await service.suggestTags(word, topK);

    res.status(200).json(suggestions);
  }));

  return router;
};
