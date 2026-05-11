package statecue

import "fmt"

const safetyNote = "StateCue is a non-medical wellness cue based on mock data. Use it for reflection, not professional advice."

var directionCopy = map[Direction]directionContent{
	DirectionGo: {
		Title:       "Go day",
		Subtitle:    "Use normal effort, keep an honest ceiling.",
		Description: "Signals are supportive enough for normal effort.",
	},
	DirectionLight: {
		Title:       "Light day",
		Subtitle:    "Keep momentum, lower the ceiling.",
		Description: "Move with intention, but reduce intensity.",
	},
	DirectionRest: {
		Title:       "Rest day",
		Subtitle:    "Protect the day and reduce demand.",
		Description: "Lower demand is the clearest direction in this mock scenario.",
	},
	DirectionCheck: {
		Title:       "Check signals",
		Subtitle:    "Pause the cue until the signal quality is clearer.",
		Description: "Signal quality needs attention before choosing effort.",
	},
}

func DeriveDirection(inputs Inputs) Direction {
	if inputs.Freshness == FreshnessStale || inputs.Freshness == FreshnessMissing {
		return DirectionCheck
	}

	if inputs.Sleep == BodySignalLow && inputs.Fatigue == BodySignalElevated {
		return DirectionRest
	}

	if inputs.Fatigue == BodySignalElevated || inputs.Load == BodySignalElevated {
		return DirectionLight
	}

	return DirectionGo
}

func TodayCue() CueSnapshot {
	for _, scenario := range Scenarios() {
		if scenario.Direction == DirectionLight {
			return scenario
		}
	}

	scenarios := Scenarios()
	return scenarios[0]
}

func Scenarios() []CueSnapshot {
	definitions := []scenarioDefinition{
		{
			DateLabel:       "Demo morning / 07:20",
			ScenarioSummary: "Supportive sleep, manageable load, low fatigue, and current mock data align around normal effort.",
			Inputs: Inputs{
				Sleep:     BodySignalSupportive,
				Load:      BodySignalModerate,
				Fatigue:   BodySignalModerate,
				Freshness: FreshnessCurrent,
			},
			Signals: []Signal{
				{Name: "sleep", Label: "Sleep", State: string(BodySignalSupportive), Severity: SeveritySupport, Value: 88, Caption: "Supportive", Detail: "Sleep signal is strong enough to support normal focus."},
				{Name: "load", Label: "Load", State: string(BodySignalModerate), Severity: SeverityNeutral, Value: 52, Caption: "Moderate", Detail: "Recent load is present but not pushing the cue down."},
				{Name: "fatigue", Label: "Fatigue", State: string(BodySignalModerate), Severity: SeveritySupport, Value: 34, Caption: "Low-moderate", Detail: "Fatigue is low enough for steady effort in this demo."},
				{Name: "freshness", Label: "Data freshness", State: string(FreshnessCurrent), Severity: SeveritySupport, Value: 94, Caption: "Current", Detail: "Mock inputs are fresh enough for a clear cue."},
			},
		},
		{
			DateLabel:       "Demo morning / 07:20",
			ScenarioSummary: "Supportive sleep and current mock data are tempered by elevated fatigue.",
			Inputs: Inputs{
				Sleep:     BodySignalSupportive,
				Load:      BodySignalModerate,
				Fatigue:   BodySignalElevated,
				Freshness: FreshnessCurrent,
			},
			Signals: []Signal{
				{Name: "sleep", Label: "Sleep", State: string(BodySignalSupportive), Severity: SeveritySupport, Value: 82, Caption: "Supportive", Detail: "Enough sleep signal to support normal focus."},
				{Name: "load", Label: "Load", State: string(BodySignalModerate), Severity: SeverityNeutral, Value: 58, Caption: "Moderate", Detail: "Recent load is manageable, not empty."},
				{Name: "fatigue", Label: "Fatigue", State: string(BodySignalElevated), Severity: SeverityCaution, Value: 67, Caption: "Elevated", Detail: "Fatigue is the limiting signal today."},
				{Name: "freshness", Label: "Data freshness", State: string(FreshnessCurrent), Severity: SeveritySupport, Value: 91, Caption: "Current", Detail: "Mock inputs are fresh enough for the demo cue."},
			},
		},
		{
			DateLabel:       "Demo morning / 07:20",
			ScenarioSummary: "Low sleep and elevated fatigue make lower demand the clearest mock cue.",
			Inputs: Inputs{
				Sleep:     BodySignalLow,
				Load:      BodySignalElevated,
				Fatigue:   BodySignalElevated,
				Freshness: FreshnessCurrent,
			},
			Signals: []Signal{
				{Name: "sleep", Label: "Sleep", State: string(BodySignalLow), Severity: SeverityLimit, Value: 41, Caption: "Low", Detail: "Sleep is the weakest support signal in this scenario."},
				{Name: "load", Label: "Load", State: string(BodySignalElevated), Severity: SeverityCaution, Value: 76, Caption: "Elevated", Detail: "Recent load is high enough to increase caution."},
				{Name: "fatigue", Label: "Fatigue", State: string(BodySignalElevated), Severity: SeverityLimit, Value: 82, Caption: "Elevated", Detail: "Fatigue reinforces the lower-effort cue."},
				{Name: "freshness", Label: "Data freshness", State: string(FreshnessCurrent), Severity: SeveritySupport, Value: 88, Caption: "Current", Detail: "Mock inputs are current, so this is not a signal-quality fallback."},
			},
		},
		{
			DateLabel:       "Demo morning / 07:20",
			ScenarioSummary: "Stale freshness and mixed signals make the safest mock output a check cue.",
			Inputs: Inputs{
				Sleep:     BodySignalSupportive,
				Load:      BodySignalElevated,
				Fatigue:   BodySignalModerate,
				Freshness: FreshnessStale,
			},
			Signals: []Signal{
				{Name: "sleep", Label: "Sleep", State: string(BodySignalSupportive), Severity: SeveritySupport, Value: 79, Caption: "Supportive", Detail: "Sleep looks supportive, but it conflicts with other signals."},
				{Name: "load", Label: "Load", State: string(BodySignalElevated), Severity: SeverityCaution, Value: 72, Caption: "Elevated", Detail: "Recent load is high enough to complicate the cue."},
				{Name: "fatigue", Label: "Fatigue", State: string(BodySignalModerate), Severity: SeverityNeutral, Value: 54, Caption: "Moderate", Detail: "Fatigue does not clearly confirm or reject normal effort."},
				{Name: "freshness", Label: "Data freshness", State: string(FreshnessStale), Severity: SeverityLimit, Value: 38, Caption: "Stale", Detail: "Mock inputs are too stale for a stronger direction."},
			},
		},
	}

	snapshots := make([]CueSnapshot, 0, len(definitions))
	for _, definition := range definitions {
		snapshots = append(snapshots, createCueSnapshot(definition))
	}

	return snapshots
}

