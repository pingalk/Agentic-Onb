import React from 'react';

export type SkeletonAnimation = 'pulse' | 'shimmer' | 'none';

export interface TableSkeletonProps {
  /** Number of columns */
  columns?: number;
  /** Number of rows */
  rows?: number;
  /** Show header row */
  showHeader?: boolean;
  /** Animation type */
  animate?: SkeletonAnimation;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Table loading skeleton
 *
 * Placeholder for loading table content.
 *
 * @example
 * ```tsx
 * <TableSkeleton columns={5} rows={8} showHeader animate="shimmer" />
 * ```
 */
export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns = 4,
  rows = 5,
  showHeader = true,
  animate = 'shimmer',
  className = '',
}) => {
  const animationClass =
    animate === 'shimmer'
      ? 'blade-ai-shimmer-bg'
      : animate === 'pulse'
        ? 'animate-pulse'
        : '';

  // Varying widths for more natural look
  const getWidth = (colIndex: number, isHeader: boolean) => {
    if (isHeader) return '60%';
    const widths = ['80%', '60%', '90%', '70%', '50%'];
    return widths[(colIndex * 3 + rows) % widths.length];
  };

  return (
    <div className={`overflow-hidden rounded-lg border border-slate-200 ${className}`}>
      <table className="w-full">
        {/* Header */}
        {showHeader && (
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <th key={colIndex} className="px-4 py-3 text-left">
                  <div
                    className={`h-4 bg-slate-200 rounded ${animationClass}`}
                    style={{ width: getWidth(colIndex, true) }}
                  />
                </th>
              ))}
            </tr>
          </thead>
        )}

        {/* Body */}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-slate-100 last:border-b-0"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <div
                    className={`h-4 bg-slate-100 rounded ${animationClass}`}
                    style={{
                      width: getWidth(colIndex + rowIndex, false),
                      animationDelay:
                        animate === 'shimmer'
                          ? `${(rowIndex * 100 + colIndex * 50) % 500}ms`
                          : undefined,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
