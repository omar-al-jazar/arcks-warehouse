#!/bin/bash
# Claude Code cloud sessions start without node_modules. Local checkouts manage their own.
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" || exit 1
hashes=node_modules/.install-deps.sha256

if ! sha256sum --check --status "$hashes" 2>/dev/null; then
  rm -f "$hashes"
  if npm ci --no-audit --no-fund; then
    sha256sum .claude/hooks/install-deps.sh package.json package-lock.json > "$hashes" || rm -f "$hashes"
  fi
fi
exit 0
