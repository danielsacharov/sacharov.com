#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${HETZNER_HOST:-hetzner-cursor}"
REMOTE_DIR="${REMOTE_DIR:-/root/sacharov.com}"

rsync -avz --delete \
  --exclude '.DS_Store' \
  --exclude 'node_modules' \
  --exclude '.git' \
  -e "ssh -o IdentitiesOnly=yes" \
  "${HOST}:${REMOTE_DIR}/" \
  "$ROOT/"

echo "Synced ← ${HOST}:${REMOTE_DIR}"
