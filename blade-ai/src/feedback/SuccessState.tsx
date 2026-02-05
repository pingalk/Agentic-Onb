import React from 'react';
import { motion } from 'motion/react';

export interface SuccessAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary';
}

export interface SuccessStateProps {
  /** Success title */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Action buttons */
  actions?: SuccessAction[];
  /** Additional content */
  children?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeConfig = {
  sm: { icon: 'w-12 h-12', title: 'text-lg', subtitle: 'text-sm' },
  md: { icon: 'w-16 h-16', title: 'text-xl', subtitle: 'text-base' },
  lg: { icon: 'w-20 h-20', title: 'text-2xl', subtitle: 'text-lg' },
};

/**
 * Success state display with animation
 *
 * Celebratory state for completed actions.
 *
 * @example
 * ```tsx
 * <SuccessState
 *   title="Payment Successful!"
 *   subtitle="Your transaction has been processed"
 *   actions={[
 *     { label: 'View Receipt', onClick: viewReceipt, variant: 'primary' },
 *     { label: 'Back to Home', onClick: goHome }
 *   ]}
 * />
 * ```
 */
export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  subtitle,
  icon,
  actions = [],
  children,
  size = 'md',
  className = '',
}) => {
  const { icon: iconSize, title: titleSize, subtitle: subtitleSize } = sizeConfig[size];

  const defaultIcon = (
    <svg
      className={`${iconSize} text-emerald-500`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <motion.path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </svg>
  );

  return (
    <motion.div
      className={`flex flex-col items-center text-center p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon with circle background */}
      <motion.div
        className={`
          ${iconSize} rounded-full
          bg-emerald-50 flex items-center justify-center
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
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className={`${subtitleSize} text-slate-500 mb-4 max-w-sm`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Additional content */}
      {children && (
        <motion.div
          className="mb-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {children}
        </motion.div>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <motion.div
          className="flex gap-3 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                transition-colors
                ${
                  action.variant === 'primary'
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }
              `}
            >
              {action.label}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SuccessState;
