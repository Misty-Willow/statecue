# GCP Staging Runbook

This document records the current StateCue staging deployment. It is an operations note for the mock API only; it does not authorize production traffic, real health data, auth expansion, wearable integrations, or medical claims.

## Current Inventory

- GCP project ID: `statecue-staging`
- GCP project name: `StateCue Staging`
- GCP project number: `520798282771`
- Region: `asia-northeast1`
- Billing account: `01A659-C200D3-3FBA8E`
- Budget alert: `StateCue Staging JPY 1600 Monthly Alert`
- Budget scope: `projects/520798282771`
- Budget period: monthly
- Budget thresholds: 50%, 90%, 100%
- Artifact Registry repository: `statecue`
- Artifact Registry location: `asia-northeast1`
- Artifact Registry format: Docker
- Current image tag: `asia-northeast1-docker.pkg.dev/statecue-staging/statecue/statecue-api:12cf408`
- Current image digest: `sha256:c942ae579313f7915686f51ad0c3b2b12f6bf47ea0c890cb13429eb76b8a5c93`
- Cloud Run service: `statecue-api`
- Cloud Run URL: `https://statecue-api-g7es36aabq-an.a.run.app`
- Cloud Run revision: `statecue-api-00001-w4b`
- Cloud Run access: authenticated only
- Cloud Run invoker: `user:runwize.app@gmail.com`
- Firebase Hosting site: `statecue-staging`
- Firebase Hosting URL: `https://statecue-staging.web.app`
- Deploy service account: `statecue-deployer@statecue-staging.iam.gserviceaccount.com`
- Cloud Run minimum instances: 0
- Cloud Run maximum instances: 1
- Cloud Run memory: 256 MiB
- Cloud Run CPU: 1

Deleted setup attempts:

- `statecue-demo-20260512`: `DELETE_REQUESTED`
- `statecue`: `DELETE_REQUESTED`

## Cost Posture

The staging service is configured to minimize idle cost:

- Cloud Run uses request-based billing by default.
- `min-instances=0` allows the service to scale to zero.
- `max-instances=1` caps accidental scale-out.
- The API is authenticated, so anonymous public traffic receives `403`.
- The current container image is small and stored in one Artifact Registry repository.
- Firebase Hosting serves the mock-only web dashboard from `apps/web/dist`.
- A JPY 1600 monthly budget alert is scoped to the staging project.

This does not make staging free. Possible charges include Cloud Run request processing, container startup and shutdown time, Artifact Registry storage, Cloud Build minutes, Cloud Logging, Firebase Hosting storage and transfer beyond free allowance, and network egress. Keep this environment quiet unless intentionally testing it.

Official references:

- Cloud Run pricing: <https://cloud.google.com/run/pricing>
- Cloud Run scale to zero and pay-per-use overview: <https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run>
- Cloud Run billing settings: <https://docs.cloud.google.com/run/docs/configuring/billing-settings>

## IAM Review

Expected project-level bindings after deployment:

- `user:runwize.app@gmail.com`: `roles/owner`
- Google-managed service agents for Artifact Registry, Cloud Build, Container Registry, Pub/Sub, and Cloud Run
- Cloud Build default service account: `roles/cloudbuild.builds.builder`
- `statecue-deployer@statecue-staging.iam.gserviceaccount.com`: `roles/run.developer`

Expected Artifact Registry repository-level binding:

- `statecue-deployer@statecue-staging.iam.gserviceaccount.com`: `roles/artifactregistry.writer` on `statecue`

Expected runtime service account binding:

- `statecue-deployer@statecue-staging.iam.gserviceaccount.com`: `roles/iam.serviceAccountUser` on `520798282771-compute@developer.gserviceaccount.com`

Expected service-level binding:

- `user:runwize.app@gmail.com`: `roles/run.invoker` on `statecue-api`

Removed after deployment:

- `520798282771-compute@developer.gserviceaccount.com`: `roles/storage.objectViewer`
- `520798282771-compute@developer.gserviceaccount.com`: `roles/artifactregistry.writer`

Those two broad project-level grants were used to get the first Cloud Build image upload working. They are not part of the steady-state staging posture. A future automated deploy slice should use a dedicated build service account with repository-scoped permissions instead of reusing the default compute service account.

The current deploy service account is prepared for future manual or automated staging deploys. It is not a user login identity and has no key files in this repository.

## Verification Commands

Run the non-mutating staging drift check:

```bash
bash scripts/check-gcp-staging.sh
```

This verifies the project, billing flag, budget alert, Cloud Run service URL, current image, invoker policy, deploy service account, removal of temporary broad default-compute grants, the expected `403` response for anonymous API requests, and the hosted web dashboard.

List the active staging service:

```bash
gcloud run services describe statecue-api \
  --project statecue-staging \
  --region asia-northeast1
```

Confirm the service is not public:

```bash
curl -i https://statecue-api-g7es36aabq-an.a.run.app/api/cue
```

Expected result: `403 Forbidden`.

Confirm the hosted web dashboard:

```bash
curl -fsSI https://statecue-staging.web.app
curl -fsS https://statecue-staging.web.app | grep -F "StateCue"
```

Expected result: `200 OK` with the StateCue HTML shell. The hosted dashboard uses local deterministic mock data while the Cloud Run API remains authenticated.

Use the authenticated proxy for manual smoke tests:

```bash
gcloud run services proxy statecue-api \
  --project statecue-staging \
  --region asia-northeast1 \
  --port 18081
```

Then, in another shell:

```bash
curl -fsS http://127.0.0.1:18081/api/cue
curl -fsS http://127.0.0.1:18081/api/scenarios
```

Expected results:

- `/api/cue` returns a mock cue with `"direction":"light"` and `"dataMode":"mock"`.
- `/api/scenarios` returns the deterministic `go`, `light`, `rest`, and `check` mock scenarios.

## Future Work

- Add a dedicated deploy service account with least-privilege Artifact Registry write access.
- Add a repeatable deploy script or CI workflow only after the deploy identity is settled.
- Decide whether the API should remain authenticated, become public, or sit behind a frontend/backend boundary.
- Add stable HTTP health verification for authenticated staging.
- Decide whether Firebase Hosting should remain the public demo surface or move behind a custom domain.
- Decide whether to enable Artifact Registry vulnerability scanning.
