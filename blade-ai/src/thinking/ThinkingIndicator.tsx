import React from 'react';
import { motion } from 'motion/react';
import { Logo } from '../primitives/Logo';

export type ThinkingVariant = 'spinner' | 'dots' | 'logo';

export interface ThinkingStep {
  label: string;
  status?: 'pending' | 'active' | 'complete';
}

export interface ThinkingIndicatorProps {
  /** Current thinking steps */
  steps?: ThinkingStep[];
  /** Current active step index */
  currentStep?: number;
  /** Visual variant */
  variant?: ThinkingVariant;
  /** Custom label text */
  label?: string;
  /** Additional CSS classes */
  className?: string;
  /** Pause animation */
  isPaused?: boolean;
}

/**
 * Animated thinking/loading state indicator
 *
 * Shows AI processing state with various visual styles.
 * Can display step labels that cycle through.
 *
 * @example
 * ```tsx
 * // Simple logo animation
 * <ThinkingIndicator variant="logo" />
 *
 * // With steps
 * <ThinkingIndicator
 *   variant="logo"
 *   steps={[
 *     { label: 'Analyzing request...' },
 *     { label: 'Searching documents...' },
 *     { label: 'Generating response...' }
 *   ]}
 *   currentStep={1}
 * />
 *
 * // Dots variant
 * <ThinkingIndicator variant="dots" label="Thinking" />
 * ```
 */
export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  steps = [],
  currentStep = 0,
  variant = 'logo',
  label,
  className = '',
  isPaused = false,
}) => {
  const currentLabel = steps[currentStep]?.label || label || 'Thinking...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-3 ${className}`}
    >
      {/* Indicator */}
      {variant === 'logo' && (
        <Logo size="md" animate={isPaused ? 'none' : 'rotate'} isPaused={isPaused} />
      )}

      {variant === 'spinner' && (
        <motion.div
          className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full"
          animate={isPaused ? {} : { rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {variant === 'dots' && (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-slate-400 rounded-full"
              animate={
                isPaused
                  ? {}
                  : {
                      y: [0, -6, 0],
                      opacity: [0.5, 1, 0.5],
                    }
              }
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Label with shimmer effect */}
      <div className="relative overflow-hidden">
        <motion.span
          key={currentLabel}
          initial={{ y: 10, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -10, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.3 }}
          className="
            text-[15px] leading-6
            bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600
            bg-[length:200%_100%] bg-clip-text text-transparent
          "
          style={
            isPaused
              ? {}
              : {
                  animation: 'blade-ai-shimmer 2s linear infinite',
                }
          }
        >
          {currentLabel}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default ThinkingIndicator;
