# Implementation Plan: Deterministic Cue Derivation

## Objective

Move StateCue from static cue fixtures toward a small deterministic mock reasoning model while staying frontend-only and public-safe.

## Technical Direction

- Add `StateCueInputs` for sleep, load, fatigue, and freshness.
- Add `deriveDirection(inputs)` as the single direction decision point.
- Create displayed snapshots from scenario definitions plus derived direction metadata.
- Add `SignalSeverity` so visual state is not inferred directly from raw signal state.
- Keep the existing HeroUI dashboard surface and scenario selector.
- Do not add API, auth, persistence, integrations, deployment, or real data.

## Verification

Run:

```bash
npm --prefix apps/web run typecheck
npm --prefix apps/web run build
bash scripts/check.sh
```

Also verify in a browser that the default `light` scenario and at least one other scenario update correctly.

## Risks

- Making the rules look more authoritative than they are.
- Letting `rest` copy drift toward advice instead of a non-medical cue.
- Confusing raw signal state with visual severity.

