import { useRef, useState, useCallback, useEffect } from 'react';

export interface UseAutoScrollOptions {
  /** Threshold in pixels from bottom to consider "at bottom" */
  threshold?: number;
  /** Smooth or instant scroll behavior */
  behavior?: ScrollBehavior;
  /** Auto-scroll when new content is added */
  autoScrollOnChange?: boolean;
}

export interface UseAutoScrollReturn {
  /** Ref to attach to scrollable container */
  scrollRef: React.RefObject<HTMLDivElement>;
  /** Whether user is at the bottom of the container */
  isAtBottom: boolean;
  /** Scroll to bottom of container */
  scrollToBottom: (options?: { instant?: boolean }) => void;
  /** Scroll to top of container */
  scrollToTop: (options?: { instant?: boolean }) => void;
  /** Scroll to a specific element */
  scrollToElement: (element: HTMLElement, options?: { instant?: boolean }) => void;
  /** Check if content is scrollable */
  isScrollable: boolean;
}

/**
 * Hook for managing auto-scroll behavior in chat/message lists
 *
 * @example
 * ```tsx
 * const { scrollRef, isAtBottom, scrollToBottom } = useAutoScroll({
 *   threshold: 100,
 *   autoScrollOnChange: true
 * });
 *
 * return (
 *   <div ref={scrollRef} className="overflow-y-auto h-full">
 *     {messages.map(m => <Message key={m.id} {...m} />)}
 *     {!isAtBottom && (
 *       <button onClick={() => scrollToBottom()}>
 *         Scroll to bottom
 *       </button>
 *     )}
 *   </div>
 * );
 * ```
 */
export function useAutoScroll(
  options: UseAutoScrollOptions = {}
): UseAutoScrollReturn {
  const {
    threshold = 50,
    behavior = 'smooth',
    autoScrollOnChange = true,
  } = options;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);

  const checkIsAtBottom = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight <= threshold;
  }, [threshold]);

  const checkIsScrollable = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return false;
    return container.scrollHeight > container.clientHeight;
  }, []);

  const scrollToBottom = useCallback(
    (opts?: { instant?: boolean }) => {
      const container = scrollRef.current;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: opts?.instant ? 'instant' : behavior,
      });
    },
    [behavior]
  );

  const scrollToTop = useCallback(
    (opts?: { instant?: boolean }) => {
      const container = scrollRef.current;
      if (!container) return;

      container.scrollTo({
        top: 0,
        behavior: opts?.instant ? 'instant' : behavior,
      });
    },
    [behavior]
  );

  const scrollToElement = useCallback(
    (element: HTMLElement, opts?: { instant?: boolean }) => {
      const container = scrollRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: relativeTop,
        behavior: opts?.instant ? 'instant' : behavior,
      });
    },
    [behavior]
  );

  // Handle scroll events
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsAtBottom(checkIsAtBottom());
      setIsScrollable(checkIsScrollable());
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [checkIsAtBottom, checkIsScrollable]);

  // Handle resize
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      setIsScrollable(checkIsScrollable());
      if (autoScrollOnChange && isAtBottom) {
        scrollToBottom({ instant: true });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [checkIsScrollable, autoScrollOnChange, isAtBottom, scrollToBottom]);

  // Handle content changes via MutationObserver
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !autoScrollOnChange) return;

    const mutationObserver = new MutationObserver(() => {
      setIsScrollable(checkIsScrollable());
      if (isAtBottom) {
        scrollToBottom();
      }
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [autoScrollOnChange, isAtBottom, scrollToBottom, checkIsScrollable]);

  return {
    scrollRef,
    isAtBottom,
    scrollToBottom,
    scrollToTop,
    scrollToElement,
    isScrollable,
  };
}

export default useAutoScroll;
