# Sync Existing Playwright Tests to Qase

Read `agent.config.json` and `tests/agents/shared/state.json` first.

## Your Goal

Scan the Playwright test files in this repository, extract all test cases with their steps from the source code, and push them to Qase — without manual work.

---

## Phase 1 — Discover Test Files

1. Find all Playwright test files by looking for:
   - Files matching `**/*.spec.ts`, `**/*.spec.js`, `**/*.test.ts`, `**/*.test.js`
   - Focus on the `tests/playwright` directory first, then scan the rest of the repo
2. List every file found and log them to `agent.log`
3. Skip any files already tracked in `tests/agents/shared/state.json` under `qase.synced_files`

---

## Phase 2 — Parse Each Test File

For each test file, read the source code and extract:

### What to extract per `test()` block:
- **title**: the string passed to `test('...')` or `it('...')`
- **suite_title**: derived from the `test.describe('...')` block wrapping it — if none, use the filename (e.g. `login.spec.ts` → `Login`)
- **steps**: every meaningful action inside the test body:
  - `page.goto(url)` → action: "Navigate to {url}", expected: "Page loads successfully"
  - `page.click(selector)` → action: "Click {selector}", expected: "Element responds to click"
  - `page.fill(selector, value)` → action: "Fill {selector} with '{value}'", expected: "Field accepts input"
  - `page.getByRole / getByLabel / getByText` → use the readable label as the action target
  - `expect(...)` → convert to expected_result of the previous step, e.g. `expect(page).toHaveURL('/dashboard')` → expected: "URL changes to /dashboard"
  - `expect(locator).toBeVisible()` → expected: "Element is visible on the page"
  - `expect(locator).toHaveText(text)` → expected: "Element displays text: {text}"
- **preconditions**: extract from `test.beforeEach` in the same describe block if present
- **priority**:
  - 1 (High) if title contains: login, auth, payment, checkout, register, delete
  - 2 (Medium) for most functional tests
  - 3 (Low) if title contains: style, color, layout, visual

### Handling helpers and fixtures:
- If a step calls a helper function (e.g. `loginAs(page, user)`), expand it to a human-readable action: "Log in as {user}"
- If a step uses a fixture, note it in preconditions

---

## Phase 3 — Push to Qase

For each extracted test case:

1. Check `tests/agents/shared/state.json` qase.pushed_titles — skip if already there
2. If the suite doesn't exist yet:
   - POST `https://api.qase.io/v1/suite/{qase_project_code}` with `{ "title": "<suite_title>" }`
   - Save the returned `suite_id` to `tests/agents/shared/state.json` qase_suites
3. POST `https://api.qase.io/v1/case/{qase_project_code}`:
```json
{
  "title": "<title>",
  "preconditions": "<preconditions or empty string>",
  "priority": <1|2|3>,
  "type": 4,
  "suite_id": <suite_id>,
  "steps": [
    {
      "position": 1,
      "action": "<action>",
      "expected_result": "<expected_result>"
    }
  ]
}
```
4. On success:
   - Add title to `tests/agents/shared/state.json` qase.pushed_titles
   - Increment `qase.total_pushed`
   - Save `tests/agents/shared/state.json`
5. Wait 300ms before the next API call
6. On 429: wait 60 seconds and retry

---

## Phase 4 — Mark File as Done

After all tests from a file are pushed:
- Add the file path to `tests/agents/shared/state.json` under `qase.synced_files`
- Save `tests/agents/shared/state.json`

---

## Phase 5 — Summary

When all files are processed, print:

```
✅ Sync complete
─────────────────────────────
📁 Files scanned:        X
🧪 Test cases pushed:    X
📂 Suites created:       X
⏭️  Skipped (duplicate): X
❌ Errors:               X
─────────────────────────────
You can now run /run-agent to generate additional test cases for uncovered flows.
```