func createCueSnapshot(definition scenarioDefinition) CueSnapshot {
	direction := DeriveDirection(definition.Inputs)
	content := directionCopy[direction]

	return CueSnapshot{
		DateLabel:       definition.DateLabel,
		Direction:       direction,
		Title:           content.Title,
		Subtitle:        content.Subtitle,
		Confidence:      deriveConfidence(direction),
		ClarityScore:    deriveClarityScore(direction, definition.Inputs),
		PrimarySignal:   derivePrimarySignal(direction, definition.Inputs),
		ScenarioSummary: definition.ScenarioSummary,
		Inputs:          definition.Inputs,
		Signals:         definition.Signals,
		Rationale:       deriveRationale(direction, definition.Inputs),
		SafetyNote:      safetyNote,
		DataMode:        "mock",
	}
}

func deriveConfidence(direction Direction) Confidence {
	if direction == DirectionGo {
		return ConfidenceHigh
	}

	if direction == DirectionCheck {
		return ConfidenceLow
	}

	return ConfidenceMedium
}

func deriveClarityScore(direction Direction, inputs Inputs) int {
	if inputs.Freshness == FreshnessMissing {
		return 34
	}

	scores := map[Direction]int{
		DirectionGo:    86,
		DirectionLight: 72,
		DirectionRest:  69,
		DirectionCheck: 46,
	}

	return scores[direction]
}

func derivePrimarySignal(direction Direction, inputs Inputs) string {
	if direction == DirectionCheck {
		if inputs.Freshness == FreshnessMissing {
			return "Primary issue: Missing freshness"
		}
		return "Primary issue: Data freshness"
	}

	if direction == DirectionRest {
		return "Primary limiter: Sleep plus fatigue"
	}

	if direction == DirectionLight {
		if inputs.Fatigue == BodySignalElevated {
			return "Primary limiter: Fatigue"
		}
		return "Primary limiter: Load"
	}

	return "Primary support: Sleep and freshness"
}

func deriveRationale(direction Direction, inputs Inputs) []string {
	if direction == DirectionCheck {
		return []string{
			"Data freshness is not current, so StateCue avoids overstating a direction.",
			"The check cue keeps the demo honest by making signal quality visible before effort is chosen.",
		}
	}

	if direction == DirectionRest {
		return []string{
			"Data freshness is current, so StateCue can choose a direction instead of asking for a signal check.",
			"Low sleep and elevated fatigue align around a lower-demand cue for this non-medical demo.",
		}
	}

	if direction == DirectionLight {
		limiter := "load"
		if inputs.Fatigue == BodySignalElevated {
			limiter = "fatigue"
		}

		return []string{
			"Data freshness is current, so the cue can stay focused on the mock body-state signals.",
			fmt.Sprintf("Elevated %s limits the direction, so StateCue lowers the cue from go to light.", limiter),
		}
	}

	return []string{
		"Sleep, fatigue, and data freshness are aligned, so StateCue can show a go cue without overstating certainty.",
		"Load is moderate rather than empty, so the cue stays normal-effort instead of pushing harder.",
	}
}
