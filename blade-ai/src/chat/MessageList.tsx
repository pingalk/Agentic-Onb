import React, { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { staggerContainer, staggerItem } from '../primitives/animations';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  [key: string]: unknown;
}

export interface MessageListProps<T extends Message = Message> {
  /** Array of messages to display */
  messages: T[];
  /** Custom renderer for each message */
  renderMessage: (message: T, index: number, isLast: boolean) => React.ReactNode;
  /** Called when user scrolls */
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  /** Enable auto-scroll to bottom on new messages */
  autoScroll?: boolean;
  /** Distance from bottom to trigger auto-scroll (px) */
  autoScrollThreshold?: number;
  /** Additional CSS classes */
  className?: string;
  /** Gap between messages */
  gap?: 'sm' | 'md' | 'lg';
  /** Animate message entry */
  animate?: boolean;
}

const gapMap: Record<string, string> = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

/**
 * Scrollable message container with auto-scroll
 *
 * Renders a list of messages with proper scrolling behavior.
 * Auto-scrolls to bottom when new messages arrive if user is
 * near the bottom.
 *
 * @example
 * ```tsx
 * <MessageList
 *   messages={messages}
 *   renderMessage={(msg, idx, isLast) => (
 *     msg.role === 'user'
 *       ? <UserMessage content={msg.content} />
 *       : <AssistantMessage isLast={isLast}>{msg.content}</AssistantMessage>
 *   )}
 *   autoScroll
 * />
 * ```
 */
export function MessageList<T extends Message = Message>({
  messages,
  renderMessage,
  onScroll,
  autoScroll = true,
  autoScrollThreshold = 100,
  className = '',
  gap = 'md',
  animate = true,
}: MessageListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  // Check if user is near bottom
  const checkIfNearBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < autoScrollThreshold;
  }, [autoScrollThreshold]);

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  // Handle scroll events
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isNearBottomRef.current = checkIfNearBottom();
    onScroll?.(e);
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (autoScroll && isNearBottomRef.current) {
      scrollToBottom();
    }
  }, [messages.length, autoScroll, scrollToBottom]);

  // Initial scroll to bottom
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(false);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`
        flex-1 overflow-y-auto overflow-x-hidden
        blade-ai-scrollbar
        ${className}
      `}
    >
      <motion.div
        className={`flex flex-col ${gapMap[gap]} p-4`}
        variants={animate ? staggerContainer : undefined}
        initial={animate ? 'hidden' : undefined}
        animate={animate ? 'visible' : undefined}
      >
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => {
            const isLast = index === messages.length - 1;

            if (animate) {
              return (
                <motion.div
                  key={message.id}
                  variants={staggerItem}
                  layout
                  layoutId={message.id}
                >
                  {renderMessage(message, index, isLast)}
                </motion.div>
              );
            }

            return (
              <div key={message.id}>{renderMessage(message, index, isLast)}</div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default MessageList;
