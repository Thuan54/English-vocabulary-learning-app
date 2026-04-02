# ARCHITECTURE.md

## Stack
- Backend: Node.js + Express + TypeScript
- Frontend: React + Vite + TypeScript
- DB: MS SQL Server, raw SQL only
- Testing: Jest (backend + frontend)

## Project Structure

```
server/src/
├── config/db.ts
├── modules/{feature}/
│ ├── {feature}.route.ts
│ ├── {feature}.service.ts
│ ├── {feature}.repository.ts
│ └── {feature}.dto.ts
client/src/
├── pages/{Feature}Page.tsx
├── components/
├── api/{feature}.api.ts

```

## Layer Responsibilities
| Layer       | Responsibility                          |
|------------|------------------------------------------|
| Route       | HTTP request/response only               |
| Service     | Business logic, validation, SRS logic    |
| Repository  | Raw SQL queries ONLY                     |

## Flow Example
POST /review → review.route.ts → review.service.ts → review.repository.ts → DB
