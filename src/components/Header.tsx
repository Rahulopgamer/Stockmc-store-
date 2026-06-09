/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, User, LogOut, Menu, X, Shield, Swords, Compass, MessageCircle, ScrollText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PurchaseHistoryModal from './PurchaseHistoryModal';

export default function Header() {
  const {
    activeView,
    setActiveView,
    mcUser,
    logout,
    cart,
    setIsCartOpen,
    setIsLoginModalOpen,
  } = useStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPurchaseHistoryOpen, setIsPurchaseHistoryOpen] = useState(false);

  // Calculate total items in cart
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'lifesteal', label: 'Lifesteal', icon: Swords },
    { id: 'survival', label: 'Survival', icon: Shield },
    { id: 'support', label: 'Support', icon: MessageCircle },
  ] as const;

  const handleNavClick = (viewId: typeof navItems[number]['id']) => {
    setActiveView(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-cyber-dark/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* LOGO BRANDING */}
          <div
            id="brand-logo"
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Custom Logo Image Uploaded by User */}
            <div className="relative w-10 h-10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <img src="/logo.png" alt="StockMC Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
            </div>
            <div className="flex items-baseline font-display text-xl font-bold tracking-tight text-white select-none">
              <span>Stock</span>
              <span className="text-accent-purple font-mono ml-0.5 text-sm bg-accent-purple/10 border border-accent-purple/15 rounded px-1.5 py-0.2 tracking-normal">MC</span>
            </div>
          </div>

          {/* DESKTOP ROUTE LINKS */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.8 text-sm font-display font-medium rounded-lg transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-accent-purple' : 'text-gray-400'} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent-purple rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT ACTION BUTTONS: CART, PROFILE */}
          <div className="flex items-center gap-4">
            
            {/* CART TRIGGER BUTTON */}
            <button
              id="cart-trigger"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-white/10 bg-cyber-card/50 hover:bg-cyber-card text-gray-300 hover:text-white transition-all cursor-pointer group"
            >
              <ShoppingCart size={20} className="group-hover:scale-105 transition-transform duration-200" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    id="cart-badge"
                    className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 flex items-center justify-center rounded-full bg-accent-purple font-mono font-bold text-[10px] text-white shadow-md shadow-accent-purple/30 text-center"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* MINECRAFT PROFILE SECTION OR LOGIN */}
            {mcUser ? (
              <div id="profile-container" className="relative">
                <button
                  id="profile-dropdown-trigger"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 p-1 rounded-xl border border-white/10 bg-cyber-card/50 hover:bg-cyber-card text-white hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-md border border-white/10 overflow-hidden shadow">
                    <img
                      src={mcUser.avatarUrl}
                      alt={`${mcUser.username} Minecraft Helmet Avatar`}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/32';
                      }}
                    />
                  </div>
                  <span className="hidden sm:inline font-mono text-xs font-semibold text-gray-200 truncate max-w-[100px] group-hover:text-white">
                    {mcUser.username}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </button>

                {/* Profile drop-down */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      {/* Dropdown block closer */}
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2.5 w-60 rounded-xl border border-white/10 bg-cyber-card p-4 shadow-xl z-20"
                        id="profile-dropdown-menu"
                      >
                        <div className="flex items-center gap-3 pb-3.5 mb-3 border-b border-white/5">
                          <img
                            src={mcUser.avatarUrl}
                            alt={mcUser.username}
                            className="w-11 h-11 object-contain bg-white/5 rounded-lg border border-white/10"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/64';
                            }}
                          />
                          <div className="overflow-hidden">
                            <h4 className="font-mono text-xs font-bold text-white truncate">{mcUser.username}</h4>
                            <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">Validated Player</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setIsPurchaseHistoryOpen(true);
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer mb-1"
                        >
                          <ScrollText size={14} />
                          Purchase History
                        </button>

                        {/* Interactive sign out link */}
                        <button
                          id="logout-btn"
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-white hover:bg-rose-500/15 rounded-lg transition-all cursor-pointer"
                        >
                          <LogOut size={14} />
                          Disconnect Username
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                id="login-trigger-btn"
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-tr from-accent-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-display text-xs sm:text-sm font-semibold rounded-xl py-2.5 px-4.5 shadow-lg shadow-accent-purple/20 transition-all cursor-pointer hover:shadow-accent-purple/40"
              >
                <User size={15} />
                <span>Minecraft Login</span>
              </button>
            )}

            {/* MOBILE NAVIGATION TOGGLE */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-cyber-dark/80 backdrop-blur-lg px-4 py-4 space-y-1"
            id="mobile-navigation-drawer"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`nav-link-mobile-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-display font-semibold transition-all cursor-pointer ${
                    activeView === item.id
                      ? 'bg-accent-purple/10 text-white border border-accent-purple/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} className={activeView === item.id ? 'text-accent-purple' : 'text-gray-400'} />
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <PurchaseHistoryModal isOpen={isPurchaseHistoryOpen} onClose={() => setIsPurchaseHistoryOpen(false)} />
    </header>
  );
}
