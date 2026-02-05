import React from 'react';
import { motion } from 'motion/react';

export type MilestoneStatus = 'pending' | 'active' | 'complete' | 'skipped';

export interface Milestone {
  /** Milestone ID */
  id: string;
  /** Milestone label */
  label: string;
  /** Optional timestamp */
  timestamp?: string | Date;
  /** Status (overrides automatic detection) */
  status?: MilestoneStatus;
  /** Optional description */
  description?: string;
}

export interface MilestonesProps {
  /** Milestones configuration */
  milestones: Milestone[];
  /** Currently active milestone (by ID) */
  activeMilestone?: string;
  /** Click handler */
  onMilestoneClick?: (milestone: Milestone) => void;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Additional CSS classes */
  className?: string;
}

const statusConfig: Record<
  MilestoneStatus,
  { dot: string; line: string; text: string; icon?: React.ReactNode }
> = {
  pending: {
    dot: 'bg-slate-200 border-slate-300',
    line: 'bg-slate-200',
    text: 'text-slate-400',
  },
  active: {
    dot: 'bg-blue-500 border-blue-500',
    line: 'bg-slate-200',
    text: 'text-blue-600',
    icon: (
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-500"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    ),
  },
  complete: {
    dot: 'bg-emerald-500 border-emerald-500',
    line: 'bg-emerald-300',
    text: 'text-slate-700',
  },
  skipped: {
    dot: 'bg-slate-100 border-slate-300',
    line: 'bg-slate-200',
    text: 'text-slate-400 line-through',
  },
};

/**
 * Multi-step progress tracker
 *
 * Journey/timeline view for tracking milestones.
 *
 * @example
 * ```tsx
 * <Milestones
 *   milestones={[
 *     { id: 'created', label: 'Order Created', timestamp: '10:30 AM', status: 'complete' },
 *     { id: 'processing', label: 'Processing', timestamp: '10:35 AM', status: 'complete' },
 *     { id: 'shipped', label: 'Shipped', status: 'active' },
 *     { id: 'delivered', label: 'Delivered', status: 'pending' }
 *   ]}
 *   activeMilestone="shipped"
 * />
 * ```
 */
export const Milestones: React.FC<MilestonesProps> = ({
  milestones,
  activeMilestone,
  onMilestoneClick,
  orientation = 'vertical',
  className = '',
}) => {
  const isVertical = orientation === 'vertical';

  const getMilestoneStatus = (milestone: Milestone): MilestoneStatus => {
    if (milestone.status) return milestone.status;
    if (milestone.id === activeMilestone) return 'active';

    const activeIndex = milestones.findIndex((m) => m.id === activeMilestone);
    const currentIndex = milestones.findIndex((m) => m.id === milestone.id);

    if (activeIndex !== -1 && currentIndex < activeIndex) return 'complete';
    return 'pending';
  };

  const formatTimestamp = (timestamp: string | Date): string => {
    if (typeof timestamp === 'string') return timestamp;
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`
        flex
        ${isVertical ? 'flex-col' : 'flex-row items-start'}
        ${className}
      `}
    >
      {milestones.map((milestone, index) => {
        const status = getMilestoneStatus(milestone);
        const config = statusConfig[status];
        const isLast = index === milestones.length - 1;
        const isClickable = !!onMilestoneClick;

        return (
          <div
            key={milestone.id}
            className={`
              flex
              ${isVertical ? 'flex-row' : 'flex-col items-center flex-1'}
              ${isClickable ? 'cursor-pointer' : ''}
            `}
            onClick={isClickable ? () => onMilestoneClick(milestone) : undefined}
          >
            {/* Timeline dot and line */}
            <div
              className={`
                flex shrink-0
                ${isVertical ? 'flex-col items-center' : 'flex-row items-center'}
              `}
            >
              {/* Dot */}
              <div
                className={`
                  relative w-4 h-4 rounded-full
                  border-2 ${config.dot}
                  transition-colors
                `}
              >
                {config.icon}
                {status === 'complete' && (
                  <svg
                    className="absolute inset-0 w-full h-full text-white p-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`
                    ${config.line}
                    ${isVertical ? 'w-0.5 flex-1 min-h-8' : 'h-0.5 flex-1 min-w-8'}
                    transition-colors
                  `}
                />
              )}
            </div>

            {/* Content */}
            <div
              className={`
                ${isVertical ? 'ml-3 pb-6' : 'mt-2 text-center px-2'}
                ${isLast && isVertical ? 'pb-0' : ''}
              `}
            >
              <span
                className={`
                  block font-medium text-sm
                  ${config.text}
                  transition-colors
                `}
              >
                {milestone.label}
              </span>

              {milestone.timestamp && (
                <span className="block text-xs text-slate-400 mt-0.5">
                  {formatTimestamp(milestone.timestamp)}
                </span>
              )}

              {milestone.description && (
                <p className="text-xs text-slate-500 mt-1">{milestone.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Milestones;
