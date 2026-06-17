import React, { useState, useEffect } from 'react';
import { Activity, Database, Mic, Wifi, WifiOff, ChevronUp, ChevronDown } from 'lucide-react';
import { useBackendBridge } from '../hooks/useBackendBridge';
import { useScaffolding } from './ScaffoldingProvider';
import { db } from '../data/localDatabase';

// ═══════════════════════════════════════════════════════════
// HEALTH PULSE — Autonomous System Observability Widget
// Always-visible status indicator showing DaaS connection,
// IndexedDB health, audio readiness, and traction metrics.
// Eliminates the need for browser dev tools to diagnose issues.
// ═══════════════════════════════════════════════════════════

export default function HealthPulse() {
  const { isDaaSConnected } = useBackendBridge();
  const { practiceMinutes, streak, breathingSessions, bardLevel } = useScaffolding();

  const [expanded, setExpanded] = useState(false);
  const [idbHealth, setIdbHealth] = useState('checking');
  const [deepHealth, setDeepHealth] = useState(null);

  // Check IndexedDB on mount
  useEffect(() => {
    const checkIdb = async () => {
      try {
        await db.settings.get('traction_state');
        setIdbHealth('ok');
      } catch {
        setIdbHealth('error');
      }
    };
    checkIdb();
  }, []);

  // Fetch deep health from DaaS when connected
  useEffect(() => {
    let cancelled = false;
    const fetchDeepHealth = async () => {
      if (!isDaaSConnected) {
        if (!cancelled) setDeepHealth(null);
        return;
      }
      try {
        const DAAS_API_BASE = `http://${window.location.hostname}:8080/api`;
        const resp = await fetch(`${DAAS_API_BASE}/health/deep`, { signal: AbortSignal.timeout(3000) });
        if (resp.ok && !cancelled) {
          setDeepHealth(await resp.json());
        }
      } catch {
        if (!cancelled) setDeepHealth(null);
      }
    };
    fetchDeepHealth();
    const interval = setInterval(fetchDeepHealth, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [isDaaSConnected]);

  const overallStatus = isDaaSConnected && idbHealth === 'ok' ? 'healthy' : idbHealth === 'ok' ? 'partial' : 'degraded';
  const statusColor = overallStatus === 'healthy' ? '#7aaa88' : overallStatus === 'partial' ? '#c9a96e' : '#c07898';

  return (
    <div style={{
      position: 'fixed', bottom: '12px', right: '12px', zIndex: 500,
      fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
    }}>
      {/* Collapsed Pill */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: '20px', cursor: 'pointer',
          background: 'rgba(5,5,8,0.9)', backdropFilter: 'blur(8px)',
          border: `1px solid ${statusColor}33`,
          color: 'rgba(255,255,255,0.5)', transition: 'all 0.3s ease',
        }}
      >
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: statusColor, boxShadow: `0 0 6px ${statusColor}`,
          animation: isDaaSConnected ? 'none' : 'loadBreath 3s ease-in-out infinite',
        }} />
        <span style={{ fontSize: '0.6rem' }}>
          {overallStatus === 'healthy' ? 'ALL SYSTEMS' : overallStatus === 'partial' ? 'OFFLINE' : 'DEGRADED'}
        </span>
        {expanded ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
      </button>

      {/* Expanded Panel */}
      {expanded && (
        <div style={{
          position: 'absolute', bottom: '36px', right: 0,
          width: '260px', padding: '14px', borderRadius: '12px',
          background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        }}>
          <h4 style={{
            margin: '0 0 10px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <Activity size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Health Pulse
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* DaaS Connection */}
            <StatusRow
              icon={isDaaSConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              label="DaaS Server"
              status={isDaaSConnected ? 'ok' : 'offline'}
              detail={isDaaSConnected ? 'Connected (8080)' : 'Offline Preview'}
            />

            {/* IndexedDB */}
            <StatusRow
              icon={<Database size={12} />}
              label="IndexedDB"
              status={idbHealth}
              detail={idbHealth === 'ok' ? 'Durable backup active' : idbHealth === 'checking' ? 'Checking...' : 'Fallback to localStorage'}
            />

            {/* SQLite (from deep health) */}
            {deepHealth && (
              <StatusRow
                icon={<Database size={12} />}
                label="SQLite"
                status="ok"
                detail={`${deepHealth.profiles_count} profiles · ${deepHealth.logs_count} logs`}
              />
            )}

            {/* LLM */}
            {deepHealth && (
              <StatusRow
                icon={<Mic size={12} />}
                label="LLM Backend"
                status={deepHealth.active_llm ? 'ok' : 'offline'}
                detail={deepHealth.active_llm || 'No model loaded'}
              />
            )}
          </div>

          {/* Traction Summary */}
          <div style={{
            marginTop: '10px', paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem',
          }}>
            Bard Lv.{bardLevel} · {practiceMinutes} min · {streak} day streak · {breathingSessions} breaths
          </div>
        </div>
      )}
    </div>
  );
}

function StatusRow({ icon, label, status, detail }) {
  const color = status === 'ok' ? '#7aaa88' : status === 'offline' ? '#c07898' : status === 'checking' ? '#c9a96e' : '#c07898';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '4px 0',
    }}>
      <span style={{ color, flexShrink: 0 }}>{icon}</span>
      <span style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{label}</span>
      <span style={{
        flex: 1, textAlign: 'right',
        color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {detail}
      </span>
      <span style={{
        width: '5px', height: '5px', borderRadius: '50%',
        background: color, flexShrink: 0,
      }} />
    </div>
  );
}
