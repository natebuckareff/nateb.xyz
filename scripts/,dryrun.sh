#!/usr/bin/env bash

source "$PROJECT_PATH/.env.prod"

sleep 1
export DOMAIN="$(cat "$PROJECT_PATH/.env.dev" | grep DOMAIN | grep -oE '"[^"]+"' | tr -d \")"
export REGISTRY
export REGISTRY_USERNAME
export BUILD_ID="$(date +"%Y-%m-%d-%s%3N")"

docker compose build
docker compose up -d