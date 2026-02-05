import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

interface AnimatedLoadingCardProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingHeight?: number;
  borderRadius?: string;
  className?: string;
}

// Spotlight border configuration
const SPOTLIGHT_SPEED = 3.5; // seconds per rotation (slower, more elegant)
const SPOTLIGHT_INTENSITY = 0.7;
const GLOW_BLUR = 4;
const LIGHT_COUNT = 2;

// Generate conic gradient with evenly distributed spotlights using magic color
// Uses CSS color-mix for opacity with CSS variable support
const generateSpotlightGradient = (isGlow: boolean) => {
  const spotlightSize = 14 / LIGHT_COUNT;
  const segmentSize = 100 / LIGHT_COUNT;
  const stops: string[] = [];

  for (let i = 0; i < LIGHT_COUNT; i++) {
    const start = i * segmentSize;
    const spotStart = start + segmentSize - spotlightSize - 2;
    const spotMid1 = start + segmentSize - spotlightSize + 4;
    const spotMid2 = start + segmentSize - 6;
    const spotEnd = start + segmentSize - 2;

    if (isGlow) {
      stops.push(`transparent ${spotStart}%`);
      stops.push(`color-mix(in srgb, var(--magic-primary, #10b981) ${Math.round(0.9 * SPOTLIGHT_INTENSITY * 100)}%, transparent) ${spotMid1}%`);
      stops.push(`color-mix(in srgb, var(--magic-primary, #10b981) ${Math.round(0.8 * SPOTLIGHT_INTENSITY * 100)}%, transparent) ${spotMid2}%`);
      stops.push(`transparent ${spotEnd}%`);
    } else {
      stops.push(`transparent ${spotStart}%`);
      stops.push(`rgba(255, 255, 255, ${SPOTLIGHT_INTENSITY}) ${spotMid1}%`);
      stops.push(`color-mix(in srgb, var(--magic-primary, #10b981) ${Math.round(SPOTLIGHT_INTENSITY * 100)}%, transparent) ${spotMid2}%`);
      stops.push(`color-mix(in srgb, var(--magic-primary, #10b981) ${Math.round(SPOTLIGHT_INTENSITY * 80)}%, transparent) ${spotEnd}%`);
    }
  }
  stops.push('transparent 100%');
  return `conic-gradient(from var(--spotlight-angle), ${stops.join(', ')})`;
};

export const AnimatedLoadingCard: React.FC<AnimatedLoadingCardProps> = ({
  isLoading,
  children,
  loadingHeight = 48,
  borderRadius = '12px',
  className
}) => {
  const [state, setState] = useState<'loading' | 'expanding' | 'revealing' | 'complete'>(
    isLoading ? 'loading' : 'complete'
  );
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Measure content height when it becomes available
  useEffect(() => {
    if (measureRef.current && !isLoading) {
      const height = measureRef.current.offsetHeight;
      setContentHeight(height);
    }
  }, [isLoading, children]);

  // State machine transitions
  useEffect(() => {
    if (isLoading) {
      setState('loading');
      return;
    }

    // isLoading became false - start expansion
    if (state === 'loading') {
      setState('expanding');
    }
  }, [isLoading, state]);

  // Handle expansion completion -> reveal
  const handleExpandComplete = () => {
    if (state === 'expanding') {
      setState('revealing');
    }
  };

  // Handle reveal completion -> complete
  useEffect(() => {
    if (state === 'revealing') {
      const timer = setTimeout(() => {
        setState('complete');
      }, 400); // Match reveal animation duration
      return () => clearTimeout(timer);
    }
  }, [state]);

  const showSpotlight = state === 'loading' || state === 'expanding';
  const showContent = state === 'revealing' || state === 'complete';

  // Calculate current height
  const getHeight = () => {
    if (state === 'loading') return loadingHeight;
    if (state === 'expanding' || state === 'revealing' || state === 'complete') {
      return contentHeight || 'auto';
    }
    return 'auto';
  };

  return (
    <div className={clsx('relative', className)}>
      {/* Hidden measurement div */}
      <div
        ref={measureRef}
        className="absolute invisible pointer-events-none"
        style={{ width: '100%' }}
      >
        {children}
      </div>

      {/* Main animated container */}
      <motion.div
        ref={contentRef}
        className="relative overflow-hidden bg-white"
        style={{ borderRadius }}
        initial={{ height: loadingHeight }}
        animate={{
          height: getHeight(),
        }}
        transition={{
          height: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
          }
        }}
        onAnimationComplete={() => {
          if (state === 'expanding') {
            handleExpandComplete();
          }
        }}
      >
        {/* Content with fade-in */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state placeholder (subtle gradient) */}
        {state === 'loading' && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />
        )}
      </motion.div>

      {/* Spotlight border animation */}
      <AnimatePresence>
        {showSpotlight && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main spotlight stroke */}
            <div
              className="absolute -inset-[1px] pointer-events-none"
              style={{
                background: generateSpotlightGradient(false),
                animation: `spotlightRotate ${SPOTLIGHT_SPEED}s linear infinite`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
                padding: '2px',
                borderRadius,
              }}
            />

            {/* Glow halo */}
            <div
              className="absolute -inset-[4px] pointer-events-none"
              style={{
                background: generateSpotlightGradient(true),
                animation: `spotlightRotate ${SPOTLIGHT_SPEED}s linear infinite`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
                padding: '6px',
                borderRadius: `calc(${borderRadius} + 4px)`,
                filter: `blur(${GLOW_BLUR}px)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Required CSS for animations */}
      <style>{`
        @property --spotlight-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes spotlightRotate {
          0% { --spotlight-angle: 0deg; }
          100% { --spotlight-angle: 360deg; }
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedLoadingCard;
