export type Direction = "go" | "light" | "rest" | "check";
export type Confidence = "low" | "medium" | "high";
export type SignalName = "sleep" | "load" | "fatigue" | "freshness";
export type SignalTone = "supportive" | "moderate" | "elevated" | "low" | "current" | "stale" | "missing";

export type SignalSummary = {
  name: SignalName;
  label: string;
  state: SignalTone;
  value: number;
  caption: string;
  detail: string;
};

export type StateCueSnapshot = {
  dateLabel: string;
  direction: Direction;
  title: string;
  subtitle: string;
  confidence: Confidence;
  clarityScore: number;
  primarySignal: string;
  scenarioSummary: string;
  signals: SignalSummary[];
  rationale: string[];
  safetyNote: string;
  dataMode: "mock";
};

export type ScenarioPreview = {
  label: string;
  direction: Direction;
  summary: string;
};

const sharedSafetyNote =
  "StateCue is a non-medical wellness cue based on mock data. Use it for reflection, not professional advice.";

export const stateCueScenarios: StateCueSnapshot[] = [
  {
    direction: "go",
    dateLabel: "Demo morning / 07:20",
    title: "Go day",
    subtitle: "Use normal effort, keep an honest ceiling.",
    confidence: "high",
    clarityScore: 86,
    primarySignal: "Primary support: Sleep and freshness",
    scenarioSummary: "Supportive sleep, manageable load, low fatigue, and current mock data align around normal effort.",
    dataMode: "mock",
    safetyNote: sharedSafetyNote,
    signals: [
      {
        name: "sleep",
        label: "Sleep",
        state: "supportive",
        value: 88,
        caption: "Supportive",
        detail: "Sleep signal is strong enough to support normal focus.",
      },
      {
        name: "load",
        label: "Load",
        state: "moderate",
        value: 52,
        caption: "Moderate",
        detail: "Recent load is present but not pushing the cue down.",
      },
      {
        name: "fatigue",
        label: "Fatigue",
        state: "moderate",
        value: 34,
        caption: "Low-moderate",
        detail: "Fatigue is low enough for steady effort in this demo.",
      },
      {
        name: "freshness",
        label: "Data freshness",
        state: "current",
        value: 94,
        caption: "Current",
        detail: "Mock inputs are fresh enough for a clear cue.",
      },
    ],
    rationale: [
      "Sleep, fatigue, and data freshness are aligned, so StateCue can show a go cue without overstating certainty.",
      "Load is moderate rather than empty, so the cue stays normal-effort instead of pushing harder.",
    ],
  },
  {
    direction: "light",
    dateLabel: "Demo morning / 07:20",
    title: "Light day",
    subtitle: "Keep momentum, lower the ceiling.",
    confidence: "medium",
    clarityScore: 72,
    primarySignal: "Primary limiter: Fatigue",
    scenarioSummary: "Supportive sleep and current mock data are tempered by elevated fatigue.",
    dataMode: "mock",
    safetyNote: sharedSafetyNote,
    signals: [
      {
        name: "sleep",
        label: "Sleep",
        state: "supportive",
        value: 82,
        caption: "Supportive",
        detail: "Enough sleep signal to support normal focus.",
      },
      {
        name: "load",
        label: "Load",
        state: "moderate",
        value: 58,
        caption: "Moderate",
        detail: "Recent load is manageable, not empty.",
      },
      {
        name: "fatigue",
        label: "Fatigue",
        state: "elevated",
        value: 67,
        caption: "Elevated",
        detail: "Fatigue is the limiting signal today.",
      },
      {
        name: "freshness",
        label: "Data freshness",
        state: "current",
        value: 91,
        caption: "Current",
        detail: "Mock inputs are fresh enough for the demo cue.",
      },
    ],
    rationale: [
      "Sleep and data freshness are supportive, so the cue does not need to fall back to check.",
      "Fatigue is elevated against a moderate load, so StateCue lowers the direction from go to light.",
    ],
  },
  {
    direction: "rest",
    dateLabel: "Demo morning / 07:20",
    title: "Rest day",
    subtitle: "Protect the day and reduce demand.",
    confidence: "medium",
    clarityScore: 69,
    primarySignal: "Primary limiter: Sleep plus fatigue",
    scenarioSummary: "Low sleep and elevated fatigue make lower demand the clearest mock cue.",
    dataMode: "mock",
    safetyNote: sharedSafetyNote,
    signals: [
      {
        name: "sleep",
        label: "Sleep",
        state: "low",
        value: 41,
        caption: "Low",
        detail: "Sleep is the weakest support signal in this scenario.",
      },
      {
        name: "load",
        label: "Load",
        state: "elevated",
        value: 76,
        caption: "Elevated",
        detail: "Recent load is high enough to increase caution.",
      },
      {
        name: "fatigue",
        label: "Fatigue",
        state: "elevated",
        value: 82,
        caption: "Elevated",
        detail: "Fatigue reinforces the lower-effort cue.",
      },
      {
        name: "freshness",
        label: "Data freshness",
        state: "current",
        value: 88,
        caption: "Current",
        detail: "Mock inputs are current, so this is not a signal-quality fallback.",
      },
    ],
    rationale: [
      "Data freshness is current, so StateCue can choose a direction instead of asking for a signal check.",
      "Low sleep, elevated load, and elevated fatigue align around a rest cue for this non-medical demo.",
    ],
  },
  {
    direction: "check",
    dateLabel: "Demo morning / 07:20",
    title: "Check signals",
    subtitle: "Pause the cue until the signal quality is clearer.",
    confidence: "low",
    clarityScore: 46,
    primarySignal: "Primary issue: Data freshness",
    scenarioSummary: "Stale freshness and mixed signals make the safest mock output a check cue.",
    dataMode: "mock",
    safetyNote: sharedSafetyNote,
    signals: [
      {
        name: "sleep",
        label: "Sleep",
        state: "supportive",
        value: 79,
        caption: "Supportive",
        detail: "Sleep looks supportive, but it conflicts with other signals.",
      },
      {
        name: "load",
        label: "Load",
        state: "elevated",
        value: 72,
        caption: "Elevated",
        detail: "Recent load is high enough to complicate the cue.",
      },
      {
        name: "fatigue",
        label: "Fatigue",
        state: "moderate",
        value: 54,
        caption: "Moderate",
        detail: "Fatigue does not clearly confirm or reject normal effort.",
      },
      {
        name: "freshness",
        label: "Data freshness",
        state: "stale",
        value: 38,
        caption: "Stale",
        detail: "Mock inputs are too stale for a stronger direction.",
      },
    ],
    rationale: [
      "The signals are mixed, and data freshness is stale, so StateCue avoids overstating a direction.",
      "The check cue keeps the demo honest by making signal quality visible before effort is chosen.",
    ],
  },
];

