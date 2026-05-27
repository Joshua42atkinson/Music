import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle, XCircle, Zap, Activity } from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// LM Studio Status Component
// Shows connection status and model info for LM Studio
// ═══════════════════════════════════════════════════════════

export default function LMStudioStatus({ isConnected, modelInfo, onCheck, loading }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  return (
    <div style={{
      padding: '16px',
      borderRadius: '12px',
      background: isConnected 
        ? 'rgba(122, 170, 136, 0.1)' 
        : 'rgba(255, 100, 100, 0.05)',
      border: `1px solid ${isConnected 
        ? 'rgba(122, 170, 136, 0.3)' 
        : 'rgba(255, 100, 100, 0.2)'}`,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: isConnected ? '12px' : '0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} style={{ 
            color: isConnected ? '#7aaa88' : 'rgba(255,100,100,0.6)',
            animation: pulse ? 'pulse 0.5s ease' : 'none'
          }} />
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: isConnected ? '#7aaa88' : 'rgba(255,100,100,0.8)',
          }}>
            LM Studio {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <button
          onClick={onCheck}
          disabled={loading}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.7rem',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.7)',
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {loading ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      {isConnected && modelInfo && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          background: 'rgba(0,0,0,0.2)',
          fontSize: '0.75rem',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            marginBottom: '8px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            <Zap size={12} style={{ color: '#c9a96e' }} />
            <span style={{ fontWeight: 600 }}>{modelInfo.id || 'Unknown Model'}</span>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>GPU Offload: </span>
              <span style={{ color: '#7aaa88' }}>Max</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>Context: </span>
              <span style={{ color: '#7aaa88' }}>32K</span>
            </div>
          </div>
        </div>
      )}

      {!isConnected && (
        <div style={{
          marginTop: '8px',
          padding: '10px',
          borderRadius: '6px',
          background: 'rgba(255,100,100,0.05)',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.5,
        }}>
          <p style={{ margin: '0 0 6px 0' }}>
            To connect LM Studio:
          </p>
          <ol style={{ margin: 0, paddingLeft: '16px' }}>
            <li>Open LM Studio</li>
            <li>Load <strong>Qwen Coder</strong> model</li>
            <li>Enable <strong>GPU offload</strong> (all layers)</li>
            <li>Start the <strong>local server</strong> (port 1234)</li>
            <li>Click Refresh above</li>
          </ol>
        </div>
      )}
    </div>
  );
}
