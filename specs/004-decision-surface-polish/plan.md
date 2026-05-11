# Implementation Plan: Decision Surface Polish

## Objective

Reduce duplicate dashboard copy after interactive scenarios by turning the lower `Scenario contrast` area into a compact `Cue logic reference`.

## Technical Direction

- Stay frontend-only in `apps/web`.
- Keep the current HeroUI card, chip, tab, alert, and meter composition.
- Add small typed reference data beside the existing mock cue data.
- Do not change cue derivation rules, scenario inputs, or safety boundaries.

## Build Steps

1. Add a compact cue logic reference data shape.
2. Render that reference in the lower dashboard card.
3. Keep the scenario selector summary panels unchanged.
4. Update public docs and check script only enough to recognize the new slice.
5. Run typecheck, build, and public-safety checks.

## Risks

- Accidentally making the reference sound like medical advice.
- Reintroducing duplicate scenario summaries under a new heading.
- Expanding the PR into visual redesign instead of a focused polish.

## Definition of Done

- The dashboard has a distinct scenario selector and cue logic reference.
- The cue taxonomy remains `go` / `light` / `rest` / `check`.
- Mock/demo and non-medical copy remains visible.
- Verification passes.
