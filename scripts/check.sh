#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

failures=0

fail() {
  printf 'check: %s\n' "$*" >&2
  failures=1
}

required_files=(
  .github/workflows/check.yml
  .gitignore
  AGENTS.md
  DESIGN.md
  LICENSE
  README.md
  docs/architecture/overview.md
  docs/plan.md
  docs/structure.md
  scripts/check-gcp-staging.sh
  scripts/check.sh
  apps/web/index.html
  apps/web/package-lock.json
  apps/web/package.json
  apps/web/public/favicon.svg
  apps/web/src/App.tsx
  apps/web/src/components/DashboardShell.tsx
  apps/web/src/data/statecue.ts
  apps/web/src/main.tsx
  apps/web/src/styles.css
  apps/web/tsconfig.app.json
  apps/web/tsconfig.json
  apps/web/tsconfig.node.json
  apps/web/vite.config.ts
  apps/api/README.md
  apps/api/Dockerfile
  apps/api/go.mod
  apps/api/cmd/statecue-api/main.go
  apps/api/internal/statecue/cue.go
  apps/api/internal/statecue/cue_test.go
  apps/api/internal/statecue/handler.go
  apps/api/internal/statecue/handler_test.go
  apps/api/internal/statecue/model.go
  docs/deployment/gcp-predeploy-plan.md
  docs/deployment/gcp-staging.md
  specs/006-cloud-run-readiness/plan.md
  specs/006-cloud-run-readiness/spec.md
  specs/006-cloud-run-readiness/tasks.md
  specs/001-statecue-mock-direction/plan.md
  specs/001-statecue-mock-direction/spec.md
  specs/001-statecue-mock-direction/tasks.md
  specs/002-interactive-mock-scenarios/plan.md
  specs/002-interactive-mock-scenarios/spec.md
  specs/002-interactive-mock-scenarios/tasks.md
  specs/003-deterministic-cue-derivation/plan.md
  specs/003-deterministic-cue-derivation/spec.md
  specs/003-deterministic-cue-derivation/tasks.md
  specs/004-decision-surface-polish/plan.md
  specs/004-decision-surface-polish/spec.md
  specs/004-decision-surface-polish/tasks.md
)

is_git_repo() {
  git rev-parse --is-inside-work-tree >/dev/null 2>&1
}

is_pruned_path() {
  local path="${1#./}"

  case "$path" in
    .git|.git/*|\
    .heroui-docs|.heroui-docs/*|\
    node_modules|node_modules/*|*/node_modules/*|\
    dist|dist/*|*/dist/*|\
    build|build/*|*/build/*|\
    coverage|coverage/*|*/coverage/*|\
    .vite|.vite/*|*/.vite/*|\
    logs|logs/*|*/logs/*|\
    .cache|.cache/*|*/.cache/*|\
    .turbo|.turbo/*|*/.turbo/*|\
    .parcel-cache|.parcel-cache/*|*/.parcel-cache/*|\
    .npm|.npm/*|*/.npm/*|\
    .pnpm-store|.pnpm-store/*|*/.pnpm-store/*|\
    .yarn/cache|.yarn/cache/*|*/.yarn/cache/*|\
    .yarn/unplugged|.yarn/unplugged/*|*/.yarn/unplugged/*|\
    vendor|vendor/*|*/vendor/*|\
    tmp|tmp/*|*/tmp/*|\
    test-results|test-results/*|*/test-results/*|\
    playwright-report|playwright-report/*|*/playwright-report/*|\
    .playwright-cli|.playwright-cli/*|*/.playwright-cli/*)
      return 0
      ;;
  esac

  return 1
}

is_secret_filename() {
  local lower
  lower="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')"

  case "$lower" in
    .env|.env.*|*/.env|*/.env.*|\
    *.pem|*.key|*.p8|*.p12|*.pfx|*.crt|*.cer|\
    *id_rsa*|*id_ed25519*|*private_key*|*private-key*|\
    *client_secret*|*client-secret*|*service_account*|*service-account*|\
    *credential*|*credentials*|*secret*|*secrets*|*token*|*tokens*|\
    *.kdbx)
      return 0
      ;;
  esac

  return 1
}

is_generated_filename() {
  local lower
  lower="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')"

  case "$lower" in
    *.log|*.tmp|*.temp|*.pid|*.seed|*.local|\
    *.db|*.sqlite|*.sqlite3|*.db-journal|*.sqlite-shm|*.sqlite-wal|\
    *.tsbuildinfo|*.eslintcache|*.map|\
    */npm-debug.log*|*/yarn-debug.log*|*/yarn-error.log*|*/pnpm-debug.log*)
      return 0
      ;;
  esac

  return 1
}

is_real_data_filename() {
  local lower
  lower="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')"

  [[ "$lower" =~ (^|/)(real[-_])?(oura|whoop|garmin|fitbit|strava|apple[-_]?health|health[-_]?export|sleep[-_]?(data|log|raw|export)|workout[-_]?(data|raw|export)|heart[-_]?rate|hrv|body[-_]?battery|recovery[-_]?(data|raw|export)|readiness[-_]?(data|raw|export)).*\.(csv|tsv|json|jsonl|xlsx|parquet|fit|tcx|gpx|xml|zip)$ ]]
}

