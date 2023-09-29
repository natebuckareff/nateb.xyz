#!/usr/bin/env bash

set -euo pipefail

set -a
source "$PROJECT_PATH/.env.stage"
set +a

sleep 1
export BUILD_ID="$(date +"%Y-%m-%d-%s%3N")"

docker compose build
docker compose up -d