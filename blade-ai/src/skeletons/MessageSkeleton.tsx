import React from 'react';

export type MessageSkeletonVariant = 'user' | 'assistant';
export type SkeletonAnimation = 'pulse' | 'shimmer' | 'none';

export interface MessageSkeletonProps {
  /** Message type */
  variant?: MessageSkeletonVariant;
  /** Number of text lines */
  lines?: number;
  /** Animation type */
  animate?: SkeletonAnimation;
  /** Show avatar */
  showAvatar?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Message loading skeleton
 *
 * Placeholder for loading message content with shimmer animation.
 *
 * @example
 * ```tsx
 * <MessageSkeleton variant="assistant" lines={3} animate="shimmer" />
 * <MessageSkeleton variant="user" lines={1} />
 * ```
 */
export const MessageSkeleton: React.FC<MessageSkeletonProps> = ({
  variant = 'assistant',
  lines = 3,
  animate = 'shimmer',
  showAvatar = true,
  className = '',
}) => {
  const isUser = variant === 'user';

  const animationClass =
    animate === 'shimmer'
      ? 'blade-ai-shimmer-bg'
      : animate === 'pulse'
        ? 'animate-pulse'
        : '';

  const lineWidths = [
    '100%',
    '85%',
    '70%',
    '90%',
    '60%',
    '75%',
  ];

  return (
    <div
      className={`
        flex gap-3
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
        ${className}
      `}
    >
      {/* Avatar skeleton */}
      {showAvatar && (
        <div
          className={`
            shrink-0 w-8 h-8 rounded-full bg-slate-200
            ${animationClass}
          `}
        />
      )}

      {/* Content skeleton */}
      <div
        className={`
          flex flex-col gap-2
          ${isUser ? 'items-end' : 'items-start'}
          max-w-[70%]
        `}
      >
        {/* Lines */}
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`
              h-4 rounded bg-slate-200
              ${animationClass}
            `}
            style={{
              width: lineWidths[index % lineWidths.length],
              minWidth: '100px',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageSkeleton;
