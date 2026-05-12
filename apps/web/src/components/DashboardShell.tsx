import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Chip, Label, Meter, ProgressCircle, Table, Tabs } from "@heroui/react";
import { EvilRadarChart } from "@/components/evilcharts/charts/radar-chart";
import { type ChartConfig } from "@/components/evilcharts/ui/chart";
import {
  cueHistory,
  cueLogicReference,
  directionCopy,
  isDirection,
  planAdjustments,
  readinessMetricsByDirection,
  signalColor,
  stateCueScenarios,
  todayCue,
  weeklyRunningPlan,
  type Direction,
  type SignalSummary,
} from "../data/statecue";
import { loadCueDataFromApi, type CueData, type CueFetchResult } from "../data/statecueApi";

const navItems = ["Today", "Plan", "Signals", "Data", "Eval"];
const readinessRadarConfig = {
  planned: {
    label: "Planned demand",
    colors: {
      light: ["#f59e0b", "#fbbf24"],
      dark: ["#fbbf24", "#fde68a"],
    },
  },
  readiness: {
    label: "Current readiness",
    colors: {
      light: ["#10b981", "#34d399"],
      dark: ["#34d399", "#a7f3d0"],
    },
  },
} satisfies ChartConfig;

function DirectionChip({ direction }: { direction: Direction }) {
  const copy = directionCopy[direction];

  return (
    <Chip color={copy.chip} size="lg" variant="soft">
      {copy.label}
    </Chip>
  );
}

function SignalCard({ signal }: { signal: SignalSummary }) {
  return (
    <Card className="h-full border border-border/70 bg-surface/90" role="article">
      <Card.Header>
        <div className="flex w-full items-start justify-between gap-3">
          <div>
            <Card.Title className="text-base">{signal.label}</Card.Title>
            <Card.Description>{signal.detail}</Card.Description>
          </div>
          <Chip color={signalColor(signal)} size="sm" variant="soft">
            {signal.caption}
          </Chip>
        </div>
      </Card.Header>
      <Card.Content>
        <Meter
          aria-label={`${signal.label} signal strength`}
          color={signalColor(signal)}
          maxValue={100}
          minValue={0}
          value={signal.value}
          valueLabel={`${signal.value}/100`}
        >
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <Label className="font-medium text-foreground">{signal.caption}</Label>
            <Meter.Output className="text-muted" />
          </div>
          <Meter.Track>
            <Meter.Fill />
          </Meter.Track>
        </Meter>
      </Card.Content>
    </Card>
  );
}

type ReadinessRadarDatum = {
  metric: string;
  planned: number;
  readiness: number;
};

