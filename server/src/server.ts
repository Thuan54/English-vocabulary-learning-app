import express from "express";
import dotenv from "dotenv";
import { connectDB, getDB } from "./config/db";
<<<<<<< Updated upstream
import {errorHandler} from "./middleware/error.middleware"
import { createStatsRouter} from './modules/stats/stats.route';
import { StatsService} from './modules/stats/stats.service';
import { StatsRepository} from './modules/stats/stats.repo';
import { createAiRouter } from './modules/ai/ai.route';
import { AiService } from './modules/ai/ai.service';
=======
import { errorHandler } from "./middleware/error.middleware";
>>>>>>> Stashed changes


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

    // Wire stats
  const statsRepo = new StatsRepository(db);
  const statsService = new StatsService(statsRepo);
  app.use('/api/stats', createStatsRouter(statsService));

<<<<<<< Updated upstream
  // Wire AI
  const aiService = new AiService();
  app.use('/api/ai', createAiRouter(aiService));

  
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
=======
  // AI (kết nối ml_server)
  const mlClient = new MlClient(ML_SERVER_URL);
  const aiService = new AiService(mlClient);
  app.use('/api/ai', createAiRouter(aiService));
  console.log(`ML Server URL: ${ML_SERVER_URL}`);
>>>>>>> Stashed changes

};

export default app;