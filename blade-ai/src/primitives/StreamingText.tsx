import React, { useState, useEffect, useRef, useMemo } from 'react';

export type StreamingStyle = 'basic' | 'typewriter' | 'glow' | 'gradient';

export interface StreamingTextProps {
  /** The content to stream */
  content: string;
  /** Milliseconds per character */
  speed?: number;
  /** Animation style variant */
  style?: StreamingStyle;
  /** Called when streaming completes */
  onComplete?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Inherit font styles from parent (for headlines) */
  inheritStyles?: boolean;
  /** Intensity of glow/gradient effect (0-100) */
  glowIntensity?: number;
  /** Number of characters for trailing glow effect */
  trailLength?: number;
  /** Pause the streaming */
  isPaused?: boolean;
}

// TextSegment used in segments array
type TextSegment = {
  text: string;
  isBold: boolean;
};

/**
 * Character-by-character streaming text with multiple animation styles
 *
 * Supports markdown bold syntax (**text**) which is rendered as the text
 * streams. Different styles provide various visual effects for AI responses.
 *
 * @example
 * ```tsx
 * // Basic streaming
 * <StreamingText content="Hello, world!" speed={15} />
 *
 * // Typewriter with cursor
 * <StreamingText
 *   content="Processing your request..."
 *   style="typewriter"
 *   onComplete={() => console.log('Done!')}
 * />
 *
 * // Glowing green text
 * <StreamingText
 *   content="**Important:** This is highlighted"
 *   style="glow"
 *   glowIntensity={80}
 * />
 * ```
 */
