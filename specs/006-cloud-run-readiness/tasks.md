# Tasks: Cloud Run Readiness

## Implementation

- [x] Add API Dockerfile.
- [x] Add Docker build context exclusions.
- [x] Keep Cloud Run deployment commands documentation-only.
- [x] Avoid GCP resource creation, deployment, billing, auth, secrets, persistence, and real data.

## Verification

- [x] Run API Go tests.
- [x] Run API Go build.
- [x] Run API Docker build.
- [x] Run local container smoke.
- [x] Run public-safety checks.
- [x] Run existing web checks.
- [x] Run CI container build check.

## Review Checklist

- [x] Container listens through `PORT`.
- [x] Container does not require secrets.
- [x] Responses remain mock/demo scoped.
- [x] Approval gate remains before any GCP deployment or billing-impacting action.
