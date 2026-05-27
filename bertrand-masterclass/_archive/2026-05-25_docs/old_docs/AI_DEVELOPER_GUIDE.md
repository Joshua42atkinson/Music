# AI Developer System - Complete Guide

This guide explains how to use the LM Studio + MCP server system to let an AI modify the Voix Vive webapp directly from Bertrand's computer.

## What This System Does

1. **LM Studio** runs Qwen Coder locally with full GPU acceleration
2. **MCP Server** exposes tools that let the AI read/edit files and run commands
3. **Chat Interface** allows Bertrand to request changes in natural language
4. **Approval System** ensures safety by requiring manual approval for destructive changes

## Architecture Overview

```
Bertrand's Computer
├── LM Studio (Port 1234)
│   └── Qwen Coder 32B
│       └── GPU-accelerated inference
├── MCP Server (Port 3001)
│   ├── File read/edit tools
│   ├── Command execution
│   ├── Git integration
│   └── Approval queue
└── Web Browser
    └── AI Developer Chat UI
        └── Natural language requests
```

## Quick Start

### Step 1: Install LM Studio

1. Download from https://lmstudio.ai/
2. Install and launch

### Step 2: Download Qwen Coder Model

1. In LM Studio, go to **Discover** tab
2. Search for `qwen2.5-coder`
3. Download **Qwen2.5-Coder-32B-Instruct-GGUF** (or 14B for less VRAM)
4. Recommended: Q4_K_M quantization for best balance

### Step 3: Configure LM Studio

1. Go to **Chat** tab
2. Load the Qwen Coder model
3. Set **GPU Offload** to **Maximum** (all layers)
4. Set **Context Length** to **32768** (or higher if you have VRAM)

### Step 4: Start LM Studio Server

1. Go to **Developer** tab
2. Toggle **Local Inference Server**
3. Port: **1234**
4. Click **Start Server**
5. Verify: Green indicator shows "Server is running"

### Step 5: Start MCP Server

```bash
cd /home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/mcp-server
./start-mcp.sh
```

This will:
- Install dependencies if needed
- Check LM Studio connection
- Start the MCP server on port 3001
- Show available endpoints

### Step 6: Open AI Developer Chat

