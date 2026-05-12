# Tasks: Running Plan Agent V1 Realignment

## Product Planning

- [x] Define StateCue V1 as a running-plan adjustment agent.
- [x] Preserve `go` / `light` / `rest` / `check`, but bind each cue to training-plan adjustment.
- [x] Distinguish deterministic Go scoring from AI explanation.
- [x] Document Google Cloud's role beyond hosting.
- [x] Add a local-only source-materials place for historical plans.

## Follow-Up Implementation Tasks

- Split the current dashboard into app shell and dashboard screen components.
- Add weekly running plan mock data.
- Add previous-day health snapshot mock data with HRV, resting HR delta, load, fatigue, soreness, and data freshness.
- Add plan adjustment model and tests.
- Add feedback state model for adopt, modify, and reject.
- Add eval event model and public-safe eval summary.
- Redesign the first viewport around planned vs adjusted workout.
- Add Data & Trust as a first-class dashboard section.
- Evaluate Evil Charts radar chart for readiness shape.
- Keep an accessible fallback for any charted readiness data.
- Add future API contract for richer dashboard data.
- Add ADR for Firebase Auth and health OAuth separation.

## Guardrails

- Do not add real health data.
- Do not add production Google Health OAuth.
- Do not add a public API access change.
- Do not let AI decide the score, zone, or direction.
- Do not copy old Recovery Compass text into public StateCue docs.
