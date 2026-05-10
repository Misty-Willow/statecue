# Architecture Overview

StateCue starts as a small mock-data product surface. The architecture should keep the demo useful while leaving a clean path to a Go API later.

## System Shape

```text
Mock cue source
      |
      v
React + Vite web app
      |
      v
HeroUI v3 experience
```

Future server slice:

```text
Mock/demo cue contract
      |
      v
Go API
      |
      v
React + Vite web app
```

## Frontend

The web app should own the first demo experience:

- Display today's StateCue direction.
- Show sleep, load, fatigue, and data freshness signals.
- Explain the cue in plain language.
- Clearly label mock/demo data.
- Include a concise non-medical safety note.

HeroUI v3 is the UI baseline. Components should be selected from local docs before implementation.

## API

A Go API is optional for the first foundation. When added, it should expose a small mock cue response rather than connecting to external platforms.

Candidate response shape:

```json
{
  "date": "2026-05-11",
  "direction": "light",
  "confidence": "medium",
  "signals": {
    "sleep": "supportive",
    "load": "moderate",
    "fatigue": "elevated",
    "freshness": "current"
  },
  "rationale": "Sleep is supportive and recent load is manageable, but fatigue suggests keeping effort light today.",
  "dataMode": "mock"
}
```

## Data Boundary

StateCue uses mock/demo data only until a future approved data-connection plan exists. No private user records, credentials, non-public exports, or connection setup notes should be stored in the repository.

## Safety Boundary

StateCue is a non-medical wellness direction aid. The system should not diagnose, treat, prevent, or predict health conditions. Product copy should frame output as a daily cue for reflection, not as professional advice.

## Verification Expectations

Foundation checks should confirm:

- Required docs and specs exist.
- Old or unrelated project names are absent.
- Credential-like files are absent.
- Product copy uses StateCue naming and mock/demo data language.
- Medical claims stay outside the product boundary.
