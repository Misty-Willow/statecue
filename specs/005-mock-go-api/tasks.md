# Tasks: Mock Go API

## Implementation

- [x] Add `apps/api` Go module.
- [x] Add deterministic mock cue logic.
- [x] Add `GET /healthz`.
- [x] Add `GET /api/cue`.
- [x] Add `GET /api/scenarios`.
- [x] Add API tests.
- [x] Keep frontend integration out of scope.
- [x] Avoid GCP deployment, cloud resources, auth, persistence, integrations, and real health data.

## Verification

- [x] Run Go tests.
- [x] Run Go build.
- [x] Run public-safety checks.
- [x] Run existing web checks.

## Review Checklist

- [x] Responses are mock/demo scoped.
- [x] Safety copy stays non-medical.
- [x] No private data, credentials, auth, persistence, or integrations are introduced.
- [x] Deployment remains planning-only.
