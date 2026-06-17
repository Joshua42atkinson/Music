#!/usr/bin/env node
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import simpleGit from 'simple-git';
import { glob } from 'glob';
import fetch from 'node-fetch';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ═══════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════
const CONFIG = {
  PROJECT_ROOT: process.env.PROJECT_ROOT || path.resolve(__dirname, '..'),
  LMSTUDIO_URL: process.env.LMSTUDIO_URL || 'http://localhost:1234/v1',
  MCP_PORT: process.env.MCP_PORT || 3001,
  REQUIRE_APPROVAL: process.env.REQUIRE_APPROVAL !== 'false',
  AUTO_COMMIT: process.env.AUTO_COMMIT === 'true',
  APPROVAL_TIMEOUT: parseInt(process.env.APPROVAL_TIMEOUT) || 300000, // 5 minutes
};

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// ═══════════════════════════════════════════════════════════
// State Management
// ═══════════════════════════════════════════════════════════
const pendingApprovals = new Map();
const git = simpleGit(CONFIG.PROJECT_ROOT);

// ═══════════════════════════════════════════════════════════
// MCP Tools Definition
// ═══════════════════════════════════════════════════════════
const TOOLS = {
  // File Operations
  read_file: {
    description: 'Read the contents of a file',
    parameters: {
      path: { type: 'string', required: true, description: 'Relative path from project root' },
      offset: { type: 'number', required: false, description: 'Line number to start reading from' },
      limit: { type: 'number', required: false, description: 'Maximum lines to read' },
    },
  },
  edit_file: {
    description: 'Apply a precise edit to a file (requires approval if REQUIRE_APPROVAL=true)',
    parameters: {
      path: { type: 'string', required: true, description: 'Relative path from project root' },
      old_string: { type: 'string', required: true, description: 'Exact string to replace' },
      new_string: { type: 'string', required: true, description: 'Replacement string' },
      description: { type: 'string', required: false, description: 'Why this change is being made' },
    },
  },
  create_file: {
    description: 'Create a new file (requires approval)',
    parameters: {
      path: { type: 'string', required: true, description: 'Relative path from project root' },
      content: { type: 'string', required: true, description: 'File content' },
      description: { type: 'string', required: false, description: 'Why this file is being created' },
    },
  },
  delete_file: {
    description: 'Delete a file (requires approval)',
    parameters: {
      path: { type: 'string', required: true, description: 'Relative path from project root' },
    },
  },
  list_directory: {
    description: 'List files and directories',
    parameters: {
      path: { type: 'string', required: false, description: 'Directory path (default: project root)' },
      recursive: { type: 'boolean', required: false, description: 'List recursively' },
    },
  },
  search_code: {
    description: 'Search for text in codebase',
    parameters: {
      query: { type: 'string', required: true, description: 'Search term' },
      path: { type: 'string', required: false, description: 'Subdirectory to search in' },
      extensions: { type: 'array', required: false, description: 'File extensions to search (e.g., [".js", ".jsx"])' },
    },
  },
  
  // Command Execution
  run_command: {
    description: 'Run a shell command (restricted to safe commands)',
    parameters: {
      command: { type: 'string', required: true, description: 'Command to execute' },
      cwd: { type: 'string', required: false, description: 'Working directory (relative to project root)' },
    },
  },
  
  // Project Operations
  get_project_structure: {
    description: 'Get an overview of the project structure',
    parameters: {},
  },
  
  // Git Operations
  git_status: {
    description: 'Get git status',
    parameters: {},
  },
  git_commit: {
    description: 'Commit changes with a message (requires approval)',
    parameters: {
      message: { type: 'string', required: true, description: 'Commit message' },
      files: { type: 'array', required: false, description: 'Specific files to commit (default: all)' },
    },
  },
  
  // Deployment
  build_project: {
    description: 'Build the project',
    parameters: {},
  },
  deploy: {
    description: 'Deploy to production (requires approval)',
    parameters: {
      method: { type: 'string', required: false, description: 'Deployment method (netlify, manual, etc.)' },
    },
  },
};