collect_files() {
  if is_git_repo; then
    git ls-files --cached --others --exclude-standard -z
  else
    find . \
      \( -path './.git' \
      -o -path './.heroui-docs' \
      -o -path './node_modules' \
      -o -path './dist' \
      -o -path './build' \
      -o -path './coverage' \
      -o -path './.vite' \
      -o -path './logs' \
      -o -path './.cache' \
      -o -path './.turbo' \
      -o -path './.parcel-cache' \
      -o -path './.npm' \
      -o -path './.pnpm-store' \
      -o -path './.yarn/cache' \
      -o -path './.yarn/unplugged' \
      -o -path './vendor' \
      -o -path './tmp' \
      -o -path './test-results' \
      -o -path './playwright-report' \
      -o -path './.playwright-cli' \) -prune \
      -o -type f -print0
  fi
}

if is_git_repo; then
  if [[ -n "$(git ls-files -- .heroui-docs)" ]]; then
    fail ".heroui-docs is tracked; remove it from git history/index before publishing"
  fi
fi

mapfile -d '' files < <(collect_files)

for required_file in "${required_files[@]}"; do
  [[ -f "$required_file" ]] || fail "required public-foundation file is missing: $required_file"
done

spec_slice_dirs=(specs/*/)
for spec_slice_dir in "${spec_slice_dirs[@]}"; do
  [[ -d "$spec_slice_dir" ]] || continue

  spec_slice_dir="${spec_slice_dir%/}"
  for spec_artifact in spec.md plan.md tasks.md; do
    [[ -f "$spec_slice_dir/$spec_artifact" ]] || fail "spec slice is missing required artifact: $spec_slice_dir/$spec_artifact"
  done
done

banned_terms_regex='internal-only|not for public|remove before public|do not publish|confidential|private repo[:=]|personal project[:=]|old product name[:=]|legacy project[:=]|sandbox repo[:=]'
private_users_path="/Us""ers"
private_home_regex="(${private_users_path}/|/home/[^[:space:]/]+/|C:\\\\Us""ers\\\\|file://${private_users_path}/|~/.ssh|~/.config)"
secret_content_regex='-----BEGIN (RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9_]{36,}|github_pat_[A-Za-z0-9_]{40,}|sk-[A-Za-z0-9_-]{24,}|AIza[0-9A-Za-z_-]{35}|xox[baprs]-[A-Za-z0-9-]{20,}'
medical_overclaim_regex='StateCue (diagnoses|treats|prevents|predicts|cures)|StateCue (is|acts as|serves as) (a )?(medical product|medical device|diagnostic|clinical)|professional medical advice|guarantees performance|treatment plan'
legacy_marker_hashes='5:a69baba413d82a01f77e80b730db2c9bb77e420f3ccc3f47b5abf6eae48aa5c6
5:9e3efb94c0e87016dd50899bddc76ad977bfebb8df02a70d879cb5159c8700ec
16:7229e13b0f989ce68bbdac2fb6e826f915dfd6caac9729be1de26c92f8a84524
18:b8e9fd3129e99772771b02f5d8699c36c8afd4dfece5f686e118659f84bdae3c
7:c903759742b75021c0daffedc7592cbc303fce8d37909a875f7eac996ae266d2
4:5a5c3f75ebced12129fcfd5391e500813b9c9b22ae6be6ff6ac7de707d8215d7
11:1f3084ca4f78338377c46cb5aa163274595f9da954916ae5f0f9ac7924e11756
10:ea36bac571e5ca395a108c943b3b3a81f6314c54309c76bafb182a8d6275b7dd
7:53a5f66d2bda0f6aa12b40e6ea7d111e692713adc2a68388b09b36b1d5bb4723
6:0615570f9ea136946c5dc08a250010320707646f57f72cedab1dfb73d95eade6
4:adc96e398532548b5faf8323dbdec7a55d2a04e24661a89ff202eb4add16cd80
12:11fe14a563f7aed66191800dc08fe0d15049ef7d9dac5f5ab4b0ca20b28e193d'

contains_legacy_marker() {
  local path="$1"

  LEGACY_MARKER_HASHES="$legacy_marker_hashes" python3 - "$path" <<'PY'
import hashlib
import os
import sys

path = sys.argv[1]
markers = {}
for item in os.environ["LEGACY_MARKER_HASHES"].splitlines():
    length, digest = item.split(":", 1)
    markers.setdefault(int(length), set()).add(digest)

try:
    text = open(path, "r", encoding="utf-8").read()
except UnicodeDecodeError:
    sys.exit(1)

for length, digests in markers.items():
    if len(text) < length:
        continue
    for index in range(0, len(text) - length + 1):
        if hashlib.sha256(text[index:index + length].encode("utf-8")).hexdigest() in digests:
            sys.exit(0)

sys.exit(1)
PY
}

for raw_path in "${files[@]}"; do
  path="${raw_path#./}"

  if is_pruned_path "$path"; then
    continue
  fi

  if is_secret_filename "$path"; then
    fail "secret-like file name is not allowed: $path"
    continue
  fi

  if is_generated_filename "$path"; then
    fail "generated or local artifact file is not allowed: $path"
  fi

  if is_real_data_filename "$path"; then
    fail "real-data-looking fixture/export file is not allowed: $path"
  fi

  if [[ "$path" =~ $private_home_regex ]]; then
    fail "private local path appears in file name: $path"
  fi

  if ! grep -Iq . "$path"; then
    continue
  fi

  if contains_legacy_marker "$path"; then
    fail "legacy or private marker found in: $path"
  fi

  if [[ "$path" == "scripts/check.sh" ]]; then
    continue
  fi

  if [[ "$path" == docs/* || "$path" == specs/* ]]; then
    if grep -FIn -- "- [ ]" "$path" >/dev/null; then
      fail "unchecked task marker found in public docs/specs: $path"
    fi
  fi

  if grep -EIn -e "$banned_terms_regex" "$path" >/dev/null; then
    fail "banned legacy/private wording found in: $path"
  fi

  if grep -EIn -e "$private_home_regex" "$path" >/dev/null; then
    fail "private local path found in: $path"
  fi

  if grep -EIn -e "$secret_content_regex" "$path" >/dev/null; then
    fail "secret-like content found in: $path"
  fi

  if grep -EIn -e "$medical_overclaim_regex" "$path" >/dev/null; then
    fail "misleading medical or performance overclaim found in: $path"
  fi
done

foundation_docs=(
  README.md
  DESIGN.md
  docs/plan.md
  docs/structure.md
  docs/architecture/overview.md
  specs/001-statecue-mock-direction/spec.md
  specs/001-statecue-mock-direction/plan.md
  specs/002-interactive-mock-scenarios/spec.md
  specs/002-interactive-mock-scenarios/plan.md
  specs/003-deterministic-cue-derivation/spec.md
  specs/003-deterministic-cue-derivation/plan.md
  specs/005-mock-go-api/spec.md
  specs/005-mock-go-api/plan.md
  specs/006-cloud-run-readiness/spec.md
  specs/006-cloud-run-readiness/plan.md
)

mock_boundary_docs=(
  README.md
  DESIGN.md
  docs/plan.md
  docs/architecture/overview.md
  specs/001-statecue-mock-direction/spec.md
  specs/002-interactive-mock-scenarios/spec.md
  specs/003-deterministic-cue-derivation/spec.md
  specs/005-mock-go-api/spec.md
  specs/006-cloud-run-readiness/spec.md
)

for doc in "${foundation_docs[@]}"; do
  grep -Fq "StateCue" "$doc" || fail "required StateCue naming is missing from: $doc"
done

if ! grep -Fq "go, light, rest, or check" README.md; then
  fail "README must publish the canonical cue taxonomy"
fi

if ! grep -Fq 'type Direction = "go" | "light" | "rest" | "check";' specs/001-statecue-mock-direction/plan.md; then
  fail "mock direction contract must include go/light/rest/check"
fi

for doc in "${mock_boundary_docs[@]}"; do
  grep -Eiq 'mock|demo data' "$doc" || fail "mock/demo data boundary is missing from: $doc"
  grep -Eiq 'non-medical|not a medical|professional advice' "$doc" || fail "non-medical safety boundary is missing from: $doc"
done

if [[ "$(sed -n '1p' apps/web/src/styles.css)" != '@import "tailwindcss";' ]]; then
  fail "apps/web/src/styles.css must import tailwindcss first"
fi

if [[ "$(sed -n '2p' apps/web/src/styles.css)" != '@import "@heroui/styles";' ]]; then
  fail "apps/web/src/styles.css must import @heroui/styles second"
fi

grep -R -Fq "今日の状態から、進む合図を。" apps/web/src || fail "web app must show the Japanese copy"
grep -R -Eiq 'mock|demo' apps/web/src || fail "web app must show mock/demo boundary language"
grep -R -Eiq 'non-medical|professional advice' apps/web/src || fail "web app must show non-medical safety language"
grep -R -Fq "function deriveDirection" apps/web/src || fail "web app must include deterministic cue derivation"
grep -R -Fq "SignalSeverity" apps/web/src || fail "web app must separate raw signal state from visual severity"

if [[ -d apps/api ]]; then
  grep -R -Fq "func DeriveDirection" apps/api || fail "api must include deterministic cue derivation"
  grep -R -Fq 'DataMode:        "mock"' apps/api || fail "api responses must stay mock-scoped"
  grep -R -Eiq 'non-medical|professional advice' apps/api || fail "api must include non-medical safety language"
  grep -Fq 'EXPOSE 8080' apps/api/Dockerfile || fail "api Dockerfile must expose the default Cloud Run port"
  grep -Fq 'USER 65532:65532' apps/api/Dockerfile || fail "api Dockerfile must run as non-root"
  grep -Fq 'ENTRYPOINT ["/statecue-api"]' apps/api/Dockerfile || fail "api Dockerfile must run the API binary"
fi

if (( failures > 0 )); then
  exit 1
fi

printf 'check: public-safety scan passed (%d files)\n' "${#files[@]}"
