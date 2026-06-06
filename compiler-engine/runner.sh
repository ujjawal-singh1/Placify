#!/bin/bash

LANG=$1
FILE_PATH=$2
INPUT_FILE=$3

# Move to the app directory
cd /app

if [ "$LANG" = "python" ]; then
    if [ -n "$INPUT_FILE" ] && [ -f "$INPUT_FILE" ]; then
        python3 "$FILE_PATH" < "$INPUT_FILE"
    else
        python3 "$FILE_PATH"
    fi

elif [ "$LANG" = "cpp" ]; then
    g++ "$FILE_PATH" -o main 2>&1
    if [ $? -eq 0 ]; then
        if [ -n "$INPUT_FILE" ] && [ -f "$INPUT_FILE" ]; then
            ./main < "$INPUT_FILE"
        else
            ./main
        fi
    fi

elif [ "$LANG" = "java" ]; then
    cp "$FILE_PATH" Main.java
    javac Main.java 2>&1
    if [ $? -eq 0 ]; then
        if [ -n "$INPUT_FILE" ] && [ -f "$INPUT_FILE" ]; then
            java Main < "$INPUT_FILE"
        else
            java Main
        fi
    fi

elif [ "$LANG" = "javascript" ]; then
    if [ -n "$INPUT_FILE" ] && [ -f "$INPUT_FILE" ]; then
        node "$FILE_PATH" < "$INPUT_FILE"
    else
        node "$FILE_PATH"
    fi
fi