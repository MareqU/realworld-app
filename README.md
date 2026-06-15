## Playwright Test Framework

Production-grade Playwright test framework with an AI-driven test case generator, built on top of the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) as the application under test.

### Architecture

```
tests/playwright/
├── fixtures.ts                  # Single registration point for all fixtures
├── playwright.config.ts         # 3 projects: setup → api (serial) + chromium (parallel)
├── setup/                       # auth.setup.ts — saves session to disk; db.setup.ts — seeds DB
├── specs/
│   ├── api/                     # REST + GraphQL tests (one file per resource)
│   └── ui/                      # E2E browser tests
└── support/
    ├── api-objects/             # Typed API wrappers — one class per resource
    ├── pages/                   # Page Object Model
    ├── factories/               # faker-based payload builders
    └── validations/             # Assertion helpers — UI and API layers separate
```

### Coverage

| Layer | Specs |
|---|---|
| **UI / E2E** | auth, onboarding, bank accounts, transactions, transaction feed, transaction detail, notifications, user settings, navigation |
| **API** | login, logout, users, bank accounts, bank transfers, transactions, comments, likes, contacts, notifications — plus GraphQL variants |

### Qase TMS Integration

- **Qase link** - https://app.qase.io/project/RWA/
- **Reporter** — test results stream to Qase after every run (`playwright-qase-reporter` wired into `playwright.config.ts`)
- **AI Agent** (`tests/agents/qase-agent/`) — autonomous Claude Code agent that:
  1. Parses all `*.spec.ts` files and syncs them into Qase suites
  2. Browses the live app with Playwright MCP to discover flows not yet covered
  3. Generates structured test cases with **semantic deduplication** — skips cases that are functionally identical even if worded differently
  4. Handles rate limits and resumes from checkpoint (`state.json`) after interruption

### Stack

`Playwright` · `TypeScript` · `Faker.js` · `Qase TMS` · `GitHub Actions` · `Claude Code (AI agent)`

### Running the tests

```bash
cd tests/playwright

npx playwright test                    # all
npx playwright test --project=api      # API only
npx playwright test --project=chromium # UI only
npx playwright show-report             # open HTML report
```

> The app starts automatically via `webServer` config. Requires `.env` (repo root) with `TEST_USER`, `TEST_PASS`, and optionally `QASE_API_TOKEN` for TMS reporting.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (see [.node-version](./.node-version))
- [Yarn Classic](https://classic.yarnpkg.com/) (v1)

```bash
npm install yarn@latest -g
yarn                        # install all dependencies (root)
npx playwright install      # download browser binaries
```

> Default password for all seed users is `s3cret`. Run `yarn list:dev:users` to list available accounts.
> The app starts automatically when running tests. To start it manually: `yarn dev` (frontend :3000, backend :3001).

## License

[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/cypress-io/cypress/blob/master/LICENSE)

This project is licensed under the terms of the [MIT license](/LICENSE).
