import React from 'react';
import { motion } from 'motion/react';
import { staggerContainer, staggerItem } from '../primitives/animations';

export interface MessageGroupProps {
  /** Messages in the group */
  children: React.ReactNode;
  /** Sender type for styling */
  sender: 'user' | 'assistant';
  /** Additional CSS classes */
  className?: string;
  /** Animate children stagger */
  animate?: boolean;
  /** Gap between messages in group */
  gap?: 'xs' | 'sm' | 'md';
}

const gapMap: Record<string, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
};

/**
 * Group consecutive messages from same sender
 *
 * Visually groups multiple messages from the same sender with
 * reduced spacing and optional staggered animation.
 *
 * @example
 * ```tsx
 * <MessageGroup sender="assistant">
 *   <AssistantMessage showLogo>First part of response...</AssistantMessage>
 *   <AssistantMessage showLogo={false}>Continuation...</AssistantMessage>
 *   <AssistantMessage showLogo={false}>Final part...</AssistantMessage>
 * </MessageGroup>
 * ```
 */
export const MessageGroup: React.FC<MessageGroupProps> = ({
  children,
  sender,
  className = '',
  animate = true,
  gap = 'sm',
}) => {
  const alignment = sender === 'user' ? 'items-end' : 'items-start';

  if (animate) {
    return (
      <motion.div
        className={`flex flex-col ${alignment} ${gapMap[gap]} ${className}`}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {React.Children.map(children, (child, index) => (
          <motion.div key={index} variants={staggerItem} className="w-full">
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <div className={`flex flex-col ${alignment} ${gapMap[gap]} ${className}`}>
      {children}
    </div>
  );
};

export default MessageGroup;
