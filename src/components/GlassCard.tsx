'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { hoverScale } from '../animations';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animateHover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  animateHover = false,
  onClick,
}) => {
  if (animateHover) {
    return (
      <motion.div
        variants={hoverScale}
        whileHover="hover"
        onClick={onClick}
        className={`glass-card p-6 overflow-hidden relative cursor-pointer ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 overflow-hidden relative ${className}`}
    >
      {children}
    </div>
  );
};
