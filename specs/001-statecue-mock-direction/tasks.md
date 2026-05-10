# Tasks: Mock Daily Direction

## Foundation

- [x] Define public product promise and safety boundary.
- [x] Define repository structure expectations.
- [x] Define architecture overview for mock-first web experience.
- [x] Define mock daily direction spec.

## Implementation Tasks

- [ ] Read local HeroUI v3 docs for components used in the first screen.
- [ ] Create a local mock cue data module.
- [ ] Build the StateCue first-screen experience in `apps/web`.
- [ ] Display product name, tagline, and Japanese copy.
- [ ] Display one active mock direction: Go, Light, Rest, or Check.
- [ ] Display sleep, load, fatigue, and data freshness as separate signals.
- [ ] Add rationale, confidence, mock-data label, and non-medical safety note.
- [ ] Add responsive styling for mobile and desktop.
- [ ] Run available checks.
- [ ] Scan for old product names, credential-like files, private references, and medical overclaims.

## Out of Scope

- Integrations
- Private user records
- Authentication
- Backend persistence
- Package installation
- Frontend implementation in this foundation slice

## Review Checklist

- [ ] Uses StateCue naming only.
- [ ] Uses mock/demo data language only.
- [ ] Does not include credentials or private user records.
- [ ] Does not imply medical diagnosis or treatment.
- [ ] Keeps public copy concise and polished.
- [ ] Does not mention unrelated project history or internal planning context.
