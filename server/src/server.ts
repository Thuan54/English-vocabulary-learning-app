import express from "express";
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

dotenv.config();

const app = express();
app.use(express.json());

// Health route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

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
  app.use('/api/word', createWordRouter(wordService));

  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
};

export default app;