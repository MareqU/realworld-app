# Playwright Test Suite

## Architecture

Three Playwright projects: `setup` (auth + DB seed) → `api` (serial, REST+GraphQL) + `chromium` (parallel, UI).

```
fixtures.ts              # Single registration point for all fixtures
setup/                   # auth.setup.ts + db.setup.ts
specs/api/               # API specs — one file per resource
specs/ui/                # UI/E2E specs
support/
  api-objects/           # API wrappers (one class per resource)
  pages/                 # Page Object Model
  factories/             # faker-based payload builders
  validations/           # Assertion helper classes
```

## Non-obvious conventions

**Imports:** Always from `../../fixtures`, never from `@playwright/test`.

**Locators:** Only `data-test` attributes — `page.getByTestId()`. MUI inputs need `.locator('input')` nested. MUI helper texts lack `data-test`, use ID: `page.locator('#field-helper-text')`. Dynamic list items: `page.locator('[data-test^="prefix"]')`.

**Validation classes:** `StatusValidations` methods are `async` (read response body). All other validation methods are synchronous. Never assert HTTP status inline — always use `statusValidations.expectStatus()`.

**API specs:** Must start with `test.describe.configure({ mode: 'serial' })`. All declarations (including `beforeAll`) must be inside a `test.describe` block — no module-level test registrations.

**UI specs:** `beforeEach` must call `seedDatabase()`. Use `page.route()` for edge-case states (empty lists) instead of modifying real data.

**Factories:** `overrides` is `Partial<T>` spread last. If a field is required by the API but not generatable by faker (e.g., `receiverId`, `source` in transactions), default to `''` — callers must override.

**Page objects:** Only `goto()` and multi-step composite interactions as methods. 

## Gotchas (do not replicate in new code)

- `LoginApi.invalidLogin()` has hardcoded credentials. New negative-path methods should accept credentials as parameters.
- `UserValidations` methods are `async` but perform no async work — inconsistency with all other validation classes. New validation methods must be synchronous.
- `api-users.spec.ts` is missing the top-level `test.describe` wrapper and `serial` mode. All new API specs must have both.

## Running tests

```bash
npx playwright test                          # all
npx playwright test --project=api            # API only
npx playwright test --project=chromium       # UI only
npx playwright test specs/ui/auth.spec.ts    # single file
npx playwright show-report                   # open last HTML report
```

Env vars from `../../.env`: `TEST_USER`, `TEST_PASS`, `VITE_BACKEND_PORT` (3001), `VITE_FRONTEND_PORT` (3000).
