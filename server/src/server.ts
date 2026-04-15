import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import vocabularyRoutes from "./modules/vocabulary/vocabulary.route";

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

const PORT = process.env.PORT || 3000;

// 4. Hàm khởi tạo Server
export const startServer = async () => {
  try {
    await connectDB();
    console.log("DB ready");

    // Chỉ listen khi không phải đang trong môi trường test (Jest)
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

export default app;