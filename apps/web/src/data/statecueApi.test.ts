import { describe, expect, it, vi } from "vitest";

import { loadCueDataFromApi } from "./statecueApi";
import { stateCueScenarios, todayCue } from "./statecue";

function jsonResponse(payload: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(payload), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
    ...init,
  });
}

describe("loadCueDataFromApi", () => {
  it("uses local mock data when no API base URL is configured", async () => {
    const result = await loadCueDataFromApi(null, vi.fn());

    expect(result.ok).toBe(false);
    expect(result.data.source).toBe("local");
    expect(result.data.today).toBe(todayCue);
    expect(result.data.scenarios).toBe(stateCueScenarios);
  });

  it("uses API mock data when the API contract is valid", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(todayCue))
      .mockResolvedValueOnce(jsonResponse(stateCueScenarios));

    const result = await loadCueDataFromApi("https://statecue.example", fetcher);

    expect(result.ok).toBe(true);
    expect(result.data.source).toBe("api");
    expect(result.data.today.direction).toBe("light");
    expect(result.data.scenarios.map((scenario) => scenario.direction).sort()).toEqual([
      "check",
      "go",
      "light",
      "rest",
    ]);
    expect(fetcher).toHaveBeenCalledWith("https://statecue.example/api/cue", expect.any(Object));
    expect(fetcher).toHaveBeenCalledWith("https://statecue.example/api/scenarios", expect.any(Object));
  });

  it("falls back to local mock data when the API is unavailable", async () => {
    const fetcher = vi.fn().mockResolvedValue(jsonResponse({ error: "forbidden" }, { status: 403 }));

    const result = await loadCueDataFromApi("https://statecue.example", fetcher);

    expect(result.ok).toBe(false);
    expect(result.data.source).toBe("local");
    if (!result.ok) {
      expect(result.reason).toBe("HTTP 403");
    }
  });

  it("falls back to local mock data when the API contract is incomplete", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(todayCue))
      .mockResolvedValueOnce(jsonResponse(stateCueScenarios.filter((scenario) => scenario.direction !== "check")));

    const result = await loadCueDataFromApi("https://statecue.example", fetcher);

    expect(result.ok).toBe(false);
    expect(result.data.source).toBe("local");
    if (!result.ok) {
      expect(result.reason).toBe("API scenarios response did not include every cue direction.");
    }
  });
});
