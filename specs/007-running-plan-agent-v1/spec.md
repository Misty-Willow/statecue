# Feature Specification: Running Plan Agent V1 Realignment

**Feature Branch**: `007-running-plan-agent-v1`
**Created**: 2026-05-12
**Status**: Draft
**Input**: Recovery Compass source-material review, StateCue public-safe restart, current Firebase Hosting / Cloud Run staging posture

## User Scenarios & Testing

### User Story 1 - See Tomorrow's Running Plan Adjustment (Priority: P1)

A runner opens StateCue and sees how yesterday's health and training signals adjust tomorrow's training menu.

**Why this priority**: This restores the product from a passive dashboard to a decision agent. The user should not only see `go`, `light`, `rest`, or `check`; they should see the training-plan adjustment that follows from the signal state.

**Independent Test**: Open the mock dashboard and verify that the default scenario shows a weekly running plan, yesterday's health snapshot, the adjusted next session, and a concise explanation.

**Acceptance Scenarios**:

1. **Given** a weekly running plan exists in mock mode, **When** the user opens the dashboard, **Then** StateCue shows the planned next workout and the adjusted recommendation.
2. **Given** sleep, heart, HRV, load, fatigue, and data freshness are visible, **When** the recommendation is shown, **Then** the UI explains which signals changed the plan.
3. **Given** the recommendation is non-medical, **When** the user reads it, **Then** the copy frames the output as training reflection and not diagnosis, treatment, or professional advice.

### User Story 2 - Compare Plan Intent Against Readiness Shape (Priority: P1)

A runner can compare the intended training load against the current readiness shape using a compact visual such as a radar chart.

**Why this priority**: A running plan adjustment needs more than a single cue. It should show whether the current state supports intensity, volume, freshness, fatigue tolerance, and recovery.

**Independent Test**: In mock mode, inspect the dashboard and verify that a data-rich readiness shape compares planned demand with observed readiness.

**Acceptance Scenarios**:

1. **Given** mock readiness metrics are available, **When** the dashboard renders, **Then** it shows a multi-axis comparison for planned demand vs current readiness.
2. **Given** the chart is present, **When** it is read without interaction, **Then** it still communicates the main limiter through labels and summary text.
3. **Given** chart tooling fails or is deferred, **When** the dashboard renders, **Then** a public-safe table or meters still communicate the same plan-vs-readiness comparison.

### User Story 3 - Review the Agentic Loop (Priority: P1)

A reviewer can see that StateCue is an agentic training-adjustment system rather than a static health dashboard.

**Why this priority**: The product should demonstrate an operational loop: observe signals, score deterministically, generate an explanation, propose an action, collect feedback, and evaluate decision quality.

**Independent Test**: Review the dashboard, architecture docs, and API contracts for explicit Observe -> Decide -> Act -> Learn surfaces.

**Acceptance Scenarios**:

1. **Given** mock data is used, **When** the dashboard shows a recommendation, **Then** it identifies the observed signals and data quality.
2. **Given** the scoring decision exists, **When** the explanation appears, **Then** it distinguishes deterministic scoring from AI-generated explanation.
3. **Given** the recommendation is shown, **When** the user reviews the action panel, **Then** they can see future `adopt`, `modify`, or `reject` feedback states even if persistence remains deferred.
4. **Given** evaluation is visible, **When** a reviewer inspects the system story, **Then** they can see how logs/evals would check recommendation quality over time.

## Product Boundary

StateCue V1 is a running-focused recovery direction agent. It does not try to become a general health coach.

It answers:

```text
Given the weekly running plan and yesterday's health/training signals,
should tomorrow stay as planned, become lighter, become recovery-only,
or require a check before training?
```

## Cue Taxonomy

Keep the public taxonomy but bind it to training-plan adjustment:

- `go`: keep the planned run or workout.
- `light`: reduce intensity, volume, or both.
- `rest`: replace training with recovery or very low load.
- `check`: data is stale, missing, or concerning enough that the user should verify before following the plan.

