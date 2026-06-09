/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../context/StoreContext';
import { Compass, Swords, Shield, MessageCircle, Twitter, Youtube, Trophy } from 'lucide-react';

export default function Footer() {
  const { setActiveView } = useStore();

  const quickLinks = [
    { label: 'Home Splash', viewId: 'home', icon: Compass },
    { label: 'Lifesteal Arena', viewId: 'lifesteal', icon: Swords },
    { label: 'Survival SMP', viewId: 'survival', icon: Shield },
    { label: 'Support center', viewId: 'support', icon: MessageCircle },
    { label: 'Admin Panel', viewId: 'admin', icon: Trophy },
  ] as const;

  return (
    <footer className="border-t border-white/5 bg-cyber-dark/60 backdrop-blur-md relative overflow-hidden">
      {/* Footer backing overlay glow */}
      <div className="absolute bottom-[-100px] left-[-100px] bg-accent-purple/5 blur-[120px] w-[350px] h-[350px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12" id="footer-branding-matrix">
          
          {/* COLUMN 1: BRAND LOGO & BIO */}
          <div className="space-y-4 md:col-span-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5 cursor-pointer" onClick={() => setActiveView('home')}>
              <div className="relative w-8 h-8 flex items-center justify-center drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                <img src="/logo.png" alt="StockMC Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex items-baseline font-display text-lg font-bold tracking-tight text-white select-none">
                <span>Stock</span>
                <span className="text-accent-purple font-mono ml-0.5 text-xs bg-accent-purple/15 rounded px-1.5 py-0.2">MC</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              StockMC is the ultimate premium decentralized survival &amp; combat lifesteal gaming network. Buy ranks, claim keys, or fund massive multiplayer guilds safely.
            </p>

            {/* Social handles links row */}
            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              <a href="https://twitter.com/stockmc" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 hover:border-accent-purple hover:text-accent-purple flex items-center justify-center text-gray-400 transition-colors">
                <Twitter size={15} />
              </a>
              <a href="https://youtube.com/stockmc" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 hover:border-accent-purple hover:text-accent-purple flex items-center justify-center text-gray-400 transition-colors">
                <Youtube size={15} />
              </a>
              <a href="https://discord.gg/stockmc" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 hover:border-accent-purple hover:text-accent-purple flex items-center justify-center text-gray-400 transition-colors">
                {/* Custom inline Discord SVG tag */}
                <svg className="w-3.8 h-3.8 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.461-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
              </a>
            </div>
          </div>

          {/* COLUMN 2: QUICK NAVIGATION */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((link, lidx) => {
                const Icon = link.icon;
                return (
                  <li key={lidx}>
                    <button
                      id={`footer-link-${link.viewId}`}
                      onClick={() => setActiveView(link.viewId)}
                      className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Icon size={12} className="text-accent-purple" />
                      <span>{link.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* COLUMN 3: SERVER STATS */}
          <div className="space-y-3.5 text-center md:text-left font-mono text-xs">
            <h4 className="text-xs font-display font-medium text-gray-300 font-bold uppercase tracking-wider">Server Ledger</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex justify-between md:justify-start gap-4">
                <span className="text-gray-500 font-bold uppercase">Online:</span>
                <span className="text-emerald-400 font-bold">184 PLAYERS</span>
              </div>
              <div className="flex justify-between md:justify-start gap-4">
                <span className="text-gray-500 font-bold uppercase">Server IP:</span>
                <span className="text-white font-medium">play.stockmc.fun</span>
              </div>
              <div className="flex justify-between md:justify-start gap-4">
                <span className="text-gray-500 font-bold uppercase">Version:</span>
                <span className="text-white font-medium">MC 1.20 - 1.21.x</span>
              </div>
            </div>
          </div>

          {/* COLUMN 4: DISCLAIMER LEGAL */}
          <div className="space-y-4 text-center md:text-left text-xs text-gray-500 font-sans leading-relaxed">
            <h4 className="text-xs font-display font-medium text-gray-300 font-bold uppercase tracking-wider">Legal Disclaimer</h4>
            <p>
              StockMC is not affiliated in any way with Mojang Synergies AB, Microsoft Studios, or parent entities. All custom in-game goods bought fund maintenance, server racks, and network extensions.
            </p>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT SUMMARY FOOTER */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/5 mt-10 pt-6 text-[10px] sm:text-xs text-gray-500 font-mono gap-4">
          <p>© 2026 StockMC. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#store-rules" className="hover:text-white transition-colors uppercase font-bold text-accent-purple flex items-center gap-1">
              <Trophy size={11} />
              <span>Rules Guide</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
