#!/usr/bin/env bash
IDENTITY="$PROJECT_PATH/.secrets/secret-age-identity"
OUTPUT="$PROJECT_PATH/.env.prod"

age --decrypt -i "$IDENTITY" -o "$OUTPUT" "$OUTPUT.age"