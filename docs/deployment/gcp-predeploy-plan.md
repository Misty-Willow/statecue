# GCP Pre-Deployment Plan

This plan describes how StateCue can prepare for GCP without creating cloud resources or causing billing.

## Current Decision

Do not deploy yet. The repository now has a local web app and a local mock Go API, but GCP deployment remains behind explicit user approval.

## Candidate Shape

- Web: static frontend build artifact.
- API: Go HTTP service that listens on `PORT`.
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
- Decide web hosting target.
- Decide API hosting target.
- Decide rollback path before first deploy.
- Decide whether public access is acceptable for the API.

## Not Included

- Terraform.
- Dockerfile.
- Cloud Run service definition.
- GitHub Actions deployment workflow.
- Secret management setup.

Those belong in a deployment slice after the approval gate is crossed.
