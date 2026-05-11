# Specification: Cloud Run Readiness

## Summary

StateCue prepares the local mock Go API for Cloud Run deployment without actually creating cloud resources, enabling GCP APIs, pushing images, or causing billing.

## User Story

As a project maintainer, I want the mock API packaged as a container and documented for Cloud Run, so the project can cross the deployment approval gate with a tested artifact instead of guesswork.

## Requirements

- Add a container build artifact for `apps/api`.
- Keep the container compatible with Cloud Run service requirements.
- Verify the container locally before any GCP deployment.
- Document exact pre-deploy decisions and approval gates.
- Keep all data mock/demo only.
- Keep non-medical safety boundaries intact.
- Keep deployment commands as documentation only.

## Non-Goals

- No `gcloud` deploy command execution.
- No GCP project changes.
- No Artifact Registry creation.
- No Cloud Run service creation.
- No public domain, load balancer, secret, auth, or billing setup.
- No frontend-to-API integration in this slice.

## Acceptance Criteria

- Docker image builds locally for the API.
- Container smoke test confirms `/healthz` and `/api/cue` work.
- CI can build the API container image.
- Documentation names the approval gate before any GCP command that creates resources or costs money.
