# Generate Playwright Tests from Qase Test Cases (POM + Best Practices)

Read `agent.config.json` and `state.json` first. Follow all rules in `CLAUDE.md`.

---

## Phase 0 — Guard Check

1. Read `state.json`
2. Check if `synced_files` is empty → STOP and print:
   ```
   ⚠️  Run /sync-playwright first before generating new tests.
   This ensures the agent knows which tests already exist.
   ```
3. If `synced_files` has entries → continue

---

## Phase 1 — Learn Existing Structure & Style

Before writing a single line of code, deeply analyse the existing codebase.

### 1a — Scan the full project structure
Look for:
- `tests/playwright/` — spec files
- `pages/` or `tests/playwright/pages/` — existing Page Object classes
- `fixtures/` or `tests/playwright/fixtures/` — custom fixtures
- `helpers/` or `utils/` — shared utilities
- `playwright.config.ts` — base URL, timeouts, projects

Log every relevant file found to `agent.log`.

### 1b — Read existing Page Objects
For each file in the `pages/` directory:
- Note the class name (e.g. `LoginPage`)
- Note every public method and what it does (e.g. `login(email, password)`, `getErrorMessage()`)
- Note the constructor signature (e.g. `constructor(page: Page)`)
- Note the locator patterns used (getByRole / getByLabel / getByTestId / CSS)

Store a **Page Object registry** — you will reuse these before creating new ones:
```
LoginPage        → pages/login.page.ts   → methods: login(), getError()
DashboardPage    → pages/dashboard.page.ts → methods: getTitle(), navigate()
```

### 1c — Read existing spec files
Extract and record:
- Import style: what gets imported and from where
- How Page Objects are instantiated (in `beforeEach` or inside each test)
- How fixtures are used
- Assertion style (`expect(locator).toBeVisible()` etc.)
- Test title naming convention (sentence case, action-first, etc.)
- Whether `test.describe()` is always used or sometimes omitted
- How `baseURL` is referenced (direct string vs `page.goto('/')`)

### 1d — Read playwright.config.ts
Note:
- `baseURL` value
- Default timeout
- Any custom expect timeout
- Test directory path

Store everything as your **style guide** — all generated code must conform to it exactly.

---

## Phase 2 — Fetch Unautomated Qase Cases

Call the Qase API to get all test cases:

```
GET https://api.qase.io/v1/case/{qase_project_code}?limit=100&offset=0
Headers: Token: {qase_api_token}, Content-Type: application/json
```

Paginate if response total > 100 (increment offset by 100).

For each case:
- If title is in `state.json` pushed_titles from `/sync-playwright` → **SKIP** (already automated)
- If title is NOT in pushed_titles → **needs automation** → add to queue grouped by suite

Print:
```
ℹ️  Found X unautomated Qase cases across Y suites
ℹ️  Suites to generate: [list]
```

---

## Phase 3 — Plan Page Objects

Before writing any spec file, decide which Page Objects are needed.

For each suite in the queue:
1. Check the **Page Object registry** from Phase 1b
2. If a matching Page Object already exists → **reuse it**, do not create a new one
3. If no matching Page Object exists → **plan a new one**:
   - Name: `<Feature>Page` (e.g. `ArticlePage`)
   - File: `pages/<feature>.page.ts`
   - Methods needed: one per distinct UI interaction across all cases in this suite

### Page Object rules (strictly enforced):
- **One class per page or major feature** — never put two unrelated pages in one file
- **Locators are private properties** — never expose raw locators to tests
- **Methods return `this` for chaining** where it makes sense
- **No assertions inside Page Objects** — assertions belong in spec files only
- **Constructor always takes `Page`** from `@playwright/test`
- **All locators defined at the top** of the class, not inline in methods
- **Use semantic locators** in this priority order:
  1. `page.getByRole()` — preferred
  2. `page.getByLabel()`
  3. `page.getByTestId()`
  4. `page.getByText()`
  5. `page.locator('css')` — only if no semantic option exists

### Page Object template:
```typescript
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly errorMessage: Locator;

  constructor(private page: Page) {
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return this.errorMessage.innerText();
  }
}
```

---

## Phase 4 — Generate Page Object Files

