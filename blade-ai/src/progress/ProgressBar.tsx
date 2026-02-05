import React from 'react';
import { motion } from 'motion/react';

export type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error' | 'gradient';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  /** Current value */
  value: number;
  /** Maximum value */
  max?: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Label position */
  labelPosition?: 'inside' | 'right' | 'top';
  /** Visual variant */
  variant?: ProgressBarVariant;
  /** Size */
  size?: ProgressBarSize;
  /** Additional CSS classes */
  className?: string;
  /** Animate the progress */
  animate?: boolean;
  /** Indeterminate loading state */
  indeterminate?: boolean;
}

const variantColors: Record<ProgressBarVariant, string> = {
  default: 'bg-blue-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
};

const sizeConfig: Record<ProgressBarSize, { height: string; fontSize: string }> = {
  sm: { height: 'h-1', fontSize: 'text-xs' },
  md: { height: 'h-2', fontSize: 'text-sm' },
  lg: { height: 'h-3', fontSize: 'text-sm' },
};

/**
 * Linear progress bar
 *
 * Horizontal progress indicator with various styles.
 *
 * @example
 * ```tsx
 * <ProgressBar value={65} showLabel />
 *
 * <ProgressBar
 *   value={uploading}
 *   max={fileSize}
 *   variant="success"
 *   showLabel
 *   labelPosition="right"
 * />
 *
 * // Indeterminate loading
 * <ProgressBar indeterminate />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = false,
  labelPosition = 'right',
  variant = 'default',
  size = 'md',
  className = '',
  animate = true,
  indeterminate = false,
}) => {
  const percentage = indeterminate ? 0 : Math.min(Math.max((value / max) * 100, 0), 100);
  const { height, fontSize } = sizeConfig[size];
  const colorClass = variantColors[variant];

  const label = `${Math.round(percentage)}%`;

  return (
    <div className={className}>
      {/* Top label */}
      {showLabel && labelPosition === 'top' && (
        <div className="flex justify-between mb-1">
          <span className={`${fontSize} text-slate-600`}>Progress</span>
          <span className={`${fontSize} font-medium text-slate-700`}>{label}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Track */}
        <div
          className={`
            flex-1 ${height} rounded-full overflow-hidden
            bg-slate-200
          `}
        >
          {indeterminate ? (
            // Indeterminate animation
            <motion.div
              className={`h-full w-1/3 rounded-full ${colorClass}`}
              animate={{
                x: ['-100%', '400%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ) : (
            // Determinate progress
            <motion.div
              className={`h-full rounded-full ${colorClass}`}
              initial={animate ? { width: 0 } : false}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )}
        </div>

        {/* Right label */}
        {showLabel && labelPosition === 'right' && !indeterminate && (
          <span className={`${fontSize} font-medium text-slate-700 min-w-[3em] text-right`}>
            {label}
          </span>
        )}
      </div>

      {/* Inside label (only for lg size) */}
      {showLabel && labelPosition === 'inside' && size === 'lg' && !indeterminate && (
        <div
          className="relative -mt-3 h-3 flex items-center"
          style={{ paddingLeft: `${Math.max(percentage - 5, 0)}%` }}
        >
          <span className="text-[10px] font-medium text-white drop-shadow">{label}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
