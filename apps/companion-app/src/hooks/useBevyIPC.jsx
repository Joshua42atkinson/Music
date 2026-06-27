import { devLog, devWarn } from '../lib/devLog';
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { onNotePlayed } from '../lib/bevyEventBus';
import { devError } from '../lib/devLog';

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
      devWarn('[BevyIPC] Max connection retries reached. Spatial Engine is likely offline.');
      return;
    }

    try {
      const ws = new WebSocket('ws://127.0.0.1:8765/ws');

      ws.onopen = () => {
        if (import.meta.env.DEV) devLog('[BevyIPC] Connected to Spatial Engine');
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
          if (import.meta.env.DEV) devLog('[BevyIPC] Received:', data);
        } catch {
          devError('[BevyIPC] Error parsing message:', event.data);
        }
      };

      ws.onclose = () => {
        if (isConnected) {
          if (import.meta.env.DEV) devLog('[BevyIPC] Disconnected from Spatial Engine');
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
      devError('[BevyIPC] Connection error:', e);
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
      if (import.meta.env.DEV) devLog('[BevyIPC] Sent:', message);
      return true;
    } else {
      devWarn('[BevyIPC] Cannot send command, not connected:', event);
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