// ═══════════════════════════════════════════════════════════
// Tool Implementation
// ═══════════════════════════════════════════════════════════

async function readFileTool(params) {
  const filePath = path.resolve(CONFIG.PROJECT_ROOT, params.path);
  
  // Security check
  if (!filePath.startsWith(CONFIG.PROJECT_ROOT)) {
    throw new Error('Path is outside project root');
  }
  
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  
  let startLine = 0;
  let endLine = lines.length;
  
  if (params.offset) {
    startLine = Math.max(0, params.offset - 1);
  }
  if (params.limit) {
    endLine = Math.min(lines.length, startLine + params.limit);
  }
  
  const selectedLines = lines.slice(startLine, endLine);
  
  return {
    content: selectedLines.join('\n'),
    totalLines: lines.length,
    shownLines: { start: startLine + 1, end: endLine },
  };
}

async function editFileTool(params) {
  const filePath = path.resolve(CONFIG.PROJECT_ROOT, params.path);
  
  // Security check
  if (!filePath.startsWith(CONFIG.PROJECT_ROOT)) {
    throw new Error('Path is outside project root');
  }
  
  if (CONFIG.REQUIRE_APPROVAL) {
    const approvalId = generateApprovalId();
    const approvalRequest = {
      id: approvalId,
      type: 'edit_file',
      params,
      timestamp: Date.now(),
      status: 'pending',
    };
    pendingApprovals.set(approvalId, approvalRequest);
    
    return {
      requiresApproval: true,
      approvalId,
      message: `Edit to ${params.path} requires approval. Approve at /approve/${approvalId}`,
    };
  }
  
  return await executeEdit(filePath, params);
}

async function executeEdit(filePath, params) {
  const content = await fs.readFile(filePath, 'utf-8');
  
  if (!content.includes(params.old_string)) {
    throw new Error(`Could not find exact match for: ${params.old_string.substring(0, 50)}...`);
  }
  
  // Backup original
  await fs.writeFile(`${filePath}.backup`, content);
  
  // Apply edit
  const newContent = content.replace(params.old_string, params.new_string);
  await fs.writeFile(filePath, newContent);
  
  // Auto-commit if enabled
  if (CONFIG.AUTO_COMMIT) {
    await git.add(params.path);
    await git.commit(params.description || `Edit: ${params.path}`);
  }
  
  return {
    success: true,
    path: params.path,
    backupCreated: true,
  };
}

async function createFileTool(params) {
  const filePath = path.resolve(CONFIG.PROJECT_ROOT, params.path);
  
  if (!filePath.startsWith(CONFIG.PROJECT_ROOT)) {
    throw new Error('Path is outside project root');
  }
  
  if (CONFIG.REQUIRE_APPROVAL) {
    const approvalId = generateApprovalId();
    pendingApprovals.set(approvalId, {
      id: approvalId,
      type: 'create_file',
      params,
      timestamp: Date.now(),
      status: 'pending',
    });
    
    return {
      requiresApproval: true,
      approvalId,
      message: `Create ${params.path} requires approval.`,
    };
  }
  
  return await executeCreate(filePath, params);
}

async function executeCreate(filePath, params) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, params.content);
  
  if (CONFIG.AUTO_COMMIT) {
    await git.add(params.path);
    await git.commit(params.description || `Create: ${params.path}`);
  }
  
  return { success: true, path: params.path };
}

async function listDirectoryTool(params) {
  const dirPath = params.path 
    ? path.resolve(CONFIG.PROJECT_ROOT, params.path)
    : CONFIG.PROJECT_ROOT;
  
  if (!dirPath.startsWith(CONFIG.PROJECT_ROOT)) {
    throw new Error('Path is outside project root');
  }
  
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  
  const result = entries.map(entry => ({
    name: entry.name,
    type: entry.isDirectory() ? 'directory' : 'file',
  }));
  
  return { path: params.path || '.', entries: result };
}

