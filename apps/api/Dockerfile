ARG BUILDPLATFORM=linux/amd64
FROM --platform=$BUILDPLATFORM golang:1.24-alpine AS build

ARG TARGETOS=linux
ARG TARGETARCH=amd64

WORKDIR /src/apps/api

COPY apps/api/go.mod ./
COPY apps/api/ ./

RUN CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -trimpath -ldflags="-s -w" -o /out/statecue-api ./cmd/statecue-api

FROM scratch

COPY --from=build /out/statecue-api /statecue-api

USER 65532:65532
EXPOSE 8080

ENTRYPOINT ["/statecue-api"]
