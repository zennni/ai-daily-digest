#!/usr/bin/env bash
# Optional: install a pre-push hook that runs preflight-check.mjs.
# Does not modify existing hooks unless you pass --force.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOK="$ROOT/.git/hooks/pre-push"
BODY='#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
node scripts/preflight-check.mjs
'

if [[ -f "$HOOK" && "${1:-}" != "--force" ]]; then
  echo "install-pre-push-hook: $HOOK already exists; pass --force to overwrite" >&2
  exit 1
fi
printf '%s\n' "$BODY" > "$HOOK"
chmod +x "$HOOK"
echo "install-pre-push-hook: wrote $HOOK"
