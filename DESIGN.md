# StateCue Design Foundation

StateCue gives a simple daily recovery direction from sleep, load, fatigue, and data freshness signals.

Japanese copy: 今日の状態から、進む合図を。

## Product Promise

StateCue helps a person start the day with a clear, non-medical read on whether today looks suited for normal effort, a lighter day, rest, or a signal check. The product is intentionally lightweight: it turns a few understandable signals into a plain-language cue, not a diagnosis or training prescription.

## Audience

- People who want a quick morning check-in before deciding how hard to train, work, or recover.
- Hackathon reviewers looking for a credible product direction, public-safe scope, and runnable demo path.
- Future contributors who need a compact product boundary before touching implementation.

## Experience Principles

- Make the first screen useful. Show the current cue, supporting signals, and confidence without a marketing detour.
- Keep language calm and directional. The product should suggest, not alarm or prescribe.
- Prefer transparent mock data. Demo states should be clearly labeled and easy to reason about.
- Avoid medical framing. StateCue is a wellness direction aid for demo purposes, not a medical device or clinical tool.
- Make uncertainty visible. If signals conflict, the interface should say so plainly.

## Visual Direction

The interface should feel focused, clear, and quietly energetic. Use HeroUI v3 as the component baseline, with restrained color, accessible contrast, and data displays that help the daily decision rather than decorating it.

Expected first-view elements:

- Product name: StateCue
- Tagline: Daily recovery direction from sleep, load, and fatigue signals.
- Japanese copy where appropriate: 今日の状態から、進む合図を。
- Today's direction: Go, Light, Rest, or Check
- Signal summary: sleep, recent load, fatigue, data freshness
- Demo-data label and non-medical boundary

## Tone

Use concise, public-facing English. StateCue should sound useful and careful:

- "Your demo signals suggest a light day."
- "Sleep looks supportive, but fatigue is elevated."
- "This is a non-medical wellness cue based on mock data."

Avoid claims that imply diagnosis, treatment, prediction, guaranteed performance, or live data connections.

## Demo Data Boundary

Until a future data-connection plan is explicitly approved, all examples must be mock or demo data. Do not include private user records, non-public exports, connection setup details, or credential material.
