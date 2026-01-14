#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-notes-app-199065-199074/frontend_notes_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

