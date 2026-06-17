import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { onNotePlayed } from '../lib/bevyEventBus';

const BevyIPCContext = createContext(null);

export function BevyIPCProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;
  const connectRef = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (retryCountRef.current >= MAX_RETRIES) {
      console.warn('[BevyIPC] Max connection retries reached. Spatial Engine is likely offline.');
      return;
    }

    try {
      const ws = new WebSocket('ws://127.0.0.1:8765/ws');

      ws.onopen = () => {
        console.log('[BevyIPC] Connected to Spatial Engine');
        setIsConnected(true);
        retryCountRef.current = 0; // reset retries on success
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          console.log('[BevyIPC] Received:', data);
        } catch {
          console.error('[BevyIPC] Error parsing message:', event.data);
        }
      };

      ws.onclose = () => {
        if (isConnected) {
          console.log('[BevyIPC] Disconnected from Spatial Engine');
          setIsConnected(false);
        }
        wsRef.current = null;
        
        if (retryCountRef.current < MAX_RETRIES) {
          const delay = Math.pow(2, retryCountRef.current) * 1000;
          retryCountRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => connectRef.current?.(), delay);
        }
      };

      ws.onerror = () => {
        // ws.onerror doesn't provide detailed info, but onclose will fire immediately after
        ws.close();
      };

      wsRef.current = ws;
    } catch (e) {
      console.error('[BevyIPC] Connection error:', e);
      if (retryCountRef.current < MAX_RETRIES) {
        const delay = Math.pow(2, retryCountRef.current) * 1000;
        retryCountRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(() => connectRef.current?.(), delay);
      }
    }
  }, [isConnected]);

  // Intentionally no deps — keeps ref in sync with latest `connect` closure on every render
  useEffect(() => {
    connectRef.current = connect;
  });

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const sendCommand = useCallback((event, payload = {}) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ event, ...payload });
      wsRef.current.send(message);
      console.log('[BevyIPC] Sent:', message);
      return true;
    } else {
      console.warn('[BevyIPC] Cannot send command, not connected:', event);
      return false;
    }
  }, []);

  useEffect(() => {
    return onNotePlayed((data) => {
      sendCommand('NOTE_PLAYED', data);
    });
  }, [sendCommand]);

  return (
    <BevyIPCContext.Provider value={{ isConnected, lastMessage, sendCommand }}>
      {children}
    </BevyIPCContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBevyIPC() {
  const context = useContext(BevyIPCContext);
  if (!context) {
    throw new Error('useBevyIPC must be used within a BevyIPCProvider');
  }
  return context;
}
