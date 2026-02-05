import React from 'react';
import { motion } from 'motion/react';

export interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error message/description */
  message: string;
  /** Show retry button */
  onRetry?: () => void;
  /** Retry button label */
  retryLabel?: string;
  /** Show dismiss button */
  onDismiss?: () => void;
  /** Dismiss button label */
  dismissLabel?: string;
  /** Error code or reference */
  errorCode?: string;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Variant style */
  variant?: 'inline' | 'full';
  /** Additional CSS classes */
  className?: string;
}

const sizeConfig = {
  sm: { icon: 'w-10 h-10', title: 'text-base', message: 'text-sm' },
  md: { icon: 'w-14 h-14', title: 'text-lg', message: 'text-base' },
  lg: { icon: 'w-18 h-18', title: 'text-xl', message: 'text-lg' },
};

/**
 * Error state display with retry option
 *
 * Error feedback with optional retry and dismiss actions.
 *
 * @example
 * ```tsx
 * <ErrorState
 *   title="Something went wrong"
 *   message="We couldn't process your request. Please try again."
 *   errorCode="ERR_500"
 *   onRetry={() => retryRequest()}
 *   onDismiss={() => dismissError()}
 * />
 * ```
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Error',
  message,
  onRetry,
  retryLabel = 'Try Again',
  onDismiss,
  dismissLabel = 'Dismiss',
  errorCode,
  icon,
  size = 'md',
  variant = 'full',
  className = '',
}) => {
  const { icon: iconSize, title: titleSize, message: messageSize } = sizeConfig[size];

  const defaultIcon = (
    <svg
      className={`${iconSize} text-red-500`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );

  if (variant === 'inline') {
    return (
      <motion.div
        className={`
          flex items-start gap-3 p-4 rounded-lg
          bg-red-50 border border-red-200
          ${className}
        `}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="shrink-0 text-red-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-800">{title}</p>
          <p className="text-sm text-red-600 mt-1">{message}</p>
          {(onRetry || onDismiss) && (
            <div className="flex gap-2 mt-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-sm font-medium text-red-700 hover:text-red-800"
                >
                  {retryLabel}
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  {dismissLabel}
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`flex flex-col items-center text-center p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon */}
      <motion.div
        className={`
          ${iconSize} rounded-full
          bg-red-50 flex items-center justify-center
          mb-4
        `}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {icon || defaultIcon}
      </motion.div>

      {/* Title */}
      <motion.h3
        className={`${titleSize} font-semibold text-slate-900 mb-2`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {title}
      </motion.h3>

      {/* Message */}
      <motion.p
        className={`${messageSize} text-slate-500 mb-4 max-w-sm`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>

      {/* Error code */}
      {errorCode && (
        <motion.code
          className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {errorCode}
        </motion.code>
      )}

      {/* Actions */}
      {(onRetry || onDismiss) && (
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {onRetry && (
            <button
              onClick={onRetry}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                bg-red-500 text-white hover:bg-red-600
                transition-colors
              `}
            >
              {retryLabel}
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                bg-slate-100 text-slate-700 hover:bg-slate-200
                transition-colors
              `}
            >
              {dismissLabel}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorState;