async function searchCodeTool(params) {
  const searchPath = params.path 
    ? path.resolve(CONFIG.PROJECT_ROOT, params.path)
    : CONFIG.PROJECT_ROOT;
  
  const pattern = params.extensions 
    ? `**/*{${params.extensions.join(',')}}`
    : '**/*.{js,jsx,ts,tsx,json,md}';
  
  const files = await glob(pattern, { cwd: searchPath, ignore: ['**/node_modules/**', '**/.git/**'] });
  
  const results = [];
  
  for (const file of files.slice(0, 50)) { // Limit to 50 files
    try {
      const content = await fs.readFile(path.join(searchPath, file), 'utf-8');
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(params.query)) {
          results.push({
            file,
            line: i + 1,
            content: lines[i].trim(),
          });
        }
      }
    } catch (e) {
      // Skip unreadable files
    }
  }
  
  return { 
    query: params.query,
    filesSearched: files.length,
    matches: results.slice(0, 20), // Limit to 20 matches
  };
}

async function runCommandTool(params) {
  // Safety: whitelist allowed commands
  const allowedCommands = [
    /^npm (install|ci|run (build|dev|lint|test|preview))/,
    /^npx eslint/,
    /^vite (build|preview)/,
    /^git (status|log|diff)/,
    /^ls/,
    /^cat/,
    /^grep/,
  ];
  
  const isAllowed = allowedCommands.some(regex => regex.test(params.command));
  
  if (!isAllowed) {
    throw new Error(`Command not allowed: ${params.command}. Allowed: npm, npx eslint, vite, git status/log, ls, cat, grep`);
  }
  
  const cwd = params.cwd 
    ? path.resolve(CONFIG.PROJECT_ROOT, params.cwd)
    : CONFIG.PROJECT_ROOT;
  
  const { stdout, stderr } = await execAsync(params.command, { cwd });
  
  return {
    command: params.command,
    stdout,
    stderr,
    success: true,
  };
}

async function gitStatusTool() {
  const status = await git.status();
  return status;
}

async function buildProjectTool() {
  return await runCommandTool({ command: 'npm run build' });
}

async function getProjectStructureTool() {
  const packageJson = await fs.readFile(
    path.join(CONFIG.PROJECT_ROOT, 'package.json'), 
    'utf-8'
  ).catch(() => '{}');
  
  const srcExists = await fs.stat(path.join(CONFIG.PROJECT_ROOT, 'src'))
    .then(() => true)
    .catch(() => false);
  
  const srcFiles = srcExists 
    ? await glob('src/**/*.{js,jsx,ts,tsx}', { cwd: CONFIG.PROJECT_ROOT })
    : [];
  
  return {
    name: JSON.parse(packageJson).name || 'unknown',
    root: CONFIG.PROJECT_ROOT,
    hasSourceDirectory: srcExists,
    sourceFiles: srcFiles.slice(0, 20),
    sourceFileCount: srcFiles.length,
  };
}

// ═══════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════

