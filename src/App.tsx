/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Header from './components/Header';
import Hero from './components/Hero';
import QuickCategories from './components/QuickCategories';
import StoreFront from './components/StoreFront';
import SupportCenter from './components/SupportCenter';
import CartDrawer from './components/CartDrawer';
import LoginModal from './components/LoginModal';
import CheckoutSection from './components/CheckoutSection';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Leaderboard from './components/Leaderboard';
import { motion, AnimatePresence } from 'motion/react';

function MainAppContent() {
  const { activeView, checkoutStep } = useStore();

  const isCheckoutActive = checkoutStep !== 'cart';

  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col justify-between selection:bg-accent-purple/30 selection:text-white relative">
      {/* GLOBAL MINECRAFT BACKGROUND WITH OVERLAY & PARALLAX */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(11, 11, 15, 0.4), rgba(11, 11, 15, 0.6)),
            url('/stockmc-background.png')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* FLOATING PARTICLES AMBIENCE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-accent-purple/60 rounded-full animate-pulse-slow" />
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-violet-500/40 rounded-full animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-indigo-400/50 rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-3.5 h-3.5 bg-fuchsia-500/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* CORE WRAPPED COMPONENTS */}
      <div className="z-10 relative flex flex-col flex-grow">
        
        {/* Sticky blurred navigation header */}
        <Header />

        {/* Dynamic sliding drawer from right side */}
        <CartDrawer />

        {/* Dynamic authenticating lightbox trigger container */}
        <LoginModal />

        {/* Toast queues container */}
        <ToastContainer />

        {/* PRIMARY MAIN LAYOUT CANVAS ROUTING */}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            {isCheckoutActive ? (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {/* Render secure Checkout gateways directly if active */}
                <CheckoutSection />
              </motion.div>
            ) : (
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {/* Render standard views */}
                <>
                  {activeView === 'home' && (
                    <>
                      <Hero showLeaderboard={true} />
                      <QuickCategories />
                      {/* Let home display Lifesteal storefront by default to feel alive immediately */}
                      <div className="border-t border-white/5 bg-cyber-dark/40 backdrop-blur-md mb-8 pb-4">
                        <StoreFront />
                      </div>
                    </>
                  )}

                  {activeView === 'lifesteal' && (
                    <>
                      <Hero showLeaderboard={false} />
                      <div className="bg-cyber-dark/40 backdrop-blur-md pb-8">
                        <StoreFront />
                      </div>
                    </>
                  )}

                  {activeView === 'survival' && (
                    <>
                      <Hero showLeaderboard={false} />
                      <div className="bg-cyber-dark/40 backdrop-blur-md pb-8">
                        <StoreFront />
                      </div>
                    </>
                  )}

                  {activeView === 'support' && (
                    <div className="pt-6">
                      <SupportCenter />
                    </div>
                  )}

                  {activeView === 'admin' && (
                    <div className="pt-6">
                      <AdminPanel />
                    </div>
                  )}
                </>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Global footer metadata */}
        <Footer />
        
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
