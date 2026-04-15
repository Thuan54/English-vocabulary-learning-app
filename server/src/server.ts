import express from "express";
import dotenv from "dotenv";
//import vocabularyRoutes from "./modules/vocabulary/vocabulary.route";
import { connectDB, getDB } from "./config/db";
import {errorHandler} from "./middleware/error.middleware"

import { createStatsRouter} from './modules/stats/stats.route';
import { StatsService} from './modules/stats/stats.service';
import { StatsRepository} from './modules/stats/stats.repo';
import { createAiRouter } from './modules/ai/ai.route';
import { AiService } from './modules/ai/ai.service';

import { ReviewRepository } from './modules/review/review.repo'
import { ReviewService } from './modules/review/review.service'
import { createReviewRouter } from './modules/review/review.route'

// 1. Cấu hình dotenv PHẢI ĐẶT ĐẦU TIÊN để các biến env có sẵn cho DB và Port
dotenv.config();

const app = express();

// 2. Middleware giải mã JSON phải đặt TRƯỚC các routes
app.use(express.json());

// 3. Đăng ký Routes
// Lưu ý: Nếu route của bạn là POST /word, thì path đầy đủ sẽ là http://localhost:PORT/api/word
app.use("/api", vocabularyRoutes);

// Health route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorHandler);

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

  //Review
  const reviewRepo = new ReviewRepository(db);
  const reviewService = new ReviewService(reviewRepo);
  app.use('/api/reviews', createReviewRouter(reviewService));

  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
};

export default app;