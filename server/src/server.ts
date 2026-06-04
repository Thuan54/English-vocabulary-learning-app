import express from "express";
import cors from "cors";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB, getDB } from "./config/db";
import {errorHandler} from "./middleware/error.middleware"

import { createStatsRouter} from './modules/stats/stats.route';
import { StatsService} from './modules/stats/stats.service';
import { StatsRepository} from './modules/stats/stats.repo';
import { createAiRouter } from './modules/ai/ai.route';
import { AiService } from './modules/ai/ai.service';

import { WordRepository } from './modules/word/word.repo';
import { WordService } from './modules/word/word.service';
import { createWordRouter } from './modules/word/word.route';
import { ReviewRepository } from './modules/review/review.repo';
import { ReviewService } from './modules/review/review.service';
import { createReviewRouter } from './modules/review/review.route';
import { DictService } from "./modules/dictionary/dict.service";
import { createDictRouter } from "./modules/dictionary/dict.route";

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

// 4. Hàm khởi tạo Server
export const startServer = async () => {
  await connectDB();    
  const db = getDB();
  console.log("DB ready");

  //stats
  const statsRepo = new StatsRepository(db);
  const statsService = new StatsService(statsRepo);
  app.use('/api/stats', createStatsRouter(statsService));

  // Wire AI
  const aiService = new AiService();
  app.use('/api/ai', createAiRouter(aiService));

  // WORD
  const wordRepo = new WordRepository(db);
  const wordService = new WordService(wordRepo);
  app.use('/api/words', createWordRouter(wordService));

  // REVIEW
  const reviewRepo = new ReviewRepository(db);
  const reviewService = new ReviewService(reviewRepo, wordService);
  app.use('/api/reviews', createReviewRouter(reviewService));

  // Search

  const dictService = new DictService()
  app.use('/api/search', createDictRouter(dictService))

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
};

export default app;