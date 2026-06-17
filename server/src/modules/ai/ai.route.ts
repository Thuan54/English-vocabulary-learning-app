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
    const rawWord = validateString(req.body.term, 'Word');
    const word = normalizeWord(rawWord);

    const topK = req.body.top_k !== undefined
      ? validateNumber(req.body.top_k, 'top_k', 1, 50)
      : 10;

    const suggestions = await service.suggestTags(word, topK);

    res.status(200).json(suggestions);
  }));

  /**
   * POST /api/ai/translate
   * Body: { text: string }
   * Response: { translation: string }
   */
  router.post('/translate', asyncHandler(async (req: Request, res: Response) => {
    const text = validateString(req.body.text, 'Text to translate');
    const translation = await service.translateText(text);
    res.status(200).json({ translation });
  }));


  /**
   * POST /api/ai/grammar/analyze
   * Body: { sentence: string }
   * CT Step 1 — Decomposition: Phân tích cấu trúc ngữ pháp câu
   */
  router.post('/grammar/analyze', asyncHandler(async (req: Request, res: Response) => {
    const sentence = validateString(req.body.sentence, 'Sentence');
    const result = await service.analyzeGrammar(sentence);
    res.status(200).json(result);
  }));

  /**
   * POST /api/ai/grammar/scan-patterns
   * Body: { text: string }
   * CT Step 2 — Pattern Recognition: Quét cụm từ học thuật
   */
  router.post('/grammar/scan-patterns', asyncHandler(async (req: Request, res: Response) => {
    const text = validateString(req.body.text, 'Text');
    const result = await service.scanPatterns(text);
    res.status(200).json(result);
  }));

  /**
   * POST /api/ai/grammar/smart-flashcard
   * Body: { word: string, surroundingText: string }
   * CT Step 3 — Abstraction: Trích xuất flashcard thông minh
   */
  router.post('/grammar/smart-flashcard', asyncHandler(async (req: Request, res: Response) => {
    const word = validateString(req.body.word, 'Word');
    const surroundingText = validateString(req.body.surroundingText, 'Surrounding text');
    const result = await service.smartFlashcard(word, surroundingText);
    res.status(200).json(result);
  }));

  /**
   * POST /api/ai/grammar/paraphrase
   * Body: { sentence: string }
   * CT Step 4 — Algorithm Design: Paraphrase 3 bước
   */
  router.post('/grammar/paraphrase', asyncHandler(async (req: Request, res: Response) => {
    const sentence = validateString(req.body.sentence, 'Sentence');
    const result = await service.paraphrase(sentence);
    res.status(200).json(result);
  }));

  return router;
};
