import express from "express";
import dotenv from "dotenv";
import path from "path"

import { connectDB, getDB } from "./config/db";
import { errorHandler } from "./middleware/error.middleware";

import { createStatsRouter } from './modules/stats/stats.route';
import { StatsService } from './modules/stats/stats.service';
import { StatsRepository } from './modules/stats/stats.repo';

import { MlClient } from './modules/ai/ml.client';
import { AiService } from './modules/ai/ai.service';
import { createAiRouter } from './modules/ai/ai.route';

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

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')))

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
const ML_SERVER_URL = process.env.ML_SERVER_URL || 'http://localhost:8000';

// 4. Hàm khởi tạo Server
export const startServer = async () => {
  await connectDB();
  const db = getDB();
  console.log("DB ready");

  // Stats
  const statsRepo = new StatsRepository(db);
  const statsService = new StatsService(statsRepo);
  app.use('/api/stats', createStatsRouter(statsService));

  // AI (kết nối ml_server)
  const mlClient = new MlClient(ML_SERVER_URL);
  const aiService = new AiService(mlClient, db);
  app.use('/api/ai', createAiRouter(aiService));
  console.log(`ML Server URL: ${ML_SERVER_URL}`);
  
  // Review Word repo
  const wordRepo = new WordRepository(db);
  const reviewRepo = new ReviewRepository(db);
  
  // WORD
  const wordService = new WordService(wordRepo, reviewRepo, aiService);
  app.use('/api/words', createWordRouter(wordService));
  
  // REVIEW
  const reviewService = new ReviewService(reviewRepo, wordRepo);
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