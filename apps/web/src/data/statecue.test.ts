import { describe, expect, it } from "vitest";

import {
  cueLogicReference,
  deriveDirection,
  directionCopy,
  isDirection,
  todayCue,
  type Direction,
  type StateCueInputs,
} from "./statecue";

const expectedDirections: Direction[] = ["go", "light", "rest", "check"];

describe("deriveDirection", () => {
  it.each([
    [
      "go",
      {
        sleep: "supportive",
        load: "moderate",
        fatigue: "moderate",
        freshness: "current",
      },
    ],
    [
      "light",
      {
        sleep: "supportive",
        load: "elevated",
        fatigue: "moderate",
        freshness: "current",
      },
    ],
    [
      "rest",
      {
        sleep: "low",
        load: "moderate",
        fatigue: "elevated",
        freshness: "current",
      },
    ],
    [
      "check",
      {
        sleep: "supportive",
        load: "moderate",
        fatigue: "moderate",
        freshness: "stale",
      },
    ],
  ] satisfies [Direction, StateCueInputs][])("returns %s for the matching deterministic inputs", (direction, inputs) => {
    expect(deriveDirection(inputs)).toBe(direction);
  });

  it("prioritizes signal freshness checks before body-state limiters", () => {
    expect(
      deriveDirection({
        sleep: "low",
        load: "elevated",
        fatigue: "elevated",
        freshness: "missing",
      }),
    ).toBe("check");
  });
});

describe("StateCue default and logic reference", () => {
  it("keeps the default today cue on the light direction", () => {
    expect(todayCue.direction).toBe("light");
  });

  it("keeps direction copy aligned with the public direction taxonomy", () => {
    expect(Object.keys(directionCopy).sort()).toEqual([...expectedDirections].sort());
    expect(expectedDirections.every(isDirection)).toBe(true);
  });

  it("includes exactly one logic reference for each direction", () => {
    const referencedDirections = cueLogicReference.map((reference) => reference.direction);

    expect(referencedDirections.sort()).toEqual([...expectedDirections].sort());
    expect(new Set(referencedDirections).size).toBe(expectedDirections.length);
  });
});
