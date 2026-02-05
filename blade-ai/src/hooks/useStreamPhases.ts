import { useState, useCallback, useRef, useEffect } from 'react';

export interface StreamPhase {
  /** Unique phase ID */
  id: string;
  /** Duration in ms before moving to next phase */
  duration?: number;
  /** Delay before this phase starts */
  delay?: number;
}

export interface UseStreamPhasesOptions {
  /** Array of phases to orchestrate */
  phases: StreamPhase[];
  /** Callback when all phases complete */
  onAllComplete?: () => void;
  /** Auto-start the sequence */
  autoStart?: boolean;
}

export interface UseStreamPhasesReturn {
  /** Current active phase ID */
  currentPhase: string | null;
  /** Current phase index */
  currentIndex: number;
  /** Check if a specific phase should be shown */
  showPhase: (phaseId: string) => boolean;
  /** Check if a specific phase is active */
  isPhaseActive: (phaseId: string) => boolean;
  /** Check if a specific phase is complete */
  isPhaseComplete: (phaseId: string) => boolean;
  /** Mark current phase as complete and advance */
  completePhase: () => void;
  /** Start the phase sequence */
  start: () => void;
  /** Reset to initial state */
  reset: () => void;
  /** Whether all phases are complete */
  isAllComplete: boolean;
}

/**
 * Hook for orchestrating multi-phase streaming sequences
 *
 * @example
 * ```tsx
 * const { showPhase, isPhaseActive, completePhase, start } = useStreamPhases({
 *   phases: [
 *     { id: 'narrative', duration: 2000 },
 *     { id: 'data', delay: 500, duration: 1000 },
 *     { id: 'insight', delay: 400 },
 *     { id: 'actions' }
 *   ],
 *   autoStart: true
 * });
 *
 * return (
 *   <>
 *     {showPhase('narrative') && <Narrative onComplete={completePhase} />}
 *     {showPhase('data') && <DataTable />}
 *     {showPhase('insight') && <Insight />}
 *     {showPhase('actions') && <Actions />}
 *   </>
 * );
 * ```
 */
export function useStreamPhases(
  options: UseStreamPhasesOptions
): UseStreamPhasesReturn {
  const { phases, onAllComplete, autoStart = false } = options;

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [visiblePhases, setVisiblePhases] = useState<Set<string>>(new Set());
  const [completedPhases, setCompletedPhases] = useState<Set<string>>(new Set());
  const [isAllComplete, setIsAllComplete] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      globalThis.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const currentPhase = currentIndex >= 0 && currentIndex < phases.length
    ? phases[currentIndex].id
    : null;

  const showPhase = useCallback(
    (phaseId: string) => visiblePhases.has(phaseId),
    [visiblePhases]
  );

  const isPhaseActive = useCallback(
    (phaseId: string) => currentPhase === phaseId,
    [currentPhase]
  );

  const isPhaseComplete = useCallback(
    (phaseId: string) => completedPhases.has(phaseId),
    [completedPhases]
  );

  const advanceToPhase = useCallback(
    (index: number) => {
      if (index >= phases.length) {
        setIsAllComplete(true);
        onAllComplete?.();
        return;
      }

      const phase = phases[index];
      const delay = phase.delay || 0;

      timeoutRef.current = globalThis.setTimeout(() => {
        setCurrentIndex(index);
        setVisiblePhases((prev) => new Set([...prev, phase.id]));

        // If phase has a duration, auto-advance
        if (phase.duration) {
          timeoutRef.current = globalThis.setTimeout(() => {
            setCompletedPhases((prev) => new Set([...prev, phase.id]));
            advanceToPhase(index + 1);
          }, phase.duration);
        }
      }, delay);
    },
    [phases, onAllComplete]
  );

  const completePhase = useCallback(() => {
    clearTimeout();
    if (currentPhase) {
      setCompletedPhases((prev) => new Set([...prev, currentPhase]));
    }
    advanceToPhase(currentIndex + 1);
  }, [currentPhase, currentIndex, advanceToPhase, clearTimeout]);

  const start = useCallback(() => {
    clearTimeout();
    setCurrentIndex(-1);
    setVisiblePhases(new Set());
    setCompletedPhases(new Set());
    setIsAllComplete(false);
    advanceToPhase(0);
  }, [advanceToPhase, clearTimeout]);

  const reset = useCallback(() => {
    clearTimeout();
    setCurrentIndex(-1);
    setVisiblePhases(new Set());
    setCompletedPhases(new Set());
    setIsAllComplete(false);
  }, [clearTimeout]);

  // Auto-start support
  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart, start]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeout();
  }, [clearTimeout]);

  return {
    currentPhase,
    currentIndex,
    showPhase,
    isPhaseActive,
    isPhaseComplete,
    completePhase,
    start,
    reset,
    isAllComplete,
  };
}

export default useStreamPhases;
