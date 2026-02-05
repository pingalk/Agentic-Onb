import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type StepStatus = 'pending' | 'active' | 'complete' | 'error';

export interface FormStepProps {
  /** Step title */
  title: string;
  /** Step number (1-indexed) */
  stepNumber: number;
  /** Step status */
  status?: StepStatus;
  /** Summary text (shown when collapsed) */
  summary?: string;
  /** Step content */
  children: React.ReactNode;
  /** Is the step expanded */
  isExpanded?: boolean;
  /** Toggle expansion handler */
  onToggle?: () => void;
  /** Show connector line to next step */
  showConnector?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const statusStyles: Record<StepStatus, { ring: string; bg: string; text: string }> = {
  pending: {
    ring: 'border-slate-200',
    bg: 'bg-slate-100',
    text: 'text-slate-400',
  },
  active: {
    ring: 'border-blue-500',
    bg: 'bg-blue-500',
    text: 'text-white',
  },
  complete: {
    ring: 'border-emerald-500',
    bg: 'bg-emerald-500',
    text: 'text-white',
  },
  error: {
    ring: 'border-red-500',
    bg: 'bg-red-500',
    text: 'text-white',
  },
};

/**
 * Step wrapper with stepper icon
 *
 * Individual step in a multi-step wizard with visual indicator.
 *
 * @example
 * ```tsx
 * <FormStep
 *   title="Payment Details"
 *   stepNumber={1}
 *   status="complete"
 *   summary="UPI payment of ₹5,000"
 *   isExpanded={false}
 * >
 *   <PaymentForm />
 * </FormStep>
 * ```
 */
export const FormStep: React.FC<FormStepProps> = ({
  title,
  stepNumber,
  status = 'pending',
  summary,
  children,
  isExpanded = true,
  onToggle,
  showConnector = true,
  className = '',
}) => {
  const styles = statusStyles[status];
  const isClickable = status !== 'pending';

  return (
    <div className={`relative ${className}`}>
      {/* Connector line */}
      {showConnector && (
        <div
          className={`
            absolute left-5 top-10 w-0.5 h-[calc(100%-40px)]
            ${status === 'complete' ? 'bg-emerald-200' : 'bg-slate-200'}
          `}
        />
      )}

      {/* Step header */}
      <div
        className={`
          flex items-start gap-4
          ${isClickable && onToggle ? 'cursor-pointer' : ''}
        `}
        onClick={isClickable ? onToggle : undefined}
      >
        {/* Step indicator */}
        <div
          className={`
            shrink-0 w-10 h-10 rounded-full
            flex items-center justify-center
            border-2 ${styles.ring} ${styles.bg}
            transition-colors
          `}
        >
          {status === 'complete' ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : status === 'error' ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <span className={`text-sm font-semibold ${styles.text}`}>{stepNumber}</span>
          )}
        </div>

        {/* Step info */}
        <div className="flex-1 min-w-0 pt-2">
          <div className="flex items-center justify-between">
            <h3
              className={`
                text-base font-medium
                ${status === 'pending' ? 'text-slate-400' : 'text-slate-900'}
              `}
            >
              {title}
            </h3>

            {/* Expand/collapse indicator */}
            {isClickable && onToggle && (
              <motion.svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            )}
          </div>

          {/* Summary (shown when collapsed) */}
          {!isExpanded && summary && (
            <p className="text-sm text-slate-500 mt-1">{summary}</p>
          )}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="ml-14 pt-4 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormStep;
