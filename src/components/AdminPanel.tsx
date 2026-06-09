/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldAlert, Plus, Trash2, CheckCircle, XCircle, Clock, Lock, LogOut } from 'lucide-react';

export default function AdminPanel() {
  const {
    coupons, createCoupon, deleteCoupon, 
    purchaseHistory, updatePurchaseStatus, 
    isAdminAuthenticated, loginAdmin, logoutAdmin,
    resetLeaderboard, featuredPlayer, setFeaturedPlayerAdmin, setCustomBadge,
    hiddenPlayers, hidePlayer, unhidePlayer
  } = useStore();
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState<number>(10);
  const [password, setPassword] = useState('');
  const [paymentTab, setPaymentTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredPayments = purchaseHistory.filter(txn => paymentTab === 'all' || txn.status === paymentTab);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCode && newDiscount > 0 && newDiscount <= 100) {
      createCoupon(newCode, newDiscount);
      setNewCode('');
      setNewDiscount(10);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(password);
    setPassword('');
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="py-20 max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="bg-cyber-dark/60 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-accent-purple/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="text-accent-purple" size={32} />
          </div>
          <h2 className="text-2xl font-display font-black text-white mb-2">Admin Access Required</h2>
          <p className="text-gray-400 font-sans text-sm mb-8">Please login to view the dashboard.</p>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-cyber-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white font-sans focus:outline-none focus:border-accent-purple transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent-purple hover:bg-violet-600 text-white font-display font-bold py-3 rounded-xl transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 border-b border-white/10 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert size={32} className="text-accent-purple" />
          <div>
            <h1 className="text-3xl font-display font-black text-white">Admin Dashboard</h1>
            <p className="text-gray-400 font-sans mt-1">Manage coupons and verify player payments.</p>
          </div>
        </div>
        <button
          onClick={logoutAdmin}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>

      <div className="mb-8 grid sm:grid-cols-3 gap-4">
        <div className="bg-cyber-dark/60 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-gray-400 font-mono text-xs uppercase font-bold tracking-wider mb-1">Total Revenue</div>
            <div className="text-2xl font-display font-black text-emerald-400">
              ₹{purchaseHistory.filter(p => p.status === 'approved').reduce((acc, p) => acc + p.amount, 0)}
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
            <CheckCircle size={24} />
          </div>
        </div>
        <div className="bg-cyber-dark/60 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-gray-400 font-mono text-xs uppercase font-bold tracking-wider mb-1">Pending Approval</div>
            <div className="text-2xl font-display font-black text-yellow-400">
              {purchaseHistory.filter(p => p.status === 'pending').length}
            </div>
          </div>
          <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500">
            <Clock size={24} />
          </div>
        </div>
        <div className="bg-cyber-dark/60 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-gray-400 font-mono text-xs uppercase font-bold tracking-wider mb-1">Total Orders</div>
            <div className="text-2xl font-display font-black text-white">
              {purchaseHistory.length}
            </div>
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-300">
            <ShieldAlert size={24} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Coupon Management */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-cyber-dark/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl">
            <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <Plus size={20} className="text-accent-purple" />
              Create Coupon
            </h2>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider mb-1.5">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. SUMMER25"
                  className="w-full bg-cyber-dark/50 border border-white/10 rounded-xl px-4 py-2.5 text-white font-sans text-sm focus:outline-none focus:border-accent-purple uppercase"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider mb-1.5">Discount %</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(parseInt(e.target.value) || 0)}
                  className="w-full bg-cyber-dark/50 border border-white/10 rounded-xl px-4 py-2.5 text-white font-sans text-sm focus:outline-none focus:border-accent-purple"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent-purple hover:bg-violet-600 text-white font-display font-bold py-2.5 rounded-xl transition duration-300"
              >
                Add Coupon
              </button>
            </form>
          </div>

          <div className="bg-cyber-dark/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl">
            <h2 className="text-xl font-display font-bold text-white mb-4">Active Coupons</h2>
            <div className="space-y-3">
              {coupons.length === 0 ? (
                <p className="text-sm text-gray-500">No active coupons.</p>
              ) : (
                coupons.map((coupon) => (
                  <div key={coupon.code} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-3">
                    <div>
                      <div className="font-mono text-emerald-400 font-bold">{coupon.code}</div>
                      <div className="text-xs text-gray-400">{coupon.discountPercentage}% OFF</div>
                    </div>
                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Purchase History & Verification */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-cyber-dark/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-display font-bold text-white">Recent Payments (Verification)</h2>
              <div className="flex bg-white/5 border border-white/10 p-1 rounded-lg">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setPaymentTab(tab)}
                    className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-md transition-colors ${paymentTab === tab ? 'bg-accent-purple text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {filteredPayments.length === 0 ? (
              <div className="text-center py-10 text-gray-500 font-mono text-sm">
                No transactions found for filter: {paymentTab}.
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-xs font-mono uppercase tracking-wider">
                    <th className="pb-3 pr-4">Txn ID / Date</th>
                    <th className="pb-3 px-4">Player Details</th>
                    <th className="pb-3 px-4">Order Items</th>
                    <th className="pb-3 px-4 text-right">Value (UTR)</th>
                    <th className="pb-3 px-4">Email Logs</th>
                    <th className="pb-3 pl-4 text-right">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredPayments.map((txn) => (
                    <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pr-4 align-top">
                        <div className="font-mono text-sm text-white">{txn.id}</div>
                        <div className="text-[10px] text-gray-500 mt-1">{new Date(txn.date).toLocaleString()}</div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-emerald-400 text-sm">{txn.username}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{txn.email}</div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <ul className="list-disc list-inside text-xs text-gray-300">
                          {txn.items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 px-4 align-top text-right">
                        <div className="font-display font-bold text-white text-sm">₹{txn.amount}</div>
                        <div className="text-[10px] font-mono text-gray-500 mt-1" title="UTR Number">
                          UTR: {txn.utrNumber}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        {txn.emailDeliveryLogs && txn.emailDeliveryLogs.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {txn.emailDeliveryLogs.map((log, idx) => (
                              <div key={idx} className="flex items-center gap-1.5" title={`${log.timestamp}${log.error ? ' - ' + log.error : ''}`}>
                                {log.status === 'sent' ? (
                                  <span className="flex-shrink-0 text-emerald-400"><CheckCircle size={12} /></span>
                                ) : log.status === 'failed' ? (
                                  <span className="flex-shrink-0 text-red-400"><XCircle size={12} /></span>
                                ) : (
                                  <span className="flex-shrink-0 text-yellow-400"><Clock size={12} /></span>
                                )}
                                <span className="text-[10px] text-gray-300 font-mono uppercase truncate max-w-[100px]">
                                  {log.type.replace('_', ' ')}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500 font-mono">No logs</span>
                        )}
                      </td>
                      <td className="py-4 pl-4 align-top text-right">
                        <div className="flex flex-col items-end gap-2">
                          {txn.screenshotBase64 && (
                            <div className="mb-2">
                              <a href={txn.screenshotBase64} target="_blank" rel="noopener noreferrer">
                                <img src={txn.screenshotBase64} alt="Proof" className="w-16 h-16 object-cover border border-white/20 rounded cursor-pointer hover:opacity-80" title="View Screenshot" />
                              </a>
                            </div>
                          )}
                          {txn.status === 'pending' ? (
                            <>
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                                <Clock size={10} /> Pending
                              </span>
                              <div className="flex gap-2 mt-1">
                                <button
                                  onClick={() => updatePurchaseStatus(txn.id, 'approved')}
                                  className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 rounded-lg transition-colors"
                                  title="Approve & Dispatch"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <form 
                                  className="flex gap-1"
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    const fd = new FormData(e.currentTarget);
                                    updatePurchaseStatus(txn.id, 'rejected', fd.get('reason') as string);
                                  }}
                                >
                                  <input 
                                    name="reason" 
                                    placeholder="Reject Reason..." 
                                    required 
                                    className="w-24 text-[10px] px-2 py-1 rounded bg-black/40 border border-white/10 text-white focus:outline-none focus:border-red-500" 
                                  />
                                  <button
                                    type="submit"
                                    className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors"
                                    title="Reject Payment"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </form>
                              </div>
                            </>
                          ) : txn.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                              <CheckCircle size={10} /> Approved
                            </span>
                          ) : (
                            <div className="flex flex-col items-end">
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 bg-red-400/10 px-2 py-1 rounded">
                                <XCircle size={10} /> Rejected
                              </span>
                              {txn.rejectionReason && (
                                <span className="text-[10px] font-mono text-gray-500 mt-1 max-w-[150px] truncate" title={txn.rejectionReason}>
                                  Reason: {txn.rejectionReason}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Leaderboard Management */}
          <div className="bg-cyber-dark/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-white">Leaderboard Management</h2>
              <button
                onClick={resetLeaderboard}
                className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 bg-red-400/10 hover:bg-red-400/20 py-1.5 px-3 rounded-lg border border-red-400/20 transition-colors"
              >
                Reset Leaderboard
              </button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4 border border-white/5 bg-white/[0.02] p-4 rounded-xl">
                <h3 className="text-sm font-bold text-gray-300 font-mono uppercase">Featured Player</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    setFeaturedPlayerAdmin(fd.get('featured') as string || null);
                  }}
                  className="flex gap-2"
                >
                  <input
                    name="featured"
                    placeholder="Username..."
                    defaultValue={featuredPlayer || ''}
                    className="flex-1 bg-cyber-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                  />
                  <button type="submit" className="bg-accent-purple px-4 rounded-lg text-white font-bold text-sm">Set</button>
                </form>
              </div>

              <div className="space-y-4 border border-white/5 bg-white/[0.02] p-4 rounded-xl">
                <h3 className="text-sm font-bold text-gray-300 font-mono uppercase">Custom Badge</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    setCustomBadge(fd.get('username') as string, fd.get('badge') as string);
                    e.currentTarget.reset();
                  }}
                  className="flex flex-col gap-2"
                >
                  <input
                    name="username"
                    required
                    placeholder="Username..."
                    className="bg-cyber-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                  />
                  <div className="flex gap-2">
                    <input
                      name="badge"
                      required
                      placeholder="Badge text (e.g. VIP)"
                      className="flex-1 bg-cyber-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white uppercase"
                    />
                    <button type="submit" className="bg-accent-purple px-3 rounded-lg text-white font-bold text-sm">+</button>
                  </div>
                </form>
              </div>

              <div className="space-y-4 border border-white/5 bg-white/[0.02] p-4 rounded-xl sm:col-span-2">
                <h3 className="text-sm font-bold text-gray-300 font-mono uppercase">Hide Player</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    hidePlayer(fd.get('username') as string);
                    e.currentTarget.reset();
                  }}
                  className="flex gap-2 mb-2"
                >
                  <input
                    name="username"
                    required
                    placeholder="Username to hide..."
                    className="flex-1 bg-cyber-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                  />
                  <button type="submit" className="bg-red-500/20 text-red-400 hover:bg-red-500/40 px-4 rounded-lg font-bold text-sm transition-colors">Hide</button>
                </form>
                {hiddenPlayers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {hiddenPlayers.map(p => (
                      <span key={p} className="text-xs bg-red-500/10 text-red-300 border border-red-500/20 px-2 py-1 rounded flex items-center gap-2">
                        {p}
                        <button onClick={() => unhidePlayer(p)} className="hover:text-white">&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
