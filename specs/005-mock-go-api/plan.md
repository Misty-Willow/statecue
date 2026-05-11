# Plan: Mock Go API

## Approach

Build the first StateCue server slice as a small standard-library Go service. Keep the API deterministic and local-first so it can later be deployed deliberately, but do not add deployment resources or cloud commands in this slice.

## API Shape

```text
GET /healthz
GET /api/cue
GET /api/cue?scenario=go
GET /api/cue?scenario=light
GET /api/cue?scenario=rest
GET /api/cue?scenario=check
GET /api/scenarios
```

## Verification

- `go test ./...` in `apps/api`
- `go build -o /tmp/statecue-api ./cmd/statecue-api` in `apps/api`
- `bash scripts/check.sh`
- Existing web typecheck, test, and build

## Distribution Boundary

The API should be shaped for a future Cloud Run style deployment, especially by listening on `PORT`, but deployment is outside this slice. GCP, billing, public external service integration, and production deployment still require explicit approval.
