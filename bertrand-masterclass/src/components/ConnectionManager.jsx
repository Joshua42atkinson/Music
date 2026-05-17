import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, ShieldCheck, KeyRound } from 'lucide-react';
import { db, setServerTunnel, getServerTunnel } from '../data/localDatabase';
import { motion } from 'framer-motion';

export default function ConnectionManager() {
  const [tunnelUrl, setTunnelUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if we already have a saved tunnel URL in IndexedDB
    getServerTunnel().then(url => {
      if (url) {
        setTunnelUrl(url);
        attemptConnection(url);
      } else {
        setShowModal(true);
      }
    });
  }, []);

  const attemptConnection = async (url) => {
    setIsConnecting(true);
    try {
      // Mock pinging the Axum Server health check endpoint
      // const res = await fetch(`${url}/api/health`);
      // if (res.ok) { ... }
      
      // Simulating network delay for UI feedback
      await new Promise(r => setTimeout(r, 1000));
      
      await setServerTunnel(url);
      setIsConnected(true);
      setShowModal(false);
    } catch (e) {
      console.error("Connection failed", e);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnect = (e) => {
    e.preventDefault();
    if (tunnelUrl.trim() === '') return;
    attemptConnection(tunnelUrl);
  };

  return (
    <>
      {/* Persistent Status Badge */}
      <div 
        onClick={() => setShowModal(true)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 cursor-pointer hover:bg-black/80 transition-colors shadow-lg"
      >
        {isConnected ? (
          <>
            <Wifi size={14} className="text-green-500" />
            <span className="text-xs text-green-500 font-medium tracking-wide">Connected to Vault</span>
          </>
        ) : (
          <>
            <WifiOff size={14} className="text-red-500 animate-pulse" />
            <span className="text-xs text-red-500 font-medium tracking-wide">Local Mode (Offline)</span>
          </>
        )}
      </div>

      {/* Connection Handshake Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-gradient-to-b from-[#1a1510] to-[#0a0806] border border-cf-gold/30 rounded-2xl max-w-md w-full p-8 shadow-[0_0_40px_rgba(201,169,110,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cf-gold to-transparent opacity-50" />
            
            <div className="w-12 h-12 rounded-full bg-cf-gold/10 flex items-center justify-center mb-6 border border-cf-gold/20">
              <ShieldCheck className="text-cf-gold" size={24} />
            </div>
            
            <h2 className="text-2xl font-light text-cf-gold mb-2">Connect to Grimoire</h2>
            <p className="text-sm text-cf-slate mb-8 font-serif italic">
              Your data is stored securely on your device. To sync with Bertrand or submit videos, enter the secure Server Code provided by your mentor.
            </p>

            <form onSubmit={handleConnect} className="flex flex-col gap-4">
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cf-gold/50" />
                <input 
                  type="text" 
                  value={tunnelUrl}
                  onChange={(e) => setTunnelUrl(e.target.value)}
                  placeholder="e.g. secure.voix-vive.tunnel" 
                  className="w-full bg-black/50 border border-cf-gold/20 rounded-xl py-3 pl-12 pr-4 text-cf-silver focus:outline-none focus:border-cf-gold focus:ring-1 focus:ring-cf-gold/50 transition-all font-mono text-sm"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-cf-slate/20 text-cf-slate hover:text-white hover:bg-white/5 transition-colors text-sm uppercase tracking-wider"
                >
                  Stay Offline
                </button>
                <button 
                  type="submit"
                  disabled={isConnecting}
                  className="flex-1 py-3 rounded-xl bg-cf-gold text-cf-void font-semibold hover:bg-white transition-colors text-sm uppercase tracking-wider disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isConnecting ? (
                    <span className="w-4 h-4 border-2 border-cf-void/30 border-t-cf-void rounded-full animate-spin" />
                  ) : "Connect"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}
