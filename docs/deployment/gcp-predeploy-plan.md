# GCP Pre-Deployment Plan

This plan describes how StateCue can prepare for GCP without creating cloud resources or causing billing.

## Current Decision

Do not deploy yet. The repository now has a local web app, a local mock Go API, and a containerized API artifact, but GCP deployment remains behind explicit user approval.

## Candidate Shape

- Web: static frontend build artifact.
- API: Go HTTP service container that listens on `PORT`.
- Likely future target: Cloud Run for the API and a static hosting option for the web.

## Approval Gate

Require explicit approval before any of the following:

- Creating or modifying GCP projects.
- Enabling APIs.
- Creating Cloud Run services, artifact registries, buckets, domains, or load balancers.
- Running deployment commands.
- Activating paid services or billing-impacting changes.
- Connecting public external integrations.

## Pre-Deploy Checklist

- Confirm the demo remains mock-data only.
- Confirm no secrets or private records are required.
- Confirm local API tests and web checks pass.
- Confirm the API container builds locally.
- Confirm local container smoke passes.
- Decide web hosting target.
- Decide API hosting target.
- Decide GCP project.
- Decide GCP region.
- Decide Cloud Run service name.
- Decide Artifact Registry repository name.
- Decide rollback path before first deploy.
- Decide whether public access is acceptable for the API.

## Local Readiness Commands

These commands do not create GCP resources:

```bash
npm --prefix apps/web run test
npm --prefix apps/web run typecheck
npm --prefix apps/web run build
bash scripts/check.sh

cd apps/api
go test ./...
go build -o /tmp/statecue-api ./cmd/statecue-api
cd ../..

docker build -f apps/api/Dockerfile -t statecue-api:local .
docker run --rm -p 127.0.0.1:8080:8080 -e PORT=8080 statecue-api:local
curl -s http://127.0.0.1:8080/healthz
curl -s http://127.0.0.1:8080/api/cue
```

Stop the local container after the smoke test.

## Deployment Commands

Do not run these until the approval gate is crossed. They are placeholders for the deployment slice:

```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com
gcloud artifacts repositories create STATECUE_REPO --repository-format=docker --location=REGION
docker build -f apps/api/Dockerfile -t REGION-docker.pkg.dev/PROJECT_ID/STATECUE_REPO/statecue-api:TAG .
docker push REGION-docker.pkg.dev/PROJECT_ID/STATECUE_REPO/statecue-api:TAG
gcloud run deploy statecue-api --image REGION-docker.pkg.dev/PROJECT_ID/STATECUE_REPO/statecue-api:TAG --region REGION
```

## Not Included

- Terraform.
- Cloud Run service definition.
- GitHub Actions deployment workflow.
- Secret management setup.

Those belong in a deployment slice after the approval gate is crossed.
