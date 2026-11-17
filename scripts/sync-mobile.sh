#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/projects/task-panel/app"
OUT="$ROOT/src/.vuepress/public/tasks"
STAMP="${GITHUB_SHA:-$(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)}"
STAMP="${STAMP:0:7}"
mkdir -p "$OUT"
rsync -a --delete "$APP/" "$OUT/"
perl -0pi -e "s/const CACHE = '[^']*';/const CACHE = 'tp-mobile-$STAMP';/" "$OUT/sw.js"
echo "synced app -> $OUT (cache tp-mobile-$STAMP)"
