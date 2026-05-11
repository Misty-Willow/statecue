# Specification: Mock Go API

## Summary

StateCue adds a local Go API that serves the same deterministic mock cue contract as the web demo. The API makes the product feel more real without adding accounts, persistence, integrations, deployment, or real health data.

## User Story

As a reviewer, I want to query a small local API for StateCue's mock daily cue, so I can see the product boundary and cue logic expressed as an API response as well as a web dashboard.

## Requirements

- Add `apps/api` as a Go service.
- Serve deterministic mock data only.
- Include `GET /healthz` for local readiness checks.
- Include `GET /api/cue` for the default mock cue.
- Include `GET /api/cue?scenario=go|light|rest|check` for canonical demo states.
- Include `GET /api/scenarios` for all canonical scenarios.
- Keep `dataMode: "mock"` and non-medical safety copy in API responses.
- Keep API verification in CI.

## Non-Goals

- No GCP deployment.
- No cloud resource creation.
- No billing-impacting changes.
- No auth, accounts, persistence, wearable integrations, or real health data.
- No frontend API integration in this slice.

## Acceptance Criteria

- The API runs locally with `go run ./cmd/statecue-api` from `apps/api`.
- `go test ./...` passes under `apps/api`.
- `bash scripts/check.sh` verifies API source presence and public boundaries.
- CI runs Go API tests and build when `apps/api/go.mod` exists.
