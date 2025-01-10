#!/bin/bash

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    mongod --dbpath /data/db &
    sleep 5  # Give MongoDB time to start
else
    echo "MongoDB is already running"
fi

# Start the flight app
echo "Starting Flight App..."
node server.js
