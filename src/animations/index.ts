import type { Variants } from 'framer-motion';

export const fadeIn = (direction: 'up' | 'down' | 'left' | 'right' | 'none' = 'none', duration = 0.5, delay = 0) => {
  return {
    hidden: {
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        duration: duration,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75] as [number, number, number, number],
      },
    },
  } satisfies Variants;
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delayChildren,
      },
    },
  } satisfies Variants;
};

export const zoomIn = (delay = 0, duration = 0.5) => {
  return {
    hidden: {
      scale: 0.85,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        delay: delay,
        duration: duration,
        ease: 'easeOut',
      },
    },
  } satisfies Variants;
};

export const hoverScale = {
  hover: {
    scale: 1.03,
    y: -4,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
    },
  },
} as const;

export const slideIn = (direction: 'up' | 'down' | 'left' | 'right', type: 'spring' | 'tween', delay: number, duration: number) => {
  return {
    hidden: {
      x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
      y: direction === 'up' ? '100%' : direction === 'down' ? '-100%' : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type,
        delay: delay,
        duration: duration,
        ease: 'easeOut',
      },
    },
  } satisfies Variants;
};
