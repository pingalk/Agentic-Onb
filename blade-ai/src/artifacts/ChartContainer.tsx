import React from 'react';
import { motion } from 'motion/react';
import { cardEnter } from '../primitives/animations';

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'custom';

export interface ChartContainerProps {
  /** Chart title */
  title?: string;
  /** Chart subtitle/description */
  subtitle?: string;
  /** Chart type (for display purposes) */
  type?: ChartType;
  /** Chart height */
  height?: number | string;
  /** Chart content (render your chart library here) */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Animate entry */
  animate?: boolean;
  /** Legend items */
  legend?: Array<{
    label: string;
    color: string;
  }>;
  /** Time range selector options */
  timeRanges?: string[];
  /** Current time range */
  currentTimeRange?: string;
  /** Called when time range changes */
  onTimeRangeChange?: (range: string) => void;
}

/**
 * Chart wrapper container
 *
 * Provides consistent styling and optional controls for charts.
 * Bring your own charting library (recharts, chart.js, etc.).
 *
 * @example
 * ```tsx
 * import { LineChart, Line, XAxis, YAxis } from 'recharts';
 *
 * <ChartContainer
 *   title="Revenue Trend"
 *   subtitle="Last 12 months"
 *   type="line"
 *   height={300}
 *   legend={[
 *     { label: 'Revenue', color: '#3b82f6' },
 *     { label: 'Expenses', color: '#ef4444' }
 *   ]}
 *   timeRanges={['1W', '1M', '3M', '1Y']}
 *   currentTimeRange="1M"
 *   onTimeRangeChange={setRange}
 * >
 *   <LineChart data={data}>
 *     <XAxis dataKey="month" />
 *     <YAxis />
 *     <Line dataKey="revenue" stroke="#3b82f6" />
 *   </LineChart>
 * </ChartContainer>
 * ```
 */
export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  type: _type = 'custom',
  height = 300,
  children,
  className = '',
  animate = true,
  legend,
  timeRanges,
  currentTimeRange,
  onTimeRangeChange,
}) => {
  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? { variants: cardEnter, initial: 'hidden', animate: 'visible' }
    : {};

  return (
    <Wrapper
      className={`
        bg-white rounded-xl border border-slate-200 overflow-hidden
        ${className}
      `}
      {...wrapperProps}
    >
      {/* Header */}
      {(title || timeRanges) && (
        <div className="flex items-start justify-between px-5 pt-4 pb-2">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          {/* Time range selector */}
          {timeRanges && timeRanges.length > 0 && (
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => onTimeRangeChange?.(range)}
                  className={`
                    px-3 py-1 text-xs font-medium rounded-md
                    transition-colors
                    ${
                      currentTimeRange === range
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      {legend && legend.length > 0 && (
        <div className="flex items-center gap-4 px-5 pb-2">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Chart content */}
      <div
        className="px-5 pb-5"
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
        }}
      >
        {children}
      </div>
    </Wrapper>
  );
};

export default ChartContainer;
