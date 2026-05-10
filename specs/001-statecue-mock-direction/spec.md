# Feature Spec: Mock Daily Direction

## Summary

StateCue displays a daily recovery direction based on mock sleep, load, fatigue, and data freshness signals. The feature demonstrates the product promise without private user records or external integrations.

Tagline: Daily recovery direction from sleep, load, and fatigue signals.

Japanese copy: 今日の状態から、進む合図を。

## User Story

As a person checking in before the day begins, I want a simple cue based on sleep, load, fatigue, and data freshness signals so I can choose whether to go, keep effort light, rest, or check the signal quality before acting.

## Direction Model

The mock direction can be one of:

- `go`: signals are generally supportive of normal or higher effort.
- `light`: signals suggest lowering intensity while staying active.
- `rest`: signals suggest prioritizing recovery and lower effort.
- `check`: signals are stale, missing, or conflicting enough that the cue should not overstate direction.

Each direction must include:

- A short title
- A plain-language rationale
- Sleep signal
- Load signal
- Fatigue signal
- Data freshness signal
- Confidence or clarity indicator
- Mock-data label
- Non-medical safety note

## Functional Requirements

- Show the StateCue product name on the main experience.
- Show the tagline: Daily recovery direction from sleep, load, and fatigue signals.
- Include the Japanese copy where it fits naturally.
- Present one active mock daily cue.
- Make sleep, load, fatigue, and data freshness visible as separate supporting signals.
- Explain why the cue was selected in one or two sentences.
- Label all values as mock/demo data.
- Include a non-medical safety boundary in user-facing copy.
- Avoid any claim that the cue diagnoses, treats, prevents, or predicts a health condition.

## Non-Goals

- Wearable, wellness platform, or calendar integrations
- Private user record ingestion
- Account creation or user profiles
- Long-term trend analysis
- Medical recommendations
- Backend persistence

## Acceptance Criteria

- A reviewer can understand what StateCue does from the first screen and this spec.
- The mock cue is useful without any private data.
- The safety boundary is visible and unambiguous.
- The feature can be implemented fully in the web app first.
- A later API can serve the same mock cue contract without changing user-facing language.

## Example Mock Cue

```json
{
  "direction": "light",
  "title": "Light day",
  "confidence": "medium",
  "signals": {
    "sleep": "supportive",
    "load": "moderate",
    "fatigue": "elevated",
    "freshness": "current"
  },
  "rationale": "Sleep looks supportive and recent load is manageable, but elevated fatigue makes a lighter pace the better cue today.",
  "dataMode": "mock",
  "safetyNote": "StateCue is a non-medical wellness cue based on demo data."
}
```
