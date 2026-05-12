# ADR 0001: Keep Staging API Private

## Status

Accepted

## Context

StateCue has two staging surfaces:

- Firebase Hosting serves the public mock dashboard.
- Cloud Run hosts the mock API.

The dashboard can optionally read API cue data, but it is designed to fall back to deterministic local mock data when API access is unset, unavailable, unauthorized, or contract-invalid.

## Decision

The public staging surface is Firebase Hosting. The Cloud Run API remains authenticated-only. Anonymous `/api/cue` returning `403` is expected.

The public web dashboard must remain usable through deterministic local mock fallback.

## Consequences

- Public reviewers can use the demo without API credentials.
- API access policy changes are not incidental deploy settings.
- Public API access requires a separate decision and explicit approval.

Before considering public API access, review:

- CORS policy
- endpoint contract
- rate and cost guardrails
- Cloud Run max instances
- budget posture
- mock-only and non-medical wording
- drift check updates
- explicit human approval for the exact GCP change
