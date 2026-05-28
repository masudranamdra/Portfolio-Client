'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../animations';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  center?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  center = false,
}) => {
  return (
    <motion.div
      variants={fadeIn('up', 0.6)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      className={`mb-12 max-w-3xl ${center ? 'mx-auto text-center' : ''}`}
    >
      {badge && (
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-sky-500 uppercase bg-sky-500/10 rounded-full border border-sky-500/20">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
