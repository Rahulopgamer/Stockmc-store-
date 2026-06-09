/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { products } from '../data/storeProducts';
import { Product, ProductTab } from '../types';
import ProductIcon from './ProductIcon';
import RankDetailsModal from './RankDetailsModal';
import { ShoppingCart, Plus, Minus, ShieldCheck, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StoreFront() {
  const {
    activeView,
    activeLifestealTab,
    setActiveLifestealTab,
    activeSurvivalTab,
    setActiveSurvivalTab,
    addToCart,
    isCartOpen,
    setIsCartOpen,
  } = useStore();

  // Selected quantities for each product item (state key: product.id)
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  // Rank Details modal state
  const [selectedRank, setSelectedRank] = useState<Product | null>(null);
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);

  // Render variables based on active catalog
  const isLifesteal = activeView === 'lifesteal';
  const categoryId = isLifesteal ? 'lifesteal' : 'survival';
  
  const activeTab = isLifesteal ? activeLifestealTab : activeSurvivalTab;
  const setActiveTab = isLifesteal ? setActiveLifestealTab : setActiveSurvivalTab;

  // Tabs layout
  const lifestealTabs: Array<{ id: ProductTab; label: string }> = [
    { id: 'ranks', label: 'Ranks' },
    { id: 'keys', label: 'Keys' },
    { id: 'coins', label: 'Coins' },
    { id: 'tags', label: 'Tags' },
  ];

  const survivalTabs: Array<{ id: ProductTab; label: string }> = [
    { id: 'ranks', label: 'Ranks' },
    { id: 'keys', label: 'Keys' },
    { id: 'coins', label: 'Coins' },
    { id: 'crates', label: 'Crates' },
  ];

  const tabs = isLifesteal ? lifestealTabs : survivalTabs;

  // Filter products by active category and active product tab
  const filteredProducts = products.filter(
    (p) => p.category === categoryId && p.tab === activeTab
  );

  const getQuantity = (productId: string) => quantities[productId] || 1;

  const handleAdjustQuantity = (productId: string, increment: boolean) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = increment ? current + 1 : Math.max(1, current - 1);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (product: Product) => {
    const qty = getQuantity(product.id);
    addToCart(product, qty);
    // Reset product local qty state
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <section id="shopfront-anchor" className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* TABS SELECTOR CONTAINER AREA */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
        
        {/* SHOP MODE INDICATOR TITLE */}
        <div className="text-center md:text-left">
          <span className="font-mono text-xs font-bold text-accent-purple uppercase tracking-widest block mb-1">
            Now Browsing: {isLifesteal ? 'Lifesteal Realm' : 'Survival SMP'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
            {isLifesteal ? 'Lifesteal Network Store' : 'Survival SMP Store'}
          </h2>
        </div>

        {/* CUSTOM SWITCHER TAB BUTTONS */}
        <div id="product-tabs-row" className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-cyber-dark border border-white/5 rounded-xl">
          {tabs.map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  isTabActive
                    ? 'cyber-tab-active text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CATALOG GRID */}
      <div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 border rounded-2xl border-dashed border-white/5 bg-cyber-card/10">
            <p className="text-gray-400 text-sm font-semibold mb-2">No products found in this category.</p>
            <p className="text-xs text-gray-500">Check back later or explore other categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="products-catalog-grid">
            
            {/* INJECT RANKS SPECIAL SIZE GRID IF IN RANKS TAB */}
            {activeTab === 'ranks' ? (
              // Ranks grid wraps seamlessly responsive
              <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {filteredProducts.map((p) => {
                  const itemQty = getQuantity(p.id);
                  const isPopular = p.isPopular;

                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative flex flex-col justify-between rounded-2xl bg-cyber-card border transition-all duration-300 p-5 group overflow-hidden ${
                        isPopular
                          ? 'premium-border-glow bg-gradient-to-tr from-accent-purple/10 to-transparent ring-1 ring-accent-purple/30'
                          : 'border-white/5 hover:border-white/15'
                      }`}
                      id={`rank-card-${p.id}`}
                    >
                      {/* Popular ribbon top/right helper */}
                      {isPopular && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-accent-purple font-mono font-bold text-[9px] text-white tracking-widest uppercase">
                          <Star size={10} fill="currentColor" />
                          <span>Popular</span>
                        </div>
                      )}

                      <div>
                        {/* Rank head info */}
                        <div className="mb-4">
                          <ProductIcon type={p.iconType} glow={isPopular} size="sm" />
                        </div>

                        <div className="mb-4">
                          <h3 className="font-display text-lg font-black text-white group-hover:text-accent-purple transition-colors">
                            {p.name}
                          </h3>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-mono text-lg font-bold text-white">₹{p.price}</span>
                            {p.originalPrice && (
                              <span className="font-mono text-xs text-gray-500 line-through">₹{p.originalPrice}</span>
                            )}
                          </div>
                          {p.desc && <p className="text-xs text-gray-400 mt-2 font-sans leading-relaxed">{p.desc}</p>}
                        </div>

                        {/* Feature lists */}
                        {p.features && (
                          <div className="border-t border-white/5 pt-4 mb-6">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-[10px] font-mono tracking-widest text-accent-purple font-bold uppercase">Unlocks features:</h4>
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedRank(p); setIsRankModalOpen(true); }}
                                className="text-[9px] px-2 py-0.5 rounded border border-accent-purple/30 bg-accent-purple/10 hover:bg-accent-purple/20 transition-colors text-white font-mono uppercase tracking-wider cursor-pointer"
                              >
                                Details ➜
                              </button>
                            </div>
                            <ul className="space-y-2 text-left">
                              {p.features.map((feat, fidx) => (
                                <li key={fidx} className="flex items-start gap-2 text-[11px] text-gray-300 leading-normal">
                                  <span className="mt-0.5 text-accent-purple">✔</span>
                                  <span className="font-medium">{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Rank actions checkout controls */}
                      <div className="mt-auto pt-4 border-t border-white/5">
                        {/* Quantity Counter & Add To Cart button wrapped */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">Configure qty:</span>
                          <div id={`qty-adjuster-${p.id}`} className="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded-lg px-2 py-0.5">
                            <button
                              id={`qty-minus-${p.id}`}
                              onClick={() => handleAdjustQuantity(p.id, false)}
                              className="text-gray-400 hover:text-white p-1 transition-colors cursor-pointer"
                            >
                              <Minus size={11} />
                            </button>
                            <span id={`qty-display-${p.id}`} className="font-mono text-xs font-bold text-white px-1">
                              {itemQty}
                            </span>
                            <button
                              id={`qty-plus-${p.id}`}
                              onClick={() => handleAdjustQuantity(p.id, true)}
                              className="text-gray-400 hover:text-white p-1 transition-colors cursor-pointer"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>

                        <button
                          id={`add-cart-btn-${p.id}`}
                          onClick={() => handleAddToCart(p)}
                          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 font-display font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all duration-300 ${
                            isPopular
                              ? 'bg-accent-purple hover:bg-violet-600 text-white shadow-md shadow-accent-purple/20'
                              : 'bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10'
                          }`}
                        >
                          <ShoppingCart size={13} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // Standard items grids (Keys, Coins, Tags)
              filteredProducts.map((p) => {
                const itemQty = getQuantity(p.id);
                const isTagType = activeTab === 'tags';

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    id={`product-card-${p.id}`}
                    className="rounded-2xl bg-cyber-card border border-white/5 p-5 flex items-center gap-4 transition-all hover:border-white/15 hover:bg-cyber-card/85 group"
                  >
                    <div className="flex-shrink-0">
                      <ProductIcon type={p.iconType} size="sm" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {isTagType ? (
                        /* Tag format styling */
                        <div className="mb-1.5 flex items-center">
                          <code className="text-xs px-2 py-1 font-mono font-bold rounded bg-black/40 border border-emerald-500/30 text-emerald-400 tracking-wider text-minecraft-glow">
                            {p.name}
                          </code>
                        </div>
                      ) : (
                        <h3 className="font-display font-bold text-white truncate group-hover:text-accent-purple transition-colors">
                          {p.name}
                        </h3>
                      )}
                      
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-sm font-bold text-white">₹{p.price}</span>
                        {p.originalPrice && (
                          <span className="font-mono text-[10px] text-gray-500 line-through">₹{p.originalPrice}</span>
                        )}
                      </div>

                      {p.desc && (
                        <p className="text-[10px] text-gray-400 line-clamp-2 mt-1.5 font-sans leading-normal">
                          {p.desc}
                        </p>
                      )}

                      {/* Quantity adjusting and order interaction wrapper */}
                      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-white/5">
                        {/* Qty count adjustment controls */}
                        <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded-lg px-2 py-0.5">
                          <button
                            id={`qty-minus-${p.id}`}
                            onClick={() => handleAdjustQuantity(p.id, false)}
                            className="text-gray-400 hover:text-white p-1 transition-colors cursor-pointer"
                          >
                            <Minus size={10} />
                          </button>
                          <span id={`qty-display-${p.id}`} className="font-mono text-xs font-bold text-white px-1">
                            {itemQty}
                          </span>
                          <button
                            id={`qty-plus-${p.id}`}
                            onClick={() => handleAdjustQuantity(p.id, true)}
                            className="text-gray-400 hover:text-white p-1 transition-colors cursor-pointer"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        {/* Add action */}
                        <button
                          id={`add-cart-btn-${p.id}`}
                          onClick={() => handleAddToCart(p)}
                          className="flex items-center gap-1.5 py-1.8 px-3 rounded-xl bg-white/5 hover:bg-accent-purple hover:text-white border border-white/10 hover:border-accent-purple transition-all cursor-pointer font-mono text-[10px] font-bold uppercase tracking-wider text-gray-300"
                        >
                          <Plus size={12} /> Add
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}

          </div>
        )}
      </div>

      <RankDetailsModal isOpen={isRankModalOpen} onClose={() => setIsRankModalOpen(false)} product={selectedRank} />
    </section>
  );
}
