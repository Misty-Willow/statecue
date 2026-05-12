# StateCue

**Daily recovery direction from sleep, load, and fatigue signals.**

StateCue is a mock-first public demo that turns simple body-state signals into a clear daily cue: go, light, rest, or check. It is not a medical product, diagnosis tool, or replacement for professional advice.

## Why It Exists

Most recovery dashboards show metrics first and leave the user to interpret them. StateCue starts with the decision surface: what should today feel like, why, and how trustworthy is the signal?

The goal is a clean, credible dashboard that makes the reasoning visible without pretending to be clinical.

## Target Product Shape

- Today Cue: the primary daily direction.
- Signal Inputs: sleep, load, fatigue, and data freshness.
- Reasoning: short deterministic explanations behind the cue.
- Data & Trust: mock-mode boundaries, confidence, and safety copy.
- Public Demo: no secrets, no live personal health data, no private integrations.

## Planned Stack

```text
apps/
  web/    React + Vite + HeroUI v3
  api/    Go API for deterministic mock scoring

docs/     product, architecture, safety, and design material
specs/    Spec Kit feature artifacts
submission/ public demo assets and submission context
```

HeroUI v3 is the baseline UI system. Charting and loading effects are allowed only when they clarify the dashboard; they are not the visual foundation.

The current repository includes the public foundation, the mock web dashboard under `apps/web`, and a local mock Go API under `apps/api`.

## Development Flow

StateCue uses a Spec Kit style flow:

1. Define the product behavior in `specs/`.
2. Keep architecture and design decisions in `docs/`.
3. Implement the smallest mock-first vertical slice.
4. Verify with automated checks and public-safety scans before publishing.

For the web app:

```bash
npm --prefix apps/web ci
npm --prefix apps/web run test
npm --prefix apps/web run typecheck
npm --prefix apps/web run build
bash scripts/check.sh
```

The web app can optionally read mock cues from an API:

```bash
VITE_STATECUE_API_BASE_URL=http://127.0.0.1:8080 npm --prefix apps/web run dev
```

If the API URL is unset or unavailable, the dashboard keeps using the deterministic local mock data. The deployed staging API is authenticated, so a browser build pointed at that URL will safely fall back unless the access policy changes.

For the API:

```bash
cd apps/api
go test ./...
go run ./cmd/statecue-api
```

The API serves deterministic mock responses at `GET /healthz`, `GET /api/cue`, and `GET /api/scenarios`.

## Safety Boundary

StateCue works with mock data by default. Any real health, wearable, or account integration must be introduced behind explicit consent, clear data boundaries, and a fresh review.
