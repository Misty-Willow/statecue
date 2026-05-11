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
  specs/
    001-statecue-mock-direction/
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
- `specs/001-statecue-mock-direction/`: first demo feature definition.
- `apps/web`: current React + Vite + HeroUI v3 mock dashboard implementation.
- `apps/api`: reserved for a future Go API implementation when a server slice is explicitly selected.

## Public Boundary Rules

- Use the product name StateCue and repo slug `statecue`.
- Use mock/demo data until future data connections are explicitly approved.
- Keep non-medical safety language visible in product and docs.
- Do not commit credentials, private user records, connection setup notes, or unrelated project context.
- Keep public docs concise and understandable without internal planning history.

## Documentation Style

Docs should be direct, polished, and implementation-aware. Prefer clear product language over internal shorthand. When a document describes user-facing behavior, include acceptance criteria or verification notes so the next worker can implement without expanding scope.
