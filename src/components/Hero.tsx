/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Copy, Server, Check } from 'lucide-react';
import { motion } from 'motion/react';
import Leaderboard from './Leaderboard';

export default function Hero({ showLeaderboard }: { showLeaderboard?: boolean }) {
  const { setActiveView, addToast } = useStore();
  const [copied, setCopied] = useState(false);
  const serverIP = 'play.stockmc.fun';

  const handleCopyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    addToast('Server IP copied! Paste in Minecraft to join.', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28">
      {/* BACKGROUND GRAPHIC OR GLOWS */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Floating particles panel simulation */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-accent-purple/60 rounded-full animate-pulse-slow" />
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-violet-500/40 rounded-full animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-indigo-400/50 rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-3.5 h-3.5 bg-fuchsia-500/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* LOGO ANIMATION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="flex justify-center mb-6"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-40 h-40 sm:w-48 sm:h-48 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
          >
            <img src="/logo.png" alt="StockMC Logo" className="w-full h-full object-contain hover:scale-110 transition-transform duration-500 cursor-pointer" />
          </motion.div>
        </motion.div>

        {/* GLORIOUS HERO HEADINGS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white leading-tight">
            Welcome to <span className="bg-gradient-to-r from-accent-purple via-violet-400 to-indigo-400 bg-clip-text text-transparent text-minecraft-glow">StockMC</span> Store
          </h1>
          <p className="text-base sm:text-xl text-gray-400 font-sans max-w-2xl mx-auto leading-relaxed">
            Upgrade your gameplay on the ultimate Lifesteal & Survival network. Unlock epic ranks, chests, items, keys, and coin caches to command absolute battlefield supremacy.
          </p>
        </motion.div>

        {/* HERO CALL TO ACTIONS BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-6"
        >
          {/* Explore Shop */}
          <button
            id="hero-explore-shop"
            onClick={() => {
              setActiveView('lifesteal');
              // scroll smooth to shopfront container
              setTimeout(() => {
                document.getElementById('shopfront-anchor')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent-purple hover:bg-violet-600 text-white font-display font-semibold rounded-xl py-3.5 px-7 shadow-lg shadow-accent-purple/20 transition-all cursor-pointer group hover:shadow-accent-purple/40"
          >
            Explore Shop
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Join Server (Copies IP) */}
          <div className="relative w-full sm:w-auto group">
            {/* Label placed above the button ('only in up') */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none">
               <span className="text-[10px] text-accent-purple font-mono uppercase tracking-widest font-bold opacity-80">Server IP</span>
            </div>
            <button
              id="hero-copy-ip-btn"
              onClick={handleCopyIP}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-transparent hover:bg-white/10 border border-white/20 rounded-xl py-3.5 px-6 block text-white font-display font-semibold transition-all cursor-pointer"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Server size={16} className="text-accent-purple group-hover:scale-110 transition-transform" />}
              <span className="font-mono text-gray-300 group-hover:text-white transition-colors">
                {copied ? 'IP Copied!' : serverIP}
              </span>
              {!copied && <Copy size={13} className="text-gray-400 group-hover:text-white transition-colors" />}
            </button>
          </div>
        </motion.div>

        {showLeaderboard && (
          <div className="mt-16">
            <Leaderboard />
          </div>
        )}

      </div>
    </section>
  );
}
