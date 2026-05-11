# Feature Spec: Deterministic Cue Derivation

## Summary

StateCue derives the active cue from deterministic mock signal inputs instead of storing each scenario as a fully static cue. This keeps the demo frontend-only while making the cue model easier to inspect and review.

This slice still uses mock/demo data only. It does not add backend/API code, accounts, auth, persistence, live integrations, real health data, or private user records.

## User Story

As a reviewer, I want to see that StateCue's `go`, `light`, `rest`, and `check` states come from clear mock signal rules so the dashboard feels like a small reasoning demo rather than four unrelated static examples.

## Derivation Rules

- If data freshness is `stale` or `missing`, derive `check`.
- If sleep is `low` and fatigue is `elevated`, derive `rest`.
- If fatigue is `elevated` or load is `elevated`, derive `light`.
- Otherwise derive `go`.

The rules are intentionally small and deterministic. They are not medical scoring, clinical interpretation, prediction, or performance advice.

## Functional Requirements

- Define typed mock inputs for sleep, load, fatigue, and data freshness.
- Derive the canonical cue direction from those inputs.
- Keep `light` as the default selected scenario.
- Separate raw signal state from visual severity.
- Use visual severity, not raw state names, for signal color.
- Keep mock/demo and non-medical safety language visible.
- Keep the implementation under `apps/web`.

## Acceptance Criteria

- The scenario selector still exposes `go`, `light`, `rest`, and `check`.
- Each scenario's displayed direction matches the deterministic derivation rules.
- Signal colors remain meaningful even when a raw state such as `low` has different product meaning across signals.
- Typecheck, production build, and public-safety checks pass.
- Browser smoke confirms scenario switching still updates cue, rationale, clarity, primary signal, and signal cards.

