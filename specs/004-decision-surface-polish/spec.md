# Feature Spec: Decision Surface Polish

## Summary

StateCue tightens the lower dashboard reference area so it explains the deterministic cue logic without repeating the scenario selector.

## User Story

As a demo reviewer, I want the selected scenario to stay focused while still seeing a compact cue logic reference, so I can understand how `go`, `light`, `rest`, and `check` differ without reading duplicate scenario summaries.

## Functional Requirements

- Keep the first viewport mock/demo and non-medical boundaries unchanged.
- Keep deterministic scenario switching unchanged.
- Replace the lower scenario-summary repeat with a compact cue logic reference.
- Show all four canonical directions: `go`, `light`, `rest`, and `check`.
- Explain each direction in product-specific language tied to support, limiter, recovery bias, or signal quality.
- Avoid medical, diagnostic, treatment, prediction, or performance-guarantee claims.

## Non-Goals

- Backend/API work
- Auth, accounts, persistence, or deployment
- Live integrations or real health data
- New interaction model
- Playwright or test framework setup

## Acceptance Criteria

- The selector remains the only interactive scenario control.
- The lower reference no longer duplicates the active scenario summaries.
- A reviewer can scan the cue taxonomy and understand the deterministic rule shape.
- Existing typecheck, build, and public-safety checks pass.
