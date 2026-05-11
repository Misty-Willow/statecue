# Plan: Cloud Run Readiness

## Approach

Package the StateCue mock API as a small container that follows the Cloud Run service contract: the ingress container listens on `0.0.0.0` using the `PORT` environment variable. The existing Go server already reads `PORT`, so this slice adds the container artifact and verification around it.

## Local Verification

```bash
docker build -f apps/api/Dockerfile -t statecue-api:local .
docker run --rm -p 127.0.0.1:8080:8080 -e PORT=8080 statecue-api:local
curl -s http://127.0.0.1:8080/healthz
curl -s http://127.0.0.1:8080/api/cue
```

## CI Verification

The CI should build the container image and run a local container smoke test only. It must not push the image, authenticate to GCP, create registries, or deploy services.

## GCP Boundary

Actual deployment requires explicit approval. The next deployment slice should decide project, region, service name, Artifact Registry repository, public access, and rollback before running any `gcloud` command.
