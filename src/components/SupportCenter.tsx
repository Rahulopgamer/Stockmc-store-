/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Send, MessageSquare, Sparkles, MessageSquareHeart, CheckCircle, ShieldQuestion } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SupportCenter() {
  const { addToast } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discordId: '',
    transactionId: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketLogged, setTicketLogged] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast('Please fill in everyone of the required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate sending ticket request to game support server
    setTimeout(() => {
      setIsSubmitting(false);
      setTicketLogged(true);
      addToast('Support ticket successfully logged. Check email for responses!', 'success');
    }, 1500);
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      discordId: '',
      transactionId: '',
      message: '',
    });
    setTicketLogged(false);
  };

  return (
    <div className="py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* SECTION TITLE */}
      <div className="text-center mb-10">
        <span className="font-mono text-xs font-bold text-accent-purple uppercase tracking-widest block mb-2">Help Desk</span>
        <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">Support Center</h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Need help with your purchase, rank claims, coin transactions, or in-game commands? Our support agents are active 24/7.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start" id="support-main-grid">
        
        {/* BIG TICKET FORM CONTAINER PANEL */}
        <div className="md:col-span-3 rounded-2xl bg-cyber-card border border-white/5 p-6 sm:p-8 relative">
          <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare size={18} className="text-accent-purple" />
            <span>Submit a Ticket</span>
          </h3>

          <AnimatePresence mode="wait">
            {!ticketLogged ? (
              <motion.form
                key="support-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleFormSubmit}
                className="space-y-4"
                id="ticket-support-form"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 block font-semibold">Your Name <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Liam"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-cyber-dark/60 border border-white/10 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/20 transition-all"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 block font-semibold">Email Address <span className="text-rose-400">*</span></label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. name@domain.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-cyber-dark/60 border border-white/10 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Discord ID field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 block font-semibold">Discord Discord ID <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      name="discordId"
                      required
                      placeholder="e.g. rahulgaming#1234"
                      value={formData.discordId}
                      onChange={handleInputChange}
                      className="w-full bg-cyber-dark/60 border border-white/10 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/20 transition-all"
                    />
                  </div>

                  {/* Transaction ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 block font-semibold">Transaction In-Game ID <span className="text-gray-500">(Optional)</span></label>
                    <input
                      type="text"
                      name="transactionId"
                      placeholder="e.g. TXN-9403-LS"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      className="w-full bg-cyber-dark/60 border border-white/10 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/20 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Message field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-400 block font-semibold">Message Detail Description <span className="text-rose-400">*</span></label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Describe your issue with as much detail as possible..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-cyber-dark/60 border border-white/10 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/20 transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  id="submit-ticket-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-accent-purple hover:bg-violet-600 disabled:opacity-50 text-white font-display font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all cursor-pointer shadow-lg shadow-accent-purple/10"
                >
                  <Send size={14} />
                  <span>{isSubmitting ? 'Submitting ticket...' : 'Submit Ticket'}</span>
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="support-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="flex justify-center mb-4 text-emerald-400">
                  <CheckCircle size={48} className="animate-pulse" />
                </div>
                <h4 className="text-lg font-display font-bold text-white mb-2">Ticket Successfully Logged!</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
                  Thanks for reaching out! A ticket hash was submitted. An advisor will contact you on Discord or Email within 15 minutes.
                </p>
                <button
                  id="reset-ticket-form-btn"
                  onClick={handleResetForm}
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-2 px-4 rounded-xl text-xs text-gray-300 font-mono transition-all cursor-pointer"
                >
                  <Sparkles size={12} className="text-accent-purple" /> Link New Ticket
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SIDEBAR PRE-INFO CARDS (DISCORD CARD & FAQS) */}
        <div className="md:col-span-2 space-y-6" id="support-sidebar-panels">
          
          {/* DISCORD PROMO BLOCK CARD */}
          <div className="premium-border-glow rounded-2xl bg-gradient-to-br from-indigo-950/40 via-violet-950/20 to-cyber-surface border border-accent-purple/35 p-6 text-center select-none relative overflow-hidden group">
            {/* Embedded glowing background indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500/10 blur-3xl w-28 h-28 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <span className="font-mono text-[9px] uppercase tracking-widest font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">Instant Response</span>
            <h3 className="text-lg font-display font-black text-white mt-4 mb-2">Need Faster Help?</h3>
            <p className="text-xs text-gray-400 font-sans mb-6 max-w-xs mx-auto leading-relaxed">
              Skip global queues! Join the StockMC Discord guild and link with our automation bots to get ticket responses in seconds.
            </p>

            <a
              id="join-discord-btn"
              href="https://discord.gg/stockmc"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 hover:shadow-indigo-500/30 text-white font-display font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-500/15"
            >
              {/* Discord vector inline outline symbol */}
              <svg className="w-4 h-4 fill-current mr-1" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.461-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
              </svg>
              <span>Join Discord</span>
            </a>
          </div>

          {/* FAQS MINI BOARD ACCORDION */}
          <div className="rounded-2xl bg-cyber-card border border-white/5 p-4 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/5">
              <ShieldQuestion size={12} className="text-accent-purple" />
              <span>Purchase FAQs</span>
            </h4>

            {/* Each item */}
            <div className="space-y-1">
              <span className="text-xs text-white font-semibold font-display">How long does custom rank claims delivery take?</span>
              <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                Ranks, keys, and coins are processed and delivered in-game within 2-5 minutes automatically. Remain logged in on our server play.stockmc.fun to collect them.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-white font-semibold font-display">Are payments safe and protected?</span>
              <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                Absolutely. All checkout flows utilize heavy banking encryption tokens. We never store credit cards nor pass values insecurely.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
