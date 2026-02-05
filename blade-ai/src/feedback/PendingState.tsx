import React from 'react';
import { motion } from 'motion/react';

export interface PendingStateProps {
  /** Loading message */
  message?: string;
  /** Estimated time remaining */
  estimatedTime?: string;
  /** Show cancel button */
  onCancel?: () => void;
  /** Cancel button label */
  cancelLabel?: string;
  /** Loading indicator variant */
  variant?: 'spinner' | 'dots' | 'pulse';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeConfig = {
  sm: { spinner: 'w-6 h-6', message: 'text-sm', estimated: 'text-xs' },
  md: { spinner: 'w-10 h-10', message: 'text-base', estimated: 'text-sm' },
  lg: { spinner: 'w-14 h-14', message: 'text-lg', estimated: 'text-base' },
};

/**
 * Pending/loading state display
 *
 * Waiting state with optional time estimate and cancel action.
 *
 * @example
 * ```tsx
 * <PendingState
 *   message="Processing your request..."
 *   estimatedTime="~30 seconds"
 *   onCancel={() => cancelRequest()}
 * />
 * ```
 */
export const PendingState: React.FC<PendingStateProps> = ({
  message = 'Please wait...',
  estimatedTime,
  onCancel,
  cancelLabel = 'Cancel',
  variant = 'spinner',
  size = 'md',
  className = '',
}) => {
  const { spinner: spinnerSize, message: messageSize, estimated: estimatedSize } = sizeConfig[size];

  const renderIndicator = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full bg-blue-500`}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={`${spinnerSize} rounded-full bg-blue-100`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            <div className="w-full h-full rounded-full bg-blue-500 opacity-50" />
          </motion.div>
        );

      case 'spinner':
      default:
        return (
          <motion.div
            className={`${spinnerSize} border-2 border-slate-200 border-t-blue-500 rounded-full`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        );
    }
  };

  return (
    <motion.div
      className={`flex flex-col items-center text-center p-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Indicator */}
      <div className="mb-4">{renderIndicator()}</div>

      {/* Message */}
      <p className={`${messageSize} text-slate-700 mb-1`}>{message}</p>

      {/* Estimated time */}
      {estimatedTime && (
        <p className={`${estimatedSize} text-slate-400`}>
          Estimated: {estimatedTime}
        </p>
      )}

      {/* Cancel button */}
      {onCancel && (
        <motion.button
          onClick={onCancel}
          className={`
            mt-4 px-4 py-2 rounded-lg
            text-sm text-slate-600
            hover:bg-slate-100 transition-colors
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {cancelLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default PendingState;
