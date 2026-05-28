'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-gray-950 transition-theme">
      <div className="relative flex flex-col items-center gap-6">
        {/* Modern animated core pulse */}
        <div className="relative w-16 h-16">
          <motion.span
            className="absolute inset-0 rounded-full border-4 border-sky-500/20"
            animate={{ scale: [1, 1.15, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border-4 border-t-sky-500 border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span className="absolute inset-3 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 blur-[2px] opacity-80" />
        </div>

        {/* Dynamic sliding shimmer line */}
        <div className="w-48 h-1 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden relative">
          <motion.div
            className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-blue-500 to-sky-400 rounded-full"
            animate={{
              left: ['-30%', '110%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <motion.p
          className="text-xs font-semibold tracking-widest text-slate-400 uppercase font-heading"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading Premium SaaS
        </motion.p>
      </div>
    </div>
  );
}
