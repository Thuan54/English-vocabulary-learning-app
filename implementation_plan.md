# Kết nối ml_server với Node.js Backend

## Tổng quan

ml_server (Python/FastAPI, port 8001) đang chạy độc lập với 3 endpoint:
- `POST /embedding/` — embed một từ → vector `list[float]`
- `POST /explain/` — giải nghĩa từ bằng AI (Groq/LLaMA)
- `POST /search/` — tìm từ tương tự theo topic (cosine similarity)

Node.js backend (Express, port 3000) cần gọi sang ml_server qua HTTP để dùng các tính năng này.

## Phân tích hiện trạng

**Những gì đã có:**
- `modules/ai/` có `AiService` nhưng chỉ là mock, chưa gọi ml_server
- `POST /api/ai/explain` route đã có sẵn
- Pattern kiến trúc: `Route → Service → Repository` (dependency injection)
- `AppError`, `asyncHandler`, `validateString` đã có sẵn để dùng

**Những gì cần làm:**
1. Thêm `ML_SERVER_URL` vào `.env`
2. Tạo `MlClient` — HTTP client wrapper gọi ml_server
3. Nâng cấp `AiService.explainWord()` — gọi ml_server thay vì mock
4. Thêm `AiService.suggestTags()` — gọi `/search/` để suggest tag cho từ mới
5. Thêm route `POST /api/ai/suggest-tags` vào `ai.route.ts`
6. Wire `MlClient` vào `server.ts`
7. Fix bug: `aiService` bị khai báo 2 lần trong `server.ts`

## Các thay đổi đề xuất

### `server/.env`

#### [MODIFY] .env
Thêm `ML_SERVER_URL=http://localhost:8001`

---

### Tầng HTTP Client (mới)

#### [NEW] `src/modules/ai/ml.client.ts`
Class `MlClient` đóng gói tất cả HTTP calls đến ml_server:
- `explainWord(word)` → gọi `POST /explain/` → trả `{ explanation: string }`
- `suggestTags(word, topK)` → gọi `POST /search/` với `topic = word` → trả `{ top_results: [{word, score}] }`

Dùng `fetch` có sẵn trong Node 18+ (không cần cài thêm lib). Tự động throw `AppError` nếu ml_server lỗi.

---

### Tầng Service

#### [MODIFY] `src/modules/ai/ai.service.ts`
- Nhận `MlClient` qua constructor injection (giống pattern của `ReviewService`)
- `explainWord(word)` → delegate sang `mlClient.explainWord(word)`
- Thêm method `suggestTags(word, topK?)` → delegate sang `mlClient.suggestTags(word, topK)`

---

### Tầng Route

#### [MODIFY] `src/modules/ai/ai.route.ts`
Thêm endpoint `POST /api/ai/suggest-tags`:
```
Body: { word: string, top_k?: number }
Response: { suggestions: [{ word: string, score: number }] }
```

---

### Entry Point

#### [MODIFY] `src/server.ts`
- Thêm import `MlClient`
- Khởi tạo `mlClient = new MlClient(process.env.ML_SERVER_URL)`
- Truyền vào `AiService(mlClient)`
- **Fix bug**: xóa dòng khai báo `aiService` trùng lặp (dòng 53–55)

---

## Luồng dữ liệu sau khi kết nối

```
Client
  │
  ▼
POST /api/ai/explain         POST /api/ai/suggest-tags
  │                                │
  ▼                                ▼
AiService.explainWord()      AiService.suggestTags()
  │                                │
  ▼                                ▼
MlClient.explainWord()       MlClient.suggestTags()
  │                                │
  ▼                                ▼
ml_server POST /explain/     ml_server POST /search/
(FastAPI, port 8001)         (FastAPI, port 8001)
```

## Kế hoạch kiểm tra

- Chạy `npm run dev` trong `server/` → phải start không lỗi
- `curl -X POST http://localhost:3000/api/ai/explain -d '{"word":"ephemeral"}'`
- `curl -X POST http://localhost:3000/api/ai/suggest-tags -d '{"word":"animal","top_k":5}'`
- Nếu ml_server tắt → server phải trả `503 Service Unavailable` thay vì crash
