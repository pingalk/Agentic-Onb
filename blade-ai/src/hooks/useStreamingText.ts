import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseStreamingTextOptions {
  /** Characters per second */
  speed?: number;
  /** Callback when streaming completes */
  onComplete?: () => void;
  /** Auto-start streaming */
  autoStart?: boolean;
}

export interface UseStreamingTextReturn {
  /** Current displayed text */
  text: string;
  /** Whether streaming has completed */
  isComplete: boolean;
  /** Whether currently streaming */
  isStreaming: boolean;
  /** Start streaming the text */
  start: (content: string) => void;
  /** Stop streaming */
  stop: () => void;
  /** Reset to initial state */
  reset: () => void;
  /** Skip to end of text */
  skipToEnd: () => void;
}

/**
 * Hook for character-by-character text streaming
 *
 * @example
 * ```tsx
 * const { text, isComplete, start } = useStreamingText({ speed: 50 });
 *
 * useEffect(() => {
 *   start("Hello, how can I help you today?");
 * }, []);
 *
 * return <p>{text}{!isComplete && <span className="cursor">|</span>}</p>;
 * ```
 */
export function useStreamingText(
  options: UseStreamingTextOptions = {}
): UseStreamingTextReturn {
  const { speed = 30, onComplete, autoStart = false } = options;

  const [text, setText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const contentRef = useRef('');
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearInterval = useCallback(() => {
    if (intervalRef.current) {
      globalThis.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clearInterval();
    setIsStreaming(false);
  }, [clearInterval]);

  const reset = useCallback(() => {
    stop();
    setText('');
    setIsComplete(false);
    contentRef.current = '';
    indexRef.current = 0;
  }, [stop]);

  const skipToEnd = useCallback(() => {
    stop();
    setText(contentRef.current);
    setIsComplete(true);
    onComplete?.();
  }, [stop, onComplete]);

  const start = useCallback(
    (content: string) => {
      clearInterval();
      contentRef.current = content;
      indexRef.current = 0;
      setText('');
      setIsComplete(false);
      setIsStreaming(true);

      const intervalMs = 1000 / speed;

      intervalRef.current = globalThis.setInterval(() => {
        if (indexRef.current < contentRef.current.length) {
          indexRef.current += 1;
          setText(contentRef.current.slice(0, indexRef.current));
        } else {
          clearInterval();
          setIsStreaming(false);
          setIsComplete(true);
          onComplete?.();
        }
      }, intervalMs);
    },
    [speed, onComplete, clearInterval]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval();
  }, [clearInterval]);

  // Auto-start support
  useEffect(() => {
    if (autoStart && contentRef.current) {
      start(contentRef.current);
    }
  }, [autoStart, start]);

  return {
    text,
    isComplete,
    isStreaming,
    start,
    stop,
    reset,
    skipToEnd,
  };
}

export default useStreamingText;
