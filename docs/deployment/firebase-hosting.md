# Firebase Hosting Runbook

This document records the Firebase Hosting workflow for the public StateCue staging dashboard. The hosted web surface is mock-only and must not introduce real health data, auth, wearable integrations, private records, or medical claims.

## Current Staging Surface

- Firebase project: `statecue-staging`
- Hosting site: `statecue-staging`
- Public URL: `https://statecue-staging.web.app`
- Hosting source directory: `apps/web/dist`
- Firebase config: `.firebaserc` and `firebase.json`
- API posture: Cloud Run remains authenticated only; the hosted web dashboard falls back to deterministic local mock data.

Anonymous Cloud Run API requests returning `403` are expected. The public demo should be reviewed through the Hosting URL, not through direct API access.

## Local Build Smoke

Run this before deploying Hosting:

```bash
npm --prefix apps/web run build
bash scripts/check-web-build.sh
```

The build smoke verifies the generated HTML shell, referenced JS/CSS assets, StateCue product text, mock/demo labels, the Japanese copy, non-medical safety text, and the canonical `go`, `light`, `rest`, and `check` cue directions.

## Deploy

Use the official Firebase CLI through `npx`:

```bash
npx -y firebase-tools@latest deploy --only hosting --project statecue-staging
```

This releases the already-built `apps/web/dist` directory to the default Hosting site. Do not use this command for production, custom domains, public API changes, or real integrations without a fresh approval and review.

## Preview Channels

Use preview channels for reviewable web changes before releasing the live staging URL:

```bash
npm --prefix apps/web run build
bash scripts/check-web-build.sh
npx -y firebase-tools@latest hosting:channel:deploy preview-BRANCH_OR_PR --project statecue-staging --expires 7d
```

Preview channels create temporary URLs. Treat them as public demo surfaces: mock data only, no secrets, no private user records, and no medical claims.

## Post-Deploy Smoke

Run the staging drift check after a live deploy:

```bash
bash scripts/check-gcp-staging.sh
```

The drift check verifies that the Hosting URL returns the StateCue HTML shell and that the Cloud Run API still returns `403` for anonymous `/api/cue` requests.

## Rollback

List releases:

```bash
npx -y firebase-tools@latest hosting:releases:list --site statecue-staging --project statecue-staging
```

Rollback in the Firebase Console if the live site needs to return to a previous release. After rollback, run:

```bash
bash scripts/check-gcp-staging.sh
```

Do not delete the Hosting site or Firebase project as part of rollback unless explicitly requested.