For each new Page Object planned in Phase 3:

1. Create the file at `pages/<feature>.page.ts`
2. Follow the template from Phase 3 exactly
3. Include only the methods needed by the test cases in the queue
4. Log: `[PAGE OBJECT CREATED] pages/<feature>.page.ts`

For existing Page Objects that need new methods:
1. Read the existing file
2. Add only the missing locators and methods
3. Never remove or modify existing methods
4. Log: `[PAGE OBJECT UPDATED] pages/<feature>.page.ts — added: methodName()`

---

## Phase 5 — Generate Spec Files

For each suite group in the queue:

### 5a — Determine file path
- Map suite name to file using observed naming convention:
  - `"UI/Login"` → `tests/playwright/login.spec.ts`
  - `"UI/User Profile"` → `tests/playwright/user-profile.spec.ts`
- If file exists → append new `test()` blocks (never overwrite)
- If file doesn't exist → create it

### 5b — Write the spec file

Follow the style guide from Phase 1 exactly:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
// import other Page Objects as needed

test.describe('Login', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // Qase: Login with valid credentials | Suite: UI/Login
  test('login with valid credentials', async ({ page }) => {
    await loginPage.login('user@example.com', 'password123');
    await expect(page).toHaveURL('/dashboard');
  });

  // Qase: Login with invalid credentials | Suite: UI/Login
  test('login with invalid credentials', async ({ page }) => {
    await loginPage.login('wrong@example.com', 'wrongpassword');
    await expect(page.getByRole('alert')).toContainText('Invalid credentials');
  });

});
```

### 5c — Spec file best practices (strictly enforced):
- **No raw `page.locator()` calls in spec files** — all selectors go through Page Objects
- **One `test.describe()` per feature** — never nest describes more than one level
- **`beforeEach` instantiates Page Objects** — not inside individual tests
- **Each test is independent** — no test relies on state from a previous test
- **No hardcoded waits** (`page.waitForTimeout()`) — use `expect()` with auto-retry instead
- **Test data is explicit** — use realistic but clearly fake values (e.g. `test@example.com`)
- **One assertion focus per test** — test one thing, not everything at once
- **Add Qase comment** above each test: `// Qase: <title> | Suite: <suite>`

### 5d — Translating Qase steps to Playwright code

Always route interactions through Page Object methods:

| Qase action | Playwright (via POM) |
|---|---|
| Navigate to {url} | `await loginPage.navigate()` |
| Fill {field} with {value} | `await loginPage.fill{Field}('{value}')` |
| Click {button} | `await loginPage.click{Button}()` |
| URL changes to {url} | `await expect(page).toHaveURL('{url}')` |
| Element {x} is visible | `await expect(page.getByText('{x}')).toBeVisible()` |
| Error message {x} appears | `await expect(page.getByRole('alert')).toContainText('{x}')` |
| Element displays text {x} | `await expect(page.getByText('{x}')).toHaveText('{x}')` |

---

## Phase 6 — Save & Register

After writing each file:
1. Add spec file path to `state.json` synced_files
2. Add all generated test titles to `state.json` pushed_titles
3. Save `state.json`
4. Log: `[GENERATED] tests/playwright/<filename>.spec.ts — X tests`

---

## Phase 7 — Validate

For each generated spec file run:
```bash
npx playwright test <filepath> --list
```

If it fails:
- Read the TypeScript/Playwright error
- Fix the issue (import path, missing method, syntax error)
- Re-validate until it passes

Also run for each new/updated Page Object:
```bash
npx tsc --noEmit
```
To catch type errors before tests are executed.

---

## Final Summary

```
✅ Generation complete
─────────────────────────────
📋 Qase cases processed:         X
🏗️  Page Objects created:         X
🔧 Page Objects updated:          X
📝 New spec files created:        X
➕ Tests appended to existing:    X
⏭️  Skipped (already automated):  X
❌ Validation errors fixed:       X
─────────────────────────────
Generated files:
  pages/
    - article.page.ts
    - profile.page.ts
  tests/playwright/
    - article.spec.ts (X tests)
    - profile.spec.ts (X tests)

Run all tests:
  npx playwright test

Run only generated tests:
  npx playwright test --grep "Qase:"
```
