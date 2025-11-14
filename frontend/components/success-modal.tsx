"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

export default function SuccessModal({ open, onClose, message }: SuccessModalProps) {
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
            className="bg-[#0f0f0f] border border-purple-500/30 p-8 rounded-2xl shadow-xl text-center max-w-sm w-full"
          >
            <h2 className="text-2xl font-bold text-purple-400 mb-2">Success 🎉</h2>
            <p className="text-gray-300 mb-6">{message}</p>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-600 rounded-lg text-white font-semibold hover:bg-purple-700 transition"
            >
              Okay
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
