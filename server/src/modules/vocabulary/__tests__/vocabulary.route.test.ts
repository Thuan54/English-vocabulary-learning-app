import dotenv from "dotenv";
dotenv.config(); // Nạp biến MONGO_URI từ file .env vào process.env

import request from "supertest";
import app from "../../../server";
import { connectDB } from "../../../config/db";

jest.mock("../../../config/db", () => ({
  connectDB: jest.fn().mockResolvedValue({}),
  getDB: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      insertOne: jest.fn().mockResolvedValue({ insertedId: "123" })
    })
  })
}));

describe("POST /word", () => {
  beforeAll(async () => {
    await connectDB();
  });



  // Test case thành công: Word is saved in DB
  it("should save word in DB", async () => {
    const res = await request(app)
      .post("/api/word")
      .send({
        word: "apple",
        meaning: "a fruit"
      });

    // Debug nếu server trả về lỗi 400
    if (res.status !== 201) console.log("Response Error:", res.body);

    expect(res.status).toBe(201);
    expect(res.body.word).toBe("apple");
  });

  // Test case thất bại: Invalid input is rejected
  it("should reject invalid input", async () => {
    const res = await request(app)
      .post("/api/word")
      .send({
        word: "" // Thiếu word/meaning sẽ kích hoạt lỗi ở Service
      });

    expect(res.status).toBe(400);
  });
});

describe('GET /word', () => {

  it('trả về từ khi tìm thấy', async () => {
    // Mock getDB trả về từ hợp lệ
    const { getDB } = require('../../../config/db');
    getDB.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn().mockResolvedValue({ insertedId: '123' }),
        findOne: jest.fn().mockResolvedValue({
          word: 'apple', meaning: 'a fruit', search_count: 0
        }),
        updateOne: jest.fn().mockResolvedValue({}),
      })
    });

    const res = await request(app)
      .get('/api/word?q=apple');

    expect(res.status).toBe(200);
    expect(res.body.word).toBe('apple');
  });

  it('trả về 404 khi không tìm thấy từ', async () => {
    const { getDB } = require('../../../config/db');
    getDB.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn().mockResolvedValue({ insertedId: '123' }),
        findOne: jest.fn().mockResolvedValue(null),
        updateOne: jest.fn().mockResolvedValue({}),
      })
    });

    const res = await request(app)
      .get('/api/word?q=notexist');

    expect(res.status).toBe(404);
  });

  it('trả về 400 khi query rỗng', async () => {
    const res = await request(app)
      .get('/api/word?q=');

    expect(res.status).toBe(400);
  });

  it('trả về 400 khi không có query', async () => {
    const res = await request(app)
      .get('/api/word');

    expect(res.status).toBe(400);
  });

});