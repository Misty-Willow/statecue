export type Direction = "go" | "light" | "rest" | "check";
export type Confidence = "low" | "medium" | "high";
export type SignalName = "sleep" | "load" | "fatigue" | "freshness";
export type BodySignalState = "supportive" | "moderate" | "elevated" | "low";
export type FreshnessState = "current" | "stale" | "missing";
export type SignalState = BodySignalState | FreshnessState;
export type SignalSeverity = "support" | "neutral" | "caution" | "limit";

export type StateCueInputs = {
  sleep: BodySignalState;
  load: BodySignalState;
  fatigue: BodySignalState;
  freshness: FreshnessState;
};

export type SignalSummary = {
  name: SignalName;
  label: string;
  state: SignalState;
  severity: SignalSeverity;
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
  inputs: StateCueInputs;
  signals: SignalSummary[];
  rationale: string[];
  safetyNote: string;
  dataMode: "mock";
};

export type CueLogicReference = {
  direction: Direction;
  logicLabel: string;
  logicSummary: string;
};

type DirectionContent = {
  title: string;
  subtitle: string;
  label: string;
  chip: "success" | "accent" | "warning" | "danger";
  description: string;
};

type ScenarioDefinition = {
  dateLabel: string;
  scenarioSummary: string;
  inputs: StateCueInputs;
  signals: SignalSummary[];
};

const sharedSafetyNote =
  "StateCue is a non-medical wellness cue based on mock data. Use it for reflection, not professional advice.";

export const directionCopy: Record<Direction, DirectionContent> = {
  go: {
    title: "Go day",
    subtitle: "Use normal effort, keep an honest ceiling.",
    label: "Go",
    chip: "success",
    description: "Signals are supportive enough for normal effort.",
  },
  light: {
    title: "Light day",
    subtitle: "Keep momentum, lower the ceiling.",
    label: "Light",
    chip: "warning",
    description: "Move with intention, but reduce intensity.",
  },
  rest: {
    title: "Rest day",
    subtitle: "Protect the day and reduce demand.",
    label: "Rest",
    chip: "danger",
    description: "Lower demand is the clearest direction in this mock scenario.",
  },
  check: {
    title: "Check signals",
    subtitle: "Pause the cue until the signal quality is clearer.",
    label: "Check",
    chip: "accent",
    description: "Signal quality needs attention before choosing effort.",
  },
};

export function isDirection(value: unknown): value is Direction {
  return value === "go" || value === "light" || value === "rest" || value === "check";
}

export function deriveDirection(inputs: StateCueInputs): Direction {
  if (inputs.freshness === "stale" || inputs.freshness === "missing") {
    return "check";
  }

  if (inputs.sleep === "low" && inputs.fatigue === "elevated") {
    return "rest";
  }

  if (inputs.fatigue === "elevated" || inputs.load === "elevated") {
    return "light";
  }

  return "go";
}

function deriveConfidence(direction: Direction): Confidence {
  if (direction === "go") {
    return "high";
  }

  if (direction === "check") {
    return "low";
  }

  return "medium";
}

function deriveClarityScore(direction: Direction, inputs: StateCueInputs): number {
  if (inputs.freshness === "missing") {
    return 34;
  }

  const clarityByDirection: Record<Direction, number> = {
    go: 86,
    light: 72,
    rest: 69,
    check: 46,
  };

  return clarityByDirection[direction];
}

function derivePrimarySignal(direction: Direction, inputs: StateCueInputs): string {
  if (direction === "check") {
    return inputs.freshness === "missing" ? "Primary issue: Missing freshness" : "Primary issue: Data freshness";
  }

  if (direction === "rest") {
    return "Primary limiter: Sleep plus fatigue";
  }

  if (direction === "light") {
    return inputs.fatigue === "elevated" ? "Primary limiter: Fatigue" : "Primary limiter: Load";
  }

  return "Primary support: Sleep and freshness";
}

