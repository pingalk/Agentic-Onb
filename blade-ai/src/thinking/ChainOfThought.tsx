import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../primitives/Logo';

export interface ChainOfThoughtStep {
  /** Step label */
  label: string;
  /** Step status */
  status?: 'pending' | 'active' | 'complete' | 'error';
  /** Optional detail text */
  detail?: string;
}

export interface ChainOfThoughtProps {
  /** Array of thinking steps */
  steps: ChainOfThoughtStep[];
  /** Make steps collapsible */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Callback when step changes */
  onStepChange?: (stepIndex: number) => void;
  /** Auto-cycle through steps */
  autoCycle?: boolean;
  /** Interval for auto-cycling (ms) */
  cycleInterval?: number;
  /** Additional CSS classes */
  className?: string;
  /** Mode: thinking shows animation, complete shows static */
  mode?: 'thinking' | 'complete';
}

/**
 * Collapsible reasoning steps display
 *
 * Shows AI chain of thought process with animated step transitions.
 * Can auto-cycle through steps or be manually controlled.
 *
 * @example
 * ```tsx
 * // Auto-cycling thinking steps
 * <ChainOfThought
 *   steps={[
 *     { label: 'Parsing query...', status: 'complete' },
 *     { label: 'Searching database...', status: 'active' },
 *     { label: 'Formatting response...', status: 'pending' }
 *   ]}
 *   autoCycle
 *   cycleInterval={1500}
 * />
 *
 * // Collapsible with details
 * <ChainOfThought
 *   steps={[
 *     { label: 'Found 15 matching records', status: 'complete', detail: 'Query took 0.3s' },
 *     { label: 'Applied filters', status: 'complete', detail: 'Date range: 30 days' }
 *   ]}
 *   collapsible
 *   defaultCollapsed
 * />
 * ```
 */
export const ChainOfThought: React.FC<ChainOfThoughtProps> = ({
  steps,
  collapsible = false,
  defaultCollapsed = false,
  onStepChange,
  autoCycle = false,
  cycleInterval = 1200,
  className = '',
  mode = 'thinking',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const isThinking = mode === 'thinking';

  // Auto-cycle through steps
  useEffect(() => {
    if (!autoCycle || !isThinking || steps.length === 0) return;

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        const next = (prev + 1) % steps.length;
        onStepChange?.(next);
        return next;
      });
    }, cycleInterval);

    return () => clearInterval(interval);
  }, [autoCycle, isThinking, steps.length, cycleInterval, onStepChange]);

  const activeStep = steps[activeStepIndex];

  const getStatusIcon = (status: ChainOfThoughtStep['status']) => {
    switch (status) {
      case 'complete':
        return (
          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'active':
        return (
          <motion.div
            className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        );
      default:
        return <div className="w-4 h-4 rounded-full bg-slate-200" />;
    }
  };

  // Compact view (single step cycling)
  if (autoCycle && isThinking) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-3 ${className}`}
      >
        <Logo size="md" animate="rotate" />

        <div className="h-[26px] relative min-w-[200px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeStepIndex}
              initial={{ y: 12, opacity: 0, filter: 'blur(6px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -12, opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.3 }}
              className="
                absolute left-0 top-0 whitespace-nowrap
                text-[15px] leading-[26px]
                bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600
                bg-[length:200%_100%] bg-clip-text text-transparent
              "
              style={{
                animation: 'blade-ai-shimmer 2s linear infinite',
              }}
            >
              {activeStep?.label}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Full list view
  return (
    <div className={className}>
      {/* Header (collapsible toggle) */}
      {collapsible && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="
            flex items-center gap-2 w-full
            px-3 py-2 rounded-lg
            text-sm font-medium text-slate-600
            hover:bg-slate-50 transition-colors
          "
        >
          <motion.svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isCollapsed ? 0 : 90 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </motion.svg>
          <span>Reasoning steps ({steps.length})</span>
        </button>
      )}

      {/* Steps list */}
      <AnimatePresence>
        {(!collapsible || !isCollapsed) && (
          <motion.div
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pt-2">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 px-3"
                >
                  <div className="shrink-0 mt-0.5">{getStatusIcon(step.status)}</div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        step.status === 'complete'
                          ? 'text-slate-600'
                          : step.status === 'error'
                            ? 'text-red-600'
                            : step.status === 'active'
                              ? 'text-slate-900 font-medium'
                              : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.detail && (
                      <p className="text-xs text-slate-400 mt-0.5">{step.detail}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChainOfThought;
