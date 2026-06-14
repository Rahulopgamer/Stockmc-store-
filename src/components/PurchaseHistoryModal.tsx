import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

interface UserPurchase {
  id: string;
  utrNumber: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  items: string[];
  rejectionReason?: string;
  username?: string;
}

export default function PurchaseHistoryModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { mcUser, addToast } = useStore();
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!mcUser) return;
        const snapshot = await getDocs(query(collection(db, "payments"), where("username", "==", mcUser.username)));
        const paymentsList: UserPurchase[] = snapshot.docs.map(docSnap => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            username: d.username,
            utrNumber: d.utrNumber,
            amount: d.amount,
            status: d.status,
            date: d.date?.toDate ? d.date.toDate().toISOString() : new Date().toISOString(),
            items: d.items,
            rejectionReason: d.rejectionReason
          };
        });
        
        paymentsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPurchases(paymentsList);
        setLoading(false);
      } catch (e) {
        addToast('Network error', 'error');
        setLoading(false);
      }
    };
    
    if (isOpen && mcUser) {
      setLoading(true);
      fetchHistory();
    }
  }, [isOpen, mcUser, addToast]);

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl bg-cyber-card border border-white/10 rounded-2xl p-6 shadow-2xl z-10 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-1 tracking-tight">Purchase History</h3>
                <p className="text-sm font-mono text-gray-400 uppercase tracking-widest">{mcUser?.username}'s Orders</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="py-12 flex justify-center text-accent-purple">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-purple"></div>
                </div>
              ) : purchases.length === 0 ? (
                <div className="py-12 text-center text-gray-400 bg-white/5 rounded-xl border border-white/5">
                  <Search size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="font-mono text-sm">No purchases found for this username.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {purchases.map(p => (
                    <div key={p.id} className="bg-stockmc-box border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between group hover:border-accent-purple/30 transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          {p.status === 'approved' ? (
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                              <CheckCircle size={10} /> Approved
                            </span>
                          ) : p.status === 'rejected' ? (
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase" title={p.rejectionReason}>
                              <XCircle size={10} /> Rejected
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase">
                              <Clock size={10} /> Pending
                            </span>
                          )}
                          <span className="text-xs text-gray-400 font-mono">
                            {new Date(p.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-base text-gray-200 font-medium line-clamp-1 mb-1">
                          {p.items.join(', ')}
                        </p>
                        {p.status === 'rejected' && p.rejectionReason && (
                          <div className="text-xs text-rose-400/80 bg-rose-500/10 px-2 py-1 rounded inline-block">
                            Reason: {p.rejectionReason}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 font-mono">UTR: {p.utrNumber}</p>
                      </div>
                      <div className="md:text-right flex flex-row md:flex-col justify-between items-center md:items-end">
                        <span className="text-lg font-bold text-emerald-400 font-mono tracking-tight">₹{p.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white text-sm font-medium rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
