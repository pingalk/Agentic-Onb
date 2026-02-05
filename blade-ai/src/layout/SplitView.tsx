import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type SplitRatio = '1:1' | '1:2' | '2:1' | '1:3' | '3:1';

export interface SplitViewProps {
  /** Left panel content */
  left: React.ReactNode;
  /** Right panel content */
  right: React.ReactNode;
  /** Split ratio (left:right) */
  ratio?: SplitRatio;
  /** Right panel is collapsible */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Collapsed state (controlled) */
  collapsed?: boolean;
  /** Called when collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Minimum width for panels (px) */
  minWidth?: number;
  /** Gap between panels */
  gap?: 'none' | 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const ratioMap: Record<SplitRatio, { left: string; right: string }> = {
  '1:1': { left: 'flex-1', right: 'flex-1' },
  '1:2': { left: 'w-1/3', right: 'w-2/3' },
  '2:1': { left: 'w-2/3', right: 'w-1/3' },
  '1:3': { left: 'w-1/4', right: 'w-3/4' },
  '3:1': { left: 'w-3/4', right: 'w-1/4' },
};

const gapMap: Record<string, string> = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

/**
 * Side-by-side layout
 *
 * Split view for chat alongside artifact panel.
 *
 * @example
 * ```tsx
 * <SplitView
 *   left={<MessageList messages={messages} />}
 *   right={<ArtifactViewer artifact={artifact} />}
 *   ratio="2:1"
 *   collapsible
 * />
 * ```
 */
export const SplitView: React.FC<SplitViewProps> = ({
  left,
  right,
  ratio = '1:1',
  collapsible = false,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  minWidth = 300,
  gap = 'md',
  className = '',
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const toggleCollapse = () => {
    const newValue = !isCollapsed;
    setInternalCollapsed(newValue);
    onCollapsedChange?.(newValue);
  };

  const { left: leftClass, right: rightClass } = ratioMap[ratio];

  return (
    <div className={`flex h-full ${gapMap[gap]} ${className}`}>
      {/* Left panel */}
      <div
        className={`
          h-full overflow-hidden
          ${isCollapsed ? 'flex-1' : leftClass}
          transition-all duration-300
        `}
        style={{ minWidth: isCollapsed ? undefined : minWidth }}
      >
        {left}
      </div>

      {/* Right panel */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`
              h-full overflow-hidden
              ${rightClass}
              relative
            `}
            style={{ minWidth }}
          >
            {/* Collapse button */}
            {collapsible && (
              <button
                onClick={toggleCollapse}
                className="
                  absolute top-4 left-0 z-10
                  w-6 h-12 -ml-3
                  flex items-center justify-center
                  bg-white border border-slate-200 rounded-r-lg
                  text-slate-400 hover:text-slate-600
                  shadow-sm
                  transition-colors
                "
                aria-label="Collapse panel"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
            {right}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand button when collapsed */}
      {collapsible && isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="
            shrink-0
            w-8 h-full
            flex items-center justify-center
            bg-slate-50 border-l border-slate-200
            text-slate-400 hover:text-slate-600 hover:bg-slate-100
            transition-colors
          "
          aria-label="Expand panel"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SplitView;
