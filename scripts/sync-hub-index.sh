#!/usr/bin/env bash
# hub.html canonical → copy to index.html (GitHub Pages entry).
# Run after editing hub.html; commit both files together.
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
