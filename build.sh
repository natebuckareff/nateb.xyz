#/usr/bin/env bash

COMMIT="$(git rev-parse HEAD)"
DEPLOY="$(date +"%s%3N")"

docker build \
    --build-arg="VITE_DEPLOY_COMMIT=$COMMIT" \
    --build-arg="VITE_DEPLOY_TIMESTAMP=$DEPLOY" \
    -t nateb.xyz .
