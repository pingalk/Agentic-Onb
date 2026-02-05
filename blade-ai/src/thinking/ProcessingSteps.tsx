import React from 'react';
import { motion } from 'motion/react';

export type ProcessingFieldStatus = 'pending' | 'extracting' | 'complete' | 'error';

export interface ProcessingField {
  /** Field name */
  name: string;
  /** Field status */
  status: ProcessingFieldStatus;
  /** Extracted value (when complete) */
  value?: string;
}

export interface ProcessingStepsProps {
  /** Fields being processed */
  fields: ProcessingField[];
  /** Overall progress (0-100) */
  progress?: number;
  /** Show progress bar */
  showProgress?: boolean;
  /** Title text */
  title?: string;
  /** Additional CSS classes */
  className?: string;
}

const fieldStatusConfig: Record<
  ProcessingFieldStatus,
  { icon: React.ReactNode; textClass: string }
> = {
  pending: {
    icon: <div className="w-3 h-3 rounded-full bg-slate-200" />,
    textClass: 'text-slate-400',
  },
  extracting: {
    icon: (
      <motion.div
        className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    ),
    textClass: 'text-blue-600',
  },
  complete: {
    icon: (
      <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    textClass: 'text-slate-700',
  },
  error: {
    icon: (
      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    ),
    textClass: 'text-red-600',
  },
};

/**
 * Step-by-step extraction progress display
 *
 * Shows progress of extracting/processing multiple fields with
 * individual status indicators.
 *
 * @example
 * ```tsx
 * <ProcessingSteps
 *   title="Extracting transaction details..."
 *   fields={[
 *     { name: 'Transaction ID', status: 'complete', value: 'TXN_123456' },
 *     { name: 'Amount', status: 'complete', value: '$500.00' },
 *     { name: 'Customer Name', status: 'extracting' },
 *     { name: 'Payment Method', status: 'pending' }
 *   ]}
 *   progress={50}
 *   showProgress
 * />
 * ```
 */
export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({
  fields,
  progress = 0,
  showProgress = true,
  title = 'Processing...',
  className = '',
}) => {
  const completedCount = fields.filter((f) => f.status === 'complete').length;
  const calculatedProgress =
    progress > 0 ? progress : Math.round((completedCount / fields.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        border border-slate-200 rounded-lg p-4
        bg-white
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-700">{title}</span>
        {showProgress && (
          <span className="text-xs text-slate-500">
            {completedCount}/{fields.length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${calculatedProgress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* Fields list */}
      <div className="space-y-2">
        {fields.map((field, index) => {
          const config = fieldStatusConfig[field.status];

          return (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              {/* Status icon */}
              <div className="shrink-0 w-3 h-3">{config.icon}</div>

              {/* Field name */}
              <span className={`text-sm ${config.textClass} flex-1`}>{field.name}</span>

              {/* Extracted value */}
              {field.status === 'complete' && field.value && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium text-slate-900 truncate max-w-[150px]"
                  title={field.value}
                >
                  {field.value}
                </motion.span>
              )}

              {/* Extracting indicator */}
              {field.status === 'extracting' && (
                <span className="text-xs text-blue-500">extracting...</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProcessingSteps;
