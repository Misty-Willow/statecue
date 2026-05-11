export type Direction = "go" | "light" | "rest" | "check";
export type Confidence = "low" | "medium" | "high";
export type SignalName = "sleep" | "load" | "fatigue" | "freshness";
export type SignalTone = "supportive" | "moderate" | "elevated" | "current" | "stale";

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

export const todayCue: StateCueSnapshot = {
  dateLabel: "Demo morning / 07:20",
  direction: "light",
  title: "Light day",
  subtitle: "Keep momentum, lower the ceiling.",
  confidence: "medium",
  clarityScore: 72,
  dataMode: "mock",
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
  safetyNote:
    "StateCue is a non-medical wellness cue based on mock data. Use it for reflection, not professional advice.",
};

export const scenarioPreviews: ScenarioPreview[] = [
  {
    label: "Signals aligned",
    direction: "go",
    summary: "Supportive sleep, low fatigue, and current mock data point toward normal effort.",
  },
  {
    label: "Signal conflict",
    direction: "check",
    summary: "Stale freshness or conflicting signals should make the product ask for caution.",
  },
  {
    label: "Recovery bias",
    direction: "rest",
    summary: "Low sleep plus elevated fatigue should make recovery the clearest direction.",
  },
];

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
  if (signal.name === "fatigue") {
    return signal.value >= 64 ? "warning" : "success";
  }

  if (signal.name === "freshness") {
    return signal.state === "current" ? "success" : "warning";
  }

  if (signal.state === "supportive") {
    return "success";
  }

  return "accent";
}
