# Workflow
1. Branch from main (`feature/yourname-desc` or `bugfix/yourname-123-desc`)
2. Write code + tests
3. Run tests locally
4. Open PR linked to GitHub issue

# Commit Convention
- `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`

# Testing
- Jest, ≥70% coverage
- Unit: services, DTOs, hooks
- Integration: route ↔ service, service ↔ repo

# Pull Requests
- Small & focused
- Include tests
- Link issue: `Closes #<issue>`