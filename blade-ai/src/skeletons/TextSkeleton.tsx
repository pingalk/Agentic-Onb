import React from 'react';

export type SkeletonAnimation = 'pulse' | 'shimmer' | 'none';

export interface TextSkeletonProps {
  /** Number of lines */
  lines?: number;
  /** Width of lines (can be percentage or pixels) */
  width?: string | number;
  /** Line height */
  lineHeight?: 'sm' | 'md' | 'lg';
  /** Animation type */
  animate?: SkeletonAnimation;
  /** Vary line widths naturally */
  natural?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const lineHeightMap = {
  sm: 'h-3',
  md: 'h-4',
  lg: 'h-5',
};

/**
 * Text loading skeleton
 *
 * Placeholder for loading text content.
 *
 * @example
 * ```tsx
 * // Paragraph skeleton
 * <TextSkeleton lines={4} natural animate="shimmer" />
 *
 * // Single line with fixed width
 * <TextSkeleton lines={1} width={200} />
 * ```
 */
export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  width,
  lineHeight = 'md',
  animate = 'shimmer',
  natural = true,
  className = '',
}) => {
  const animationClass =
    animate === 'shimmer'
      ? 'blade-ai-shimmer-bg'
      : animate === 'pulse'
        ? 'animate-pulse'
        : '';

  const heightClass = lineHeightMap[lineHeight];

  // Natural line widths for paragraph-like appearance
  const naturalWidths = ['100%', '95%', '85%', '90%', '70%', '80%', '60%'];

  const getLineWidth = (index: number): string | number => {
    if (width !== undefined) {
      return typeof width === 'number' ? `${width}px` : width;
    }

    if (natural) {
      // Last line is often shorter
      if (index === lines - 1) {
        return naturalWidths[(index + 4) % naturalWidths.length];
      }
      return naturalWidths[index % naturalWidths.length];
    }

    return '100%';
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${heightClass} bg-slate-200 rounded ${animationClass}`}
          style={{
            width: getLineWidth(index),
            animationDelay:
              animate === 'shimmer' ? `${index * 100}ms` : undefined,
          }}
        />
      ))}
    </div>
  );
};

export default TextSkeleton;
