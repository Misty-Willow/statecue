# Implementation Plan: Mock Daily Direction

## Objective

Implement the first StateCue demo slice: a polished mock daily direction experience that explains a Go, Light, Rest, or Check cue from sleep, load, fatigue, and freshness signals.

This plan is implementation guidance only. The current foundation slice does not create frontend or backend code.

## Technical Direction

- Start in `apps/web` with React + Vite + HeroUI v3.
- Use local mock data in the first implementation.
- Keep the cue data contract small and serializable.
- Add a Go API only when a server-backed demo slice is explicitly selected.
- Use HeroUI v3 docs before selecting or composing components.

## Mock Data Contract

```ts
type Direction = "go" | "light" | "rest" | "check";
type SignalState = "supportive" | "moderate" | "elevated" | "low";
type FreshnessState = "current" | "stale" | "missing";

type StateCueMockDirection = {
  date: string;
  direction: Direction;
  title: string;
  confidence: "low" | "medium" | "high";
  signals: {
    sleep: SignalState;
    load: SignalState;
    fatigue: SignalState;
    freshness: FreshnessState;
  };
  rationale: string;
  dataMode: "mock";
  safetyNote: string;
};
```

## Experience Outline

The first screen should include:

- Header with StateCue and the tagline
- Japanese copy as a compact supporting line
- Current direction panel
- Signal summary for sleep, load, fatigue, and data freshness
- Rationale text
- Mock-data indicator
- Non-medical safety note

## Suggested Build Steps

1. Read the relevant HeroUI v3 docs for layout, card/surface, chip, meter/progress, and typography.
2. Create a local mock cue module.
3. Build a responsive first-screen layout.
4. Add clear state styling for Go, Light, Rest, and Check.
5. Add a visible demo-data label and safety note.
6. Run the repository check script once it exists.
7. Scan for private references, credential-like files, and prohibited product names before committing.

## Risks

- Overstating the cue as advice instead of direction.
- Hiding mock-data status too low in the page.
- Adding integration language before an integration plan exists.
- Turning the first screen into a landing page rather than a usable daily cue.

## Definition of Done

- The first screen communicates StateCue's value within a few seconds.
- The mock direction is visible and understandable.
- Safety and demo-data boundaries are present.
- The implementation remains independent from any unrelated project history.
