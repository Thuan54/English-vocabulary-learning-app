# Add Basic AI Explain Endpoint

This task aims to create a basic mock AI Explain API endpoint (`POST /ai/explain`) that returns a simple explanation for given vocabulary words. This will form the foundation for later adding actual AI integration, while adhering to the project's goal of offline, simple, and explicit logic.

## Proposed Changes

### `src/modules/ai`

#### [NEW] [ai.service.ts](file:///home/ducquan/Documents/Python/TDTT/English-vocabulary-learning-app/server/src/modules/ai/ai.service.ts)
Create `AiService` class with an `explainWord(word: string)` method. This method will currently return a hardcoded/mocked explanation string like "This is a simple mock explanation for the word '[word]'."

#### [NEW] [ai.route.ts](file:///home/ducquan/Documents/Python/TDTT/English-vocabulary-learning-app/server/src/modules/ai/ai.route.ts)
Create a route definition exporting `createAiRouter(service: AiService)`. 
- Define a `POST /explain` route.
- Accept `{"word": "something"}` in the request body.
- Use `validateString` and `normalizeWord` (from `src/utils/validation.ts`) to validate the input.
- Call the `AiService.explainWord` method.
- Return the explanation with a `200 OK` status.

---

### `server configuration`

#### [MODIFY] [server.ts](file:///home/ducquan/Documents/Python/TDTT/English-vocabulary-learning-app/server/src/server.ts)
- Instantiate `AiService`.
- Import `createAiRouter` and wire it up with the path `app.use('/api/ai', createAiRouter(aiService))`. Note: This makes the full path `POST /api/ai/explain`, adhering to the existing API structure where endpoints are prefixed with `/api/`.

---

### `tests`

#### [NEW] [ai.integration.test.ts](file:///home/ducquan/Documents/Python/TDTT/English-vocabulary-learning-app/server/src/__tests__/ai.integration.test.ts)
Create an integration test using `supertest` to verify:
- Successful response (status `200`) and correct mock explanation format for valid word input.
- Failure response (status `400`) and `VALIDATION_ERROR` when `word` is missing or empty.

## Open Questions

> [!WARNING]
> The issue requests `POST /ai/explain`. However, existing endpoints are prefixed with `/api/` (like `/api/stats`). Should the AI endpoint be strictly mounted at the root (`/ai/explain`) or under the API prefix (`/api/ai/explain`) to match convention? The plan currently assumes `/api/ai/explain`. Please confirm if this is acceptable.

## Verification Plan

### Automated Tests
- Run `npm run test` targeting the new `ai.integration.test.ts` file. Ensure Jest passes the integration suite.

### Manual Verification
- Start the server using `npm run dev`.
- Make a cURL request: `curl -X POST http://localhost:3000/api/ai/explain -H "Content-Type: application/json" -d '{"word": "test"}'` to confirm it works locally.
