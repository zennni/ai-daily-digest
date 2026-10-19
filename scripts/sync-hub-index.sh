#!/usr/bin/env bash
# hub.html canonical → copy to index.html (GitHub Pages entry).
# Run after editing hub.html CSS/DOM; commit both files together.
# If you also changed rows/aliases/daily/news, run node scripts/build-hub.mjs
# before or after sync so window.HUB stays generated from JSON.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/hub.html"
DST="$ROOT/index.html"
if [[ ! -f "$SRC" ]]; then
  echo "sync-hub-index: missing $SRC" >&2
  exit 1
fi
cp "$SRC" "$DST"
echo "sync-hub-index: hub.html → index.html ($(wc -c < "$DST") bytes)"
