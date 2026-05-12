# Public Staging

This is the public-safe staging overview for StateCue.

## What Is Public

- Web dashboard: `https://statecue-staging.web.app`
- Hosting platform: Firebase Hosting
- Data mode: deterministic mock data
- Product boundary: non-medical wellness cue for reflection only

## What Is Private By Design

- Cloud Run API anonymous access
- GCP operator inventory
- Billing identifiers
- IAM member details
- Deploy service identities
- Real health data, accounts, auth, and wearable integrations

Anonymous API requests returning `403` are expected. The public web dashboard does not require API access; it stays usable with deterministic local mock data.

## Review Path

1. Open `https://statecue-staging.web.app`.
2. Start with the default Light cue.
3. Switch to Check to see stale data freshness reduce clarity.
4. Switch to Rest to see low sleep plus elevated fatigue shift the cue.
5. Confirm the first viewport says mock/demo, non-medical, and no real health data.

The public staging demo should feel intentional even when the API is private. Do not add real data, auth, account setup, wearable integrations, or medical claims to this surface without a fresh review.
