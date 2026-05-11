package statecue

type Direction string
type Confidence string
type BodySignalState string
type FreshnessState string
type SignalSeverity string

const (
	DirectionGo    Direction = "go"
	DirectionLight Direction = "light"
	DirectionRest  Direction = "rest"
	DirectionCheck Direction = "check"

	ConfidenceLow    Confidence = "low"
	ConfidenceMedium Confidence = "medium"
	ConfidenceHigh   Confidence = "high"

	BodySignalSupportive BodySignalState = "supportive"
	BodySignalModerate   BodySignalState = "moderate"
	BodySignalElevated   BodySignalState = "elevated"
	BodySignalLow        BodySignalState = "low"

	FreshnessCurrent FreshnessState = "current"
	FreshnessStale   FreshnessState = "stale"
	FreshnessMissing FreshnessState = "missing"

	SeveritySupport SignalSeverity = "support"
	SeverityNeutral SignalSeverity = "neutral"
	SeverityCaution SignalSeverity = "caution"
	SeverityLimit   SignalSeverity = "limit"
)

type Inputs struct {
	Sleep     BodySignalState `json:"sleep"`
	Load      BodySignalState `json:"load"`
	Fatigue   BodySignalState `json:"fatigue"`
	Freshness FreshnessState  `json:"freshness"`
}

type Signal struct {
	Name     string         `json:"name"`
	Label    string         `json:"label"`
	State    string         `json:"state"`
	Severity SignalSeverity `json:"severity"`
	Value    int            `json:"value"`
	Caption  string         `json:"caption"`
	Detail   string         `json:"detail"`
}

type CueSnapshot struct {
	DateLabel       string     `json:"dateLabel"`
	Direction       Direction  `json:"direction"`
	Title           string     `json:"title"`
	Subtitle        string     `json:"subtitle"`
	Confidence      Confidence `json:"confidence"`
	ClarityScore    int        `json:"clarityScore"`
	PrimarySignal   string     `json:"primarySignal"`
	ScenarioSummary string     `json:"scenarioSummary"`
	Inputs          Inputs     `json:"inputs"`
	Signals         []Signal   `json:"signals"`
	Rationale       []string   `json:"rationale"`
	SafetyNote      string     `json:"safetyNote"`
	DataMode        string     `json:"dataMode"`
}

type scenarioDefinition struct {
	DateLabel       string
	ScenarioSummary string
	Inputs          Inputs
	Signals         []Signal
}

type directionContent struct {
	Title       string
	Subtitle    string
	Description string
}