export const StreamingText: React.FC<StreamingTextProps> = ({
  content,
  speed = 10,
  style = 'basic',
  onComplete,
  className = '',
  inheritStyles = false,
  glowIntensity = 70,
  trailLength = 8,
  isPaused = false,
}) => {
  const intensityFactor = glowIntensity / 100;
  const [visibleCount, setVisibleCount] = useState(0);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const pausedAtRef = useRef<number>(0);
  const onCompleteCalled = useRef(false);

  // Parse content into segments (Bold vs Normal)
  const segments = useMemo((): TextSegment[] => {
    if (!content) return [];
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts
      .map((part): TextSegment => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return { text: part.slice(2, -2), isBold: true };
        }
        return { text: part, isBold: false };
      })
      .filter((s) => s.text.length > 0);
  }, [content]);

  // Calculate total visible characters
  const totalLength = useMemo(
    () => segments.reduce((acc, s) => acc + s.text.length, 0),
    [segments]
  );

  useEffect(() => {
    // Reset on content change
    setVisibleCount(0);
    startTimeRef.current = undefined;
    pausedAtRef.current = 0;
    onCompleteCalled.current = false;
  }, [content]);

  useEffect(() => {
    if (isPaused) {
      // Store where we paused
      pausedAtRef.current = visibleCount;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      return;
    }

    const animate = (time: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = time - pausedAtRef.current * speed;
      }

      const elapsed = time - startTimeRef.current;
      const targetCount = Math.floor(elapsed / speed);

      if (targetCount >= totalLength) {
        setVisibleCount(totalLength);
        if (onComplete && !onCompleteCalled.current) {
          onCompleteCalled.current = true;
          onComplete();
        }
        return;
      }

      setVisibleCount(targetCount);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [totalLength, speed, onComplete, isPaused, visibleCount]);

  const isComplete = visibleCount >= totalLength;

  // Get glow styling for a character based on its position from the end
  const getGlowStyle = (distanceFromEnd: number): React.CSSProperties => {
    if (distanceFromEnd >= trailLength) return {};

    const rawIntensity = Math.max(0, 1 - distanceFromEnd / Math.max(1, trailLength - 1));
    const intensity = rawIntensity;

    const colorOpacity = (0.5 + intensity * 0.5) * intensityFactor;
    const shadowOpacity1 = intensity * 0.5 * intensityFactor;
    const shadowOpacity2 = intensity * 0.2 * intensityFactor;
    const shadowBlur1 = intensity * 8 * 0.5;
    const shadowBlur2 = intensity * 8;
    const textBlur = intensity * 0.4 * 8;

    return {
      display: 'inline-block',
      color: `rgba(16, 185, 129, ${colorOpacity})`,
      textShadow: `0 0 ${shadowBlur1}px rgba(52, 211, 153, ${shadowOpacity1}), 0 0 ${shadowBlur2}px rgba(16, 185, 129, ${shadowOpacity2})`,
      filter: `blur(${textBlur}px)`,
      transition: 'color 0.3s ease-out, text-shadow 0.3s ease-out, filter 0.3s ease-out',
    };
  };

  // Get gradient styling for a character based on its position
  const getGradientStyle = (distanceFromEnd: number): React.CSSProperties => {
    if (distanceFromEnd >= trailLength) return {};

    const rawIntensity = Math.max(0, 1 - distanceFromEnd / Math.max(1, trailLength - 1));
    const intensity = rawIntensity;
    const floatAmount = 2 * intensityFactor;
    const blurAmount = 0.5 * intensityFactor;

    return {
      display: 'inline-block',
      transform: `translateY(${-intensity * floatAmount}px)`,
      opacity: 0.7 + intensity * 0.3,
      filter: `blur(${intensity * blurAmount}px)`,
      transition: 'transform 0.25s ease-out, filter 0.25s ease-out, opacity 0.25s ease-out',
    };
  };

  const renderContent = () => {
    // Once complete, render without effects
    if (isComplete && content) {
      return segments.map((segment, idx) => (
        <span
          key={idx}
          className={
            inheritStyles
              ? segment.isBold
                ? 'font-bold'
                : ''
              : segment.isBold
                ? 'font-semibold text-slate-900'
                : 'font-normal text-slate-600'
          }
        >
          {segment.text}
        </span>
      ));
    }

    // During streaming, render character by character
    let currentCount = 0;
    let globalCharIndex = 0;
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const segmentStart = currentCount;
      const segmentEnd = currentCount + segment.text.length;

      // If we haven't reached this segment yet, stop
      if (visibleCount <= segmentStart) break;

      // Calculate how much of this segment is visible
      const charCountInSegment = Math.min(visibleCount, segmentEnd) - segmentStart;
      const textSlice = segment.text.slice(0, charCountInSegment);

      // For glow/gradient styles, render each character individually
      if ((style === 'glow' || style === 'gradient') && !isComplete) {
        const chars = textSlice.split('');
        const charElements = chars.map((char, charIdx) => {
          const absoluteCharIndex = globalCharIndex + charIdx;
          const distanceFromEnd = visibleCount - 1 - absoluteCharIndex;

          const effectStyle =
            style === 'glow' ? getGlowStyle(distanceFromEnd) : getGradientStyle(distanceFromEnd);

          return (
            <span
              key={`${i}-${charIdx}`}
              style={effectStyle}
              className={
                inheritStyles
                  ? segment.isBold
                    ? 'font-bold'
                    : ''
                  : segment.isBold
                    ? 'font-semibold'
                    : 'font-normal'
              }
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        });

        elements.push(
          <span key={i} className={style === 'gradient' ? 'text-emerald-500' : ''}>
            {charElements}
          </span>
        );
        globalCharIndex += charCountInSegment;
      } else {
        // Basic or typewriter style - render segment as a single span
        elements.push(
          <span
            key={i}
            className={
              inheritStyles
                ? segment.isBold
                  ? 'font-bold'
                  : ''
                : segment.isBold
                  ? 'font-semibold text-slate-900'
                  : 'font-normal text-slate-600'
            }
          >
            {textSlice}
          </span>
        );
      }

      currentCount += segment.text.length;

      // If we are partly through this segment, we are done
      if (visibleCount < segmentEnd) break;
    }

    // Add blinking cursor for typewriter style
    if (style === 'typewriter' && !isComplete) {
      elements.push(
        <span
          key="cursor"
          className="inline-block w-[2px] h-[1em] bg-slate-600 ml-[1px] align-middle"
          style={{
            animation: 'blade-ai-typing 1s ease-in-out infinite',
          }}
        />
      );
    }

    return elements;
  };

  return (
    <span
      className={`${inheritStyles ? 'inline' : 'inline text-[15px] leading-[1.6]'} ${className}`}
    >
      {renderContent()}
    </span>
  );
};

export default StreamingText;
