# Feature Spec: Interactive Mock Scenarios

## Summary

StateCue lets a reviewer switch between deterministic mock scenarios for `go`, `light`, `rest`, and `check`. The feature shows how the same dashboard changes when sleep, load, fatigue, and data freshness signals change.

This is still a frontend-only demo. It does not add real data, accounts, integrations, persistence, or backend/API code.

## User Story

As a reviewer exploring StateCue, I want to switch between the four canonical cue states so I can understand what makes the product show go, light, rest, or check without connecting any private data.

## Functional Requirements

- Show a deterministic scenario selector for `go`, `light`, `rest`, and `check`.
- Keep `light` as the default selected scenario.
- Update the active cue title, canonical state, clarity, rationale, and signal cards when the selected scenario changes.
- Keep all values clearly mock/demo only.
- Keep the non-medical safety boundary visible in the first viewport and in the mock data boundary alert.
- Avoid persistence, routing, accounts, auth, live integrations, and backend/API code.

## Scenario Requirements

- `go`: supportive sleep, manageable load, low or moderate fatigue, current freshness, high clarity.
- `light`: supportive sleep, moderate load, elevated fatigue, current freshness, medium clarity.
- `rest`: low sleep, elevated fatigue, elevated or high load, current freshness, medium clarity.
- `check`: stale or missing freshness, mixed signals, low clarity.

Each scenario should explain the primary support, limiter, or signal-quality issue in plain language.

## Acceptance Criteria

- A reviewer can switch between all four canonical states from the dashboard.
- The cue, rationale, signal summaries, and clarity indicator change together.
- The UI remains responsive and usable on mobile and desktop.
- The product remains frontend-only and mock-first.
- Public-safety checks, typecheck, and production build pass.

