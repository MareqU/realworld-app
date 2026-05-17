# 🤖 Playwright MCP + Qase Test Case Generator Agent

An autonomous Claude Code agent that:
1. Syncs your existing Playwright tests into Qase
2. Browses your live website to discover uncovered flows
3. Generates new test cases and pushes them to Qase — without duplicates

---

## Folder Structure

```
qase-agent/
├── CLAUDE.md                          ← Agent brain (auto-read by Claude Code)
├── agent.config.json                  ← Your settings
├── state.json                         ← Tracks what's been pushed (do not delete)
├── agent.log                          ← Created at runtime
└── .claude/
    └── commands/
        ├── sync-playwright.md         ← /sync-playwright command
        └── run-agent.md               ← /run-agent command
```

---

## Prerequisites

- Node.js 18+
- Claude Code: `npm install -g @anthropic/claude-code`
- Qase account with a project already created

---

## Setup

### 1. Copy this folder into your repo root

Place the `qase-agent` folder inside your `realworld-app` repo (or any repo containing your Playwright tests).

### 2. Add Playwright MCP to Claude Code

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

Verify:
```bash
claude mcp list
```

### 3. Fill in agent.config.json

```json
{
  "target_url": "https://your-website.com",
  "qase_api_token": "your_token_here",
  "qase_project_code": "YOUR_CODE",
  "max_cases": 30,
  "delay_between_requests_ms": 300,
  "headless": false,
  "explore_depth": 3
}
```

**Where to find your Qase credentials:**
- API Token: Qase → Profile avatar → API Tokens → Generate
- Project Code: visible in your project URL `app.qase.io/project/YOUR_CODE`

---

## Usage

Open Claude Code from your repo root:

```bash
cd realworld-app
claude
```

### Step 1 — Sync existing Playwright tests (always first)

```
/sync-playwright
```

This reads all `*.spec.ts` / `*.spec.js` files, extracts test steps from the source code, and pushes them to Qase grouped into suites by `describe` block or filename. All pushed titles are recorded in `state.json`.

### Step 2 — Generate new test cases for uncovered flows

```
/run-agent
```

The agent opens a browser via Playwright MCP, explores your site, and generates test cases only for flows not already covered by your existing tests. It uses semantic deduplication — so even if titles are worded differently, it won't push duplicates.

---

## Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `target_url` | — | Website to explore (required) |
| `qase_api_token` | — | Your Qase API token (required) |
| `qase_project_code` | — | Qase project code (required) |
| `max_cases` | 30 | Stop after pushing this many new cases |
| `delay_between_requests_ms` | 300 | Delay between Qase API calls |
| `headless` | false | `true` = invisible browser, `false` = visible |
| `explore_depth` | 3 | How many link levels deep to follow |

---

## How Deduplication Works

Both commands share `state.json`. The `/run-agent` command checks every candidate test case against existing `pushed_titles` using two layers:

1. **Exact match** — identical title → skip
2. **Semantic match** — same intent, different wording → skip
   - e.g. `"should login successfully"` and `"Login with valid credentials"` both map to `AUTH_LOGIN + POSITIVE_FLOW` → treated as the same case

Every skip decision is logged to `agent.log` with the reason.

---

## Resuming After Interruption

`state.json` is saved after every push. If a run is interrupted, just re-run the same command — it will skip everything already done and continue from where it left off.

To start completely fresh, reset `state.json`:
```json
{
  "visited_urls": [],
  "pushed_titles": [],
  "suites": {},
  "synced_files": [],
  "total_pushed": 0
}
```

---

## Qase Rate Limits

Qase allows 200 API requests/minute. The agent respects this automatically with a 300ms delay between calls and a 60-second backoff on 429 errors.
