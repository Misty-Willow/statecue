# Implementation Plan: Running Plan Agent V1 Realignment

## Objective

Realign StateCue around a running-focused recovery agent:

```text
weekly running plan + previous-day health/training signals
  -> deterministic scoring
  -> AI-assisted explanation
  -> adjusted next workout
  -> feedback and eval loop
```

This is a product and architecture reset before deeper implementation. The public repo should not copy old Recovery Compass text, but it should recover the stronger product thesis.

## Current Gap

The current StateCue dashboard is safe and deployable, but it is too shallow:

- It shows a cue, not a training-plan adjustment.
- It abstracts health data into four broad signals.
- It does not show a weekly running plan.
- It does not show HRV, resting HR delta, load history, soreness, planned activity, or feedback state.
- It does not make the AI agent loop visible.
- It does not make Google Cloud usage feel necessary beyond hosting.

## Product Direction

StateCue V1 should become:

> A running-plan adjustment agent that uses health and training signals to decide whether tomorrow's workout should stay as planned, become lighter, become recovery-only, or require a check.

The product should feel like an operational cockpit for one daily running decision, not a broad health dashboard or generic coach.

## UX Direction

Replace the LP-like single-page feel with a focused app shell:

- Desktop sidebar: Today, Plan, Signals, History, Data & Trust, Eval
- Mobile top bar + bottom navigation
- Dashboard-first public demo
- Auth/connect surfaces as planned states, not blockers for the public mock demo
- Data-rich widgets:
  - next workout adjustment
  - weekly running plan
  - readiness radar
  - sleep / HRV / resting HR / load / fatigue trends
  - data freshness
  - reason stack
  - feedback action strip

The first viewport should show:

- StateCue product name
- today's adjusted training direction
- planned vs adjusted workout
- top limiter
- data mode and freshness
- non-medical safety note
- a clear path into weekly plan and signals

## Technical Direction

### Frontend

- React + Vite + HeroUI v3 remains the web stack.
- Keep component boundaries compatible with a future React Native style mental model:
  - app shell
  - screen components
  - data cards
  - chart widgets
  - action sheets/drawers
- Use HeroUI for layout, cards, tabs, drawer, table, meter, progress, chips.
- Consider Evil Charts for radar once dependency impact is reviewed.

### API

Keep existing endpoints for compatibility, then add a richer dashboard contract later:

- Existing:
  - `GET /healthz`
  - `GET /api/cue`
  - `GET /api/scenarios`
- Future:
  - `GET /api/dashboard`
  - `GET /api/plan/week`
  - `POST /api/feedback`
  - `GET /api/evals/summary`

### Scoring

Go scoring should decide:

- score
- zone
- direction
- adjusted session category
- safety downgrade
- confidence/data quality

The AI layer should generate:

- explanation
- action wording
- guardrails
- short summary

### Google Cloud Story

Use Google Cloud because this is an operational agent:

- Cloud Run: API/scoring/agent runtime.
- Firebase Hosting/Auth: public app and future identity.
- Gemini/ADK: explanation and agent orchestration.
- Firestore: plan, decision, feedback.
- BigQuery: eval and decision logs.
- Cloud Logging/Monitoring: runtime visibility.

## PR Sequence

### PR 1 - Product Realignment Docs

- Add this spec/plan/tasks set.
- Add source-materials local directory guidance.
- Update structure docs.
- Do not implement runtime changes.

### PR 2 - Dashboard App Shell

- Split `DashboardShell` into app shell and screens.
- Add sidebar/mobile nav shell.
- Keep current cue content working.
- No new chart dependency yet.

### PR 3 - Data-Rich Mock Model

- Add weekly running plan mock data.
- Add health snapshot fields for HRV, resting HR, load, fatigue, soreness, data freshness.
- Add plan adjustment model.
- Add eval event mock data.
- Update tests and build smoke.

### PR 4 - Running Plan Dashboard

- Add planned vs adjusted workout panel.
- Add weekly plan view.
- Add data quality panel.
- Add feedback strip.
- Add history/eval preview.

### PR 5 - Readiness Shape Chart

- Evaluate Evil Charts radar chart.
- Add radar chart only if dependency and styling fit.
- Preserve accessible table/meter fallback.

### PR 6 - Agent Contract

- Add API contract for dashboard plan adjustment.
- Add Go scoring expansion.
- Add deterministic fixtures and tests.
- Add AI explanation placeholder contract, still mock-only.

### PR 7 - Firebase Auth / Health Adapter Planning

- Add ADR for Firebase Auth vs health OAuth separation.
- Add UI planned states for sign-in/connect.
- Do not connect real health data until explicitly approved.

## Verification

Every implementation PR must run:

```bash
bash scripts/check.sh
npm --prefix apps/web run test
npm --prefix apps/web run typecheck
npm --prefix apps/web run build
bash scripts/check-web-build.sh
```

If API contracts change:

```bash
cd apps/api
go test ./...
```

## Open Questions

- Is the first sport focus running only, or running-first with later cycling/strength?
- Should the weekly plan be manually entered in V1, imported later, or generated from templates?
- Should feedback be per decision or per workout?
- Should Evil Charts be adopted directly, copied through shadcn-style install, or replaced with a custom SVG radar for bundle control?
- How far should the public demo go before Firebase Auth is real?