The cue is not a medical decision. It is a training-plan adjustment signal.

## Data Model Requirements

### WeeklyRunningPlan

- `weekStart`
- `goal`: e.g. base building, 5K prep, long-run week
- `sessions[]`
  - `date`
  - `type`: easy, intervals, tempo, long, strength, rest
  - `plannedDistanceKm`
  - `plannedDurationMin`
  - `plannedIntensity`
  - `priority`: key, support, optional, recovery

### HealthSnapshot

- `date`
- `source`: `google_health`, `fitbit`, `mock`
- `sleepHours`
- `sleepQuality`
- `restingHeartRate`
- `restingHeartRateDelta`
- `hrv`
- `hrvDelta`
- `steps`
- `trainingLoad24h`
- `trainingLoad7d`
- `subjectiveFatigue`
- `soreness`
- `painOrIllness`
- `dataFreshnessHours`
- `dataGaps[]`

### PlanAdjustment

- `direction`: `go`, `light`, `rest`, or `check`
- `score`
- `zone`: green, yellow, red, gray
- `plannedSession`
- `adjustedSession`
- `changeSummary`
- `reasons[]`
- `guardrails[]`
- `confidence`
- `dataQuality`
- `agentExplanation`
- `feedbackState`: none, adopted, modified, rejected

### EvalEvent

- `fixtureName`
- `expectedDirection`
- `actualDirection`
- `safetyStatus`
- `schemaStatus`
- `latencyMs`
- `model`
- `scoringVersion`

## Agent Boundary

StateCue must not let an LLM decide the numeric score, zone, or cue direction.

Expected pipeline:

1. Load weekly running plan.
2. Load latest health snapshot and check-in.
3. Normalize signal state.
4. Run deterministic Go scoring for score, zone, and direction.
5. Ask the AI layer for explanation, action wording, and safety framing.
6. Validate the AI output against a JSON schema.
7. Run a safety guard.
8. Return the final plan adjustment.
9. Log an eval event.

## Google Cloud Differentiation

StateCue should be materially different from a generic consumer health coach:

- It focuses on a narrow decision layer: running-plan adjustment.
- It shows deterministic scoring instead of opaque AI judgment.
- It uses an AI layer for explanation, not medical authority.
- It exposes data quality, scoring version, model version, and eval status.
- It treats feedback and evaluation as part of the product loop.

Target architecture:

- Firebase Hosting for the public web app.
- Firebase Auth for future user identity.
- Google Health API / Fitbit-derived data as a future health adapter, with mock fallback.
- Cloud Run for the Go API and scoring service.
- Gemini / ADK for explanation and safety wording.
- Firestore for user plan, decision, and feedback state.
- BigQuery for decision/eval logs.
- Optional search layer for similar past decisions.

## Chart Direction

Evil Charts radar chart is a good candidate for the plan-vs-readiness comparison because it supports filled and line radar variants, gradient/glow styling, loading state, and click selection.

Use it only after checking bundle impact and compatibility with the current React/Vite/HeroUI stack. If adopted, use it for:

- planned workout demand
- current readiness
- recovery reserve
- fatigue risk
- data confidence

Do not use charts as decoration. Every chart must explain a training-plan adjustment.

## Non-Goals

- No real health data in this slice.
- No production Google Health OAuth in this slice.
- No medical diagnosis, treatment, injury prediction, or professional advice.
- No generic chatbot coach.
- No custom domain requirement.
- No public API access change.
- No GCP resource creation without explicit approval.

## Success Criteria

- **SC-001**: The product story clearly shifts from passive dashboard to running-plan adjustment agent.
- **SC-002**: The mock model includes weekly plan, health snapshot, plan adjustment, feedback state, and eval event concepts.
- **SC-003**: Docs explain why Google Cloud, Gemini/ADK, Cloud Run, Firebase, and eval logs matter.
- **SC-004**: The UI plan includes an app-shell dashboard with data-rich running widgets and mobile-compatible navigation.
- **SC-005**: The implementation remains mock-first and public-safe until real data integration is explicitly approved.