function ReadinessRadar({ data }: { data: ReadinessRadarDatum[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(260px,1fr)_0.9fr] lg:items-center">
      <EvilRadarChart
        activeDotVariant="default"
        chartConfig={readinessRadarConfig}
        chartProps={{ margin: { top: 14, right: 18, bottom: 14, left: 18 } }}
        className="min-h-[300px] w-full p-3"
        data={data}
        dataKey="metric"
        dotVariant="colored-border"
        fillOpacity={0.26}
        glowingRadars={["readiness"]}
        gridType="circle"
        isClickable
        legendVariant="horizontal-bar"
        polarGridProps={{ radialLines: true }}
        radarProps={{ isAnimationActive: true, animationDuration: 850, animationEasing: "ease-out" }}
        tooltipRoundness="lg"
        tooltipVariant="frosted-glass"
      />
      <div className="space-y-3">
        {data.map((metric) => (
          <div className="grid grid-cols-[72px_1fr] items-center gap-3 text-sm" key={metric.metric}>
            <span className="font-medium text-foreground">{metric.metric}</span>
            <div className="space-y-1">
              <div className="h-2 rounded-full bg-warning/20">
                <div className="h-2 rounded-full bg-warning" style={{ width: `${metric.planned}%` }} />
              </div>
              <div className="h-2 rounded-full bg-success/20">
                <div className="h-2 rounded-full bg-success" style={{ width: `${metric.readiness}%` }} />
              </div>
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-warning" /> Planned demand
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-success" /> Current readiness
          </span>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell() {
  const [selectedDirection, setSelectedDirection] = useState<Direction>(todayCue.direction);
  const [cueData, setCueData] = useState<CueData>({
    source: "local",
    today: todayCue,
    scenarios: stateCueScenarios,
  });
  const activeCue = cueData.scenarios.find((scenario) => scenario.direction === selectedDirection) ?? cueData.today;
  const direction = directionCopy[activeCue.direction];
  const adjustment = planAdjustments[activeCue.direction];
  const readinessMetrics = readinessMetricsByDirection[activeCue.direction];
  const readinessRadarData = readinessMetrics.map((metric) => ({
    metric: metric.label,
    planned: metric.planned,
    readiness: metric.readiness,
  }));
  const dataSourceNote =
    cueData.source === "api"
      ? "API mock mode: deterministic mock cues are coming from the staging API."
      : "Local mock mode: the staging API is private by design, so this public demo uses deterministic mock data.";
  const navLabel = useMemo(() => `StateCue navigation, active section Today`, []);

  useEffect(() => {
    const controller = new AbortController();

    void loadCueDataFromApi(undefined, fetch, controller.signal)
      .then((result: CueFetchResult) => {
        setCueData(result.data);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[248px_1fr]">
        <aside className="hidden border-r border-border bg-surface/80 px-5 py-6 lg:block">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">StateCue</p>
            <p className="mt-2 text-sm text-muted">Running plan agent</p>
          </div>
          <nav aria-label={navLabel} className="space-y-1">
            {navItems.map((item) => (
              <button
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  item === "Today" ? "bg-background text-foreground" : "text-muted hover:bg-background/70 hover:text-foreground"
                }`}
                key={item}
                type="button"
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="mt-8 rounded-md border border-border bg-background/70 p-3 text-sm text-muted">
            <span className="block font-medium text-foreground">Mock source</span>
            Fitbit / Google Health adapter planned. No live integrations in this public demo.
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 py-4 backdrop-blur sm:px-8 lg:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip color="accent" size="sm" variant="soft">
                    Mock demo
                  </Chip>
                  <Chip color={cueData.source === "api" ? "success" : "default"} size="sm" variant="tertiary">
                    {cueData.source === "api" ? "API mock" : "Local mock"}
                  </Chip>
                  <Chip color="default" size="sm" variant="tertiary">
                    No live integrations
                  </Chip>
                </div>
                <h1 className="mt-3 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                  Tomorrow's run, adjusted from yesterday's signals.
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-muted">
                  今日の状態から、進む合図を。{" "}
                  StateCue compares a weekly running plan with mock sleep, HRV, load, fatigue, and data freshness
                  before suggesting a non-medical training adjustment.
                </p>
              </div>
              <div className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted">
                <span className="block font-medium text-foreground">{activeCue.dateLabel}</span>
                Non-medical demo. Mock signals only.
              </div>
            </div>
          </header>

          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 pb-24 sm:px-8 lg:px-10">
            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <Card className="border border-border bg-surface shadow-sm" role="region" aria-labelledby="adjustment-title">
                <Card.Header>
                  <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Card.Description>Next session adjustment</Card.Description>
                      <Card.Title id="adjustment-title" className="mt-1 text-3xl sm:text-4xl">
                        {adjustment.adjustedTitle}
                      </Card.Title>
                    </div>
                    <DirectionChip direction={activeCue.direction} />
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="grid gap-4 md:grid-cols-[160px_1fr] md:items-center">
                    <div className="flex items-center gap-4">
                      <ProgressCircle aria-label="Plan adjustment score" color={direction.chip} value={adjustment.score}>
                        <ProgressCircle.Track>
                          <ProgressCircle.TrackCircle />
                          <ProgressCircle.FillCircle />
                        </ProgressCircle.Track>
                      </ProgressCircle>
                      <div>
                        <p className="text-2xl font-semibold">{adjustment.score}</p>
                        <p className="text-sm text-muted">score / {adjustment.zone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted">Planned: {adjustment.plannedTitle}</p>
                      <p className="mt-2 text-lg text-foreground">{adjustment.changeSummary}</p>
                      <p className="mt-3 text-sm text-muted">{adjustment.agentSummary}</p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {adjustment.guardrails.map((guardrail) => (
                      <p className="rounded-md border border-border bg-background/70 px-4 py-3 text-sm text-foreground" key={guardrail}>
                        {guardrail}
                      </p>
                    ))}
                  </div>
                </Card.Content>
                <Card.Footer>
                  <p className="text-sm text-muted">{adjustment.feedbackPrompt}</p>
                </Card.Footer>
              </Card>

              <Card className="border border-border bg-surface" role="region" aria-labelledby="readiness-title">
                <Card.Header>
                  <Card.Title id="readiness-title">Plan demand vs readiness</Card.Title>
                  <Card.Description>Radar-style mock comparison for tomorrow's training decision.</Card.Description>
                </Card.Header>
                <Card.Content>
                  <ReadinessRadar data={readinessRadarData} />
                </Card.Content>
              </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <Card className="border border-border bg-surface" role="region" aria-labelledby="plan-title">
                <Card.Header>
                  <div className="flex w-full items-start justify-between gap-4">
                    <div>
                      <Card.Title id="plan-title">Weekly running plan</Card.Title>
                      <Card.Description>{weeklyRunningPlan.goal}</Card.Description>
                    </div>
                    <Chip color="default" size="sm" variant="tertiary">
                      {weeklyRunningPlan.weekLabel}
                    </Chip>
                  </div>
                </Card.Header>
                <Card.Content>
                  <Table>
                    <Table.ScrollContainer>
                      <Table.Content aria-label="Mock weekly running plan" className="min-w-[620px]">
                        <Table.Header>
                          <Table.Column isRowHeader>Day</Table.Column>
                          <Table.Column>Session</Table.Column>
                          <Table.Column>Load</Table.Column>
                          <Table.Column>Priority</Table.Column>
                        </Table.Header>
                        <Table.Body>
                          {weeklyRunningPlan.sessions.map((session) => (
                            <Table.Row key={session.day}>
                              <Table.Cell>{session.day}</Table.Cell>
                              <Table.Cell>{session.label}</Table.Cell>
                              <Table.Cell>
                                {session.plannedDistanceKm === null ? `${session.plannedDurationMin} min` : `${session.plannedDistanceKm} km`}
                              </Table.Cell>
                              <Table.Cell>{session.priority}</Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Content>
                    </Table.ScrollContainer>
                  </Table>
                </Card.Content>
              </Card>

              <Card className="border border-border bg-surface" role="region" aria-labelledby="scenario-title">
                <Card.Header>
                  <Card.Title id="scenario-title">Mock scenario control</Card.Title>
                  <Card.Description>Switch the signal state to see the plan adjustment change.</Card.Description>
                </Card.Header>
                <Card.Content>
                  <Tabs
                    className="w-full"
                    selectedKey={activeCue.direction}
                    onSelectionChange={(key) => {
                      if (isDirection(key)) {
                        setSelectedDirection(key);
                      }
                    }}
                  >
                    <Tabs.ListContainer>
                      <Tabs.List aria-label="Choose a deterministic mock scenario" className="w-full flex-wrap *:min-h-10 *:flex-1">
                        {cueData.scenarios.map((scenario) => (
                          <Tabs.Tab id={scenario.direction} key={scenario.direction}>
                            {directionCopy[scenario.direction].label}
                            <Tabs.Indicator />
                          </Tabs.Tab>
                        ))}
                      </Tabs.List>
                    </Tabs.ListContainer>
                    {cueData.scenarios.map((scenario) => (
                      <Tabs.Panel className="px-1 pt-3 text-sm text-muted" id={scenario.direction} key={scenario.direction}>
                        {scenario.scenarioSummary}
                      </Tabs.Panel>
                    ))}
                  </Tabs>
                  <p className="mt-4 rounded-md border border-border bg-background/70 px-4 py-3 text-sm text-muted">
                    {dataSourceNote}
                  </p>
                </Card.Content>
              </Card>
            </section>

            <section aria-label="Signal summaries" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {activeCue.signals.map((signal) => (
                <SignalCard key={signal.name} signal={signal} />
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <Card className="border border-border bg-surface" role="region" aria-labelledby="rationale-title">
                <Card.Header>
                  <Card.Title id="rationale-title">Why this adjustment</Card.Title>
                  <Card.Description>Deterministic scoring first, AI explanation later.</Card.Description>
                </Card.Header>
                <Card.Content>
                  <ol className="space-y-4">
                    {activeCue.rationale.map((item) => (
                      <li className="rounded-md border border-border bg-background/70 p-4 text-sm text-foreground" key={item}>
                        {item}
                      </li>
                    ))}
                  </ol>
                </Card.Content>
              </Card>

              <Card className="border border-border bg-surface" role="region" aria-labelledby="history-title">
                <Card.Header>
                  <Card.Title id="history-title">Decision loop preview</Card.Title>
                  <Card.Description>Mock history for future feedback and eval tracking.</Card.Description>
                </Card.Header>
                <Card.Content>
                  <Table>
                    <Table.ScrollContainer>
                      <Table.Content aria-label="Mock cue history" className="min-w-[560px]">
                        <Table.Header>
                          <Table.Column isRowHeader>Day</Table.Column>
                          <Table.Column>Planned</Table.Column>
                          <Table.Column>Cue</Table.Column>
                          <Table.Column>Limiter</Table.Column>
                        </Table.Header>
                        <Table.Body>
                          {cueHistory.map((item) => (
                            <Table.Row key={`${item.day}-${item.planned}`}>
                              <Table.Cell>{item.day}</Table.Cell>
                              <Table.Cell>{item.planned}</Table.Cell>
                              <Table.Cell>{directionCopy[item.actualCue].label}</Table.Cell>
                              <Table.Cell>{item.limiter}</Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Content>
                    </Table.ScrollContainer>
                  </Table>
                </Card.Content>
              </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <Alert status="accent" className="border border-border bg-surface">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Data & trust boundary</Alert.Title>
                  <Alert.Description>{activeCue.safetyNote}</Alert.Description>
                </Alert.Content>
              </Alert>

              <Card className="border border-border bg-surface" role="region" aria-labelledby="logic-title">
                <Card.Header>
                  <Card.Title id="logic-title">Cue logic reference</Card.Title>
                  <Card.Description>Training-plan meaning for each deterministic cue.</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {cueLogicReference.map((item) => (
                      <article className="rounded-md border border-border bg-background/70 p-4" key={item.direction}>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold">{item.logicLabel}</h3>
                          <DirectionChip direction={item.direction} />
                        </div>
                        <p className="mt-3 text-sm text-muted">{item.logicSummary}</p>
                      </article>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </section>
          </div>

          <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-border bg-background/95 px-2 py-2 backdrop-blur lg:hidden" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Button
                className={`min-w-0 px-1 text-xs ${item === "Today" ? "text-accent" : "text-muted"}`}
                key={item}
                size="sm"
                variant={item === "Today" ? "secondary" : "ghost"}
              >
                {item}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </main>
  );
}
