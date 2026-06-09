/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../context/StoreContext';
import { Swords, Shield, ChevronRight, Heart, Flame, Landmark, Trees } from 'lucide-react';
import { motion } from 'motion/react';

export default function QuickCategories() {
  const { setActiveView } = useStore();

  const categories = [
    {
      id: 'lifesteal',
      title: 'Lifesteal Network',
      subtitle: 'Hearts are currency here.',
      description: 'The ultimate PvP battleground. Steal hearts from standard players on kill, forge unbeatable Titanium alliances, and protect your custom core from rivals.',
      badge: 'High Stakes PvP',
      icon: Swords,
      accentColor: 'from-rose-600/20 to-purple-800/10 border-rose-500/20',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      taglineIcon: Heart,
      taglineText: 'Steal & Trade Hearts',
      bgGraphic: (
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-rose-600 blur-2xl" />
          <div className="absolute top-10 right-10 text-rose-500 rotate-12">
            <Heart size={140} strokeWidth={1} />
          </div>
        </div>
      )
    },
    {
      id: 'survival',
      title: 'Survival Network',
      subtitle: 'Create epic realms & trade.',
      description: 'A massive, collaborative SMP. Forge rich empires, build automatic shops, secure claims with bronze locks, and explore deep-seated quest logs recursively.',
      badge: 'Economy & Quests',
      icon: Shield,
      accentColor: 'from-emerald-600/20 to-indigo-800/10 border-emerald-500/20',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      taglineIcon: Landmark,
      taglineText: 'Secure Land Claims',
      bgGraphic: (
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-600 blur-2xl" />
          <div className="absolute top-10 right-10 text-emerald-500 -rotate-12">
            <Landmark size={140} strokeWidth={1} />
          </div>
        </div>
      )
    }
  ] as const;

  const handleExplore = (categoryId: 'lifesteal' | 'survival') => {
    setActiveView(categoryId);
    // Smooth scroll to catalog
    setTimeout(() => {
      document.getElementById('shopfront-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* SECTION HEADER */}
      <div className="text-center md:text-left mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-bold text-accent-purple uppercase tracking-widest block mb-2">Featured Realm Modes</span>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white">Choose Your Network</h2>
        </div>
        <p className="text-sm text-gray-400 max-w-sm font-sans">
          Select which server catalog you would like to explore. Both networks feature unique gameplay architectures.
        </p>
      </div>

      {/* TWO BIG HUGEST CARDS GRID */}
      <div className="grid md:grid-cols-2 gap-6" id="server-realms-selection">
        {categories.map((cat) => {
          const MainIcon = cat.icon;
          const TagIcon = cat.taglineIcon;

          return (
            <motion.div
              key={cat.id}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => handleExplore(cat.id)}
              className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${cat.accentColor} p-6 sm:p-8 cursor-pointer flex flex-col justify-between h-[300px] sm:h-[320px] transition-all group`}
            >
              {/* Overlay elements */}
              {cat.bgGraphic}
              
              <div className="relative z-10">
                {/* Header elements */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-2.5 py-1 text-[10px] font-mono tracking-wider font-bold rounded border uppercase ${cat.badgeColor}`}>
                    {cat.badge}
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-gray-400 bg-black/20 px-2.5 py-1 rounded-full border border-white/5">
                    <TagIcon size={12} className="text-accent-purple" />
                    <span>{cat.taglineText}</span>
                  </div>
                </div>

                {/* Meta details */}
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white mb-2 group-hover:text-accent-purple transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-sans line-clamp-3 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Interaction button footer */}
              <div className="relative z-10 flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-white transition-colors">
                  Explore Catalog
                </span>
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 group-hover:bg-accent-purple group-hover:border-accent-purple group-hover:text-white text-gray-300 transition-all">
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
