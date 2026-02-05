/**
 * Blade AI Animation Variants
 *
 * Shared motion variants and timing configurations for consistent animations
 * across all Blade AI components.
 */

import type { Variants, Transition } from 'motion/react';

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export const fadeInFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
};

export const fadeInSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// ============================================================================
// BLUR ANIMATIONS
// ============================================================================

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const blurSlideUp: Variants = {
  hidden: { opacity: 0, y: 5, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

// ============================================================================
// CONTAINER ANIMATIONS (for stagger children)
// ============================================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// ============================================================================
// STAGGER ITEM VARIANTS
// ============================================================================

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 5, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export const staggerItemSimple: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// ============================================================================
// SPRING CONFIGURATIONS
// ============================================================================

export const springConfig: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const springConfigBouncy: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
};

export const springConfigGentle: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 35,
};

// ============================================================================
// THINKING/PROCESSING ANIMATIONS
// ============================================================================

/**
 * Stepped 90-degree rotation for thinking indicators
 * Rotates through 0 -> 90 -> 180 -> 270 -> 360 with pauses
 */
export const rotatingLogo = {
  rotate: [0, 90, 90, 180, 180, 270, 270, 360],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 1],
  },
};

export const rotatingLogoStopped = {
  rotate: 0,
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

/**
 * Pulse animation for loading states
 */
export const pulsingDot: Variants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// TEXT FLIP ANIMATION (for thinking steps)
// ============================================================================

export const textFlipEnter: Variants = {
  initial: { y: 12, opacity: 0, filter: 'blur(6px)' },
  animate: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      y: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
      opacity: { duration: 0.35, ease: 'easeOut' },
      filter: { duration: 0.4, ease: 'easeOut' },
    },
  },
  exit: {
    y: -12,
    opacity: 0,
    filter: 'blur(6px)',
    transition: {
      y: { duration: 0.3, ease: [0.4, 0, 1, 1] },
      opacity: { duration: 0.25, ease: 'easeIn' },
      filter: { duration: 0.25, ease: 'easeIn' },
    },
  },
};

// ============================================================================
// MESSAGE ANIMATIONS
// ============================================================================

export const messageEnter: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const messageExit: Variants = {
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// ============================================================================
// CARD/ARTIFACT ANIMATIONS
// ============================================================================

export const cardEnter: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const tableRowEnter: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// ============================================================================
// BUTTON ANIMATIONS
// ============================================================================

export const buttonPress = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.15 },
};

// ============================================================================
// OVERLAY ANIMATIONS
// ============================================================================

export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

export const panelSlideIn: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// ============================================================================
// PROGRESS ANIMATIONS
// ============================================================================

export const progressFill: Variants = {
  initial: { scaleX: 0, transformOrigin: 'left' },
  animate: (progress: number) => ({
    scaleX: progress / 100,
    transition: { duration: 0.5, ease: 'easeOut' },
  }),
};

export const checkmarkDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.4, ease: 'easeOut' },
      opacity: { duration: 0.2 },
    },
  },
};

// ============================================================================
// SUCCESS STATE ANIMATIONS
// ============================================================================

export const successBounce: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
};

export const confettiBurst = {
  initial: { scale: 0, rotate: 0 },
  animate: {
    scale: [0, 1.2, 1],
    rotate: [0, 15, 0],
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a delayed variant of any animation
 */
export function withDelay<T extends Variants>(variants: T, delay: number): Variants {
  return {
    ...variants,
    visible: {
      ...(variants.visible as object),
      transition: {
        ...((variants.visible as { transition?: object })?.transition || {}),
        delay,
      },
    },
  };
}

/**
 * Create a stagger delay for items in a list
 */
export function staggerDelay(index: number, baseDelay = 0, interval = 0.1): number {
  return baseDelay + index * interval;
}
