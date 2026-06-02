import express from "express";
import dotenv from "dotenv";
import vocabularyRoutes from "./modules/vocabulary/vocabulary.route";
import { connectDB, getDB } from "./config/db";
import { errorHandler } from "./middleware/error.middleware";

import { createStatsRouter } from './modules/stats/stats.route';
import { StatsService } from './modules/stats/stats.service';
import { StatsRepository } from './modules/stats/stats.repo';

import { MlClient } from './modules/ai/ml.client';
import { AiService } from './modules/ai/ai.service';
import { createAiRouter } from './modules/ai/ai.route';

import { ReviewRepository } from './modules/review/review.repo';
import { ReviewService } from './modules/review/review.service';
import { createReviewRouter } from './modules/review/review.route';

// 1. Cấu hình dotenv PHẢI ĐẶT ĐẦU TIÊN để các biến env có sẵn cho DB và Port
dotenv.config();

const app = express();

// 2. Middleware giải mã JSON phải đặt TRƯỚC các routes
app.use(express.json());

// 3. Routes không cần DB
app.use("/api", vocabularyRoutes);

// Health route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const ML_SERVER_URL = process.env.ML_SERVER_URL || 'http://localhost:8001';

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
  const aiService = new AiService(mlClient);
  app.use('/api/ai', createAiRouter(aiService));
  console.log(`ML Server URL: ${ML_SERVER_URL}`);

};

export default app;