function generateApprovalId() {
  return `apr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ═══════════════════════════════════════════════════════════
// Routes
// ═══════════════════════════════════════════════════════════

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', requireApproval: CONFIG.REQUIRE_APPROVAL });
});

// List available tools
app.get('/mcp/tools/list', (req, res) => {
  res.json({ tools: TOOLS });
});

// Call a tool
app.post('/mcp/tools/call', async (req, res) => {
  const { name, parameters } = req.body;
  
  if (!TOOLS[name]) {
    return res.status(400).json({ error: `Unknown tool: ${name}` });
  }
  
  try {
    let result;
    
    switch (name) {
      case 'read_file':
        result = await readFileTool(parameters);
        break;
      case 'edit_file':
        result = await editFileTool(parameters);
        break;
      case 'create_file':
        result = await createFileTool(parameters);
        break;
      case 'list_directory':
        result = await listDirectoryTool(parameters);
        break;
      case 'search_code':
        result = await searchCodeTool(parameters);
        break;
      case 'run_command':
        result = await runCommandTool(parameters);
        break;
      case 'git_status':
        result = await gitStatusTool();
        break;
      case 'build_project':
        result = await buildProjectTool();
        break;
      case 'get_project_structure':
        result = await getProjectStructureTool();
        break;
      default:
        throw new Error(`Tool ${name} not implemented`);
    }
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Approval routes
app.get('/pending', (req, res) => {
  const pending = Array.from(pendingApprovals.values())
    .filter(a => a.status === 'pending');
  res.json({ pending });
});

app.post('/approve/:id', async (req, res) => {
  const approval = pendingApprovals.get(req.params.id);
  
  if (!approval) {
    return res.status(404).json({ error: 'Approval not found' });
  }
  
  if (approval.status !== 'pending') {
    return res.status(400).json({ error: `Already ${approval.status}` });
  }
  
  try {
    let result;
    
    switch (approval.type) {
      case 'edit_file':
        const filePath = path.resolve(CONFIG.PROJECT_ROOT, approval.params.path);
        result = await executeEdit(filePath, approval.params);
        break;
      case 'create_file':
        const createPath = path.resolve(CONFIG.PROJECT_ROOT, approval.params.path);
        result = await executeCreate(createPath, approval.params);
        break;
      default:
        throw new Error(`Unknown approval type: ${approval.type}`);
    }
    
    approval.status = 'approved';
    approval.result = result;
    
    res.json({ success: true, result });
  } catch (error) {
    approval.status = 'failed';
    approval.error = error.message;
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/reject/:id', (req, res) => {
  const approval = pendingApprovals.get(req.params.id);
  
  if (!approval) {
    return res.status(404).json({ error: 'Approval not found' });
  }
  
  approval.status = 'rejected';
  res.json({ success: true, status: 'rejected' });
});

// Chat with context
app.post('/chat', async (req, res) => {
  const { messages, tools: requestedTools } = req.body;
  
  try {
    // Get project context
    const projectStructure = await getProjectStructureTool();
    
    // Enhance system message with context
    const enhancedMessages = messages.map((m, i) => {
      if (i === 0 && m.role === 'system') {
        return {
          ...m,
          content: `${m.content}\n\nProject Context:\n- Name: ${projectStructure.name}\n- Root: ${projectStructure.root}\n- Source files: ${projectStructure.sourceFileCount}\n\nYou have access to MCP tools. Use them when needed.`,
        };
      }
      return m;
    });
    
    // Call LM Studio
    const response = await fetch(`${CONFIG.LMSTUDIO_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'loaded',
        messages: enhancedMessages,
        temperature: 0.7,
        max_tokens: 4096,
        n_ctx: 32768,
        n_gpu_layers: 999,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`LM Studio error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(CONFIG.MCP_PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║         Voix Vive MCP Server                               ║
║                                                            ║
║  Port:        ${CONFIG.MCP_PORT}                                   ║
║  Project:     ${CONFIG.PROJECT_ROOT}  ║
║  LM Studio:   ${CONFIG.LMSTUDIO_URL}          ║
║  Approval:    ${CONFIG.REQUIRE_APPROVAL ? 'Required' : 'Disabled'}                         ║
║  Auto-commit: ${CONFIG.AUTO_COMMIT ? 'Enabled' : 'Disabled'}                         ║
╚═══════════════════════════════════════════════════════════╝
  `);
  console.log('Endpoints:');
  console.log(`  GET  /health                   - Health check`);
  console.log(`  GET  /mcp/tools/list           - List available tools`);
  console.log(`  POST /mcp/tools/call           - Call a tool`);
  console.log(`  GET  /pending                  - List pending approvals`);
  console.log(`  POST /approve/:id              - Approve an operation`);
  console.log(`  POST /reject/:id               - Reject an operation`);
  console.log(`  POST /chat                     - Chat with LM Studio + context`);
});
