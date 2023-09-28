#!/usr/bin/env bash
RECIPIENTS_DIR="$PROJECT_PATH/.secrets/recipients"
RECIPIENTS=$(ls "$RECIPIENTS_DIR" | xargs -I {} echo " -R $RECIPIENTS_DIR/{}" | tr -d '\n')
INPUT="$PROJECT_PATH/.env.prod"

age --encrypt $RECIPIENTS -o "$INPUT.age" "$INPUT"