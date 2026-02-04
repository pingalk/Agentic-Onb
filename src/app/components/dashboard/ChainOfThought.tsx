import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { useDemo } from '@/context/DemoContext';
import { thinkingSteps, defaultThinkingSteps } from './useDemoScript';

// Ray icon SVG path - same as the main Ray component
const RAY_PATH = "M12 12L14.25 3H21V9.75L12 12L21 14.25V21H14.25L12 12L9.75001 21H3.00001V14.25L12 12L3.00001 9.75V3H9.75001L12 12Z";

const RayIcon = () => (
  <svg
    className="block size-full"
    fill="none"
    preserveAspectRatio="none"
    viewBox="0 0 24 24"
  >
    <path
      d={RAY_PATH}
      fill="#009E5C"
    />
  </svg>
);

export interface ChainOfThoughtProps {
  steps?: string[];
  stepInterval?: number;
  isPaused?: boolean;
  onComplete?: () => void;
  mode?: 'thinking' | 'complete';
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  highlightedSuggestionIndex?: number | null;
}

export const ChainOfThought: React.FC<ChainOfThoughtProps> = ({
  steps: propSteps,
  stepInterval = 1200,
  isPaused = false,
  onComplete,
  mode = 'thinking',
  suggestions = [],
  onSuggestionClick,
  highlightedSuggestionIndex = null
}) => {
  // Auto-detect persona from context if no steps provided
  const { currentPersonaId } = useDemo();
  const steps = propSteps || thinkingSteps[currentPersonaId] || defaultThinkingSteps;

  const [stepIndex, setStepIndex] = useState(0);

  const isThinking = mode === 'thinking';
  const isComplete = mode === 'complete';

  // Cycle through thinking steps only in thinking mode
  useEffect(() => {
    if (!isThinking || isPaused) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          return 0;
        }
        return next;
      });
    }, stepInterval);

    return () => clearInterval(interval);
  }, [steps.length, stepInterval, isPaused, isThinking]);

  // Call onComplete when mode changes to complete
  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  const currentStep = steps[stepIndex];
  const shouldRotate = isThinking && !isPaused;

  // Determine display text based on mode
  const displayText = isComplete ? "How can I help you next?" : currentStep;
  const textKey = isComplete ? 'complete' : `step-${stepIndex}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-3"
    >
      <style>{`
        @keyframes shimmerGreen {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Ray icon + Text row */}
      <div className="flex items-center gap-3 px-0">
        {/* Ray icon with stepped rotation */}
        <motion.div
          className="w-6 h-6 shrink-0"
          animate={shouldRotate ? {
            rotate: [0, 90, 90, 180, 180, 270, 270, 360]
          } : { rotate: 0 }}
          transition={shouldRotate ? {
            duration: 2,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
            times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 1]
          } : { duration: 0.3 }}
          style={{
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          <RayIcon />
        </motion.div>

        {/* Flipping text - shimmer in thinking mode, static in complete mode */}
        <div className="h-[26px] relative min-w-[200px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={textKey}
              initial={{ y: 12, opacity: 0, filter: 'blur(6px)' }}
              animate={{
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                transition: {
                  y: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
                  opacity: { duration: 0.35, ease: 'easeOut' },
                  filter: { duration: 0.4, ease: 'easeOut' }
                }
              }}
              exit={{
                y: -12,
                opacity: 0,
                filter: 'blur(6px)',
                transition: {
                  y: { duration: 0.3, ease: [0.4, 0, 1, 1] },
                  opacity: { duration: 0.25, ease: 'easeIn' },
                  filter: { duration: 0.25, ease: 'easeIn' }
                }
              }}
              className={clsx(
                "absolute left-0 top-0 whitespace-nowrap",
                "text-[16px] leading-[26px] tracking-[0.16px]",
                isThinking && [
                  "bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600",
                  "bg-[length:200%_100%] bg-clip-text text-transparent"
                ],
                isComplete && "text-[#40566d]"
              )}
              style={isThinking ? {
                animation: 'shimmerGreen 2s linear infinite',
                animationPlayState: isPaused ? 'paused' : 'running'
              } : undefined}
            >
              {displayText}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Suggestions - only shown in complete mode */}
      {isComplete && suggestions.length > 0 && (
        <div className="flex flex-col gap-1 pl-9">
          {suggestions.map((suggestion, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, x: -8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{
                delay: 0.05 + idx * 0.08,
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              onClick={() => onSuggestionClick?.(suggestion)}
              className={clsx(
                "text-left px-3 py-2 text-sm font-medium rounded-lg transition-all",
                "hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
                highlightedSuggestionIndex === idx
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600"
              )}
            >
              <span className="text-[#40566d] mr-2">{idx + 1}.</span>
              {suggestion}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ChainOfThought;
