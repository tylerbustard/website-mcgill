#!/bin/bash

# Preview link script for website
# Detects the school name and creates a named preview link
# Both dev server and tunnel run in the background so updates are visible in real-time

# Ensure we're in the correct directory (website_mcgill)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCGILL_DIR="$SCRIPT_DIR"

# Verify this is the McGill directory (not UNB or others)
if [[ ! "$MCGILL_DIR" == *"website_mcgill"* ]]; then
    echo "❌ Error: Script must be in website_mcgill directory"
    echo "   Current directory: $MCGILL_DIR"
    exit 1
fi

cd "$MCGILL_DIR" || exit 1

# Verify we're in the right directory with required files
if [[ ! -f "$MCGILL_DIR/package.json" ]] || [[ ! -d "$MCGILL_DIR/server" ]]; then
    echo "❌ Error: Must run from website_mcgill directory"
    echo "   Current directory: $(pwd)"
    exit 1
fi

# Verify this is NOT the UNB directory
if [[ "$MCGILL_DIR" == *"website_UNB"* ]] || [[ "$MCGILL_DIR" == *"website_unb"* ]]; then
    echo "❌ Error: This script is for website_mcgill, not website_UNB"
    exit 1
fi

echo "✓ Running from McGill directory: $MCGILL_DIR"

HOST="127.0.0.1"
DEFAULT_PORT=5000
SERVER_PID_FILE="$MCGILL_DIR/dev_server.pid"
TUNNEL_PID_FILE="$MCGILL_DIR/cf_tunnel.pid"
TUNNEL_LOG="$MCGILL_DIR/cf_tunnel.log"

# Detect school name from workspace or website content
# Default to mcgill based on folder name, but can be overridden
SCHOOL_NAME="mcgill"
if [ -d ".git" ]; then
    # Try to detect from website content
    if grep -qi "desautels\|mcgill" client/src/components/about-section.tsx 2>/dev/null; then
        SCHOOL_NAME="mcgill"
    elif grep -qi "unb\|university of new brunswick" client/src/components/about-section.tsx 2>/dev/null; then
        SCHOOL_NAME="unb"
    fi
fi

PREVIEW_URL_FILE="$MCGILL_DIR/preview-${SCHOOL_NAME}-url.txt"

# Function to find an available port
find_available_port() {
    local start_port=$1
    local port=$start_port
    while lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; do
        port=$((port + 1))
        if [ $port -gt 65535 ]; then
            echo "Error: No available ports found" >&2
            exit 1
        fi
    done
    echo $port
}

# Note: We don't set up cleanup trap here because we want the processes
# to continue running in the background after the script exits.
# Use stop-preview.sh to clean up when done.

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "❌ Error: cloudflared is not installed"
    echo "   Install it with: brew install cloudflared"
    exit 1
fi

# Check if server is already running
PORT=$DEFAULT_PORT
SERVER_RUNNING=false

if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    # Check if it's actually our McGill server by testing the health endpoint
    # Must return 200 OK with JSON containing "status":"healthy"
    HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://$HOST:$PORT/health 2>/dev/null)
    if [ "$HEALTH_RESPONSE" = "200" ] && curl -s http://$HOST:$PORT/health | grep -q '"status":"healthy"' 2>/dev/null; then
        # Verify the server process is from McGill directory, not UNB or others
        SERVER_PID=$(lsof -Pi :$PORT -sTCP:LISTEN -t | head -1)
        SERVER_CWD=$(lsof -p $SERVER_PID 2>/dev/null | grep cwd | awk '{print $NF}')
        if [[ "$SERVER_CWD" == *"website_mcgill"* ]] && [[ "$SERVER_CWD" != *"website_UNB"* ]] && [[ "$SERVER_CWD" != *"website_unb"* ]]; then
            echo "✓ McGill server is already running on port $PORT"
            echo $SERVER_PID > "$SERVER_PID_FILE"
            SERVER_RUNNING=true
        else
            echo "⚠️  Port $PORT is in use by a different server (not McGill)"
            echo "   Server directory: $SERVER_CWD"
            # Port is in use by something else, find a new port
            PORT=$(find_available_port $DEFAULT_PORT)
            echo "⚠️  Using port $PORT instead"
        fi
    else
        # Port is in use by something else, find a new port
        PORT=$(find_available_port $DEFAULT_PORT)
        echo "⚠️  Port $DEFAULT_PORT is in use, using port $PORT instead"
    fi
fi

