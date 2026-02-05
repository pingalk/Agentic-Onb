import React from 'react';
import { motion } from 'motion/react';

export type SendButtonVariant = 'send' | 'stop';

export interface SendButtonProps {
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: SendButtonVariant;
  /** Loading/processing state */
  isLoading?: boolean;
  /** Disable the button */
  disabled?: boolean;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeMap: Record<string, { button: string; icon: string }> = {
  sm: { button: 'w-8 h-8', icon: 'w-4 h-4' },
  md: { button: 'w-10 h-10', icon: 'w-5 h-5' },
  lg: { button: 'w-12 h-12', icon: 'w-6 h-6' },
};

/**
 * Submit/stop button for chat input
 *
 * Animated button that switches between send and stop states.
 * Shows loading spinner when processing.
 *
 * @example
 * ```tsx
 * // Send state
 * <SendButton
 *   onClick={handleSend}
 *   disabled={!hasContent}
 * />
 *
 * // Stop state (during streaming)
 * <SendButton
 *   onClick={handleStop}
 *   variant="stop"
 * />
 *
 * // Loading
 * <SendButton onClick={handleSend} isLoading />
 * ```
 */
export const SendButton: React.FC<SendButtonProps> = ({
  onClick,
  variant = 'send',
  isLoading = false,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const { button, icon } = sizeMap[size];

  const isDisabled = disabled || isLoading;
  const isSend = variant === 'send';

  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.05 } : undefined}
      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
      className={`
        ${button}
        rounded-full
        flex items-center justify-center
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${
          isSend
            ? isDisabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-red-500 text-white hover:bg-red-600'
        }
        ${className}
      `}
      aria-label={isLoading ? 'Loading' : isSend ? 'Send message' : 'Stop generation'}
    >
      {isLoading ? (
        <motion.div
          className={`${icon} border-2 border-current border-t-transparent rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      ) : isSend ? (
        <svg className={icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      ) : (
        <svg className={icon} fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      )}
    </motion.button>
  );
};

export default SendButton;
