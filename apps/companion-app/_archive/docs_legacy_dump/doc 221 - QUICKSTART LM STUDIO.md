# Quick Start: LM Studio Self-Healing Web App

## Summary

You now have a complete system where LM Studio (running Qwen Coder) can directly modify the Voix Vive webapp from Bertrand's computer. This enables:

- **Bug fixes** via natural language chat
- **Feature additions** without manual coding
- **Content generation** for monthly subscriptions
- **Self-healing** capabilities when issues arise

## What Was Built

### 1. MCP Server (`/mcp-server/`)
- Exposes file read/edit tools to the AI
- Command execution (npm, git, etc.)
- Approval queue for safety
- Runs on port 3001

### 2. Chat Interface (`/src/components/AIDeveloperChat.jsx`)
- Natural language requests to the AI
- Shows pending approvals
- Real-time conversation
- Accessible at `/ai-developer`

### 3. LM Studio Integration (`/src/hooks/useLMStudio.js`)
- Direct connection to LM Studio's API
- Optimized for Qwen Coder
- Full GPU offload support
- Max context (32K+)

### 4. Updated Backend Bridge (`/src/hooks/useBackendBridge.js`)
- Routes AI requests to LM Studio first
- Falls back to DaaS server if needed
- Supports both local AI backends

## 3-Minute Setup

### 1. Start LM Studio
```
1. Open LM Studio
2. Load Qwen Coder 32B (or 14B)
3. Set GPU Offload = Maximum
4. Developer tab → Start Server (port 1234)
```

### 2. Start MCP Server
```bash
cd /home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/mcp-server
./start-mcp.sh
```

### 3. Open Webapp
```bash
cd /home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass
npm run dev
```

### 4. Access AI Developer Chat
```
Navigate to: http://localhost:5173/ai-developer
```

## Example Usage

### Fix a Bug
Type: "The pitch detection in usePitchDetector.js is inaccurate. Please debug and fix it."

Result: AI reads the file, identifies the issue, proposes a fix, you approve it.

### Add Content
Type: "Create a new fingerpicking exercise for Fret 3 with tab notation."

Result: AI generates the exercise data, creates the file, you approve and deploy.

### Generate Monthly Content
Type: "Generate July's subscription content: new boss battle, 4 chord progressions, and a newsletter."

Result: AI creates all files, commits them, ready for deployment.

## Architecture

```
Bertrand Types Request
         ↓
    Web Browser
         ↓
AI Developer Chat UI
         ↓
    MCP Server (3001)
         ↓
    LM Studio (1234)
         ↓
   Qwen Coder 32B
         ↓
   AI Decides Tools
         ↓
  File Read/Edit/Command
         ↓
  Approval Queue (Web UI)
         ↓
Bertrand Approves/Rejects
         ↓
   Change Applied
         ↓
   Git Commit
```

## Key Features

### Safety
- **Approval required** for all file edits
- **Automatic backups** before changes
- **Git integration** with descriptive commits
- **Restricted commands** (no rm -rf, etc.)

### Capabilities
- Read any file in the project
- Edit files with precise text replacement
- Create new files
- Run safe commands (npm, vite, git)
- Build and deploy
- Search entire codebase

### Content Generation
- Monthly subscription content
- New exercises and challenges
- Blog posts and newsletters
- Social media content
- Curriculum updates

## Files Created

```
mcp-server/
├── README.md              # MCP server documentation
├── package.json           # Dependencies
├── server.js              # Main MCP server
├── start-mcp.sh           # Startup script
└── ...

src/
├── hooks/
│   ├── useLMStudio.js     # Direct LM Studio hook
│   └── useBackendBridge.js # Updated with LM Studio support
├── components/
│   ├── AIDeveloperChat.jsx   # Main chat interface
│   ├── LMStudioStatus.jsx    # Connection status
│   ├── LMStudioSubAgent.jsx  # Sub-agent demo
│   └── SongwritingCompanion.jsx # Updated for LM Studio
└── ...

docs/
├── LM_STUDIO_SETUP.md     # LM Studio setup guide
└── AI_DEVELOPER_GUIDE.md  # Complete usage guide
```

## Next Steps

1. **Test it:** Try a simple request like "Fix the typo in the landing page heading"

2. **Create templates:** Save prompts that work well for recurring tasks

3. **Set up scheduled generation:** Use cron to auto-generate monthly content

4. **Train the AI:** Give feedback on what works to improve future responses

5. **Integrate monitoring:** Watch the MCP server logs for issues

## Important Notes

- **Always review approvals** before clicking "Approve"
- **Test locally** after approving changes (`npm run dev`)
- **Git commits** are automatic with descriptive messages
- **Backups** are created as `.backup` files
- **LM Studio must be running** for the AI to work

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "LM Studio not detected" | Check port 1234, ensure server is started |
| "Port 3001 in use" | Run `./start-mcp.sh` which handles this |
| Changes not applied | Check approval queue in sidebar |
| AI doesn't understand | Be more specific, reference file paths |

## Support

- See `docs/AI_DEVELOPER_GUIDE.md` for complete documentation
- See `mcp-server/README.md` for MCP server details
- Check MCP server logs for errors
- Review git history with `git log --oneline`

---

**Ready to go!** Start with LM Studio, run the MCP server, and navigate to `/ai-developer` to begin chatting with your AI developer.
