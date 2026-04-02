# Stack
- Backend: Node.js + Express + TypeScript
- Frontend: React + Vite + TypeScript
- DB: MongoDB (native driver, no ORM)
- Testing: Jest

# Project Structure

```
server/src/
├── config/db.ts
├── modules/{feature}/
│   ├── {feature}.route.ts
│   ├── {feature}.service.ts
│   ├── {feature}.repository.ts
│   ├── {feature}.dto.ts
│   └── __tests__/
│       ├── {feature}.service.test.ts
│       ├── {feature}.repository.test.ts
│       └── {feature}.route.test.ts

client/src/
├── pages/{Feature}Page.tsx
├── components/
├── api/{feature}.api.ts
├── __tests__/
```

# Layer Responsibilities
| Layer       | Responsibility                          |
|------------|------------------------------------------|
| Route       | HTTP request/response only               |
| Service     | Business logic, validation, SRS logic    |
| Repository  | Mongo queries ONLY                     |

# Flow Example
POST /review → review.route.ts → review.service.ts → review.repository.ts → DB
