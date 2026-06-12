/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import ProductIcon from './ProductIcon';
import { ShieldCheck, ArrowLeft, ArrowRight, Sparkles, Server, Copy, CheckCircle, Upload, Image as ImageIcon, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export default function CheckoutSection() {
  const {
    cart,
    mcUser,
    couponCode,
    cartSubtotal,
    cartDiscountAmount,
    cartTotal,
    checkoutStep,
    setCheckoutStep,
    clearCart,
    addToast,
    setIsCartOpen,
    addPurchase,
  } = useStore();

  const [isPaying, setIsPaying] = useState(false);
  const [successTxnId, setSuccessTxnId] = useState('');

  const [email, setEmail] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmittingUpi, setIsSubmittingUpi] = useState(false);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !utrNumber || !screenshotPreview) {
      addToast('Please complete all fields and upload payment screenshot.', 'error');
      return;
    }

    setIsSubmittingUpi(true);
    
    try {
      const response = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: mcUser?.username || 'Unknown',
          email,
          utrNumber,
          amount: cartTotal,
          items: cart.map(i => `${i.quantity}x ${i.product.name}`),
          screenshotBase64: screenshotPreview
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to submit payment proof');

      // Still call local addPurchase to update store slightly, though we should probably fetch it.
      addPurchase({
        username: mcUser?.username || 'Unknown',
        email,
        utrNumber,
        amount: cartTotal,
        status: 'pending',
        items: cart.map(i => `${i.quantity}x ${i.product.name}`)
      });
      
      setCheckoutStep('upi_verification');
      addToast('Payment proof submitted securely!', 'success');
      
      // Trigger confetti celebration
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#6EE7B7', '#8B5CF6', '#F59E0B'],
      });
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Error occurred during payment submission', 'error');
    } finally {
      setIsSubmittingUpi(false);
    }
  };

  const handlePayment = () => {
    setCheckoutStep('upi_payment');
  };

  const handleUpiPaymentCompleted = () => {
    // Instead of directly showing verification, might do something later, but for now we go to verification logic
    // Actually the user needs to upload screenshot in this step. So this will just trigger form submission.
    // Wait, let's put the form in upi_payment step.
  }

  const handleCancel = () => {
    setCheckoutStep('cart');
    setIsCartOpen(true);
  };

  const handleFinish = () => {
    clearCart();
    setCheckoutStep('cart');
  };

  if (checkoutStep === 'cart') return null;

  if (!mcUser) {
    // Failsafe in case user somehow entered checkout without logging in
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-display font-bold text-white">Authentication Required</h2>
        <p className="text-gray-400">Please login to continue checkout.</p>
        <button onClick={handleCancel} className="bg-accent-purple px-4 py-2 rounded-xl text-white font-bold">Return to Cart</button>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        
        {/* STEP CHECKOUT GATEWAY */}
        {checkoutStep === 'checkout' && (
          <motion.div
            key="checkout-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid md:grid-cols-5 gap-8 items-start"
            id="checkout-gateway-panel"
          >
            {/* LEFT DETAILS COLUMN */}
            <div className="md:col-span-3 rounded-2xl bg-cyber-card border border-white/5 p-6 space-y-6">
              
              {/* Header checkout */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-xl font-display font-black text-white flex items-center gap-2">
                  <ShieldCheck size={20} className="text-accent-purple" />
                  <span>Secure Checkout</span>
                </h3>
                <button
                  id="checkout-back-btn"
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-all cursor-pointer font-mono font-medium"
                >
                  <ArrowLeft size={12} />
                  <span>Back To Cart</span>
                </button>
              </div>

              {/* Minecraft username profile summary card */}
              <div className="bg-cyber-dark/50 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="relative">
                  <img
                    src={mcUser?.avatarUrl || 'https://mc-heads.net/avatar/Steve/64'}
                    alt="Player Skin"
                    className="w-12 h-12 object-contain bg-white/5 border border-white/10 rounded-lg p-1"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-cyber-card rounded-full" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-accent-purple uppercase font-bold block mb-0.5">Destined Player Account</span>
                  <h4 className="font-mono text-sm font-bold text-white leading-none mb-1">{mcUser?.username}</h4>
                  <p className="text-[10px] text-gray-400">All purchased items will lock and auto-deliver to this unique profile.</p>
                </div>
              </div>

              {/* Order summary listing panel */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider">Order Summary Details</h4>
                
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 text-xs text-gray-300 font-medium"
                    >
                      <div className="flex items-center gap-3">
                        <ProductIcon type={item.product.iconType} size="sm" glow={false} />
                        <div>
                          <span className="text-white font-display font-semibold block">{item.product.name}</span>
                          <span className="text-gray-500 font-mono text-[10px]">{item.quantity}x @ ₹{item.product.price}</span>
                        </div>
                      </div>
                      <span className="font-mono text-white text-sm font-bold">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT SUMMARY BILLS BAR */}
            <div className="md:col-span-2 rounded-2xl bg-cyber-card border border-accent-purple/20 p-6 space-y-6">
              
              <h4 className="text-xs font-mono text-accent-purple font-bold uppercase tracking-widest">Pricing Ledger</h4>
              
              <div className="space-y-3.5 border-b border-white/5 pb-5 text-sm font-medium">
                <div className="flex justify-between text-gray-400">
                  <span>Cart Subtotal:</span>
                  <span className="font-mono text-white">₹{cartSubtotal}</span>
                </div>

                {couponCode && (
                  <div className="flex justify-between text-accent-purple">
                    <span>Discount applied ({couponCode}):</span>
                    <span className="font-mono">- ₹{cartDiscountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-white">
                  <span>Merchant Processing:</span>
                  <span className="font-mono text-emerald-400 uppercase text-xs font-bold">FREE</span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/5">
                  <span className="font-display">Total Price:</span>
                  <span className="font-mono text-accent-purple text-lg">₹{cartTotal}</span>
                </div>
              </div>

              {/* SECURE CHECKOUT SUMMARY CTA */}
              <button
                id="checkout-payment-btn"
                onClick={handlePayment}
                disabled={isPaying}
                className="w-full flex items-center justify-center gap-2 bg-accent-purple hover:bg-violet-600 disabled:opacity-50 text-white font-display font-semibold rounded-xl py-3.5 px-5 shadow-lg shadow-accent-purple/20 transition-all cursor-pointer uppercase tracking-wider text-xs sm:text-sm"
              >
                <span>{isPaying ? 'Verifying payment ledger...' : 'Continue Payment'}</span>
                {!isPaying && <ArrowRight size={15} />}
              </button>

              <div className="text-center font-mono text-[9px] text-gray-500 max-w-[200px] mx-auto leading-relaxed">
                Protected by StockMC Secure Socket token shields. All transacting funds are legally clear.
              </div>

            </div>
          </motion.div>
        )}

        {/* STEP UPI PAYMENT */}
        {checkoutStep === 'upi_payment' && (
          <motion.div
            key="upi-payment-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid md:grid-cols-2 gap-8 items-start max-w-5xl mx-auto"
            id="upi-payment-panel"
          >
            {/* LEFT QR DETAILS */}
            <div className="rounded-2xl bg-cyber-card/80 backdrop-blur-xl border border-accent-purple p-6 sm:p-8 space-y-6 text-center transform transition-all shadow-[0_0_30px_rgba(139,92,246,0.15)] relative overflow-hidden">
              <div className="absolute -top-24 -left-24 bg-accent-purple/20 blur-[100px] w-56 h-56 rounded-full pointer-events-none" />
              
              <h3 className="text-xl font-display font-black text-white flex justify-center items-center gap-2">
                <QrCode size={24} className="text-accent-purple" />
                <span>Scan to Pay</span>
              </h3>
              
              <div className="bg-white/10 p-4 rounded-xl inline-block border border-white/20 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <img src="/payment-qr.png" alt="Payment QR Code" className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg" />
              </div>
              
              <div className="space-y-2">
                <div className="text-gray-400 font-mono text-sm uppercase tracking-wider font-bold">UPI ID:</div>
                <div className="text-white font-mono text-lg sm:text-xl font-bold bg-white/5 border border-white/10 p-3 rounded-xl tracking-tight select-all">
                  9316983108@fam
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-gray-400 font-mono text-xs uppercase tracking-wider font-bold">Amount to Pay:</div>
                <div className="text-accent-purple font-display text-3xl font-black">
                  ₹{cartTotal}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('9316983108@fam');
                    addToast('UPI ID copied to clipboard!', 'info');
                  }}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-white font-display font-semibold transition-all text-xs"
                >
                  <Copy size={14} />
                  <span>Copy UPI ID</span>
                </button>
                <a
                  href={`upi://pay?pa=9316983108@fam&pn=StockMC&am=${cartTotal}&cu=INR`}
                  className="flex items-center justify-center gap-2 bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/50 rounded-xl py-3 px-4 text-accent-purple font-display font-semibold transition-all text-xs"
                >
                  <Sparkles size={14} />
                  <span>Open App</span>
                </a>
              </div>
              
              <div className="max-w-xs mx-auto text-center font-mono text-[10px] text-gray-500 leading-relaxed mt-4">
                 Scan the QR Code from PhonePe, GPay, Paytm, or any UPI app to transfer funds securely.
              </div>
            </div>

            {/* RIGHT PROOF UPLOAD FORM */}
            <div className="rounded-2xl bg-cyber-card/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 space-y-6">
               <h3 className="text-xl font-display font-black text-white flex items-center gap-2 border-b border-white/5 pb-4">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  <span>Submit Payment Proof</span>
               </h3>

               <form onSubmit={handleUpiSubmit} className="space-y-4">
                 
                 <div>
                   <label className="block text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider mb-1.5">Minecraft Username</label>
                   <input 
                     type="text" 
                     value={mcUser?.username || ''}
                     readOnly
                     className="w-full bg-cyber-dark/50 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-400 font-mono text-sm focus:outline-none cursor-not-allowed"
                   />
                 </div>

                 <div>
                   <label className="block text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider mb-1.5">Email Address</label>
                   <input 
                     type="email" 
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="player@example.com"
                     className="w-full bg-cyber-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-accent-purple transition-colors placeholder:text-gray-600"
                   />
                 </div>

                 <div>
                   <label className="block text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider mb-1.5">UTR / Transaction ID</label>
                   <input 
                     type="text" 
                     required
                     value={utrNumber}
                     onChange={(e) => setUtrNumber(e.target.value)}
                     placeholder="e.g. 312560918274"
                     className="w-full bg-cyber-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-accent-purple transition-colors placeholder:text-gray-600"
                   />
                   <p className="text-[10px] text-gray-500 mt-1">12-digit reference number found in your UPI app's transaction history.</p>
                 </div>

                 <div>
                   <label className="block text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider mb-1.5">Payment Screenshot</label>
                   <div className="relative group cursor-pointer border-2 border-dashed border-white/10 rounded-xl hover:border-accent-purple/50 bg-cyber-dark/30 transition-colors">
                     <input
                       type="file"
                       accept="image/*"
                       required
                       onChange={handleScreenshotUpload}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                     />
                     <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                       {screenshotPreview ? (
                         <div className="text-emerald-400 flex flex-col items-center">
                           <ImageIcon size={24} className="mb-2" />
                           <span className="font-mono text-xs font-bold">Screenshot Attached</span>
                           <img src={screenshotPreview} alt="Preview" className="w-16 h-16 object-cover rounded mt-2 border border-emerald-500/30" />
                         </div>
                       ) : (
                         <div className="text-gray-400 flex flex-col items-center group-hover:text-accent-purple transition-colors">
                           <Upload size={24} className="mb-2" />
                           <span className="font-sans text-sm font-medium">Click or drag image to upload</span>
                           <span className="font-mono text-[10px] mt-1">PNG, JPG, JPEG</span>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>

                 <div>
                   <label className="block text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider mb-1.5">Order Value</label>
                   <div className="w-full bg-cyber-dark/50 border border-white/10 rounded-xl px-4 py-3 flex justify-between items-center text-sm">
                     <span className="text-gray-300 font-sans">Total payable amount:</span>
                     <span className="text-accent-purple font-mono font-bold tracking-wider">₹{cartTotal}</span>
                   </div>
                 </div>

                 <button
                    type="submit"
                    disabled={isSubmittingUpi}
                    className="w-full flex items-center justify-center gap-2 mt-2 bg-accent-purple hover:bg-violet-600 disabled:opacity-50 text-white font-display font-semibold rounded-xl py-3.5 px-5 shadow-lg shadow-accent-purple/20 transition-all cursor-pointer tracking-wider text-sm"
                  >
                    <span>{isSubmittingUpi ? 'Uploading Proof...' : "I've Completed Payment"}</span>
                    {!isSubmittingUpi && <ArrowRight size={15} />}
                  </button>

               </form>

            </div>
          </motion.div>
        )}

        {/* STEP UPI VERIFICATION PENDING */}
        {checkoutStep === 'upi_verification' && (
          <motion.div
            key="upi-verification-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto rounded-2xl bg-cyber-card/80 backdrop-blur-xl border border-yellow-500/30 p-6 sm:p-10 text-center relative overflow-hidden"
            id="upi-verification-section"
          >
            <div className="absolute -top-24 -left-24 bg-yellow-500/10 blur-[100px] w-56 h-56 rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              <div className="flex justify-center flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 mb-4 animate-pulse">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">
                  <span className="text-yellow-400">🟡</span> Payment Pending Verification
                </h2>
                <p className="text-sm text-gray-300 max-w-sm mt-4 leading-relaxed font-sans">
                  Thank you for purchasing from StockMC. Your payment proof has been received and will be reviewed by staff.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-cyber-dark/60 border border-white/5 space-y-4 font-mono text-xs text-left max-w-md mx-auto">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase">Status Check:</span>
                  <span className="text-yellow-400 font-bold uppercase bg-yellow-400/10 px-2 py-1 rounded">MANUAL REVIEW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase">Minecraft Destination:</span>
                  <span className="text-white font-medium bg-white/5 px-2 py-1 rounded">{mcUser?.username}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1 text-sm font-bold">
                  <span className="text-gray-400 uppercase">Order Value:</span>
                  <span className="text-accent-purple font-mono">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-gray-400 uppercase">Paid By:</span>
                  <span className="text-white font-mono break-all pl-4 text-right">{email}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                Verification usually takes 5-15 minutes. Once approved, your ranks, keys, or items will be automatically dispatched to <span className="text-gray-300 font-mono">play.stockmc.fun</span>.
              </div>

              <button
                id="finish-checkout-btn"
                onClick={handleFinish}
                className="w-full max-w-xs flex items-center justify-center gap-2 mx-auto bg-white/10 hover:bg-white/20 border border-white/10 text-white font-display font-semibold rounded-xl py-3 px-6 transition-all cursor-pointer text-xs uppercase shadow-lg duration-300"
              >
                <span>Return to Store</span>
                <ArrowRight size={13} />
              </button>

            </div>
          </motion.div>
        )}

        {/* STEP PAYMENT SUCCESS SCREEN */}
        {checkoutStep === 'success' && (
          <motion.div
            key="success-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto rounded-2xl bg-cyber-card border border-emerald-500/20 p-6 sm:p-10 text-center relative overflow-hidden"
            id="payment-success-section"
          >
            {/* Success glows visual background */}
            <div className="absolute -top-24 -left-24 bg-emerald-500/10 blur-[100px] w-56 h-56 rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              {/* Massive confirmation check banner */}
              <div className="flex justify-center flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl sm:text-4xl font-display font-black text-white leading-tight">
                  Congratulations, <span className="text-emerald-400 font-mono tracking-tight font-bold">{mcUser?.username}</span>!
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 max-w-sm mt-2">
                  Your payment has cleared successfully! All configurations are deployed on our servers.
                </p>
              </div>

              {/* Transaction details card panel */}
              <div className="p-4 rounded-xl bg-cyber-dark/60 border border-white/5 space-y-3 font-mono text-xs text-left max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase">Transaction Hash:</span>
                  <span className="text-white font-medium">{successTxnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase">Minecraft Destination:</span>
                  <span className="text-white font-medium">{mcUser?.username}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-gray-500 font-bold uppercase">Status Check:</span>
                  <span className="text-emerald-400 font-bold uppercase">DISPATCHED / INSTANT</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-1">
                  <span className="text-gray-400 uppercase">Paid Amount:</span>
                  <span className="text-accent-purple font-mono">₹{cartTotal}</span>
                </div>
              </div>

              {/* Claim instructions block */}
              <div className="max-w-md mx-auto rounded-xl border border-white/5 bg-cyber-card/40 p-4 space-y-2 text-left">
                <h4 className="text-[10px] font-mono text-accent-purple uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Server size={10} className="text-accent-purple" />
                  <span>How To Claim Your Items:</span>
                </h4>
                <ol className="space-y-1.5 list-decimal list-inside text-[11px] text-gray-300">
                  <li>Launch Minecraft and connect to <code className="text-accent-purple font-mono font-bold bg-white/5 px-1 rounded">play.stockmc.fun</code>.</li>
                  <li>Remain active in-game for 2 to 5 minutes.</li>
                  <li>Run the command <code className="text-emerald-400 font-mono font-bold bg-white/5 px-1 rounded">/claim</code> inside the server lobby to redeem!</li>
                </ol>
              </div>

              {/* Finish payment session button */}
              <button
                id="finish-checkout-btn"
                onClick={handleFinish}
                className="w-full max-w-xs flex items-center justify-center gap-2 mx-auto bg-emerald-500 hover:bg-emerald-600 text-white font-display font-semibold rounded-xl py-3 px-6 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all cursor-pointer text-xs uppercase"
              >
                <span>Acknowledge &amp; Return</span>
                <Sparkles size={13} />
              </button>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
