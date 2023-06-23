#!/usr/bin/env bash

# XXX Copied from another project

set -euo pipefail

function find_root_directory() {
    local CURRENT_PATH

    CURRENT_PATH="$PWD"

    while true; do
        if [[ "$CURRENT_PATH" = '/' ]]; then
            echo "PNPM workspace not found" >&2
            exit 1
        fi

        if [[ -f "$CURRENT_PATH/pnpm-workspace.yaml" ]]; then
            echo "$CURRENT_PATH"
            return
        fi

        CURRENT_PATH="$(dirname "$CURRENT_PATH")"
    done
}

function get_docker_compose_config_flags() {
    local DOCKER_COMPOSE_ENV

    DOCKER_COMPOSE_ENV="$1"

    find -type f \
        | rg "docker-compose(.${DOCKER_COMPOSE_ENV})?.yml" \
        | sed 's/^/-f /g' \
        | tr '\n' ' ' \
        | head -c -1
}

function get_and_merge_env_files() {
    local DOCKER_COMPOSE_ENV
    local TEMP_ENV

    DOCKER_COMPOSE_ENV="$1"
    TEMP_ENV="$(mktemp)"

    find -type f \
        | rg ".env.${DOCKER_COMPOSE_ENV}" \
        | xargs -I {} bash -c "cat {} | sed -e '\$a\' -" \
        | sort -t '=' -u -k1 \
        >"$TEMP_ENV"

    echo "$TEMP_ENV"
}

function main() {
    local ENVIRONMENT
    local ROOT_DIRECTORY
    local TEMP_ENV

    if [[ "$1" != "dev" ]] && [[ "$1" != "prod" ]]; then
        echo "Invalid environment: $1" >&2
        exit 1
    fi

    ENVIRONMENT="$1"

    shift

    ROOT_DIRECTORY="$(find_root_directory)"

    cd "$ROOT_DIRECTORY"

    TEMP_ENV="$(get_and_merge_env_files "$ENVIRONMENT")"

    docker compose \
        --project-name natebxyz \
        --project-directory . \
        $(get_docker_compose_config_flags "$ENVIRONMENT") \
        --env-file "$TEMP_ENV" \
        $@

    rm "$TEMP_ENV"
}

main "$@"