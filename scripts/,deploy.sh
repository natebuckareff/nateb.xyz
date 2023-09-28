#!/usr/bin/env bash

set -eu

source "$PROJECT_PATH/.env.prod"

# Generate new build ID, waiting one second to avoid duplicates
sleep 1
export REGISTRY
export REGISTRY_USERNAME
export BUILD_ID="$(date +"%Y-%m-%d-%s%3N")"

# Build images
docker compose build

# Login to registry
echo "$REGISTRY_PASSWORD_RW" \
    | docker login "$REGISTRY" -u "$REGISTRY_USERNAME" --password-stdin

# Push to registry and logout
docker compose push
docker logout "$REGISTRY"

DEPLOY_FILE="deploy/docker-compose.$BUILD_ID.yml"

# Setup deployment directory
ssh nateb.xyz "mkdir -p deploy"

# Upload docker compose config with "services[].build" section removed
docker compose config \
    | yq '.services[] |= del(.build)' \
    | ssh nateb.xyz "cat > $DEPLOY_FILE"

# Update link to config
ssh nateb.xyz "rm -f docker-compose.yml"
ssh nateb.xyz "ln -s $DEPLOY_FILE docker-compose.yml"

# Login to registry on server and stay logged in so images may be pulled
# whenever necessary
ssh nateb.xyz "
    echo $REGISTRY_PASSWORD_RO \
        | docker login $REGISTRY -u $REGISTRY_USERNAME --password-stdin
"

# Upload services
ssh nateb.xyz "docker compose up -d"
