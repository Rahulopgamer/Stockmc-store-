import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Trophy, Crown, Flame, Star, Hexagon } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

interface LeaderboardEntry {
  username: string;
  total: number;
}

export default function Leaderboard() {
  const { hiddenPlayers, customBadges, featuredPlayer, leaderboardResetDate } = useStore();
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, "payments"), where("status", "==", "approved")));
        const playerTotals: Record<string, number> = {};
        
        snapshot.docs.forEach(docSnap => {
          const d = docSnap.data();
          if (d.username && d.amount) {
            playerTotals[d.username] = (playerTotals[d.username] || 0) + Number(d.amount);
          }
        });
        
        const sortedPlayers = Object.entries(playerTotals)
          .map(([username, total]) => ({ username, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 10);
        
        setGlobalLeaderboard(sortedPlayers);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const topPlayers = useMemo(() => {
    // We already have aggregated totals from the server
    // We just need to apply local filters
    const validPlayers = globalLeaderboard.filter(p => !hiddenPlayers.includes(p.username));
    return validPlayers.slice(0, 10);
  }, [globalLeaderboard, hiddenPlayers]);

  if (isLoading || topPlayers.length === 0) return null;

  return (
    <div className="py-4 w-full relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent-purple/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="text-center space-y-3 mb-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-accent-purple mb-4"
        >
          <Trophy size={16} />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">Top Supporters</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 15 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white"
        >
          Leaderboard
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.2 }}
          className="text-gray-400 font-sans max-w-2xl mx-auto"
        >
          Players who have contributed the most to StockMC.
        </motion.p>
      </div>

      <div className="grid gap-4 relative z-10">
        {topPlayers.map((player, index) => {
          const rank = index + 1;
          const isFeatured = player.username === featuredPlayer;
          const customBadge = customBadges[player.username];

          // Determine styles based on rank
          let rankColor = 'text-accent-purple';
          let borderGlow = 'border-white/10 hover:border-accent-purple/50 bg-cyber-dark/40';
          let RankIcon = Hexagon;
          let rankLabel = 'Supporter';

          if (rank === 1) {
            rankColor = 'text-yellow-400';
            borderGlow = 'border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.2)] bg-yellow-400/5';
            RankIcon = Crown;
            rankLabel = 'Supporter King';
          } else if (rank === 2) {
            rankColor = 'text-gray-300';
            borderGlow = 'border-gray-300/40 shadow-[0_0_15px_rgba(209,213,219,0.1)] bg-white/5';
            RankIcon = Star;
            rankLabel = 'Elite Supporter';
          } else if (rank === 3) {
            rankColor = 'text-amber-600';
            borderGlow = 'border-amber-600/40 shadow-[0_0_15px_rgba(217,119,6,0.1)] bg-amber-600/5';
            RankIcon = Flame;
            rankLabel = 'Legendary Supporter';
          }

          if (isFeatured) {
            borderGlow += ' ring-2 ring-emerald-400/50';
          }

          return (
            <motion.div
              key={player.username}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01, x: 5 }}
              className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl backdrop-blur-md border transition-all duration-300 ${borderGlow}`}
            >
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Rank Number */}
                <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-display font-black text-lg sm:text-xl ${rankColor}`}>
                  #{rank}
                </div>

                {/* Avatar */}
                <div className="relative">
                  <div className={`absolute inset-0 rounded-lg blur-md ${rank === 1 ? 'bg-yellow-400/30' : rank === 2 ? 'bg-gray-300/30' : rank === 3 ? 'bg-amber-600/30' : 'bg-accent-purple/30'}`} />
                  <img
                    src={`https://mc-heads.net/avatar/${player.username}/64`}
                    alt={player.username}
                    className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-black/50 border border-white/10"
                    loading="lazy"
                  />
                  {rank <= 3 && (
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center bg-cyber-dark border ${rank === 1 ? 'border-yellow-400 text-yellow-400' : rank === 2 ? 'border-gray-300 text-gray-300' : 'border-amber-600 text-amber-600'}`}>
                      <RankIcon size={12} />
                    </div>
                  )}
                </div>

                {/* Player Details */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-white text-lg sm:text-xl tracking-tight">{player.username}</span>
                    {customBadge && (
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                        {customBadge}
                      </span>
                    )}
                  </div>
                  <div className={`text-xs font-mono uppercase tracking-wider font-bold mt-1 ${rankColor}`}>
                    {rankLabel}
                  </div>
                </div>
              </div>

              {/* Amount Spent */}
              <div className="text-right pl-4">
                <div className="font-display font-black text-xl sm:text-2xl text-white">
                  ₹{player.total}
                </div>
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-1">
                  Total Contributed
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
