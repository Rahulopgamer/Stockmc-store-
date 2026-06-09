/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../context/StoreContext';
import { CircleCheck, CircleAlert, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-wrapper" className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              id={`toast-${toast.id}`}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-white/10 bg-cyber-card/90 backdrop-blur-md p-4 shadow-xl shadow-black/40 border-l-4 border-l-accent-purple overflow-hidden"
            >
              {/* Type specific icons */}
              <div className="flex-shrink-0 mt-0.5">
                {isSuccess ? (
                  <CircleCheck size={18} className="text-emerald-400" />
                ) : isError ? (
                  <CircleAlert size={18} className="text-rose-400" />
                ) : (
                  <Info size={18} className="text-blue-400" />
                )}
              </div>

              {/* Message body */}
              <div className="flex-1 text-xs text-gray-200 leading-relaxed font-sans font-medium">
                {toast.message}
              </div>

              {/* Close trigger button */}
              <button
                id={`close-toast-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-gray-500 hover:text-white transition-colors p-0.5 rounded cursor-pointer"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
