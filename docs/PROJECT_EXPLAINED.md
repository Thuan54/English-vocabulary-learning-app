# 📖 Giải Thích Toàn Bộ Project

## Mục lục
- [1. Tổng quan dự án](#1-tổng-quan-dự-án)
- [2. Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
- [3. Kiến trúc: Request đi từ đâu đến đâu?](#3-kiến-trúc-request-đi-từ-đâu-đến-đâu)
- [4. Tầng Nền (Infrastructure)](#4-tầng-nền-infrastructure)
- [5. Tầng Middleware](#5-tầng-middleware)
- [6. Tầng Utils (Tiện ích dùng chung)](#6-tầng-utils-tiện-ích-dùng-chung)
- [7. Tầng Modules (Logic nghiệp vụ)](#7-tầng-modules-logic-nghiệp-vụ)
- [8. Luồng request thực tế (ví dụ cụ thể)](#8-luồng-request-thực-tế-ví-dụ-cụ-thể)
- [9. Testing - Hệ thống test](#9-testing---hệ-thống-test)
- [10. File cấu hình](#10-file-cấu-hình)

---

## 1. Tổng quan dự án

Đây là ứng dụng **học từ vựng tiếng Anh**, hoạt động hoàn toàn **offline** (không cần mạng), dành cho **1 người dùng**. Ứng dụng gồm 2 phần:

| Phần | Thư mục | Công nghệ | Vai trò |
|------|---------|------------|---------|
| **Server** (Backend) | `server/` | Node.js + Express + TypeScript + MongoDB | Xử lý logic, lưu trữ dữ liệu |
| **Client** (Frontend) | `client/` | Vite + React + TypeScript | Giao diện người dùng |

Hiện tại phần **Server** là trọng tâm phát triển. Client đang ở giai đoạn khởi tạo.

---

## 2. Cấu trúc thư mục

```
server/
├── package.json              ← Khai báo dependencies & scripts
├── tsconfig.json             ← Cấu hình TypeScript
├── jest.config.js            ← Cấu hình cho testing framework
│
└── src/                      ← ⭐ TẤT CẢ source code nằm ở đây
    ├── index.ts              ← 🚪 Điểm khởi chạy (entry point)
    ├── server.ts             ← 🧠 Nơi "lắp ráp" toàn bộ ứng dụng
    │
    ├── config/
    │   └── db.ts             ← 🗄️ Kết nối MongoDB
    │
    ├── middleware/
    │   ├── error.ts          ← Định nghĩa AppError + asyncHandler
    │   ├── error.middleware.ts ← Xử lý lỗi tập trung (error handler)
    │   └── logger.middleware.ts ← Ghi log mỗi request
    │
    ├── utils/
    │   └── validation.ts     ← Hàm kiểm tra & làm sạch dữ liệu đầu vào
    │
    ├── modules/              ← ⭐ Mỗi tính năng = 1 module
    │   ├── stats/            ← Module thống kê
    │   │   ├── stats.repo.ts     ← Truy vấn Database
    │   │   ├── stats.service.ts  ← Xử lý logic
    │   │   ├── stats.route.ts    ← Định nghĩa API endpoint
    │   │   └── __tests__/        ← Test cho module này
    │   │
    │   └── ai/               ← Module giải thích từ bằng AI
    │       ├── ai.service.ts     ← Logic (hiện tại là mock)
    │       └── ai.route.ts       ← Định nghĩa API endpoint
    │
    ├── test/
    │   └── db-test-helper.ts  ← Helper tạo DB giả lập cho testing
    │
    └── __tests__/             ← Test tổng hợp (integration tests)
        ├── health.test.ts
        ├── ai.integration.test.ts
        ├── error.middleware.test.ts
        └── integration-template.test.ts
```

---

## 3. Kiến trúc: Request đi từ đâu đến đâu?

Project tuân theo kiến trúc **phân lớp (layered architecture)** rất rõ ràng. Mỗi lớp chỉ làm **đúng 1 việc**:

```
Trình duyệt / Postman / cURL
        │
        ▼
  ┌─────────────┐
  │   Route     │  ← Nhận request, validate input, trả response
  │  (Bộ điều   │     Ví dụ: ai.route.ts, stats.route.ts
  │  hướng)     │     🚫 KHÔNG chứa logic nghiệp vụ
  └──────┬──────┘
         │ gọi xuống
         ▼
  ┌─────────────┐
  │  Service    │  ← Xử lý logic nghiệp vụ
  │  (Bộ xử lý) │     Ví dụ: ai.service.ts, stats.service.ts
  │             │     🚫 KHÔNG biết về HTTP (req, res)
  └──────┬──────┘
         │ gọi xuống
         ▼
  ┌─────────────┐
  │ Repository  │  ← Thao tác với Database
  │ (Kho dữ liệu│     Ví dụ: stats.repo.ts
  │             │     🚫 KHÔNG chứa logic nghiệp vụ
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  MongoDB    │  ← Nơi lưu trữ dữ liệu thật
  └─────────────┘
```

**Tại sao phân tách như vậy?**
- Dễ test: có thể test Service mà không cần HTTP server thật
- Dễ thay đổi: đổi database? Chỉ sửa Repository. Đổi logic? Chỉ sửa Service.
- Dễ hiểu: mở file lên là biết nó làm gì

---

## 4. Tầng Nền (Infrastructure)

### `index.ts` — Điểm khởi chạy
```typescript
import { startServer } from "./server";
startServer().catch(console.error);
```
**Giải thích:** Đây là file đầu tiên Node.js chạy. Nó chỉ làm 1 việc duy nhất: gọi `startServer()`. Nếu có lỗi thì in ra console. Đơn giản vậy thôi.

**Tại sao không viết luôn code vào đây?** → Để tách biệt "khởi chạy" và "cấu hình". File test có thể import `server.ts` mà không cần thực sự khởi chạy server.

---

### `server.ts` — Bộ não trung tâm (Nơi lắp ráp mọi thứ)
```typescript
// 1. Tạo app Express
const app = express();
app.use(express.json());     // Cho phép đọc body JSON từ request

// 2. Route kiểm tra sức khỏe server
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 3. Middleware xử lý lỗi
app.use(errorHandler);

// 4. Hàm khởi động server
export const startServer = async () => {
  await connectDB();           // Kết nối MongoDB
  const db = getDB();          // Lấy instance DB

  // "Lắp ráp" module stats: Repo → Service → Router → mount lên app
  const statsRepo = new StatsRepository(db);
  const statsService = new StatsService(statsRepo);
  app.use('/api/stats', createStatsRouter(statsService));

  // "Lắp ráp" module AI: Service → Router → mount lên app
  const aiService = new AiService();
  app.use('/api/ai', createAiRouter(aiService));

  app.listen(PORT, () => { ... });
};
```

**Giải thích:** File này là nơi "xây dựng nhà máy":
1. Tạo ứng dụng Express
2. Kết nối database
3. **Tạo các phụ thuộc theo thứ tự:** Repository (cần db) → Service (cần repo) → Router (cần service) ← Đây gọi là **Dependency Injection thủ công** — mỗi thành phần nhận cái nó cần qua **constructor/tham số**, thay vì tự đi tìm.
4. Gắn các router vào đường dẫn tương ứng (`/api/stats`, `/api/ai`)
5. Lắng nghe request trên port

---

### `config/db.ts` — Kết nối MongoDB
```typescript
let db: Db;  // Biến lưu trữ kết nối, dùng lại xuyên suốt app

export const connectDB = async () => {
  // Đọc MONGO_URI từ file .env
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db();       // Lưu reference vào biến module-level
};

export const getDB = () => db;  // Các nơi khác gọi hàm này để lấy DB
```

**Giải thích:** File này quản lý kết nối duy nhất đến MongoDB. Pattern **Singleton** đơn giản: kết nối 1 lần → dùng lại mãi.

---

## 5. Tầng Middleware

Middleware trong Express là **"trạm kiểm soát"** nằm giữa request và response. Mỗi request đi qua sẽ bị middleware chặn lại để xử lý.

```
Request → [express.json()] → [logger] → [Route xử lý] → [errorHandler] → Response
```

### `error.ts` — Công cụ xử lý lỗi

**`AppError`** — Lỗi tùy chỉnh:
```typescript
export class AppError extends Error {
  constructor(message: string, code: string, statusCode: number = 500) { ... }
}
// Dùng: throw new AppError("Word không hợp lệ", "VALIDATION_ERROR", 400);
```
Khi bạn muốn trả lỗi cho client, thay vì `throw new Error(...)` bình thường, bạn dùng `throw new AppError(...)` để kèm thêm `code` (loại lỗi) và `statusCode` (mã HTTP).

**`asyncHandler`** — Bọc hàm async:
```typescript
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```
**Tại sao cần cái này?** Express không tự bắt lỗi từ hàm `async`. Nếu một route async throw lỗi, Express sẽ không biết → server treo. `asyncHandler` bọc lại và tự động gọi `next(error)` khi có lỗi → chuyển lỗi sang `errorHandler`.

### `error.middleware.ts` — Xử lý lỗi tập trung
```typescript
export const errorHandler = (err, _req, res, _next) => {
  // Nếu lỗi là AppError → lấy status + code từ đó
  // Nếu lỗi khác → mặc định 500 + INTERNAL_ERROR
  res.status(status).json({ error: { message, code } });
};
```
**Giải thích:** Đây là middleware đặc biệt có **4 tham số** (Express nhận biết nó là error handler). Mọi lỗi throw trong app đều chảy về đây, và nó trả response lỗi thống nhất cho client.

### `logger.middleware.ts` — Ghi log request
```typescript
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[GET] /api/stats 200 - 12ms`);
  });
  next();  // ← cho request đi tiếp
};
```

---

## 6. Tầng Utils (Tiện ích dùng chung)

### `utils/validation.ts` — Kiểm tra & làm sạch dữ liệu

| Hàm | Vai trò | Ví dụ |
|-----|---------|-------|
| `validateString(value, label)` | Kiểm tra phải là string không rỗng | `validateString(req.body.word, 'Word')` — nếu rỗng → throw AppError (400) |
| `validateNumber(value, label, min, max)` | Kiểm tra phải là số hợp lệ | `validateNumber(req.body.value, 'Value')` |
| `normalizeWord(word)` | Chuẩn hóa từ: viết thường, bỏký tự đặc biệt | `"  Hello World! "` → `"hello world"` |
| `sanitizeInput(input)` | Chống tấn công XSS, giới hạn độ dài | `"<script>"` → `"&lt;script&gt;"` |

**Tại sao cần?** Dữ liệu từ client không bao giờ tin được. Phải kiểm tra và làm sạch trước khi sử dụng.

---

## 7. Tầng Modules (Logic nghiệp vụ)

Mỗi module là **1 tính năng hoàn chỉnh**, chứa đủ 3 lớp (hoặc ít hơn nếu không cần).

### Module `stats/` — Thống kê từ vựng

Chức năng: trả về số lượng từ vựng và lượt ôn tập trong hệ thống.

#### `stats.repo.ts` (Repository — nói chuyện với Database)
```typescript
export class StatsRepository {
  constructor(private db: Db) {}

  async countWords()   { return this.db.collection('words').countDocuments(); }
  async countReviews() { return this.db.collection('reviews').countDocuments(); }
}
```
**Diễn giải:** Chỉ biết cách truy vấn MongoDB. Không biết "thống kê" nghĩa là gì, không biết HTTP là gì. Nhận `db` qua constructor.

#### `stats.service.ts` (Service — xử lý logic)
```typescript
export class StatsService {
  constructor(private repo: StatsRepository) {}

  async getStats() {
    const [words, reviews] = await Promise.all([
      this.repo.countWords(),
      this.repo.countReviews(),
    ]);
    return { words, reviews };
  }
}
```
**Diễn giải:** Gọi repo để lấy dữ liệu, tổng hợp lại. Dùng `Promise.all` để chạy 2 query song song (nhanh hơn chạy tuần tự). Không biết HTTP, không biết MongoDB — chỉ biết "repo cho tôi số liệu, tôi gộp lại trả ra".

#### `stats.route.ts` (Route — cửa ngõ HTTP)
```typescript
export const createStatsRouter = (service: StatsService) => {
  const router = Router();

  router.get('/', asyncHandler(async (_req, res) => {
    const stats = await service.getStats();
    res.status(200).json(stats);         // → { words: 5, reviews: 12 }
  }));

  return router;
};
```
**Diễn giải:** Nhận Service qua tham số. Khi có `GET /api/stats` → gọi service → trả JSON. Không biết database, không biết logic đếm — chỉ biết "nhận request, gọi service, trả response".

---

### Module `ai/` — Giải thích từ vựng bằng AI

Chức năng: nhận một từ, trả về giải thích (hiện tại là mock data).

#### `ai.service.ts` (Service)
```typescript
export class AiService {
  async explainWord(word: string): Promise<{ explanation: string }> {
    return {
      explanation: `This is a simple mock explanation for the word '${word}'.`
    };
  }
}
```
**Diễn giải:** Hiện tại trả kết quả giả. Sau này thay bằng gọi OpenAI/Gemini → chỉ cần sửa **file này**, không ảnh hưởng route hay bất kỳ chỗ nào khác.

#### `ai.route.ts` (Route)
```typescript
export const createAiRouter = (service: AiService) => {
  const router = Router();

  router.post('/explain', asyncHandler(async (req, res) => {
    const rawWord = validateString(req.body.word, 'Word');  // ← Validate
    const word = normalizeWord(rawWord);                     // ← Chuẩn hóa
    const result = await service.explainWord(word);          // ← Gọi service
    res.status(200).json(result);                            // ← Trả kết quả
  }));

  return router;
};
```
**Luồng chi tiết:**
1. Client gửi `POST /api/ai/explain` với body `{ "word": "Hello" }`
2. `validateString` kiểm tra: word có phải string không rỗng? Nếu không → throw `AppError` (400)
3. `normalizeWord` chuẩn hóa: `"Hello"` → `"hello"`
4. `service.explainWord("hello")` → trả mock explanation
5. Response: `{ "explanation": "This is a simple mock explanation..." }`

---

## 8. Luồng request thực tế (ví dụ cụ thể)

### ✅ Trường hợp thành công

```
Client gửi: POST /api/ai/explain  { "word": "Apple" }
        │
        ▼
  express.json()        →  Parse body JSON thành object
        │
        ▼
  ai.route.ts           →  validateString("Apple") ✓ OK
        |                →  normalizeWord("Apple") → "apple"
        |                 →  service.explainWord("apple")
        │
        ▼
  ai.service.ts         →  return { explanation: "...mock...apple..." }
        │
        ▼
  ai.route.ts           →  res.status(200).json(result)
        │
        ▼
  Client nhận: 200 OK   { "explanation": "...mock...apple..." }
```

### ❌ Trường hợp lỗi

```
Client gửi: POST /api/ai/explain  { "word": "" }
        │
        ▼
  express.json()        →  Parse body
        │
        ▼
  ai.route.ts           →  validateString("") 
                        →  💥 throw new AppError("Word must be a non-empty string", "VALIDATION_ERROR", 400)
        │
        ▼
  asyncHandler          →  Bắt lỗi, gọi next(error)
        │
        ▼
  errorHandler          →  Nhận AppError, trả response lỗi
        │
        ▼
  Client nhận: 400      { "error": { "message": "Word must be...", "code": "VALIDATION_ERROR" } }
```

---

## 9. Testing — Hệ thống test

### Công cụ được dùng

| Tool | Vai trò |
|------|---------|
| **Jest** | Framework chạy test (giống "bộ điều khiển" test) |
| **Supertest** | Giả lập HTTP request đến Express app (không cần start server thật) |
| **MongoMemoryServer** | Tạo MongoDB giả lập chạy trong RAM (nhanh, không cần cài MongoDB thật) |

### Cách test hoạt động (file `db-test-helper.ts`)

```typescript
beforeAll(async () => { await startTestDB(); });    // Tạo DB giả trước khi test
beforeEach(async () => { await clearTestDB(); });   // Xóa sạch data giữa mỗi test
afterAll(async () => { await stopTestDB(); });      // Dọn dẹp sau khi test xong
```

**Luồng:** Tạo MongoDB trong RAM → Chạy test (mỗi test bắt đầu với DB trống) → Dọn dẹp.

### Ví dụ test AI endpoint (`ai.integration.test.ts`)

```typescript
// Tạo "mini app" chỉ cho test — KHÔNG cần DB thật
const aiService = new AiService();
const app = express();
app.use('/api/ai', createAiRouter(aiService));
app.use(errorHandler);

it('returns 200 with valid word', async () => {
  const res = await request(app)                     // Supertest giả lập HTTP
    .post('/api/ai/explain')
    .send({ word: 'test' });

  expect(res.status).toBe(200);                      // Kiểm tra status
  expect(res.body).toHaveProperty('explanation');     // Kiểm tra có field explanation
});

it('returns 400 on invalid word', async () => {
  const res = await request(app)
    .post('/api/ai/explain')
    .send({ word: '   ' });                           // Gửi string rỗng

  expect(res.status).toBe(400);                       // Phải trả lỗi 400
  expect(res.body.error.code).toBe('VALIDATION_ERROR');
});
```

### Quy tắc đặt file test
- Test gắn chặt với module → đặt trong `modules/<tên>/__tests__/`
- Test tổng hợp (integration) → đặt trong `src/__tests__/`

---

## 10. File cấu hình

### `package.json` — Scripts thường dùng
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",          // Chạy server (auto reload khi sửa code)
    "test": "jest --config jest.config.js",   // Chạy test
    "test:coverage": "jest ... --coverage"    // Chạy test + xem % coverage
  }
}
```

### `tsconfig.json` — Cấu hình TypeScript
- `target: ES2020` — Compile ra JS phiên bản 2020 (hỗ trợ async/await, optional chaining...)
- `module: node16` — Dùng hệ thống module của Node.js
- `strict: true` — Bật chế độ kiểm tra nghiêm ngặt (giúp tránh bug)

### `jest.config.js` — Cấu hình test
- `preset: ts-jest` — Cho phép Jest hiểu TypeScript
- `testMatch: ["**/__tests__/**/*.test.ts"]` — Chỉ chạy file `.test.ts` trong thư mục `__tests__`
- `coverageThreshold: 70%` — Test phải cover ≥ 70% code, nếu không → fail

---

## Tóm tắt: Bức tranh toàn cảnh

```
                    ┌──────────────────────────────────────────┐
                    │              index.ts                    │
                    │          (Khởi chạy server)              │
                    └──────────────┬───────────────────────────┘
                                   │
                    ┌──────────────▼───────────────────────────┐
                    │             server.ts                     │
                    │  (Lắp ráp: DB + Middleware + Modules)     │
                    └──┬────────────┬────────────┬─────────────┘
                       │            │            │
          ┌────────────▼───┐  ┌─────▼────────┐  ┌▼─────────────┐
          │  config/db.ts  │  │ middleware/  │  │   modules/   │
          │  (Kết nối DB)  │  │ (Error,Log)  │  │  (Features)  │
          └────────────────┘  └──────────────┘  └──┬───────┬───┘
                                                   │       │
                                        ┌──────────▼─┐  ┌───▼──────┐
                                        │   stats/   │  │   ai/    │
                                        │ repo→svc→rt│  │ svc→route│
                                        └────────────┘  └──────────┘
```

**Nguyên tắc cốt lõi:**
1. **Mỗi file làm đúng 1 việc** — dễ đọc, dễ sửa, dễ test
2. **Phụ thuộc chảy từ trên xuống** — Route → Service → Repository → DB
3. **Dependency Injection** — mỗi thành phần nhận cái nó cần qua constructor, không tự tạo
4. **Error handling tập trung** — throw lỗi ở bất kỳ đâu, `errorHandler` sẽ bắt và trả response
5. **Test song song với code** — mỗi module có test riêng, đảm bảo ≥ 70% coverage