# Start server if not already running
if [ "$SERVER_RUNNING" = false ]; then
    # Set PORT environment variable so server uses the correct port
    export PORT=$PORT
    SERVER_LOG="$MCGILL_DIR/dev_server_${PORT}.log"
    echo "Starting McGill dev server on port $PORT in background..."
    echo "   Directory: $MCGILL_DIR"
    
    # Ensure we're in the McGill directory
    cd "$MCGILL_DIR" || exit 1
    
    # Check if node_modules exists, install if needed
    if [ ! -d "$MCGILL_DIR/node_modules" ]; then
        echo "Installing dependencies..."
        cd "$MCGILL_DIR" && npm install > /dev/null 2>&1
    fi
    
    # Verify we're using McGill's node_modules
    if [[ ! -d "$MCGILL_DIR/node_modules" ]]; then
        echo "❌ Error: node_modules not found in McGill directory"
        exit 1
    fi
    
    # Use absolute path to ensure we're running from McGill directory
    cd "$MCGILL_DIR" || exit 1
    PORT=$PORT NODE_ENV=development npx tsx "$MCGILL_DIR/server/index.ts" > "$SERVER_LOG" 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > "$SERVER_PID_FILE"
    
    # Verify the server process is from McGill
    sleep 2
    SERVER_CWD=$(lsof -p $SERVER_PID 2>/dev/null | grep cwd | awk '{print $NF}')
    if [[ "$SERVER_CWD" != *"website_mcgill"* ]] || [[ "$SERVER_CWD" == *"website_UNB"* ]]; then
        echo "❌ Error: Server started from wrong directory: $SERVER_CWD"
        kill $SERVER_PID 2>/dev/null
        exit 1
    fi
    echo "✓ Verified server running from: $SERVER_CWD"
    
    # Wait for server to be ready
    echo "Waiting for server to start (this may take 10-15 seconds)..."
    max_attempts=60
    attempt=0
    while [ $attempt -lt $max_attempts ]; do
        HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://$HOST:$PORT/health 2>/dev/null)
        if [ "$HEALTH_RESPONSE" = "200" ] && curl -s http://$HOST:$PORT/health | grep -q '"status":"healthy"' 2>/dev/null; then
            echo "✓ Server is ready on port $PORT"
            break
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ Error: Server failed to start on port $PORT"
        echo "Check server logs: $SERVER_LOG"
        echo "Last 20 lines of log:"
        tail -20 "$SERVER_LOG" 2>/dev/null || echo "Log file not found"
        exit 1
    fi
fi

# Stop any existing tunnel
if [ -f "$TUNNEL_PID_FILE" ]; then
    OLD_PID=$(cat "$TUNNEL_PID_FILE")
    if ps -p $OLD_PID > /dev/null 2>&1; then
        echo "Stopping existing tunnel (PID: $OLD_PID)..."
        kill $OLD_PID 2>/dev/null
        sleep 1
    fi
    rm -f "$TUNNEL_PID_FILE"
fi

# Start tunnel in background and capture URL
echo "Starting tunnel for ${SCHOOL_NAME} preview..."
cloudflared tunnel --url http://$HOST:$PORT > "$TUNNEL_LOG" 2>&1 &
TUNNEL_PID=$!
echo $TUNNEL_PID > "$TUNNEL_PID_FILE"

# Wait for tunnel to be ready and extract URL
echo "Waiting for tunnel to establish..."
max_attempts=45
attempt=0
PREVIEW_URL=""

# Give tunnel a moment to start writing logs
sleep 2

while [ $attempt -lt $max_attempts ]; do
    if [ -f "$TUNNEL_LOG" ] && grep -q "trycloudflare.com" "$TUNNEL_LOG" 2>/dev/null; then
        PREVIEW_URL=$(grep -o "https://[a-z0-9-]*\.trycloudflare\.com" "$TUNNEL_LOG" | tail -1)
        if [ -n "$PREVIEW_URL" ]; then
            break
        fi
    fi
    attempt=$((attempt + 1))
    sleep 1
done

if [ -z "$PREVIEW_URL" ]; then
    echo "❌ Error: Failed to get preview URL"
    echo "Check tunnel logs: $TUNNEL_LOG"
    exit 1
fi

# Save URL to file with school name
echo "$PREVIEW_URL" > "$PREVIEW_URL_FILE"

# Display results
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
SCHOOL_NAME_UPPER=$(echo "$SCHOOL_NAME" | tr '[:lower:]' '[:upper:]')
echo "  🎓 Preview Link for $SCHOOL_NAME_UPPER Website"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  🔗 Preview URL: $PREVIEW_URL"
echo ""
echo "  📝 Server running on port $PORT (PID: $(cat $SERVER_PID_FILE))"
echo "  📝 Tunnel running (PID: $TUNNEL_PID)"
echo "  📄 URL saved to: $PREVIEW_URL_FILE"
echo ""
echo "  🔄 Both dev server and tunnel are running in the background"
echo "  🔄 Changes will be reflected automatically (hot-reload enabled)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  📋 To stop the preview, run:"
echo "     npm run stop-preview"
echo "     or"
echo "     ./stop-preview.sh"
echo ""
echo "  💡 The preview URL is saved in: $PREVIEW_URL_FILE"
echo ""

# Script ends here - tunnel and server continue running in background
# The preview will stay active until you run stop-preview.sh

