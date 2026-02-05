import React from 'react';

export type SkeletonAnimation = 'pulse' | 'shimmer' | 'none';

export interface CardSkeletonProps {
  /** Number of content rows */
  rows?: number;
  /** Show header section */
  showHeader?: boolean;
  /** Show action buttons */
  showActions?: boolean;
  /** Animation type */
  animate?: SkeletonAnimation;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Card loading skeleton
 *
 * Placeholder for loading card content.
 *
 * @example
 * ```tsx
 * <CardSkeleton rows={4} showHeader showActions animate="shimmer" />
 * ```
 */
export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  rows = 3,
  showHeader = true,
  showActions = false,
  animate = 'shimmer',
  className = '',
}) => {
  const animationClass =
    animate === 'shimmer'
      ? 'blade-ai-shimmer-bg'
      : animate === 'pulse'
        ? 'animate-pulse'
        : '';

  return (
    <div
      className={`
        bg-white rounded-xl border border-slate-200 overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      {showHeader && (
        <div className="px-5 py-4 border-b border-slate-100">
          <div className={`h-5 w-40 bg-slate-200 rounded ${animationClass}`} />
          <div className={`h-4 w-24 bg-slate-100 rounded mt-2 ${animationClass}`} />
        </div>
      )}

      {/* Content rows */}
      <div className="px-5 py-4 grid grid-cols-2 gap-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className={`h-3 w-16 bg-slate-100 rounded ${animationClass}`} />
            <div
              className={`h-4 bg-slate-200 rounded ${animationClass}`}
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
          <div className={`h-9 w-20 bg-slate-100 rounded-lg ${animationClass}`} />
          <div className={`h-9 w-24 bg-slate-200 rounded-lg ${animationClass}`} />
        </div>
      )}
    </div>
  );
};

export default CardSkeleton;
