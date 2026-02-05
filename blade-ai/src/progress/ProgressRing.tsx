import React from 'react';
import { motion } from 'motion/react';

export type ProgressRingSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ProgressRingProps {
  /** Current value */
  value: number;
  /** Maximum value */
  max?: number;
  /** Size variant */
  size?: ProgressRingSize;
  /** Show label in center */
  label?: string | React.ReactNode;
  /** Ring color */
  color?: string;
  /** Track color */
  trackColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Additional CSS classes */
  className?: string;
  /** Animate the progress */
  animate?: boolean;
}

const sizeConfig: Record<ProgressRingSize, { size: number; stroke: number; fontSize: string }> = {
  sm: { size: 32, stroke: 3, fontSize: 'text-xs' },
  md: { size: 48, stroke: 4, fontSize: 'text-sm' },
  lg: { size: 64, stroke: 5, fontSize: 'text-base' },
  xl: { size: 96, stroke: 6, fontSize: 'text-xl' },
};

/**
 * Circular progress indicator
 *
 * Animated circular progress with optional center label.
 *
 * @example
 * ```tsx
 * <ProgressRing value={75} max={100} size="lg" />
 *
 * <ProgressRing
 *   value={3}
 *   max={5}
 *   size="md"
 *   label={<span className="font-bold">3/5</span>}
 *   color="#22c55e"
 * />
 * ```
 */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size = 'md',
  label,
  color = '#3b82f6',
  trackColor = '#e2e8f0',
  strokeWidth,
  className = '',
  animate = true,
}) => {
  const config = sizeConfig[size];
  const actualStrokeWidth = strokeWidth ?? config.stroke;
  const svgSize = config.size;
  const radius = (svgSize - actualStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const offset = circumference * (1 - percentage);

  const displayLabel = label ?? `${Math.round(percentage * 100)}%`;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: svgSize, height: svgSize }}
    >
      <svg
        className="transform -rotate-90"
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
      >
        {/* Track */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={actualStrokeWidth}
        />

        {/* Progress */}
        <motion.circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={actualStrokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Center label */}
      <div
        className={`
          absolute inset-0
          flex items-center justify-center
          ${config.fontSize} font-medium text-slate-700
        `}
      >
        {displayLabel}
      </div>
    </div>
  );
};

export default ProgressRing;
