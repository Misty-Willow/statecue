import { useState } from "react";
import { Alert, Card, Chip, Label, Meter, Tabs } from "@heroui/react";
import {
  directionCopy,
  isDirection,
  signalColor,
  stateCueScenarios,
  todayCue,
  type Direction,
  type SignalSummary,
} from "../data/statecue";

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

export function DashboardShell() {
  const [selectedDirection, setSelectedDirection] = useState<Direction>(todayCue.direction);
  const activeCue =
    stateCueScenarios.find((scenario) => scenario.direction === selectedDirection) ?? todayCue;
  const direction = directionCopy[activeCue.direction];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Chip color="accent" size="sm" variant="soft">
                Mock demo
              </Chip>
              <Chip color="default" size="sm" variant="tertiary">
                No live integrations
              </Chip>
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">StateCue</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Daily recovery direction from sleep, load, and fatigue signals.
            </h1>
            <p className="mt-3 text-lg text-muted">今日の状態から、進む合図を。</p>
          </div>
          <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
            <span className="block font-medium text-foreground">{activeCue.dateLabel}</span>
            Non-medical demo cue. Mock signals only. No real health data.
          </div>
        </header>

        <section className="rounded-lg border border-border bg-surface/80 p-3" aria-label="Mock scenario selector">
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
              <Tabs.List
                aria-label="Choose a deterministic mock scenario"
                className="w-full flex-wrap *:min-h-10 *:flex-1 *:px-4 *:text-sm *:font-medium"
              >
                {stateCueScenarios.map((scenario) => (
                  <Tabs.Tab id={scenario.direction} key={scenario.direction}>
                    {directionCopy[scenario.direction].label}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs.ListContainer>
            {stateCueScenarios.map((scenario) => (
              <Tabs.Panel className="px-1 pt-3 text-sm text-muted" id={scenario.direction} key={scenario.direction}>
                {scenario.scenarioSummary}
              </Tabs.Panel>
            ))}
          </Tabs>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border border-border bg-surface shadow-sm" role="region" aria-labelledby="today-cue-title">
            <Card.Header>
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Card.Description>Today's cue</Card.Description>
                  <Card.Title id="today-cue-title" className="mt-1 text-4xl sm:text-5xl">
                    {activeCue.title}
                  </Card.Title>
                </div>
                <DirectionChip direction={activeCue.direction} />
              </div>
            </Card.Header>
            <Card.Content>
              <p className="max-w-2xl text-xl text-foreground">{activeCue.subtitle}</p>
              <p className="mt-3 text-muted">{direction.description}</p>
              <p className="mt-5 rounded-md border border-border bg-background/70 px-4 py-3 text-sm font-medium text-foreground">
                {activeCue.primarySignal}
              </p>

              <div className="mt-8">
                <Meter
                  aria-label="Cue clarity"
                  color="accent"
                  maxValue={100}
                  minValue={0}
                  size="lg"
                  value={activeCue.clarityScore}
                  valueLabel={`${activeCue.clarityScore}/100`}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Label className="text-sm font-medium text-foreground">
                      Cue clarity: {activeCue.confidence}
                    </Label>
                    <Meter.Output className="text-sm text-muted" />
                  </div>
                  <Meter.Track>
                    <Meter.Fill />
                  </Meter.Track>
                </Meter>
              </div>
            </Card.Content>
            <Card.Footer>
              <p className="text-sm text-muted">Canonical state: {activeCue.direction}</p>
            </Card.Footer>
          </Card>

          <Card className="border border-border bg-surface" role="region" aria-labelledby="rationale-title">
            <Card.Header>
              <Card.Title id="rationale-title">Why this cue</Card.Title>
              <Card.Description>Transparent reasoning from mock signals.</Card.Description>
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
        </section>

        <section aria-label="Signal summaries" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {activeCue.signals.map((signal) => (
            <SignalCard key={signal.name} signal={signal} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Alert status="accent" className="border border-border bg-surface">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Mock data boundary</Alert.Title>
              <Alert.Description>{activeCue.safetyNote}</Alert.Description>
            </Alert.Content>
          </Alert>

          <Card className="border border-border bg-surface" role="region" aria-labelledby="scenario-title">
            <Card.Header>
              <Card.Title id="scenario-title">Scenario contrast</Card.Title>
              <Card.Description>How the same model should shift when mock signals change.</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid gap-3 sm:grid-cols-2">
                {stateCueScenarios.map((scenario) => (
                  <article
                    className="rounded-md border border-border bg-background/70 p-4"
                    key={scenario.direction}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold">{scenario.title}</h3>
                      <DirectionChip direction={scenario.direction} />
                    </div>
                    <p className="mt-3 text-sm text-muted">{scenario.scenarioSummary}</p>
                  </article>
                ))}
              </div>
            </Card.Content>
          </Card>
        </section>
      </div>
    </main>
  );
}
