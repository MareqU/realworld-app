# Run QA Agent — Explore & Generate Missing Test Cases

Read `agent.config.json` and `tests/agents/shared/state.json` first. Follow all rules in `CLAUDE.md`.

---

## Phase 0 — Guard Check

1. Read `tests/agents/shared/state.json`
2. Check if `qase.synced_files` array is empty
3. If empty → **STOP immediately** and print:
   ```
   ⚠️  No existing Playwright tests have been synced yet.

   Please run /sync-playwright first to register your existing test coverage.
   This prevents the agent from generating duplicate test cases.

   Once sync is complete, run /run-agent again.
   ```
4. If `qase.synced_files` has at least one entry → continue to Phase 1

---

## Phase 1 — Setup

- Load config from `agent.config.json`
- Load full state from `tests/agents/shared/state.json` — especially `qase.pushed_titles`, `qase_suites`, and `qase.agent_pushed`
- Read `default_parent_suite` from config (e.g. `"UI"`) — this is the top-level suite all new cases will be nested under
- Note: `max_cases` applies ONLY to `qase.agent_pushed` — not `qase.total_pushed`. `/sync-playwright` pushes do not count toward this limit.
- Log start time and counts to `agent.log`
- Print: `ℹ️  Existing coverage: {qase.pushed_titles.length} test cases already in Qase`
- Print: `ℹ️  Agent has pushed {qase.agent_pushed} cases so far (limit: {max_cases})`
- Print: `ℹ️  Remaining budget: {max_cases - qase.agent_pushed} new cases`
- Print: `ℹ️  All new cases will be created under suite: "{default_parent_suite}"`

---

## Phase 2 — Explore & Generate

Start at: `{target_url from config}`

For each page visited:
1. Use Playwright MCP to navigate to the URL
2. Take an accessibility snapshot to see all interactive elements
3. Identify user flows (forms, buttons, navigation, modals, error states)
4. For each flow, generate candidate test cases (happy path + negative + edge case)
5. For each candidate → run semantic deduplication (see Phase 3)
6. Collect links to unvisited pages and add to queue (respect `explore_depth`)

---

## Phase 3 — Semantic Deduplication

Before queuing any candidate for pushing, check it against `tests/agents/shared/state.json` qase.pushed_titles:

**Check 1 — Exact title match:**
- If candidate title exactly matches any pushed title → SKIP
- Log: `[SKIP - EXACT] "<title>"`

**Check 2 — Semantic intent match:**
Normalise both the candidate and every existing title using these mappings:

| Raw words | Normalised intent |
|---|---|
| login / sign in / log in | AUTH_LOGIN |
| logout / sign out | AUTH_LOGOUT |
| register / sign up / create account | AUTH_REGISTER |
| valid / correct / successful / happy | POSITIVE_FLOW |
| invalid / incorrect / wrong / bad | NEGATIVE_FLOW |
| empty / blank / missing / required | EMPTY_INPUT |
| submit / save / confirm / send | FORM_SUBMIT |
| delete / remove | DELETE |
| edit / update / change / modify | UPDATE |
| navigate / go to / open / visit | NAVIGATE |

Combine the suite name + normalised intent tokens into a fingerprint.

- If fingerprint matches any existing title's fingerprint → SKIP
- Log: `[SKIP - SEMANTIC] "<candidate title>" covered by "<matched existing title>"`

**Check 3 — Passes both checks → PUSH**
- Log: `[PUSH] "<title>" — new coverage identified`

---

## Phase 4 — Push to Qase

For each candidate that passed deduplication:

1. **Resolve the parent suite (`default_parent_suite` from config):**
   - Check `tests/agents/shared/state.json` qase_suites for a key matching `default_parent_suite` (e.g. `"UI"`)
   - If not found → POST `https://api.qase.io/v1/suite/{qase_project_code}` with `{ "title": "UI" }`
   - Save returned `parent_suite_id` to `tests/agents/shared/state.json` qase_suites under key `"UI"`

2. **Resolve the feature sub-suite (e.g. "Login", "Dashboard"):**
   - Check `tests/agents/shared/state.json` qase_suites for a key matching `"{default_parent_suite}/{suite_title}"` (e.g. `"UI/Login"`)
   - If not found → POST `https://api.qase.io/v1/suite/{qase_project_code}` with:
     ```json
     { "title": "<suite_title>", "parent_id": <parent_suite_id> }
     ```
   - Save returned `suite_id` to `tests/agents/shared/state.json` qase_suites under key `"UI/Login"`

3. POST `https://api.qase.io/v1/case/{qase_project_code}`:
```json
{
  "title": "<title>",
  "description": "<description>",
  "preconditions": "<preconditions>",
  "priority": <1|2|3>,
  "type": 4,
  "suite_id": <sub-suite id from step 2>,
  "steps": [
    { "action": "<action>", "expected_result": "<expected_result>", "position": 1 }
  ]
}
```
4. On success:
   - Add title to `tests/agents/shared/state.json` qase.pushed_titles
   - Increment BOTH `qase.agent_pushed` and `qase.total_pushed`
   - Save `tests/agents/shared/state.json` immediately
5. Wait 300ms before next call
6. On 429 → wait 60 seconds, retry once

---

## Phase 5 — Continue or Stop

- If `qase.agent_pushed` >= `max_cases` → STOP (do NOT use qase.total_pushed for this check)
- If queue has unvisited URLs and depth <= `explore_depth` → visit next, back to Phase 2
- If queue empty → STOP

---

## Final Summary

```
✅ Agent run complete
─────────────────────────────
🌐 URLs explored:              X
🧪 New cases pushed:           X
⏭️  Skipped (exact match):     X
⏭️  Skipped (semantic match):  X
📂 Suites created:             X
❌ Errors:                     X
─────────────────────────────
Agent pushed this run:  X / {max_cases}
Total in Qase now:      X cases
```
