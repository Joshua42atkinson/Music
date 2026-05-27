import React, { useState } from 'react';
import { Bot, Code, Send, Terminal, XCircle, CheckCircle } from 'lucide-react';
import { useLMStudio } from '../hooks/useLMStudio';

// ═══════════════════════════════════════════════════════════
// LM Studio Sub-Agent Demo
// Shows how to use LM Studio (Qwen Coder) as a coding sub-agent
// ═══════════════════════════════════════════════════════════

const EXAMPLE_TASKS = [
  {
    label: 'Generate React Hook',
    prompt: 'Create a custom React hook called useAudioAnalyzer that analyzes microphone input and returns frequency data. Include proper cleanup and TypeScript types.'
  },
  {
    label: 'Optimize Function',
    prompt: 'Optimize this function for performance: function findDuplicates(arr) { let dups = []; for(let i=0; i<arr.length; i++) { for(let j=i+1; j<arr.length; j++) { if(arr[i] === arr[j]) dups.push(arr[i]); } } return dups; }'
  },
  {
    label: 'Debug Code',
    prompt: 'This useEffect runs infinitely - why? useEffect(() => { setCount(count + 1); }, [count]);'
  },
  {
    label: 'Explain Algorithm',
    prompt: 'Explain the Web Audio API worklet system and how to pass data between the main thread and audio worklet without blocking.'
  }
];

export default function LMStudioSubAgent() {
  const { isReady, isLoading, error, modelInfo, checkConnection, chatCompletion, chatCompletionStream } = useLMStudio();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [streamingOutput, setStreamingOutput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleCheckConnection = async () => {
    const result = await checkConnection();
    console.log('LM Studio status:', result);
  };

  const handleSend = async (customPrompt = null) => {
    const prompt = customPrompt || input;
    if (!prompt.trim() || !isReady) return;

    setOutput('');
    setStreamingOutput('');
    setIsStreaming(true);

    try {
      await chatCompletionStream(
        [
          {
            role: 'system',
            content: 'You are a helpful coding assistant. Provide clear, well-commented code examples and concise explanations. Focus on best practices and modern JavaScript/React patterns.'
          },
          { role: 'user', content: prompt }
        ],
        (chunk, full) => {
          setStreamingOutput(full);
        },
        {
          temperature: 0.3,
          max_tokens: 4096,
          maxContext: 32768,
          gpuLayers: 999,
        }
      );
      setOutput(streamingOutput);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
    setIsStreaming(false);
  };

  return (
    <div style={{
      padding: '24px',
      maxWidth: '800px',
      margin: '0 auto',
      color: '#e8edf2',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(123,106,170,0.2)',
          border: '1px solid rgba(123,106,170,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Bot size={24} style={{ color: '#7b6aaa' }} />
        </div>
        <div>
          <h2 style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: 600,
            fontFamily: "'Cormorant Garamond', serif",
          }}>
            LM Studio Sub-Agent
          </h2>
          <p style={{
            margin: '4px 0 0',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {isReady ? (
              <span style={{ color: '#7aaa88' }}>
                <CheckCircle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Connected: {modelInfo?.id?.split('/').pop() || 'Unknown Model'}
              </span>
            ) : (
              <span style={{ color: 'rgba(255,100,100,0.8)' }}>
                <XCircle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Not connected
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleCheckConnection}
          style={{
            marginLeft: 'auto',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Check Connection
        </button>
      </div>

      {/* Example Tasks */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          fontSize: '0.65rem',
          fontFamily: "'JetBrains Mono', monospace",
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '12px',
        }}>
          Quick Tasks
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {EXAMPLE_TASKS.map((task) => (
            <button
              key={task.label}
              onClick={() => handleSend(task.prompt)}
              disabled={!isReady || isStreaming}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                background: 'rgba(123,106,170,0.1)',
                border: '1px solid rgba(123,106,170,0.2)',
                color: '#b09cd8',
                cursor: isReady ? 'pointer' : 'not-allowed',
                fontFamily: "'JetBrains Mono', monospace",
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Code size={14} />
              {task.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          fontSize: '0.65rem',
          fontFamily: "'JetBrains Mono', monospace",
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '8px',
        }}>
          Custom Prompt
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Qwen Coder to generate code, explain concepts, or debug issues..."
            rows={3}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e8edf2',
              outline: 'none',
              fontFamily: "'JetBrains Mono', monospace",
              resize: 'vertical',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!isReady || !input.trim() || isStreaming}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: isReady && input.trim()
                ? 'rgba(123,106,170,0.3)'
                : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isReady && input.trim() ? 'rgba(123,106,170,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: isReady && input.trim() ? '#b09cd8' : 'rgba(255,255,255,0.3)',
              cursor: isReady && input.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Output Area */}
      {(streamingOutput || output) && (
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}>
            <Terminal size={16} style={{ color: '#7aaa88' }} />
            <span style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Response {isStreaming && <span style={{ color: '#c9a96e' }}>(streaming...)</span>}
            </span>
          </div>
          <pre style={{
            margin: 0,
            fontSize: '0.8rem',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.8)',
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {streamingOutput || output}
          </pre>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          borderRadius: '8px',
          background: 'rgba(255,100,100,0.1)',
          border: '1px solid rgba(255,100,100,0.2)',
          fontSize: '0.8rem',
          color: 'rgba(255,100,100,0.8)',
        }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}