In your webapp, navigate to the AI Developer Chat component (you'll need to add it to your routing). Or access it directly via:

```
http://localhost:5173/ai-developer  # (after adding the route)
```

## How to Request Changes

### Simple Examples

Type natural language requests:

**Fix a bug:**
```
The pitch detection in the audio engine seems off. Can you check the usePitchDetector hook and fix the accuracy issue?
```

**Add a feature:**
```
Add a new fingerpicking exercise to Fret 3 (The Threshold). Include tab notation and audio reference.
```

**Update content:**
```
Update the testimonials on the landing page. Add a new one from Sarah about the breathing exercises.
```

**Generate curriculum:**
```
Create a new monthly challenge for August focusing on blues improvisation. Include daily exercises.
```

**Debug:**
```
The Adventure Player keeps crashing when I reach the boss level. Can you debug the VertiscaleEngine?
```

### What Happens After You Send a Request

1. **AI analyzes** the request and determines what files to examine
2. **AI reads** relevant files using MCP tools
3. **AI proposes** changes (or makes them if safe)
4. **Destructive changes** go to the approval queue
5. **You approve** via the sidebar or reject if not correct
6. **AI commits** changes with descriptive messages
7. **AI can deploy** if you approve the deployment

## Available MCP Tools

The AI can use these tools:

### File Operations
- `read_file` - Read any file with optional line range
- `edit_file` - Precise text replacement (requires approval)
- `create_file` - Create new files (requires approval)
- `delete_file` - Remove files (requires approval)
- `list_directory` - Explore folder structure
- `search_code` - Find text across all files

### Project Operations
- `get_project_structure` - Overview of the codebase
- `run_command` - Execute npm/build commands
- `build_project` - Run production build
- `git_status` - Check git state
- `git_commit` - Commit changes (requires approval)
- `deploy` - Deploy to production (requires approval)

## Safety Features

### Approval Queue

Any potentially destructive operation requires your approval:
- File edits
- File creation
- File deletion
- Git commits
- Deployments

You'll see these in the right sidebar with Approve/Reject buttons.

### Automatic Backups

Before any file edit, the original is saved as `filename.backup`

### Git Integration

All changes are automatically committed with descriptive messages:
```
AI: Fix pitch detection accuracy in usePitchDetector
AI: Add fingerpicking exercise to Fret 3
AI: Update landing page testimonials
```

### Restricted Commands

The AI can only run safe commands:
- `npm run build`
- `npm run dev`
- `npm run lint`
- `vite build`
- `git status/log`
- `ls`, `cat`, `grep`

Dangerous commands are blocked.

## Content Generation Workflow

### Monthly Subscription Content

1. **Request generation:**
   ```
   Generate July's content pack:
   - New boss battle: "The Blues Dragon"
   - 4 new chord progressions
   - 2 fingerstyle arrangements
   - Weekly newsletter draft
   ```

2. **AI creates:**
   - New adventure level data
   - Chord progression exercises
   - Updated curriculum JSON
   - Markdown newsletter content

3. **Review & approve:**
   - Check generated files in approval queue
   - Preview in browser
   - Approve or request changes

4. **Deploy:**
   ```
   Deploy the July content update to production
   ```

### User Culture/Community Content

1. **Generate social posts:**
   ```
   Create 5 Instagram posts about the new Fret 5 content
   ```

2. **Generate newsletter:**
   ```
   Write this month's newsletter highlighting student progress features
   ```

3. **Generate blog posts:**
   ```
   Write a blog post about the science behind the breathing gate
   ```

## Advanced Usage

### Direct API Access

You can call the MCP server directly:

```bash
# Read a file
curl -X POST http://localhost:3001/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "read_file",
    "parameters": {
      "path": "src/hooks/usePitchDetector.js",
      "offset": 1,
      "limit": 50
    }
  }'

# Search code
curl -X POST http://localhost:3001/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "search_code",
    "parameters": {
      "query": "pitchAccuracy",
      "extensions": [".js", ".jsx"]
    }
  }'

# Check pending approvals
curl http://localhost:3001/pending

# Approve an operation
curl -X POST http://localhost:3001/approve/apr-1234567890-abc123
```

### Custom System Prompts

You can customize the AI's behavior by modifying the system prompt in `server.js`:

```javascript
{
  role: 'system',
  content: `You are Bertrand's AI developer assistant...`
}
```

### Disabling Approvals (Not Recommended)

For trusted operations only:

```bash
export REQUIRE_APPROVAL=false
npm start
```

## Troubleshooting

### LM Studio Not Connected

**Symptoms:** MCP server shows "LM Studio not detected"

**Fix:**
1. Open LM Studio
2. Go to Developer tab
3. Ensure server is running on port 1234
4. Check that a model is loaded

### Port 3001 Already in Use

**Fix:**
```bash
# Find and kill process
lsof -t -i:3001 | xargs kill -9
# Or use the startup script which handles this
./start-mcp.sh
```

### Changes Not Being Applied

**Check:**
1. Is the approval in the pending queue?
2. Did you click "Approve"?
3. Check server logs for errors
4. Verify git status: `git status`

### AI Makes Wrong Changes

**Solutions:**
1. Be more specific in your request
2. Reference specific files: "In src/hooks/usePitchDetector.js..."
3. Reject the approval and try again
4. Review the backup file (`.backup`) if needed

## Best Practices

### 1. Start Small

Test with simple requests first:
- "Fix the typo in the landing page heading"
- "Add a console.log to debug the audio engine"

### 2. Be Specific

Good: "Add error handling to the loadSound function in src/audio/audioEngine.js"

Vague: "Fix the audio"

### 3. Review Before Approving

Always review what the AI is proposing to change. Check:
- The file path is correct
- The change makes sense
- It won't break other features

### 4. Use Version Control

The AI commits automatically, but you can always:
```bash
git log --oneline -10  # See recent AI commits
git diff HEAD~1        # See what changed
git revert HEAD        # Undo last change if needed
```

### 5. Test After Changes

After approving changes:
1. Run `npm run dev` to test locally
2. Check the browser console for errors
3. Test the specific feature that was modified

## Security Considerations

### What the AI Cannot Do

- Access files outside the project root
- Run dangerous commands (rm -rf, format disk, etc.)
- Access environment variables with secrets
- Connect to external APIs without your knowledge

### What You Should Monitor

- Watch the approval queue for unexpected requests
- Review git commits regularly
- Keep backups of critical data
- Don't disable approvals in production

## Integration with Existing Workflow

### Adding AI Chat to the App

1. Add the route:
```jsx
// In your router
<Route path="/ai-developer" element={<AIDeveloperChat />} />
```

2. Add a link in the admin/coaching area:
```jsx
<Link to="/ai-developer">
  <Bot size={16} /> AI Developer
</Link>
```

### Scheduling Content Generation

Use cron jobs or scheduled tasks:
```bash
# Generate monthly content automatically
0 9 1 * * curl -X POST http://localhost:3001/chat \
  -d '{"messages": [{"role": "user", "content": "Generate monthly content"}]}'
```

## Next Steps

1. **Test the setup** with a simple request
2. **Create templates** for common operations
3. **Document your prompts** that work well
4. **Set up monitoring** for the MCP server
5. **Consider CI/CD** integration for automated testing before deploy

## Support

If something goes wrong:
1. Check MCP server logs
2. Verify LM Studio is running
3. Review the approval queue
4. Check git status for pending changes
5. Restore from backup if needed

---

**Remember:** This system gives an AI direct access to modify your codebase. Always review approvals carefully and maintain regular git commits!
