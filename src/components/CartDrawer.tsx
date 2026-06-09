/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProductIcon from './ProductIcon';
import { X, Trash2, Plus, Minus, Ticket, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    mcUser,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartDiscountAmount,
    cartTotal,
    setCheckoutStep,
    setIsLoginModalOpen,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    if (!mcUser) return;
    setCheckoutStep('checkout');
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div id="cart-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-cyber-dark/80 backdrop-blur-md"
          />

          {/* Drawer container from right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
            id="cart-drawer-content"
            className="absolute right-0 top-0 h-full w-full max-w-md bg-cyber-dark/80 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col justify-between"
          >
            {/* Ambient glows inside drawer */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-accent-purple/10 blur-3xl rounded-full pointer-events-none" />

            {/* HEADER */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between z-10 relative">
              <div className="flex items-center gap-2.5">
                <span className="text-white font-display font-black text-lg">Your Shopping Cart</span>
                <span className="font-mono text-xs bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-gray-400">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <button
                id="close-cart-btn"
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* LIST AREA */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 z-10 relative">
              {cart.length === 0 ? (
                <div id="empty-cart-view" className="h-full flex flex-col items-center justify-center text-center space-y-3 py-10">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5 text-gray-400 mb-2">
                    <X size={24} />
                  </div>
                  <h4 className="font-display font-bold text-white">Your Cart is Empty</h4>
                  <p className="text-xs text-gray-400 max-w-[240px] leading-relaxed">
                    Browse the explore modules to configure premium server ranks, tags, coins, and lockbox keys!
                  </p>
                  <button
                    id="cart-continue-browsing"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 bg-accent-purple/10 border border-accent-purple/20 text-accent-purple font-mono text-xs font-bold py-2 px-5 rounded-xl hover:bg-accent-purple/20 transition-all cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const p = item.product;
                  const itemSubtotal = p.price * item.quantity;
                  const isLifesteal = p.category === 'lifesteal';

                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3.5 rounded-xl border border-white/5 bg-cyber-dark/40 p-3.5 hover:border-white/10 transition-colors group"
                    >
                      <div className="flex-shrink-0">
                        <ProductIcon type={p.iconType} size="sm" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="font-display text-sm font-black text-white truncate max-w-[170px]">
                              {p.name}
                            </h5>
                            <span className={`text-[9px] font-mono font-bold tracking-widest uppercase ${isLifesteal ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {isLifesteal ? 'Lifesteal Network' : 'Survival Network'}
                            </span>
                          </div>
                          
                          <button
                            id={`remove-cart-item-${p.id}`}
                            onClick={() => removeFromCart(p.id)}
                            className="text-gray-500 hover:text-rose-400 p-1.5 rounded transition-colors cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-3 mt-3.5">
                          {/* Quantity selectors */}
                          <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded-lg px-2 py-0.5">
                            <button
                              id={`cart-qty-minus-${p.id}`}
                              onClick={() => updateQuantity(p.id, item.quantity - 1)}
                              className="text-gray-400 hover:text-white p-0.5 transition-all cursor-pointer"
                            >
                              <Minus size={10} />
                            </button>
                            <span id={`cart-qty-display-${p.id}`} className="font-mono text-xs font-bold text-white px-1">
                              {item.quantity}
                            </span>
                            <button
                              id={`cart-qty-plus-${p.id}`}
                              onClick={() => updateQuantity(p.id, item.quantity + 1)}
                              className="text-gray-400 hover:text-white p-0.5 transition-all cursor-pointer"
                            >
                              <Plus size={10} />
                            </button>
                          </div>

                          {/* Price metrics */}
                          <div className="text-right">
                            <span className="font-mono text-xs font-medium text-gray-400">{item.quantity}x ₹{p.price}</span>
                            <p className="font-mono text-sm font-bold text-white">₹{itemSubtotal}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* LOWER CART ACTIONS & PRICING DETAILS */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-white/5 bg-cyber-dark/60 backdrop-blur z-10 space-y-4">
                
                {/* COUPON REDEEM INPUT FIELD */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <Ticket size={14} />
                    </span>
                    <input
                      id="coupon-input-field"
                      type="text"
                      placeholder="Enter Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full bg-cyber-card/60 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple/50 font-mono tracking-wide uppercase"
                    />
                  </div>
                  <button
                    id="apply-coupon-btn"
                    type="submit"
                    disabled={!couponInput.trim()}
                    className="bg-accent-purple/20 hover:bg-accent-purple border border-accent-purple/30 hover:border-accent-purple hover:text-white text-accent-purple disabled:opacity-50 text-xs font-display font-bold px-4 rounded-xl transition-all cursor-pointer uppercase"
                  >
                    Apply
                  </button>
                </form>

                {/* Sub-Coupons active info badge */}
                {couponCode && (
                  <div className="flex items-center justify-between bg-accent-purple/10 border border-accent-purple/20 rounded-lg p-2 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-accent-purple">
                      <Ticket size={12} />
                      <span className="font-bold">{couponCode}</span>
                      <span className="text-gray-400 font-medium">({couponDiscount}% OFF)</span>
                    </div>
                    <button
                      id="remove-coupon-btn"
                      onClick={removeCoupon}
                      className="text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* SUMMARY DETAILS */}
                <div id="cart-pricing-details" className="space-y-2 border-t border-b border-white/5 py-3 text-xs font-medium">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white">₹{cartSubtotal}</span>
                  </div>
                  
                  {couponCode && (
                    <div className="flex justify-between text-accent-purple">
                      <span>Discount ({couponCode}):</span>
                      <span className="font-mono">- ₹{cartDiscountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-bold text-white pt-1">
                    <span className="font-display">Total Price:</span>
                    <span className="font-mono text-accent-purple text-base">₹{cartTotal}</span>
                  </div>
                </div>

                {/* SECURITY LOGGED IN CHECK */}
                {!mcUser ? (
                  <div id="checkout-warning-box" className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 flex items-start gap-2.5 shadow-sm">
                    <ShieldAlert size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-rose-300 block mb-1">Authentification Required</span>
                      <p className="text-[10px] text-gray-400 font-sans leading-normal">
                        Please login with your Minecraft username before checkout. This ensures the automated delivery of ranks goes to your account!
                      </p>
                      
                      <button
                        id="drawer-login-trigger"
                        onClick={() => setIsLoginModalOpen(true)}
                        className="mt-2.5 inline-flex items-center gap-1 bg-rose-500 hover:bg-rose-600 font-mono text-[9px] font-bold uppercase tracking-wider text-white py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                      >
                        <UserCheck size={11} /> Validate Username
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex items-center justify-between text-xs">
                    <span className="text-gray-400">Delivering items to:</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <img src={mcUser.avatarUrl} className="w-5 h-5 rounded-sm object-contain" referrerPolicy="no-referrer" />
                      <span className="text-white font-bold">{mcUser.username}</span>
                    </div>
                  </div>
                )}

                {/* CHECKOUT EXECUTION TRIGGER BUTTON */}
                <button
                  id="cart-checkout-btn"
                  onClick={handleProceedToCheckout}
                  disabled={!mcUser || cart.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-800 disabled:to-gray-800 disabled:opacity-40 text-white font-display font-semibold rounded-xl py-3.5 px-5 shadow-lg shadow-accent-purple/10 disabled:shadow-none transition-all cursor-pointer uppercase tracking-wider text-xs sm:text-sm"
                >
                  <span>Proceed To Checkout</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
