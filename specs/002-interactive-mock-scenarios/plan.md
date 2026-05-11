# Implementation Plan: Interactive Mock Scenarios

## Objective

Turn the static StateCue mock dashboard into a deterministic interactive demo where `go`, `light`, `rest`, and `check` can be selected without adding backend complexity.

## Technical Direction

- Keep implementation under `apps/web`.
- Use HeroUI v3 Tabs for the scenario selector.
- Store scenarios as local mock fixtures that share the existing cue contract.
- Keep the default selection deterministic: `light`.
- Do not add API, persistence, auth, routing, or live data setup.

## UI Direction

- Place the scenario selector near the top of the dashboard.
- Keep the first viewport focused on the active cue and safety boundary.
- Add a concise primary signal line, such as `Primary limiter: Fatigue`.
- Keep signal cards and rationale synchronized with the selected scenario.

## Verification

Run:

```bash
npm --prefix apps/web run typecheck
npm --prefix apps/web run build
bash scripts/check.sh
```

## Risks

- Making the demo feel like a real data connection.
- Adding too much scenario explanation and weakening the first-screen decision surface.
- Letting rest/check wording drift toward medical advice.
