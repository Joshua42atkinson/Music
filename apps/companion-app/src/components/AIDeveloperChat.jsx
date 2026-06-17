import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Terminal, FileCode, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// AI Developer Chat
// Chat interface for Bertrand to request code changes from LM Studio
// Shows pending approvals and tool execution status
// ═══════════════════════════════════════════════════════════

const MCP_SERVER_URL = 'http://localhost:3001';

const SUGGESTED_PROMPTS = [
  "Fix the pitch detection accuracy in the audio engine",
  "Add a new chord progression exercise to Fret 3",
  "Create a monthly challenge for July about fingerpicking",
  "Update the landing page testimonials section",
  "The breathing gate has a bug - can you debug it?",
  "Generate a new adventure level for Truebadour's Journey",
];

export default function AIDeveloperChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello Bertrand! I\'m your AI developer assistant powered by Qwen Coder. I can help you:\n\n• Fix bugs and optimize code\n• Add new features and exercises\n• Generate content for lessons\n• Update the UI and styling\n• Deploy changes to production\n\nWhat would you like me to help with today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [serverStatus, setServerStatus] = useState('checking');
  const [toolExecutions, setToolExecutions] = useState([]);
  const messagesEndRef = useRef(null);

  // Check MCP server status
  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkServerStatus = async () => {
    try {
      const resp = await fetch(`${MCP_SERVER_URL}/health`);
      const data = await resp.json();
      setServerStatus(data.status === 'ok' ? 'connected' : 'error');
      
      // Also fetch pending approvals
      const pendingResp = await fetch(`${MCP_SERVER_URL}/pending`);
      const pendingData = await pendingResp.json();
      setPendingApprovals(pendingData.pending || []);
    } catch {
      setServerStatus('disconnected');
    }
  };

  const handleSend = async (customInput = null) => {
    const text = customInput || input;
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const resp = await fetch(`${MCP_SERVER_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an AI developer assistant for the Voix Vive guitar masterclass webapp. You have access to MCP tools to read and edit files, run commands, and deploy changes.\n\nWhen Bertrand asks for code changes:\n1. First use search_code or read_file to understand the current state\n2. Propose the changes clearly\n3. If approval is needed, explain what will be modified\n4. Use the MCP tools at /mcp/tools/call endpoint\n\nAlways be safe: create backups, require approval for destructive changes, and test when possible.`,
            },
            ...messages,
            userMessage,
          ],
        }),
      });

      if (!resp.ok) {
        throw new Error(`Server error: ${resp.status}`);
      }

      const data = await resp.json();
      const assistantMessage = data.choices?.[0]?.message;
      
      if (assistantMessage) {
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}. Make sure the MCP server is running on port 3001.`,
      }]);
    }

    setIsLoading(false);
    checkServerStatus();
  };

  const handleApprove = async (approvalId) => {
    try {
      const resp = await fetch(`${MCP_SERVER_URL}/approve/${approvalId}`, {
        method: 'POST',
      });
      const data = await resp.json();
      
      if (data.success) {
        setToolExecutions(prev => [...prev, {
          id: approvalId,
          status: 'approved',
          result: data.result,
          timestamp: Date.now(),
        }]);
      }
    } catch (e) {
      console.error('Approval failed:', e);
    }
    checkServerStatus();
  };

  const handleReject = async (approvalId) => {
    try {
      await fetch(`${MCP_SERVER_URL}/reject/${approvalId}`, {
        method: 'POST',
      });
      setToolExecutions(prev => [...prev, {
        id: approvalId,
        status: 'rejected',
        timestamp: Date.now(),
      }]);
    } catch (e) {
      console.error('Rejection failed:', e);
    }
    checkServerStatus();
  };

  return (
    <div className="flex h-screen bg-[#0d0d14] text-[#e8edf2] font-body">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-[800px] mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[rgba(123,106,170,0.2)] border border-[rgba(123,106,170,0.3)] flex items-center justify-center">
              <Bot size={20} className="text-[#7b6aaa]" />
            </div>
            <div>
              <h1 className="m-0 text-[1.1rem] font-semibold font-heading">
                AI Developer Assistant
              </h1>
              <div className="flex items-center gap-1.5 text-[0.75rem]" style={{ color: serverStatus === 'connected' ? '#7aaa88' : '#ff6464' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: serverStatus === 'connected' ? '#7aaa88' : '#ff6464' }} />
                MCP Server {serverStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[85%] px-4 py-3 rounded-xl ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
              style={{
                background: msg.role === 'user'
                  ? 'rgba(123,106,170,0.2)'
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${msg.role === 'user'
                  ? 'rgba(123,106,170,0.3)'
                  : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              <pre className="m-0 text-[0.85rem] leading-[1.5] font-body whitespace-pre-wrap break-words">
                {msg.content}
              </pre>
            </div>
          ))}
          
          {isLoading && (
            <div className="self-start px-4 py-3 flex items-center gap-2 text-[0.85rem] text-white/50">
              <span style={{ animation: 'pulse 1s infinite' }}>●</span>
              <span style={{ animation: 'pulse 1s infinite 0.2s' }}>●</span>
              <span style={{ animation: 'pulse 1s infinite 0.4s' }}>●</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length < 3 && (
          <div className="mb-3">
            <p className="text-[0.7rem] text-white/40 mb-2 uppercase tracking-[0.05em]">
              Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="py-1.5 px-3 rounded-2xl text-[0.75rem] bg-white/5 border border-white/10 text-white/60 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 p-3 bg-white/[0.03] rounded-xl border border-white/10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me to fix something, add a feature, or generate content..."
            className="flex-1 py-2.5 px-3.5 rounded-lg text-[0.9rem] bg-white/5 border border-white/10 text-[#e8edf2] outline-none focus:border-white/20 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors"
            style={{
              background: input.trim() ? 'rgba(123,106,170,0.3)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${input.trim() ? 'rgba(123,106,170,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: input.trim() ? '#b09cd8' : 'rgba(255,255,255,0.3)',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Sidebar - Pending Approvals & Tool History */}
      <div className="w-80 border-l border-white/10 bg-black/20 p-6 overflow-y-auto">
        {/* Pending Approvals */}
        <div className="mb-6">
          <h3 className="text-[0.8rem] uppercase tracking-[0.1em] text-white/50 mb-3 flex items-center gap-1.5">
            <AlertCircle size={14} />
            Pending Approvals ({pendingApprovals.length})
          </h3>

          {pendingApprovals.length === 0 ? (
            <p className="text-[0.8rem] text-white/30 italic">
              No pending approvals
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="p-3 rounded-lg bg-cf-gold/10 border border-cf-gold/20"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <FileCode size={14} className="text-cf-gold" />
                    <span className="text-[0.75rem] font-medium text-cf-gold">
                      {approval.type}
                    </span>
                  </div>

                  <p className="text-[0.75rem] text-white/60 mb-2">
                    {approval.params?.path || 'Unknown file'}
                  </p>
                  
                  {approval.params?.description && (
                    <p className="text-[0.7rem] text-white/40 mb-3">
                      {approval.params.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(approval.id)}
                      className="flex-1 py-1.5 px-2.5 rounded-md text-[0.7rem] bg-[rgba(122,170,136,0.2)] border border-[rgba(122,170,136,0.3)] text-[#7aaa88] cursor-pointer flex items-center justify-center gap-1 hover:bg-[rgba(122,170,136,0.3)] transition-colors"
                    >
                      <CheckCircle size={12} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(approval.id)}
                      className="flex-1 py-1.5 px-2.5 rounded-md text-[0.7rem] bg-[rgba(255,100,100,0.1)] border border-[rgba(255,100,100,0.2)] text-red-400/80 cursor-pointer flex items-center justify-center gap-1 hover:bg-[rgba(255,100,100,0.2)] transition-colors"
                    >
                      <XCircle size={12} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tool Execution History */}
        {toolExecutions.length > 0 && (
          <div>
            <h3 className="text-[0.8rem] uppercase tracking-[0.1em] text-white/50 mb-3 flex items-center gap-1.5">
              <Terminal size={14} />
              Recent Actions
            </h3>

            <div className="flex flex-col gap-2">
              {toolExecutions.slice(-5).map((exec) => (
                <div
                  key={exec.id}
                  className="p-2.5 rounded-md bg-white/[0.03] border border-white/[0.08]"
                >
                  <div className="flex items-center gap-1.5">
                    {exec.status === 'approved' ? (
                      <CheckCircle size={12} className="text-[#7aaa88]" />
                    ) : (
                      <XCircle size={12} className="text-[#ff6464]" />
                    )}
                    <span className="text-[0.7rem]" style={{ color: exec.status === 'approved' ? '#7aaa88' : '#ff6464' }}>
                      {exec.status}
                    </span>
                    <Clock size={10} className="text-white/30" />
                    <span className="text-[0.65rem] text-white/30">
                      {new Date(exec.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
