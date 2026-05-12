import {
  isDirection,
  stateCueScenarios,
  todayCue,
  type Direction,
  type StateCueSnapshot,
} from "./statecue";

export type CueSource = "local" | "api";

export type CueData = {
  source: CueSource;
  today: StateCueSnapshot;
  scenarios: StateCueSnapshot[];
};

export type CueFetchResult =
  | {
      ok: true;
      data: CueData;
    }
  | {
      ok: false;
      data: CueData;
      reason: string;
    };

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const localCueData: CueData = {
  source: "local",
  today: todayCue,
  scenarios: stateCueScenarios,
};

export function getConfiguredApiBaseUrl(): string | null {
  const value = import.meta.env.VITE_STATECUE_API_BASE_URL;

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed.replace(/\/+$/, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCueSnapshot(value: unknown): value is StateCueSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isDirection(value.direction) &&
    value.dataMode === "mock" &&
    typeof value.title === "string" &&
    typeof value.subtitle === "string" &&
    typeof value.confidence === "string" &&
    typeof value.clarityScore === "number" &&
    Array.isArray(value.signals) &&
    Array.isArray(value.rationale)
  );
}

function hasAllDirections(scenarios: StateCueSnapshot[]): boolean {
  const directions = new Set<Direction>(scenarios.map((scenario) => scenario.direction));

  return ["go", "light", "rest", "check"].every((direction) => directions.has(direction as Direction));
}

async function fetchJson(fetcher: FetchLike, url: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetcher(url, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function loadCueDataFromApi(
  apiBaseUrl: string | null = getConfiguredApiBaseUrl(),
  fetcher: FetchLike = fetch,
  signal?: AbortSignal,
): Promise<CueFetchResult> {
  if (apiBaseUrl === null) {
    return {
      ok: false,
      data: localCueData,
      reason: "No API base URL configured.",
    };
  }

  try {
    const [todayPayload, scenariosPayload] = await Promise.all([
      fetchJson(fetcher, `${apiBaseUrl}/api/cue`, signal),
      fetchJson(fetcher, `${apiBaseUrl}/api/scenarios`, signal),
    ]);

    if (!isCueSnapshot(todayPayload)) {
      throw new Error("API cue response did not match the mock cue contract.");
    }

    if (!Array.isArray(scenariosPayload) || !scenariosPayload.every(isCueSnapshot)) {
      throw new Error("API scenarios response did not match the mock cue contract.");
    }

    if (!hasAllDirections(scenariosPayload)) {
      throw new Error("API scenarios response did not include every cue direction.");
    }

    return {
      ok: true,
      data: {
        source: "api",
        today: todayPayload,
        scenarios: scenariosPayload,
      },
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return {
      ok: false,
      data: localCueData,
      reason: error instanceof Error ? error.message : "API cue fetch failed.",
    };
  }
}
