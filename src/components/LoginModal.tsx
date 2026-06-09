/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useStore();
  const [username, setUsername] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('https://mc-heads.net/avatar/Steve/64');

  // Debounce username input to load gorgeous live avatar preview
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = username.trim();
      if (trimmed) {
        setAvatarPreview(`https://mc-heads.net/avatar/${trimmed}/64`);
      } else {
        setAvatarPreview('https://mc-heads.net/avatar/Steve/64');
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <div id="login-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLoginModalOpen(false)}
            className="fixed inset-0 bg-cyber-dark/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-cyber-dark/80 backdrop-blur-xl p-6 shadow-2xl z-10"
            id="login-modal-content"
          >
            {/* Ambient Purple glow background effect */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-purple/20 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-purple/15 blur-3xl rounded-full pointer-events-none" />

            {/* Header close button */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-accent-purple/10 border border-accent-purple/20">
                  <ShieldCheck size={18} className="text-accent-purple" />
                </div>
                <span className="font-mono text-xs text-accent-purple tracking-widest uppercase font-bold">Secure Gateway</span>
              </div>
              <button
                id="close-login-btn"
                onClick={() => setIsLoginModalOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-white/5 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Logo and Content info */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                {/* Logo and StockMC Badge */}
                <div className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-white">
                  <div className="relative w-8 h-8 flex items-center justify-center drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    <img src="/logo.png" alt="StockMC Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-white">Stock</span>
                  <span className="text-accent-purple font-mono bg-accent-purple/10 px-2 py-0.5 rounded text-sm tracking-normal">MC</span>
                </div>
              </div>
              <h2 className="text-xl font-display font-bold text-white mb-2">Login with Minecraft Username</h2>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Enter your Minecraft In-Game Username. No passwords required. Your skin is retrieved automatically.
              </p>
            </div>

            {/* Interactive Live skin display */}
            <div className="flex justify-center items-center gap-4 bg-cyber-dark/40 border border-white/5 rounded-xl p-4 mb-6">
              <div className="relative p-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-inner">
                <img
                  src={avatarPreview}
                  alt="Minecraft Live Skin Previews"
                  className="w-14 h-14 object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/64';
                  }}
                />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono text-accent-purple font-medium tracking-wide uppercase block">Live Render Preview</span>
                <span className="font-mono text-sm text-white font-semibold truncate max-w-[180px] block">
                  {username.trim() || 'Steve (Default)'}
                </span>
                <span className="text-xs text-gray-400 block">Status: Waiting verification</span>
              </div>
            </div>

            {/* Input Form submission */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-300 font-medium block">
                  Minecraft Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={16} />
                  </span>
                  <input
                    id="mc-username-input"
                    type="text"
                    required
                    placeholder="e.g. Dream / Steve"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-cyber-dark/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/30 transition-all font-mono"
                  />
                </div>
              </div>

              <button
                id="submit-login-btn"
                type="submit"
                disabled={!username.trim()}
                className="w-full flex items-center justify-center gap-2 bg-accent-purple hover:bg-violet-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3 px-4 shadow-lg shadow-accent-purple/20 transition-all cursor-pointer font-display"
              >
                Continue <ArrowRight size={16} />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
