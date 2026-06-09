import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Terminal, Settings } from 'lucide-react';
import { Product } from '../types';
import ProductIcon from './ProductIcon';

interface RankDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function RankDetailsModal({ isOpen, onClose, product }: RankDetailsModalProps) {
  if (!product) return null;

  // Generate generic commands if not present
  const commands = product.commands || [
    '/fly - Toggle flight mode in Hub',
    '/feed - Fill your hunger bar',
    '/heal - Restore your health',
    '/kit ' + product.name.toLowerCase() + ' - Claim your weekly kit',
    '/enderchest - Open your portable ender chest',
    '/workbench - Open portable crafting table'
  ];

  // Generate generic permissions if not present
  const permissions = product.permissions || [
    'stockmc.rank.' + product.name.toLowerCase(),
    'essentials.kits.' + product.name.toLowerCase(),
    'essentials.fly',
    'essentials.feed',
    'essentials.heal.cooldown.bypass',
    'playervaults.size.10',
    'chat.color.format'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl bg-cyber-dark border border-accent-purple/20 rounded-2xl p-6 shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow effect */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-purple to-transparent opacity-50"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-stockmc-box border border-white/5">
                  <ProductIcon type={product.iconType} glow={product.isPopular} size="sm" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black text-white tracking-tight">{product.name} Rank</h3>
                  <p className="text-sm font-mono text-accent-purple uppercase tracking-widest">{product.category} Realm</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
              {/* Product description */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-gray-300 text-sm leading-relaxed">{product.desc}</p>
                {product.features && (
                  <ul className="mt-3 space-y-1">
                    {product.features.map((feat, i) => (
                      <li key={i} className="text-xs text-gray-400 font-mono flex items-start gap-2">
                        <span className="text-accent-purple mt-0.5">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Commands section */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-3">
                  <Terminal size={16} className="text-emerald-400" />
                  Included Commands
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {commands.map((cmd, i) => (
                    <div key={i} className="bg-stockmc-box border border-white/5 rounded-lg p-3 group hover:border-emerald-500/30 transition-colors">
                      <code className="text-xs font-mono text-emerald-400 block mb-1">
                        {cmd.split(' - ')[0]}
                      </code>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                        {cmd.split(' - ')[1] || 'Execute command'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions section */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-3">
                  <Settings size={16} className="text-blue-400" />
                  Granted Permissions
                </h4>
                <div className="bg-stockmc-box border border-white/5 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {permissions.map((perm, i) => (
                      <span key={i} className="px-2 py-1 bg-black/40 border border-white/10 rounded text-[10px] font-mono text-gray-300">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
               <div className="flex items-baseline gap-2">
                  <span className="text-xl font-mono font-bold text-white">₹{product.price}</span>
                  {product.originalPrice && <span className="text-sm font-mono text-gray-500 line-through">₹{product.originalPrice}</span>}
               </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-accent-purple hover:bg-accent-purple/90 text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(111,76,255,0.3)] transition-all cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
