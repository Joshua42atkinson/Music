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
  "Generate a new adventure level for Troubadour's Journey",
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
    } catch (e) {
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
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#0d0d14',
      color: '#e8edf2',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Main Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(123,106,170,0.2)',
              border: '1px solid rgba(123,106,170,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Bot size={20} style={{ color: '#7b6aaa' }} />
            </div>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 600,
                fontFamily: "'Cormorant Garamond', serif",
              }}>
                AI Developer Assistant
              </h1>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                color: serverStatus === 'connected' ? '#7aaa88' : '#ff6464',
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: serverStatus === 'connected' ? '#7aaa88' : '#ff6464',
                }} />
                MCP Server {serverStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: msg.role === 'user' 
                  ? 'rgba(123,106,170,0.2)' 
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${msg.role === 'user' 
                  ? 'rgba(123,106,170,0.3)' 
                  : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              <pre style={{
                margin: 0,
                fontSize: '0.85rem',
                lineHeight: 1.5,
                fontFamily: "'Inter', sans-serif",
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.content}
              </pre>
            </div>
          ))}
          
          {isLoading && (
            <div style={{
              alignSelf: 'flex-start',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.85rem',
            }}>
              <span style={{ animation: 'pulse 1s infinite' }}>●</span>
              <span style={{ animation: 'pulse 1s infinite 0.2s' }}>●</span>
              <span style={{ animation: 'pulse 1s infinite 0.4s' }}>●</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length < 3 && (
          <div style={{ marginBottom: '12px' }}>
            <p style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Try asking:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me to fix something, add a feature, or generate content..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e8edf2',
              outline: 'none',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
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
      <div style={{
        width: '320px',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.2)',
        padding: '24px',
        overflowY: 'auto',
      }}>
        {/* Pending Approvals */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <AlertCircle size={14} />
            Pending Approvals ({pendingApprovals.length})
          </h3>
          
          {pendingApprovals.length === 0 ? (
            <p style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.3)',
              fontStyle: 'italic',
            }}>
              No pending approvals
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(201,169,110,0.1)',
                    border: '1px solid rgba(201,169,110,0.2)',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                  }}>
                    <FileCode size={14} style={{ color: '#c9a96e' }} />
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: '#c9a96e',
                    }}>
                      {approval.type}
                    </span>
                  </div>
                  
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '8px',
                  }}>
                    {approval.params?.path || 'Unknown file'}
                  </p>
                  
                  {approval.params?.description && (
                    <p style={{
                      fontSize: '0.7rem',
                      color: 'rgba(255,255,255,0.4)',
                      marginBottom: '12px',
                    }}>
                      {approval.params.description}
                    </p>
                  )}
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleApprove(approval.id)}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        background: 'rgba(122,170,136,0.2)',
                        border: '1px solid rgba(122,170,136,0.3)',
                        color: '#7aaa88',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle size={12} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(approval.id)}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        background: 'rgba(255,100,100,0.1)',
                        border: '1px solid rgba(255,100,100,0.2)',
                        color: 'rgba(255,100,100,0.8)',
                        cursor: 'pointer',
                      }}
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
            <h3 style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Terminal size={14} />
              Recent Actions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {toolExecutions.slice(-5).map((exec) => (
                <div
                  key={exec.id}
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    {exec.status === 'approved' ? (
                      <CheckCircle size={12} style={{ color: '#7aaa88' }} />
                    ) : (
                      <XCircle size={12} style={{ color: '#ff6464' }} />
                    )}
                    <span style={{
                      fontSize: '0.7rem',
                      color: exec.status === 'approved' ? '#7aaa88' : '#ff6464',
                    }}>
                      {exec.status}
                    </span>
                    <Clock size={10} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <span style={{
                      fontSize: '0.65rem',
                      color: 'rgba(255,255,255,0.3)',
                    }}>
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
