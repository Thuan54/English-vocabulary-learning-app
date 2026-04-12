import express from "express";
import dotenv from "dotenv";
import { connectDB, getDB } from "./config/db";
import {errorHandler} from "./middleware/error.middleware"
import { createStatsRouter} from './modules/stats/stats.route';
import { StatsService} from './modules/stats/stats.service';
import { StatsRepository} from './modules/stats/stats.repo';


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

  
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });

};

export default app;