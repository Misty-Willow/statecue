# GCP Staging Runbook

This document records the public-safe StateCue staging posture. It does not authorize production traffic, real health data, auth expansion, wearable integrations, medical claims, custom domains, public API access, or billing-impacting changes.

Detailed operator inventory such as billing account IDs, project numbers, personal emails, image digests, exact IAM members, and service account names must stay outside the public repository. Keep those values in a local ignored operator note or shell environment.

## Current Posture

- GCP project ID: `statecue-staging`
- GCP project name: `StateCue Staging`
- Region: `asia-northeast1`
- Firebase Hosting URL: `https://statecue-staging.web.app`
- Cloud Run service: mock API, authenticated only
- Anonymous API access: expected `403`
- Web data mode: deterministic local mock fallback when API access is unavailable
- Cloud Run minimum instances: 0
- Cloud Run maximum instances: 1
- Budget posture: billing is enabled with a staging budget alert

## Cost Posture

The staging service is configured to minimize idle cost:

- Cloud Run uses request-based billing by default.
- `min-instances=0` allows the service to scale to zero.
- `max-instances=1` caps accidental scale-out.
- The API is authenticated, so anonymous public traffic receives `403`.
- Firebase Hosting serves the mock-only web dashboard from `apps/web/dist`.
- A budget alert is expected for the staging project.

This does not make staging free. Possible charges include Cloud Run request processing, container startup and shutdown time, Artifact Registry storage, Cloud Build minutes, Cloud Logging, Firebase Hosting storage and transfer beyond free allowance, and network egress. If the demo is not being reviewed, keep Cloud Run authenticated, keep min instances at 0, keep max instances at 1, and avoid repeated smoke loops.

Official references:

- Cloud Run pricing: <https://cloud.google.com/run/pricing>
- Cloud Run scale to zero and pay-per-use overview: <https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run>
- Cloud Run billing settings: <https://docs.cloud.google.com/run/docs/configuring/billing-settings>

## Public Access Boundary

The public demo surface is Firebase Hosting. The Cloud Run API remains private by design.

Expected public behavior:

- `https://statecue-staging.web.app` returns the StateCue dashboard.
- Anonymous requests to the Cloud Run API return `403`.
- The web dashboard stays usable through deterministic local mock data.
- No real health data, accounts, auth flows, wearable integrations, or private records are used.

## Verification Commands

Run the public web build checks:

```bash
npm --prefix apps/web run build
bash scripts/check-web-build.sh
```

Run the non-mutating staging drift check after loading local operator values into the environment:

```bash
bash scripts/check-gcp-staging.sh
```

The drift check verifies the project state, billing flag, budget alert, Cloud Run service URL, current image, invoker policy, deploy identity posture, removal of temporary broad default-compute grants, the expected `403` response for anonymous API requests, and the hosted web dashboard.

Required local environment values:

```bash
PROJECT_NUMBER=...
BILLING_ACCOUNT=...
BUDGET_NAME=...
EXPECTED_IMAGE=...
EXPECTED_URL=...
EXPECTED_INVOKER=...
DEPLOYER_SA=...
```

These values are intentionally not committed to the public repo.

Confirm the hosted web dashboard:

```bash
curl -fsSI https://statecue-staging.web.app
curl -fsS https://statecue-staging.web.app | grep -F "StateCue"
```

Expected result: `200 OK` with the StateCue HTML shell. The hosted dashboard uses local deterministic mock data while the Cloud Run API remains authenticated.

## Future Work

- Keep detailed operator inventory in ignored local notes.
- Add a repeatable deploy script or CI workflow only after the deploy identity and secret posture are reviewed.
- Decide whether the API should remain authenticated, become public, or sit behind a frontend/backend boundary.
- Add stable HTTP health verification for authenticated staging.
- Decide whether Firebase Hosting should remain the public demo surface or move behind a custom domain.
- Decide whether to enable Artifact Registry vulnerability scanning.
