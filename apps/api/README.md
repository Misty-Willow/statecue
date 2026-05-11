# StateCue API

Small Go API for deterministic mock StateCue responses.

## Run Locally

```bash
go run ./cmd/statecue-api
```

The server listens on `:8080` by default. Set `PORT` to change the port.

## Endpoints

- `GET /healthz`
- `GET /api/cue`
- `GET /api/cue?scenario=go`
- `GET /api/cue?scenario=light`
- `GET /api/cue?scenario=rest`
- `GET /api/cue?scenario=check`
- `GET /api/scenarios`

All responses use deterministic mock data. This API does not connect to wearable platforms, accounts, private records, or real health data.
