# Repository Structure

StateCue is organized as a small public project with a documentation-first foundation and room for a web app plus optional API.

## Intended Layout

```text
statecue/
  DESIGN.md
  README.md
  docs/
    plan.md
    structure.md
    architecture/
      overview.md
    deployment/
      gcp-predeploy-plan.md
      gcp-staging.md
  specs/
    001-statecue-mock-direction/
      spec.md
      plan.md
      tasks.md
    002-interactive-mock-scenarios/
      spec.md
      plan.md
      tasks.md
    003-deterministic-cue-derivation/
      spec.md
      plan.md
      tasks.md
    004-decision-surface-polish/
      spec.md
      plan.md
      tasks.md
    005-mock-go-api/
      spec.md
      plan.md
      tasks.md
  apps/
    web/
    api/
```

## Ownership

- `DESIGN.md`: product promise, tone, safety boundary, and visual direction.
- `docs/plan.md`: public foundation plan and milestone boundary.
- `docs/structure.md`: repository map and contribution expectations.
- `docs/architecture/overview.md`: high-level system shape and data boundary.
- `docs/deployment/gcp-predeploy-plan.md`: historical approval-gated GCP planning notes.
- `docs/deployment/gcp-staging.md`: current GCP staging inventory, cost posture, IAM review, and verification notes.
- `specs/001-statecue-mock-direction/`: first demo feature definition.
- `specs/002-interactive-mock-scenarios/`: deterministic scenario switching feature definition.
- `specs/003-deterministic-cue-derivation/`: mock cue derivation and signal severity feature definition.
- `specs/004-decision-surface-polish/`: compact cue logic reference and dashboard polish feature definition.
- `specs/005-mock-go-api/`: local Go API feature definition.
- `apps/web`: current React + Vite + HeroUI v3 mock dashboard implementation.
- `apps/api`: current local Go API for deterministic mock cue responses.

## Public Boundary Rules

- Use the product name StateCue and repo slug `statecue`.
- Use mock/demo data until future data connections are explicitly approved.
- Keep non-medical safety language visible in product and docs.
- Do not commit credentials, private user records, connection setup notes, or unrelated project context.
- Keep public docs concise and understandable without internal planning history.

## Documentation Style

Docs should be direct, polished, and implementation-aware. Prefer clear product language over internal shorthand. When a document describes user-facing behavior, include acceptance criteria or verification notes so the next worker can implement without expanding scope.
