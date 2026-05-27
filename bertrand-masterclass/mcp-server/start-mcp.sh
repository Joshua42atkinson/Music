#!/bin/bash

# ═══════════════════════════════════════════════════════════
# Voix Vive MCP Server Startup Script
# This script starts the MCP server that connects LM Studio
# to the webapp codebase for AI-powered modifications
# ═══════════════════════════════════════════════════════════

echo "
╔═══════════════════════════════════════════════════════════╗
║         Voix Vive MCP Server Startup                    ║
╚═══════════════════════════════════════════════════════════╝
"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ required. Found: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Check for LM Studio
echo ""
echo -e "${YELLOW}🔍 Checking LM Studio connection...${NC}"
if curl -s http://localhost:1234/v1/models > /dev/null 2>&1; then
    MODEL=$(curl -s http://localhost:1234/v1/models | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo -e "${GREEN}✓ LM Studio connected${NC}"
    echo -e "${GREEN}  Model: $MODEL${NC}"
else
    echo -e "${YELLOW}⚠ LM Studio not detected on port 1234${NC}"
    echo "  Please:"
    echo "  1. Open LM Studio"
    echo "  2. Load Qwen Coder model"
    echo "  3. Start the local server (Developer tab → Start Server)"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Set environment variables
export PROJECT_ROOT="$(cd .. && pwd)"
export LMSTUDIO_URL="http://localhost:1234/v1"
export MCP_PORT="3001"
export REQUIRE_APPROVAL="true"
export AUTO_COMMIT="true"

echo ""
echo -e "${YELLOW}⚙ Configuration:${NC}"
echo "  Project Root: $PROJECT_ROOT"
echo "  LM Studio: $LMSTUDIO_URL"
echo "  MCP Port: $MCP_PORT"
echo "  Require Approval: $REQUIRE_APPROVAL"
echo "  Auto Commit: $AUTO_COMMIT"
echo ""

# Check if port is already in use
if lsof -Pi :$MCP_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Port $MCP_PORT is already in use${NC}"
    read -p "Kill existing process? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill $(lsof -t -i:$MCP_PORT) 2>/dev/null
        sleep 1
    else
        exit 1
    fi
fi

echo -e "${GREEN}🚀 Starting MCP Server...${NC}"
echo ""

# Start the server
node server.js

# If server crashes, show helpful message
if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Server stopped unexpectedly${NC}"
    echo "Check the error messages above for details."
    echo ""
    echo "Common issues:"
    echo "  • Port 3001 already in use"
    echo "  • Missing dependencies (run: npm install)"
    echo "  • Project root not found"
    exit 1
fi
