package statecue

import "testing"

func TestDeriveDirection(t *testing.T) {
	tests := []struct {
		name      string
		inputs    Inputs
		direction Direction
	}{
		{
			name:      "go",
			inputs:    Inputs{Sleep: BodySignalSupportive, Load: BodySignalModerate, Fatigue: BodySignalModerate, Freshness: FreshnessCurrent},
			direction: DirectionGo,
		},
		{
			name:      "light",
			inputs:    Inputs{Sleep: BodySignalSupportive, Load: BodySignalElevated, Fatigue: BodySignalModerate, Freshness: FreshnessCurrent},
			direction: DirectionLight,
		},
		{
			name:      "rest",
			inputs:    Inputs{Sleep: BodySignalLow, Load: BodySignalModerate, Fatigue: BodySignalElevated, Freshness: FreshnessCurrent},
			direction: DirectionRest,
		},
		{
			name:      "check",
			inputs:    Inputs{Sleep: BodySignalSupportive, Load: BodySignalModerate, Fatigue: BodySignalModerate, Freshness: FreshnessStale},
			direction: DirectionCheck,
		},
		{
			name:      "freshness wins",
			inputs:    Inputs{Sleep: BodySignalLow, Load: BodySignalElevated, Fatigue: BodySignalElevated, Freshness: FreshnessMissing},
			direction: DirectionCheck,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := DeriveDirection(test.inputs); got != test.direction {
				t.Fatalf("DeriveDirection() = %q, want %q", got, test.direction)
			}
		})
	}
}

func TestTodayCue(t *testing.T) {
	cue := TodayCue()

	if cue.Direction != DirectionLight {
		t.Fatalf("TodayCue().Direction = %q, want %q", cue.Direction, DirectionLight)
	}

	if cue.DataMode != "mock" {
		t.Fatalf("TodayCue().DataMode = %q, want mock", cue.DataMode)
	}
}

func TestScenariosCoverDirections(t *testing.T) {
	want := map[Direction]bool{
		DirectionGo:    false,
		DirectionLight: false,
		DirectionRest:  false,
		DirectionCheck: false,
	}

	for _, scenario := range Scenarios() {
		if _, ok := want[scenario.Direction]; !ok {
			t.Fatalf("unexpected direction %q", scenario.Direction)
		}
		want[scenario.Direction] = true
	}

	for direction, seen := range want {
		if !seen {
			t.Fatalf("missing scenario for %q", direction)
		}
	}
}
