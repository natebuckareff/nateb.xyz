#!/usr/bin/env bash
RECIPIENTS_DIR="$PROJECT_PATH/.secrets/recipients"
RECIPIENTS=$(ls "$RECIPIENTS_DIR" | xargs -I {} echo " -R $RECIPIENTS_DIR/{}" | tr -d '\n')
INPUTS=".env.prod .env.stage"

for INPUT in $INPUTS; do
    echo "encrypt: $INPUT -> $INPUT.age"
    age --encrypt $RECIPIENTS -o "$PROJECT_PATH/$INPUT.age" "$PROJECT_PATH/$INPUT"
done
