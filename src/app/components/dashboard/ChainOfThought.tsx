import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { defaultThinkingSteps } from './useDemoScript';
import Ray from '@/imports/Ray';

export interface ChainOfThoughtProps {
  steps?: string[];
  stepInterval?: number;
  isPaused?: boolean;
  onComplete?: () => void;
  mode?: 'waiting' | 'streaming' | 'complete';
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  highlightedSuggestionIndex?: number | null;
}

export const ChainOfThought: React.FC<ChainOfThoughtProps> = ({
  steps: propSteps,
  stepInterval = 3000,
  isPaused = false,
  onComplete,
  mode = 'waiting',
  suggestions = [],
  onSuggestionClick,
  highlightedSuggestionIndex = null
}) => {
  // Use provided steps or default thinking steps
  const steps = propSteps || defaultThinkingSteps;

  const [stepIndex, setStepIndex] = useState(0);

  const isWaiting = mode === 'waiting';
  const isStreaming = mode === 'streaming';
  const isComplete = mode === 'complete';

  // Cycle through thinking steps only in waiting mode
  useEffect(() => {
    if (!isWaiting || isPaused) return;

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
  }, [steps.length, stepInterval, isPaused, isWaiting]);

  // Call onComplete when mode changes to complete
  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  const currentStep = steps[stepIndex];
  // Rotate icon in waiting or streaming mode (not complete)
  const shouldRotate = (isWaiting || isStreaming) && !isPaused;

  // Determine display text based on mode
  // - waiting: show cycling shimmery text
  // - streaming: no text
  // - complete: static "How can I help you next?"
  const displayText = isComplete ? "How can I help you next?" : currentStep;
  const textKey = isComplete ? 'complete' : `step-${stepIndex}`;

  // Show text in waiting mode (shimmery) only
  const shouldShowText = isWaiting;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-3"
    >
      <style>{`
        @keyframes shimmerMagic {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .shimmer-magic {
          background: linear-gradient(90deg, var(--magic-primary, #009E5C) 0%, var(--magic-gradient-light, rgba(0, 158, 92, 0.5)) 50%, var(--magic-primary, #009E5C) 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmerMagic 2s linear infinite;
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
          <Ray static />
        </motion.div>

        {/* Text - shown in waiting mode (shimmery) and complete mode (static) */}
        {shouldShowText && (
          <div className="relative min-w-[200px] flex items-center">
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
                  "whitespace-nowrap text-[16px] leading-[26px] tracking-[0.16px]",
                  isWaiting ? "shimmer-magic" : "text-[#40566d]"
                )}
              >
                {displayText}
              </motion.span>
            </AnimatePresence>
          </div>
        )}
      </div>


      {/* Suggestions - only shown in complete mode */}
      {/* All suggestions look the same but clicking any triggers the first suggestion's action */}
      {isComplete && suggestions.length > 0 && (
        <div className="flex flex-col gap-1 pl-9">
          {suggestions.map((suggestion, idx) => {
            // All suggestions look active, but clicking any triggers the first suggestion
            const firstSuggestion = suggestions[0];
            return (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -8, filter: 'blur(3px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: 0.05 + idx * 0.08,
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                onClick={() => onSuggestionClick?.(firstSuggestion)}
                className={clsx(
                  "text-left px-3 py-2 text-sm font-medium rounded-lg transition-all",
                  "hover:bg-black/[0.04] active:bg-black/[0.06] cursor-pointer",
                  highlightedSuggestionIndex === idx
                    ? "bg-black/[0.04] text-slate-900"
                    : "text-slate-600"
                )}
              >
                <span className="mr-2 text-[#40566d]">{idx + 1}.</span>
                {suggestion}
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default ChainOfThought;
