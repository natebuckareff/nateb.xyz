#!/usr/bin/env bash

set -euo pipefail

# Build the site image locally, ship it to the server over SSH and start it
# there. The server holds nothing but Docker state: compose runs here and
# talks to the server's Docker daemon over SSH.

DEPLOY_HOST="${DEPLOY_HOST:-nate@100.105.96.18}"
PROJECT_PATH="${PROJECT_PATH:-$(git rev-parse --show-toplevel)}"
COMPOSE_FILE="$PROJECT_PATH/docker-compose.prod.yml"

cd "$PROJECT_PATH"

# Only deploy committed code
if [ -n "$(git status --porcelain)" ]; then
    echo "deploy: working tree has uncommitted changes" >&2
    exit 1
fi

export IMAGE_TAG="$(git rev-parse --short HEAD)"
IMAGE="natebxyz-site:$IMAGE_TAG"

# Build images locally
docker compose -f "$COMPOSE_FILE" build site

# Ship the image to the server
docker save "$IMAGE" | gzip -1 | ssh "$DEPLOY_HOST" "gunzip | docker load"

# Start services on the server
DOCKER_HOST="ssh://$DEPLOY_HOST" docker compose -f "$COMPOSE_FILE" up -d --no-build

echo "deployed $IMAGE"
