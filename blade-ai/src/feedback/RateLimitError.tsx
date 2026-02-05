import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';

export interface RateLimitErrorProps {
  /** Seconds until retry is allowed */
  retryAfter: number;
  /** Callback when countdown completes */
  onRetry?: () => void;
  /** Custom title */
  title?: string;
  /** Custom message */
  message?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Rate limit error with countdown
 *
 * Shows a countdown timer until the rate limit resets.
 *
 * @example
 * ```tsx
 * <RateLimitError
 *   retryAfter={60}
 *   onRetry={() => retryRequest()}
 *   title="Too many requests"
 *   message="Please wait before trying again"
 * />
 * ```
 */
export const RateLimitError: React.FC<RateLimitErrorProps> = ({
  retryAfter,
  onRetry,
  title = 'Rate Limit Exceeded',
  message = 'Too many requests. Please wait before trying again.',
  className = '',
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState(retryAfter);
  const [canRetry, setCanRetry] = useState(false);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      setCanRetry(true);
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setCanRetry(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const formatTime = useCallback((seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }, []);

  const progress = retryAfter > 0 ? ((retryAfter - remainingSeconds) / retryAfter) * 100 : 100;

  return (
    <motion.div
      className={`
        flex flex-col items-center text-center p-6
        bg-amber-50 border border-amber-200 rounded-lg
        ${className}
      `}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Icon */}
      <motion.div
        className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4"
        animate={canRetry ? {} : { rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, repeat: canRetry ? 0 : Infinity, repeatDelay: 2 }}
      >
        <svg
          className="w-6 h-6 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </motion.div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-amber-800 mb-2">{title}</h3>

      {/* Message */}
      <p className="text-sm text-amber-700 mb-4 max-w-sm">{message}</p>

      {/* Countdown */}
      {!canRetry && (
        <div className="w-full max-w-xs mb-4">
          {/* Progress bar */}
          <div className="h-2 bg-amber-200 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full bg-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Time remaining */}
          <div className="flex justify-between text-xs text-amber-600">
            <span>Retry available in</span>
            <span className="font-mono font-medium">{formatTime(remainingSeconds)}</span>
          </div>
        </div>
      )}

      {/* Retry button */}
      {onRetry && (
        <motion.button
          onClick={canRetry ? onRetry : undefined}
          disabled={!canRetry}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm
            transition-all
            ${
              canRetry
                ? 'bg-amber-500 text-white hover:bg-amber-600 cursor-pointer'
                : 'bg-amber-200 text-amber-400 cursor-not-allowed'
            }
          `}
          whileHover={canRetry ? { scale: 1.02 } : {}}
          whileTap={canRetry ? { scale: 0.98 } : {}}
        >
          {canRetry ? 'Retry Now' : `Wait ${formatTime(remainingSeconds)}`}
        </motion.button>
      )}
    </motion.div>
  );
};

export default RateLimitError;
