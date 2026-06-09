/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActiveView, ProductTab, Product, CartItem, UserProfile, Coupon, PurchaseHistory } from '../types';

interface StoreToast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  activeLifestealTab: ProductTab;
  setActiveLifestealTab: (tab: ProductTab) => void;
  activeSurvivalTab: ProductTab;
  setActiveSurvivalTab: (tab: ProductTab) => void;
  mcUser: UserProfile | null;
  login: (username: string) => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  couponCode: string | null;
  couponDiscount: number; // Percentage discount (e.g. 15 = 15%)
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  toasts: StoreToast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  checkoutStep: 'cart' | 'checkout' | 'upi_payment' | 'upi_verification' | 'success';
  setCheckoutStep: (step: 'cart' | 'checkout' | 'upi_payment' | 'upi_verification' | 'success') => void;
  cartSubtotal: number;
  cartDiscountAmount: number;
  cartTotal: number;

  // Admin capabilities
  coupons: Coupon[];
  createCoupon: (code: string, discountPercentage: number) => void;
  deleteCoupon: (code: string) => void;
  purchaseHistory: PurchaseHistory[];
  addPurchase: (purchase: Omit<PurchaseHistory, 'id' | 'date'>) => void;
  updatePurchaseStatus: (id: string, status: 'pending' | 'approved' | 'rejected', reason?: string) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Leaderboard Admin Controls
  hiddenPlayers: string[];
  hidePlayer: (username: string) => void;
  unhidePlayer: (username: string) => void;
  customBadges: Record<string, string>;
  setCustomBadge: (username: string, badge: string) => void;
  featuredPlayer: string | null;
  setFeaturedPlayerAdmin: (username: string | null) => void;
  leaderboardResetDate: string | null;
  resetLeaderboard: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Navigation & Tabs
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [activeLifestealTab, setActiveLifestealTab] = useState<ProductTab>('ranks');
  const [activeSurvivalTab, setActiveSurvivalTab] = useState<ProductTab>('ranks');

  // Minecraft Login States
  const [mcUser, setMcUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('stockmc_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Shopping Cart States
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('stockmc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'upi_payment' | 'upi_verification' | 'success'>('cart');

  // Coupon promo state
  const [couponCode, setCouponCode] = useState<string | null>(() => {
    return localStorage.getItem('stockmc_coupon_code') || null;
  });
  const [couponDiscount, setCouponDiscount] = useState<number>(() => {
    const saved = localStorage.getItem('stockmc_coupon_discount');
    return saved ? Number(saved) : 0;
  });

  // Custom Toast state
  const [toasts, setToasts] = useState<StoreToast[]>([]);

  // Admin states
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('stockmc_coupons');
    return saved ? JSON.parse(saved) : [
      { code: 'MINEPARTY', discountPercentage: 15, active: true },
      { code: 'STEVE', discountPercentage: 10, active: true },
      { code: 'WARRIOR', discountPercentage: 20, active: true },
      { code: 'STOCK25', discountPercentage: 25, active: true }
    ];
  });

  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>(() => {
    const saved = localStorage.getItem('stockmc_purchase_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Fetch from server on admin login
  useEffect(() => {
    const fetchPayments = async () => {
      if (isAdminAuthenticated) {
        try {
          const res = await fetch('/api/payments?pwd=minetrex0012030');
          const data = await res.json();
          if (data.payments) {
            setPurchaseHistory(data.payments);
          }
        } catch (e) {
          console.error("Failed to fetch server payments", e);
        }
      }
    };
    fetchPayments();
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem('stockmc_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('stockmc_purchase_history', JSON.stringify(purchaseHistory));
  }, [purchaseHistory]);

  // Synchronize localStorage
  useEffect(() => {
    if (mcUser) {
      localStorage.setItem('stockmc_user', JSON.stringify(mcUser));
    } else {
      localStorage.removeItem('stockmc_user');
    }
  }, [mcUser]);

  useEffect(() => {
    localStorage.setItem('stockmc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (couponCode) {
      localStorage.setItem('stockmc_coupon_code', couponCode);
      localStorage.setItem('stockmc_coupon_discount', String(couponDiscount));
    } else {
      localStorage.removeItem('stockmc_coupon_code');
      localStorage.removeItem('stockmc_coupon_discount');
    }
  }, [couponCode, couponDiscount]);

  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Login handler
  const login = (username: string) => {
    const cleanUsername = username.trim();
    if (!cleanUsername) {
      addToast('Please enter a valid username.', 'error');
      return;
    }
    // Minotar or MC-Heads is dynamic, secure, and renders the user's actual 3D avatar helmet overlay!
    const avatarUrl = `https://mc-heads.net/avatar/${cleanUsername}/128`;
    const profile: UserProfile = {
      username: cleanUsername,
      avatarUrl,
      loggedInAt: new Date().toISOString(),
    };
    setMcUser(profile);
    setIsLoginModalOpen(false);
    addToast(`Successfully authenticated as ${cleanUsername}!`, 'success');
  };

  const logout = () => {
    const username = mcUser?.username || 'player';
    setMcUser(null);
    addToast(`Logged out from ${username}.`, 'info');
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        addToast(`Updated quantity of ${product.name} in your cart.`, 'success');
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      addToast(`Added ${product.name} to your cart!`, 'success');
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    if (item) {
      addToast(`Removed ${item.product.name} from cart.`, 'info');
    }
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode(null);
    setCouponDiscount(0);
    setCheckoutStep('cart');
  };

  // Coupon validation
  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    
    const coupon = coupons.find(c => c.code === cleanCode && c.active);

    if (coupon) {
      setCouponCode(cleanCode);
      setCouponDiscount(coupon.discountPercentage);
      addToast(`Coupon "${cleanCode}" successfully applied! Unlocked ${coupon.discountPercentage}% discount.`, 'success');
      return true;
    } else {
      addToast('Invalid voucher or coupon code.', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    if (couponCode) {
      addToast(`Promo code ${couponCode} removed.`, 'info');
    }
    setCouponCode(null);
    setCouponDiscount(0);
  };

  // Calculator properties
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartDiscountAmount = Math.round((cartSubtotal * couponDiscount) / 100);
  const cartTotal = Math.max(0, cartSubtotal - cartDiscountAmount);

  const loginAdmin = (password: string): boolean => {
    // Basic hardcoded password for client-side demo
    if (password === 'minetrex0012030') {
      setIsAdminAuthenticated(true);
      addToast('Admin login successful!', 'success');
      return true;
    }
    addToast('Invalid admin password.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    addToast('Admin logged out.', 'info');
  };
  
  // Admin Methods
  const createCoupon = (code: string, discountPercentage: number) => {
    const cleanCode = code.trim().toUpperCase();
    if (coupons.some(c => c.code === cleanCode)) {
      addToast('Coupon code already exists.', 'error');
      return;
    }
    setCoupons(prev => [...prev, { code: cleanCode, discountPercentage, active: true }]);
    addToast(`Coupon ${cleanCode} created successfully!`, 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    addToast(`Coupon ${code} deleted.`, 'info');
  };

  const addPurchase = (purchase: Omit<PurchaseHistory, 'id' | 'date'>) => {
    const id = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const date = new Date().toISOString();
    const newPurchase: PurchaseHistory = { ...purchase, id, date };
    setPurchaseHistory(prev => [newPurchase, ...prev]);
  };

  const updatePurchaseStatus = async (id: string, status: 'pending' | 'approved' | 'rejected', reason?: string) => {
    // Optimistic local update
    setPurchaseHistory(prev => prev.map(p => p.id === id ? { ...p, status, rejectionReason: reason } : p));
    
    // Server API call
    try {
      const endpoint = status === 'approved' ? '/api/payments/approve' : '/api/payments/reject';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: id,
          password: 'minetrex0012030', // From existing admin context logic
          reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status on server');
      }
      addToast(`Purchase ${id} status securely updated to ${status}.`, 'success');
    } catch (e) {
      console.error(e);
      addToast(`API update failed, local state updated only.`, 'info');
    }
  };

  // Leaderboard Admin Controls
  const [hiddenPlayers, setHiddenPlayers] = useState<string[]>(() => {
    const saved = localStorage.getItem('stockmc_hidden_players');
    return saved ? JSON.parse(saved) : [];
  });

  const [customBadges, setCustomBadges] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('stockmc_custom_badges');
    return saved ? JSON.parse(saved) : {};
  });

  const [featuredPlayer, setFeaturedPlayer] = useState<string | null>(() => {
    return localStorage.getItem('stockmc_featured_player') || null;
  });

  const [leaderboardResetDate, setLeaderboardResetDate] = useState<string | null>(() => {
    return localStorage.getItem('stockmc_leaderboard_reset');
  });

  useEffect(() => {
    localStorage.setItem('stockmc_hidden_players', JSON.stringify(hiddenPlayers));
  }, [hiddenPlayers]);

  useEffect(() => {
    localStorage.setItem('stockmc_custom_badges', JSON.stringify(customBadges));
  }, [customBadges]);

  useEffect(() => {
    if (featuredPlayer) {
      localStorage.setItem('stockmc_featured_player', featuredPlayer);
    } else {
      localStorage.removeItem('stockmc_featured_player');
    }
  }, [featuredPlayer]);

  useEffect(() => {
    if (leaderboardResetDate) {
      localStorage.setItem('stockmc_leaderboard_reset', leaderboardResetDate);
    } else {
      localStorage.removeItem('stockmc_leaderboard_reset');
    }
  }, [leaderboardResetDate]);

  const hidePlayer = (username: string) => {
    setHiddenPlayers(prev => [...prev, username]);
  };

  const unhidePlayer = (username: string) => {
    setHiddenPlayers(prev => prev.filter(p => p !== username));
  };

  const setCustomBadge = (username: string, badge: string) => {
    setCustomBadges(prev => ({ ...prev, [username]: badge }));
  };

  const setFeaturedPlayerAdmin = (username: string | null) => {
    setFeaturedPlayer(username);
  };

  const resetLeaderboard = () => {
    setLeaderboardResetDate(new Date().toISOString());
  };

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        activeLifestealTab,
        setActiveLifestealTab,
        activeSurvivalTab,
        setActiveSurvivalTab,
        mcUser,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        couponCode,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        toasts,
        addToast,
        removeToast,
        checkoutStep,
        setCheckoutStep,
        cartSubtotal,
        cartDiscountAmount,
        cartTotal,
        coupons,
        createCoupon,
        deleteCoupon,
        purchaseHistory,
        addPurchase,
        updatePurchaseStatus,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        hiddenPlayers,
        hidePlayer,
        unhidePlayer,
        customBadges,
        setCustomBadge,
        featuredPlayer,
        setFeaturedPlayerAdmin,
        leaderboardResetDate,
        resetLeaderboard,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