function deriveRationale(direction: Direction, inputs: StateCueInputs): string[] {
  if (direction === "check") {
    return [
      "Data freshness is not current, so StateCue avoids overstating a direction.",
      "The check cue keeps the demo honest by making signal quality visible before effort is chosen.",
    ];
  }

  if (direction === "rest") {
    return [
      "Data freshness is current, so StateCue can choose a direction instead of asking for a signal check.",
      "Low sleep and elevated fatigue align around a lower-demand cue for this non-medical demo.",
    ];
  }

  if (direction === "light") {
    const limiter = inputs.fatigue === "elevated" ? "fatigue" : "load";

    return [
      "Data freshness is current, so the cue can stay focused on the mock body-state signals.",
      `Elevated ${limiter} limits the direction, so StateCue lowers the cue from go to light.`,
    ];
  }

  return [
    "Sleep, fatigue, and data freshness are aligned, so StateCue can show a go cue without overstating certainty.",
    "Load is moderate rather than empty, so the cue stays normal-effort instead of pushing harder.",
  ];
}

function createStateCueSnapshot(definition: ScenarioDefinition): StateCueSnapshot {
  const direction = deriveDirection(definition.inputs);
  const content = directionCopy[direction];

  return {
    dateLabel: definition.dateLabel,
    direction,
    title: content.title,
    subtitle: content.subtitle,
    confidence: deriveConfidence(direction),
    clarityScore: deriveClarityScore(direction, definition.inputs),
    primarySignal: derivePrimarySignal(direction, definition.inputs),
    scenarioSummary: definition.scenarioSummary,
    inputs: definition.inputs,
    signals: definition.signals,
    rationale: deriveRationale(direction, definition.inputs),
    safetyNote: sharedSafetyNote,
    dataMode: "mock",
  };
}

