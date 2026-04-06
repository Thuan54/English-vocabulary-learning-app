import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
app.use(express.json());

// Health route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});



const PORT = process.env.PORT || 3000;

export const startServer = async () => {
  await connectDB();
  console.log("DB ready");

  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
};

export default app;