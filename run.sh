#/usr/bin/env bash

docker run -d \
    -p 80:3000 \
    -v ./data:/data \
    -v ./articles:/articles \
    --env-file .env.prod \
    --name nateb.xyz \
    nateb.xyz:latest
