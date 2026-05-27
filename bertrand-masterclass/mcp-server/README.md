# LM Studio MCP Server - Self-Healing Web App

This MCP (Model Context Protocol) server enables LM Studio (running Qwen Coder) to directly modify the webapp codebase, generate content, and deploy updates.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  LM Studio      │────▶│  MCP Bridge      │────▶│  MCP Tool       │
│  (Qwen Coder)   │◀────│  (Port 3001)     │◀────│  Server         │
│                 │     │                  │     │  (File/Command) │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                       │
         │              ┌────────▼─────────┐           │
         │              │  Approval Queue  │◀──────────┘
         │              │  (Web UI)        │
         │              └──────────────────┘
         │
         └──────────────────────────────────────────────┐
                                                      │
                                            ┌─────────▼────────┐
                                            │  Web App Chat    │
                                            │  (Bertrand UI)   │
                                            └──────────────────┘
```

## Capabilities

### 1. Code Modification Tools
- `read_file` - Read any file in the project
- `edit_file` - Apply precise edits to files
- `create_file` - Create new files
- `search_code` - Search the codebase
- `list_directory` - Explore directory structure

### 2. Command Execution
- `run_command` - Execute build, lint, test commands
- `deploy` - Deploy to production (with approval)

### 3. Content Generation
- `generate_lesson` - Create guitar lesson content
- `generate_challenge` - Create monthly challenges
- `update_curriculum` - Modify curriculum data

## Safety Features

1. **Approval Queue** - Destructive operations require manual approval
2. **Backup System** - Files are backed up before editing
3. **Git Integration** - Changes are committed with descriptive messages
4. **Sandbox Mode** - Test changes before applying

## Setup

### 1. Install LM Studio
Download from https://lmstudio.ai/

### 2. Load Qwen Coder
- Download Qwen2.5-Coder-32B-Instruct-GGUF
- Enable GPU offload (max layers)
- Set context to 32K+
- Start local server on port 1234

### 3. Start MCP Server
```bash
cd mcp-server
npm install
npm start
```

### 4. Configure LM Studio
Point LM Studio to the MCP Bridge at `http://localhost:3001/mcp`

## Usage

### Bertrand's Chat Interface

Bertrand can type natural language requests:

- "Add a new chord progression exercise to Fret 3"
- "Fix the pitch detection accuracy in the audio engine"
- "Create a monthly challenge for July about fingerpicking"
- "Update the landing page with new testimonials"
- "The breathing gate is broken, please debug it"

### AI Autonomous Mode

The AI can also:
1. Monitor for errors in production
2. Suggest improvements based on user analytics
3. Generate weekly newsletter content
4. Create social media posts from lesson highlights

## API Endpoints

### MCP Bridge
- `POST /mcp/tools/call` - Call a tool
- `GET /mcp/tools/list` - List available tools
- `POST /chat` - Chat with code context

### Approval System
- `GET /pending` - List pending approvals
- `POST /approve/:id` - Approve an operation
- `POST /reject/:id` - Reject an operation

## Environment Variables

```env
PROJECT_ROOT=/home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass
LMSTUDIO_URL=http://localhost:1234/v1
MCP_PORT=3001
REQUIRE_APPROVAL=true
AUTO_COMMIT=true
```
