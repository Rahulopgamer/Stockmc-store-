/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Sword, Key, Coins, Tag, Archive, Gem } from 'lucide-react';

interface ProductIconProps {
  type: 'shield' | 'sword' | 'key' | 'coins' | 'tag' | 'chest' | 'gem';
  glow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProductIcon({ type, glow = true, size = 'md' }: ProductIconProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 20,
    md: 32,
    lg: 48
  };

  const getIcon = () => {
    switch (type) {
      case 'shield':
        return <Shield size={iconSizes[size]} className="text-violet-400 group-hover:scale-110 transition-transform duration-300" />;
      case 'sword':
        return <Sword size={iconSizes[size]} className="text-purple-400 group-hover:scale-110 transition-transform duration-300" />;
      case 'key':
        return <Key size={iconSizes[size]} className="text-amber-400 group-hover:rotate-12 transition-transform duration-300" />;
      case 'coins':
        return <Coins size={iconSizes[size]} className="text-yellow-400 group-hover:bounce transition-all duration-300" />;
      case 'tag':
        return <Tag size={iconSizes[size]} className="text-emerald-400 group-hover:-translate-y-1 transition-transform duration-300" />;
      case 'chest':
        return <Archive size={iconSizes[size]} className="text-indigo-400 group-hover:scale-105 transition-transform duration-300" />;
      case 'gem':
        default:
        return <Gem size={iconSizes[size]} className="text-fuchsia-400 transition-transform duration-300" />;
    }
  };

  const getBackgroundGradient = () => {
    switch (type) {
      case 'shield':
        return 'from-purple-900/40 to-violet-800/20 border-purple-500/30';
      case 'sword':
        return 'from-fuchsia-900/40 to-pink-800/20 border-fuchsia-500/30';
      case 'key':
        return 'from-amber-950/40 to-yellow-800/10 border-amber-500/30';
      case 'coins':
        return 'from-yellow-950/40 to-amber-900/10 border-yellow-500/30';
      case 'tag':
        return 'from-emerald-950/40 to-teal-900/10 border-emerald-500/30';
      case 'chest':
        return 'from-indigo-900/40 to-blue-800/20 border-indigo-500/30';
      default:
        return 'from-purple-950/40 to-violet-900/10 border-purple-500/30';
    }
  };

  return (
    <div className="relative group">
      {/* Background glow overlay */}
      {glow && (
        <div className="absolute inset-0 bg-accent-purple/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
      )}
      
      <div className={`flex items-center justify-center rounded-2xl border bg-gradient-to-b ${getBackgroundGradient()} ${sizeClasses[size]} transition-all duration-300 shadow-md`}>
        {getIcon()}
      </div>
    </div>
  );
}