export const todayCue = stateCueScenarios.find((scenario) => scenario.direction === "light") ?? stateCueScenarios[0];

export const scenarioPreviews: ScenarioPreview[] = stateCueScenarios.map((scenario) => ({
  label: scenario.title,
  direction: scenario.direction,
  summary: scenario.scenarioSummary,
}));

export const directionCopy: Record<
  Direction,
  { label: string; chip: "success" | "accent" | "warning" | "danger"; description: string }
> = {
  go: {
    label: "Go",
    chip: "success",
    description: "Signals are supportive enough for normal effort.",
  },
  light: {
    label: "Light",
    chip: "warning",
    description: "Move with intention, but reduce intensity.",
  },
  rest: {
    label: "Rest",
    chip: "danger",
    description: "Recovery is the clearest direction.",
  },
  check: {
    label: "Check",
    chip: "accent",
    description: "Signal quality needs attention before choosing effort.",
  },
};

export function signalColor(signal: SignalSummary): "success" | "accent" | "warning" | "danger" {
  if (signal.state === "current" || signal.state === "supportive") {
    return "success";
  }

  if (signal.state === "elevated" || signal.state === "stale") {
    return "warning";
  }

  if (signal.state === "low" || signal.state === "missing") {
    return "danger";
  }

  return "accent";
}
