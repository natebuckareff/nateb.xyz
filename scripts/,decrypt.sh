#!/usr/bin/env bash
IDENTITY="$PROJECT_PATH/.secrets/secret-age-identity"

for INPUT in $(find "$PROJECT_PATH" -maxdepth 1 -type f -name ".env.*.age"); do
    OUTPUT="$(echo $INPUT | sed 's/\.age$//')"

    echo "decrypt: $(basename $INPUT) -> $(basename $OUTPUT)"
    age --decrypt -i "$IDENTITY" -o "$OUTPUT" "$INPUT"
done
