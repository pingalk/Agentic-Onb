import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { PerplexityStreamText, StreamingStyle } from './PerplexityStreamingTypography';
import { SmartHighlightWithBold } from './SmartHighlight';

// Stat format: { label: string, value: string }
export interface StatItem {
  label: string;
  value: string;
}

// Bullet format: { text: string, bold?: string }
export interface BulletItem {
  text: string;
  bold?: string;
}

interface StreamingBulletListProps {
  items: (StatItem | BulletItem)[];
  type: 'stats' | 'bullets';
  speed?: number;
  boldSpeed?: number;
  style?: StreamingStyle;
  onComplete?: () => void;
  className?: string;
}

export const StreamingBulletList = ({
  items,
  type,
  speed = 10,
  boldSpeed = 15,
  style = 'glow',
  onComplete,
  className
}: StreamingBulletListProps) => {
  const [activeBulletIndex, setActiveBulletIndex] = useState(0);
  // Track which phase each bullet is in: null = not started, 'first' = streaming first part, 'second' = streaming second part, 'done' = completed
  const [bulletPhases, setBulletPhases] = useState<Map<number, 'first' | 'second' | 'done'>>(() => {
    const initial = new Map<number, 'first' | 'second' | 'done'>();
    initial.set(0, 'first');
    return initial;
  });

  // Use refs to prevent callback issues
  const onCompleteCalledRef = useRef(false);

  // Handle completion of first part (label/bold)
  const handleFirstPartComplete = useCallback((bulletIndex: number) => {
    setBulletPhases(prev => {
      const next = new Map(prev);
      next.set(bulletIndex, 'second');
      return next;
    });
  }, []);

  // Handle completion of second part (value/text)
  const handleSecondPartComplete = useCallback((bulletIndex: number) => {
    setBulletPhases(prev => {
      const next = new Map(prev);
      next.set(bulletIndex, 'done');
      return next;
    });

    if (bulletIndex < items.length - 1) {
      // Start next bullet
      setActiveBulletIndex(bulletIndex + 1);
      setBulletPhases(prev => {
        const next = new Map(prev);
        next.set(bulletIndex + 1, 'first');
        return next;
      });
    } else {
      // All done
      if (!onCompleteCalledRef.current) {
        onCompleteCalledRef.current = true;
        onComplete?.();
      }
    }
  }, [items.length, onComplete]);

  if (!items || items.length === 0) return null;

  return (
    <ul className={clsx("flex flex-col gap-[8px] list-disc pl-[20px] ml-3", className)}>
      {items.map((item, i) => {
        const shouldRender = i <= activeBulletIndex;
        const phase = bulletPhases.get(i);

        if (!shouldRender) return null;

        // For stats: { label, value }
        if (type === 'stats') {
          const stat = item as StatItem;
          const showLabel = phase === 'first' || phase === 'second' || phase === 'done';
          const showValue = phase === 'second' || phase === 'done';

          return (
            <motion.li
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="text-[16px] leading-[24px] text-[#40566d]"
            >
              {/* Label part - keep PerplexityStreamText mounted */}
              {showLabel && (
                <span className="text-[#40566d]">
                  <PerplexityStreamText
                    content={stat.label + ': '}
                    speed={boldSpeed}
                    style={style}
                    onComplete={phase === 'first' ? () => handleFirstPartComplete(i) : undefined}
                  />
                </span>
              )}

              {/* Value part - keep PerplexityStreamText mounted */}
              {showValue && (
                <span className="font-medium text-[#192839]">
                  <PerplexityStreamText
                    content={stat.value}
                    speed={speed}
                    style={style}
                    inheritStyles
                    onComplete={phase === 'second' ? () => handleSecondPartComplete(i) : undefined}
                  />
                </span>
              )}
            </motion.li>
          );
        }

        // For bullets: { text, bold? }
        const bullet = item as BulletItem;
        const hasBold = !!bullet.bold;
        const showBold = hasBold && (phase === 'first' || phase === 'second' || phase === 'done');
        const showText = !hasBold ? (phase === 'first' || phase === 'second' || phase === 'done') : (phase === 'second' || phase === 'done');

        return (
          <motion.li
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="text-[16px] leading-[26px] text-[#40566d] tracking-[0.16px]"
          >
            {/* Bold prefix (if exists) - keep PerplexityStreamText mounted */}
            {showBold && (
              <span className="font-medium text-[#192839]">
                <PerplexityStreamText
                  content={bullet.bold + ' '}
                  speed={boldSpeed}
                  style={style}
                  inheritStyles
                  onComplete={phase === 'first' ? () => handleFirstPartComplete(i) : undefined}
                />
              </span>
            )}

            {/* Main text - keep PerplexityStreamText mounted */}
            {showText && (
              <PerplexityStreamText
                content={bullet.text}
                speed={speed}
                style={style}
                onComplete={
                  (hasBold && phase === 'second') || (!hasBold && phase === 'first')
                    ? () => handleSecondPartComplete(i)
                    : undefined
                }
              />
            )}
          </motion.li>
        );
      })}
    </ul>
  );
};

export default StreamingBulletList;
