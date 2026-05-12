#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-statecue-staging}"
PROJECT_NUMBER="${PROJECT_NUMBER:-520798282771}"
REGION="${REGION:-asia-northeast1}"
SERVICE_NAME="${SERVICE_NAME:-statecue-api}"
BILLING_ACCOUNT="${BILLING_ACCOUNT:-01A659-C200D3-3FBA8E}"
BUDGET_NAME="${BUDGET_NAME:-StateCue Staging JPY 1600 Monthly Alert}"
EXPECTED_IMAGE="${EXPECTED_IMAGE:-asia-northeast1-docker.pkg.dev/statecue-staging/statecue/statecue-api:12cf408}"
EXPECTED_URL="${EXPECTED_URL:-https://statecue-api-g7es36aabq-an.a.run.app}"
EXPECTED_INVOKER="${EXPECTED_INVOKER:-user:runwize.app@gmail.com}"
DEFAULT_COMPUTE_SA="${DEFAULT_COMPUTE_SA:-${PROJECT_NUMBER}-compute@developer.gserviceaccount.com}"
DEPLOYER_SA="${DEPLOYER_SA:-statecue-deployer@statecue-staging.iam.gserviceaccount.com}"

failures=0

fail() {
  printf 'check-gcp-staging: %s\n' "$*" >&2
  failures=1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "missing required command: $1"
}

expect_eq() {
  local label="$1"
  local actual="$2"
  local expected="$3"

  if [[ "$actual" != "$expected" ]]; then
    fail "$label expected '$expected' but got '$actual'"
  fi
}

expect_empty() {
  local label="$1"
  local actual="$2"

  if [[ -n "$actual" ]]; then
    fail "$label expected empty result but got '$actual'"
  fi
}

expect_contains() {
  local label="$1"
  local actual="$2"
  local expected="$3"

  if [[ "$actual" != *"$expected"* ]]; then
    fail "$label expected to contain '$expected'"
  fi
}

require_command gcloud
require_command curl

active_account="$(gcloud auth list --filter=status:ACTIVE --format='value(account)' 2>/dev/null || true)"
if [[ -z "$active_account" ]]; then
  fail "no active gcloud account"
fi

project_state="$(gcloud projects describe "$PROJECT_ID" --format='value(lifecycleState)')"
expect_eq "project lifecycleState" "$project_state" "ACTIVE"

billing_enabled="$(gcloud billing projects describe "$PROJECT_ID" --format='value(billingEnabled)')"
expect_eq "billing enabled" "$billing_enabled" "True"

budget_names="$(gcloud billing budgets list \
  --billing-account "$BILLING_ACCOUNT" \
  --format='value(displayName)' | sort)"
budget_names="$(printf '%s\n' "$budget_names" | grep -Fx "$BUDGET_NAME" || true)"
expect_eq "budget alert" "$budget_names" "$BUDGET_NAME"

service_url="$(gcloud run services describe "$SERVICE_NAME" \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --format='value(status.url)')"
expect_eq "Cloud Run URL" "$service_url" "$EXPECTED_URL"

ready_condition="$(gcloud run services describe "$SERVICE_NAME" \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --format='value(status.conditions[0].status)')"
expect_eq "Cloud Run ready condition" "$ready_condition" "True"

image="$(gcloud run services describe "$SERVICE_NAME" \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --format='value(spec.template.spec.containers[0].image)')"
expect_eq "Cloud Run image" "$image" "$EXPECTED_IMAGE"

invoker_policy="$(gcloud run services get-iam-policy "$SERVICE_NAME" \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --format=json)"
expect_contains "Cloud Run invoker policy" "$invoker_policy" "$EXPECTED_INVOKER"

if [[ "$invoker_policy" == *'"allUsers"'* || "$invoker_policy" == *'"allAuthenticatedUsers"'* ]]; then
  fail "Cloud Run service must not allow public or broad authenticated invocation"
fi

temporary_grants="$(gcloud projects get-iam-policy "$PROJECT_ID" \
  --flatten='bindings[].members' \
  --filter="bindings.members:serviceAccount:${DEFAULT_COMPUTE_SA} AND (bindings.role:roles/storage.objectViewer OR bindings.role:roles/artifactregistry.writer)" \
  --format='value(bindings.role)')"
expect_empty "temporary default compute grants" "$temporary_grants"

deployer_email="$(gcloud iam service-accounts describe "$DEPLOYER_SA" \
  --project "$PROJECT_ID" \
  --format='value(email)' 2>/dev/null || true)"
expect_eq "deployer service account" "$deployer_email" "$DEPLOYER_SA"

deployer_project_roles="$(gcloud projects get-iam-policy "$PROJECT_ID" \
  --flatten='bindings[].members' \
  --filter="bindings.members:serviceAccount:${DEPLOYER_SA}" \
  --format='value(bindings.role)' | sort)"
expect_eq "deployer project-level roles" "$deployer_project_roles" "roles/run.developer"

repo_policy="$(gcloud artifacts repositories get-iam-policy statecue \
  --project "$PROJECT_ID" \
  --location "$REGION" \
  --format=json)"
expect_contains "deployer repository writer" "$repo_policy" "$DEPLOYER_SA"
expect_contains "deployer repository writer role" "$repo_policy" "roles/artifactregistry.writer"

runtime_sa_policy="$(gcloud iam service-accounts get-iam-policy "$DEFAULT_COMPUTE_SA" \
  --project "$PROJECT_ID" \
  --format=json)"
expect_contains "deployer runtime serviceAccountUser" "$runtime_sa_policy" "$DEPLOYER_SA"
expect_contains "deployer runtime serviceAccountUser role" "$runtime_sa_policy" "roles/iam.serviceAccountUser"

public_status="$(curl -sS -o /dev/null -w '%{http_code}' "${EXPECTED_URL}/api/cue")"
expect_eq "public API status" "$public_status" "403"

if (( failures > 0 )); then
  exit 1
fi

printf 'check-gcp-staging: staging drift check passed for %s/%s\n' "$PROJECT_ID" "$SERVICE_NAME"
