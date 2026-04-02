# Project Purpose
- Local-only, offline-first, single-user vocabulary learning app
- Learn vocabulary efficiently with Spaced Repetition System (SRS)
- AI is helper only: explain words, suggest topics if needed
- Keep everything simple, explicit, and minimal

# Hard Constraints
- No auth / multi-user
- No cloud / online dependency
- No ORM, raw SQL only (MS SQL Server + `mssql`)
- Architecture: Client → Route → Service → Repository → SQL
- AI cannot handle scheduling, system logic, or core DB operations

# Core Features
- Vocabulary lookup (word, meaning, example, search_count)
- Word relationships (synonyms, topics)
- Study plan & review (SRS-based, SM-2 or simplified)
- AI explanations (simple, uses known words)

# Complexity Rules
✅ Prefer simple, explicit, predictable logic  
❌ Avoid future-proof abstractions, generic frameworks, plugin/config-driven systems

# Testing Expectations
- Jest, ≥70% coverage
- Repository tests use real test DB
- Services and routes tested
- No skipping tests