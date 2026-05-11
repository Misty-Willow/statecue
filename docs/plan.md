# StateCue Public Foundation Plan

## Goal

Create a clean public foundation for StateCue: a hackathon-ready product story, architecture outline, and specification for a mock daily recovery direction experience.

Tagline: Daily recovery direction from sleep, load, and fatigue signals.

Japanese copy: 今日の状態から、進む合図を。

## Current Scope

This foundation covers documentation, specification, and public repository safety gates:

- Product design direction
- Repository structure guidance
- Architecture overview
- Mock-direction feature specification
- Implementation task outline for the first demo slice
- Public-safety scan script and initial GitHub Actions check

The web implementation lives in `apps/web` as a deterministic mock dashboard with interactive mock scenarios and cue derivation rules. Backend implementation, real data integration, and deployment setup remain outside this slice.

## Product Boundary

StateCue is a non-medical wellness direction aid. It uses mock/demo signals to explain a daily direction such as Go, Light, Rest, or Check. It must not present itself as a medical device, diagnostic system, clinical recommendation engine, or replacement for professional advice.

## First Demo Slice

The first demo should show:

- A current daily cue
- Four supporting signals: sleep, load, fatigue, and data freshness
- A short rationale for the cue
- A confidence or clarity indicator
- A visible mock-data label
- A concise non-medical safety note

## Success Criteria

- Public docs use only StateCue naming and public-safe wording.
- Specs clearly distinguish mock/demo data from future data connections.
- The first feature is small enough to implement in a React + Vite + HeroUI v3 web app.
- A future Go API can serve the same mock cue contract without changing the product story.
- Public-safety scans can reject credential-like files, private references, old product names, and misleading medical claims.

## Later Work

Future slices may add a mock API, richer cue explanation, persistence-free demo sessions, and optional data-connection planning. Anything beyond mock/demo data remains out of scope until explicitly approved and documented.
