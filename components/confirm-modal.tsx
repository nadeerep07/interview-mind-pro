"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ open, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-[#0e0e0e] border border-red-500/30 p-8 rounded-2xl shadow-xl text-center max-w-sm w-full"
          >
            <h2 className="text-2xl font-bold text-red-400 mb-3">Confirm Logout</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to log out?</p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onCancel}
                className="px-5 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="px-5 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition"
              >
                Log Out
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
