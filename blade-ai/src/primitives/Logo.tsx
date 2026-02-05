import React from 'react';
import { motion } from 'motion/react';
import { rotatingLogo, rotatingLogoStopped } from './animations';

export type LogoAnimateState = 'rotate' | 'pulse' | 'none';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<LogoSize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
};

export interface LogoProps {
  /** Size of the logo */
  size?: LogoSize;
  /** Animation state */
  animate?: LogoAnimateState;
  /** Custom color (overrides default) */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Pause the animation */
  isPaused?: boolean;
}

/**
 * AI Logo with animated states
 *
 * Displays the Ray AI logo with optional rotation, pulse, or no animation.
 * The stepped rotation animation pauses at 90-degree intervals for a
 * mechanical, thinking appearance.
 *
 * @example
 * ```tsx
 * // Thinking state with rotation
 * <Logo animate="rotate" size="md" />
 *
 * // Static logo
 * <Logo animate="none" size="lg" />
 *
 * // Pulse animation
 * <Logo animate="pulse" color="#3b82f6" />
 * ```
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  animate = 'none',
  color = '#009E5C',
  className = '',
  isPaused = false,
}) => {
  // Ray star path
  const rayPath =
    'M12 12L14.25 3H21V9.75L12 12L21 14.25V21H14.25L12 12L9.75001 21H3.00001V14.25L12 12L3.00001 9.75V3H9.75001L12 12Z';

  const shouldRotate = animate === 'rotate' && !isPaused;
  const shouldPulse = animate === 'pulse' && !isPaused;

  return (
    <motion.div
      className={`shrink-0 ${sizeMap[size]} ${className}`}
      animate={
        shouldRotate
          ? rotatingLogo
          : shouldPulse
            ? {
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
            : rotatingLogoStopped
      }
    >
      <svg
        className="block w-full h-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path d={rayPath} fill={color} />
      </svg>
    </motion.div>
  );
};

export default Logo;
