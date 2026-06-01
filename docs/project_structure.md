
```
TDTT
├─ client
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ jest.config.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  ├─ src
│  │  ├─ api
│  │  │  ├─ ai.api.ts
│  │  │  ├─ related.api.ts
│  │  │  ├─ review.api.ts
│  │  │  └─ vocabulary.api.ts
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  ├─ components
│  │  │  ├─ forms
│  │  │  │  └─ AddWordForm.tsx
│  │  │  ├─ layout
│  │  │  │  ├─ Sidebar.tsx
│  │  │  │  └─ StreakCard.tsx
│  │  │  ├─ Layout.tsx
│  │  │  ├─ learned
│  │  │  │  ├─ GroupToggle.tsx
│  │  │  │  ├─ SearchBox.tsx
│  │  │  │  └─ WordItem.tsx
│  │  │  ├─ related
│  │  │  │  ├─ InputBar.tsx
│  │  │  │  ├─ MessageBubble.tsx
│  │  │  │  └─ WordCard.tsx
│  │  │  ├─ review
│  │  │  │  ├─ CompletedView.tsx
│  │  │  │  ├─ Flashcard.tsx
│  │  │  │  ├─ ReviewControls.tsx
│  │  │  │  └─ ReviewHeader.tsx
│  │  │  ├─ search
│  │  │  │  ├─ AiExplanation.tsx
│  │  │  │  ├─ SearchBar.tsx
│  │  │  │  └─ WordDetails.tsx
│  │  │  └─ ui
│  │  │     └─ wordCard.tsx
│  │  ├─ contexts
│  │  │  └─ VocabularyContext.tsx
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ Dashboard.tsx
│  │  │  ├─ LearnedWordsPage.tsx
│  │  │  ├─ RelatedWord.tsx
│  │  │  ├─ Review.tsx
│  │  │  ├─ VocabularyPage.tsx
│  │  │  └─ VocabularySearch.tsx
│  │  ├─ routes.tsx
│  │  ├─ types
│  │  │  ├─ related.ts
│  │  │  └─ word.ts
│  │  └─ __tests__
│  │     ├─ AddWordForm.test.tsx
│  │     ├─ api
│  │     ├─ components
│  │     │  ├─ Review.test.tsx
│  │     │  └─ wordCard.test.tsx
│  │     ├─ pages
│  │     │  ├─ LearnedWordsPage.test.tsx
│  │     │  └─ Review.test.tsx
│  │     └─ Vocabular
│  │        └─ Context.test.tsx
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ docs
│  ├─ ARCHITECTURE.md
│  ├─ CONTEXT.md
│  └─ CONTRIBUTING.md
├─ package-lock.json
├─ package.json
├─ README.md
└─ server
   ├─ jest.config.js
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ config
   │  │  └─ db.ts
   │  ├─ index.ts
   │  ├─ middleware
   │  │  ├─ error.middleware.ts
   │  │  ├─ error.ts
   │  │  └─ logger.middleware.ts
   │  ├─ modules
   │  │  ├─ ai
   │  │  │  ├─ ai.route.ts
   │  │  │  └─ ai.service.ts
   │  │  ├─ review
   │  │  │  ├─ review.dto.ts
   │  │  │  ├─ review.repo.ts
   │  │  │  ├─ review.route.ts
   │  │  │  ├─ review.service.ts
   │  │  │  └─ __tests__
   │  │  │     ├─ review.repo.test.ts
   │  │  │     └─ review.service.test.ts
   │  │  ├─ stats
   │  │  │  ├─ stats.repo.ts
   │  │  │  ├─ stats.route.ts
   │  │  │  ├─ stats.service.ts
   │  │  │  └─ __tests__
   │  │  │     ├─ stats.service.test.ts
   │  │  │     └─ stats.test.ts
   │  │  ├─ vocabulary
   │  │  │  ├─ vocabulary.repository.ts
   │  │  │  ├─ vocabulary.route.ts
   │  │  │  ├─ vocabulary.service.ts
   │  │  │  └─ __tests__
   │  │  │     ├─ vocabulary.route.test.ts
   │  │  │     └─ vocabulary.service.test.ts
   │  │  └─ word
   │  │     ├─ word.dto.ts
   │  │     ├─ word.repo.ts
   │  │     ├─ word.route.ts
   │  │     ├─ word.service.ts
   │  │     └─ word.test.ts
   │  ├─ server.ts
   │  ├─ test
   │  │  ├─ db-test-helper.ts
   │  │  ├─ seed-cli.ts
   │  │  └─ seed.ts
   │  ├─ utils
   │  │  ├─ validation.ts
   │  │  └─ __tests__
   │  │     └─ validation.test.ts
   │  └─ __tests__
   │     ├─ ai.integration.test.ts
   │     ├─ error.middleware.test.ts
   │     ├─ health.test.ts
   │     └─ integration-template.test.ts
   └─ tsconfig.json

```