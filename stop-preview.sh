#!/bin/bash

# Stop preview script - kills both the dev server and Cloudflare tunnel
# Also cleans up the preview URL file

SERVER_PID_FILE="dev_server.pid"
TUNNEL_PID_FILE="cf_tunnel.pid"
TUNNEL_LOG="cf_tunnel.log"

echo "Stopping preview..."

# Stop tunnel
if [ -f "$TUNNEL_PID_FILE" ]; then
    TUNNEL_PID=$(cat "$TUNNEL_PID_FILE")
    if ps -p $TUNNEL_PID > /dev/null 2>&1; then
        echo "Stopping Cloudflare tunnel (PID: $TUNNEL_PID)..."
        kill $TUNNEL_PID 2>/dev/null
        sleep 1
    fi
    rm -f "$TUNNEL_PID_FILE"
fi

# Stop dev server
if [ -f "$SERVER_PID_FILE" ]; then
    SERVER_PID=$(cat "$SERVER_PID_FILE")
    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo "Stopping dev server (PID: $SERVER_PID)..."
        kill $SERVER_PID 2>/dev/null
        sleep 1
    fi
    rm -f "$SERVER_PID_FILE"
fi

# Clean up log file
rm -f "$TUNNEL_LOG"

# Clean up preview URL files
rm -f preview-*-url.txt

echo ""
echo "✓ Preview stopped. All processes terminated."