const scenarioDefinitions: ScenarioDefinition[] = [
  {
    dateLabel: "Demo morning / 07:20",
    scenarioSummary: "Supportive sleep, manageable load, low fatigue, and current mock data align around normal effort.",
    inputs: {
      sleep: "supportive",
      load: "moderate",
      fatigue: "moderate",
      freshness: "current",
    },
    signals: [
      {
        name: "sleep",
        label: "Sleep",
        state: "supportive",
        severity: "support",
        value: 88,
        caption: "Supportive",
        detail: "Sleep signal is strong enough to support normal focus.",
      },
      {
        name: "load",
        label: "Load",
        state: "moderate",
        severity: "neutral",
        value: 52,
        caption: "Moderate",
        detail: "Recent load is present but not pushing the cue down.",
      },
      {
        name: "fatigue",
        label: "Fatigue",
        state: "moderate",
        severity: "support",
        value: 34,
        caption: "Low-moderate",
        detail: "Fatigue is low enough for steady effort in this demo.",
      },
      {
        name: "freshness",
        label: "Data freshness",
        state: "current",
        severity: "support",
        value: 94,
        caption: "Current",
        detail: "Mock inputs are fresh enough for a clear cue.",
      },
    ],
  },
  {
    dateLabel: "Demo morning / 07:20",
    scenarioSummary: "Supportive sleep and current mock data are tempered by elevated fatigue.",
    inputs: {
      sleep: "supportive",
      load: "moderate",
      fatigue: "elevated",
      freshness: "current",
    },
    signals: [
      {
        name: "sleep",
        label: "Sleep",
        state: "supportive",
        severity: "support",
        value: 82,
        caption: "Supportive",
        detail: "Enough sleep signal to support normal focus.",
      },
      {
        name: "load",
        label: "Load",
        state: "moderate",
        severity: "neutral",
        value: 58,
        caption: "Moderate",
        detail: "Recent load is manageable, not empty.",
      },
      {
        name: "fatigue",
        label: "Fatigue",
        state: "elevated",
        severity: "caution",
        value: 67,
        caption: "Elevated",
        detail: "Fatigue is the limiting signal today.",
      },
      {
        name: "freshness",
        label: "Data freshness",
        state: "current",
        severity: "support",
        value: 91,
        caption: "Current",
        detail: "Mock inputs are fresh enough for the demo cue.",
      },
    ],
  },
  {
    dateLabel: "Demo morning / 07:20",
    scenarioSummary: "Low sleep and elevated fatigue make lower demand the clearest mock cue.",
    inputs: {
      sleep: "low",
      load: "elevated",
      fatigue: "elevated",
      freshness: "current",
    },
    signals: [
      {
        name: "sleep",
        label: "Sleep",
        state: "low",
        severity: "limit",
        value: 41,
        caption: "Low",
        detail: "Sleep is the weakest support signal in this scenario.",
      },
      {
        name: "load",
        label: "Load",
        state: "elevated",
        severity: "caution",
        value: 76,
        caption: "Elevated",
        detail: "Recent load is high enough to increase caution.",
      },
      {
        name: "fatigue",
        label: "Fatigue",
        state: "elevated",
        severity: "limit",
        value: 82,
        caption: "Elevated",
        detail: "Fatigue reinforces the lower-effort cue.",
      },
      {
        name: "freshness",
        label: "Data freshness",
        state: "current",
        severity: "support",
        value: 88,
        caption: "Current",
        detail: "Mock inputs are current, so this is not a signal-quality fallback.",
      },
    ],
  },
  {
    dateLabel: "Demo morning / 07:20",
    scenarioSummary: "Stale freshness and mixed signals make the safest mock output a check cue.",
    inputs: {
      sleep: "supportive",
      load: "elevated",
      fatigue: "moderate",
      freshness: "stale",
    },
    signals: [
      {
        name: "sleep",
        label: "Sleep",
        state: "supportive",
        severity: "support",
        value: 79,
        caption: "Supportive",
        detail: "Sleep looks supportive, but it conflicts with other signals.",
      },
      {
        name: "load",
        label: "Load",
        state: "elevated",
        severity: "caution",
        value: 72,
        caption: "Elevated",
        detail: "Recent load is high enough to complicate the cue.",
      },
      {
        name: "fatigue",
        label: "Fatigue",
        state: "moderate",
        severity: "neutral",
        value: 54,
        caption: "Moderate",
        detail: "Fatigue does not clearly confirm or reject normal effort.",
      },
      {
        name: "freshness",
        label: "Data freshness",
        state: "stale",
        severity: "limit",
        value: 38,
        caption: "Stale",
        detail: "Mock inputs are too stale for a stronger direction.",
      },
    ],
  },
];

export const stateCueScenarios: StateCueSnapshot[] = scenarioDefinitions.map(createStateCueSnapshot);

export const todayCue = stateCueScenarios.find((scenario) => scenario.direction === "light") ?? stateCueScenarios[0];

export const cueLogicReference: CueLogicReference[] = [
  {
    direction: "go",
    logicLabel: "Aligned support",
    logicSummary: "Fresh mock data with no rest or light limiter keeps the cue at normal effort.",
  },
  {
    direction: "light",
    logicLabel: "One limiter",
    logicSummary: "Current data can still point lighter when fatigue or load becomes the limiting signal.",
  },
  {
    direction: "rest",
    logicLabel: "Recovery bias",
    logicSummary: "Low sleep and elevated fatigue align around a lower-demand reflection cue.",
  },
  {
    direction: "check",
    logicLabel: "Signal quality issue",
    logicSummary: "Stale or missing freshness moves the output to check before a stronger direction is shown.",
  },
];

export function signalColor(signal: SignalSummary): "success" | "accent" | "warning" | "danger" {
  if (signal.severity === "support") {
    return "success";
  }

  if (signal.severity === "caution") {
    return "warning";
  }

  if (signal.severity === "limit") {
    return "danger";
  }

  return "accent";
}
