#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT/apps/web/dist"
INDEX_HTML="$DIST_DIR/index.html"

fail() {
  printf 'check-web-build: %s\n' "$*" >&2
  exit 1
}

[[ -f "$INDEX_HTML" ]] || fail "missing built index.html; run npm --prefix apps/web run build first"
grep -Fq '<title>StateCue</title>' "$INDEX_HTML" || fail "built HTML must include the StateCue title"
grep -Fq 'StateCue gives a daily recovery direction' "$INDEX_HTML" || fail "built HTML must include the public description"

mapfile -t asset_paths < <(grep -Eo '/assets/[^"]+\.(js|css)' "$INDEX_HTML" | sort -u)
[[ "${#asset_paths[@]}" -gt 0 ]] || fail "built HTML must reference JS/CSS assets"

for asset_path in "${asset_paths[@]}"; do
  [[ -f "$DIST_DIR$asset_path" ]] || fail "built asset is missing: $asset_path"
done

bundle_text="$(cat "$DIST_DIR"/assets/*.js "$DIST_DIR"/assets/*.css 2>/dev/null || true)"

for expected in \
  "Mock demo" \
  "Local mock" \
  "No live integrations" \
  "今日の状態から、進む合図を。" \
  "Non-medical demo cue" \
  "Mock data boundary" \
  "Canonical state" \
  "go" \
  "light" \
  "rest" \
  "check"; do
  [[ "$bundle_text" == *"$expected"* ]] || fail "built bundle is missing expected public demo text: $expected"
done

printf 'check-web-build: Firebase Hosting build smoke passed (%d assets)\n' "${#asset_paths[@]}"
