import React from 'react';
import { motion } from 'motion/react';
import { Logo } from '../primitives/Logo';
import { messageEnter } from '../primitives/animations';

export interface AssistantMessageProps {
  /** Message content (can be any React node) */
  children: React.ReactNode;
  /** Show thinking animation on logo */
  isThinking?: boolean;
  /** Is this the last message in the conversation */
  isLast?: boolean;
  /** Show the AI logo */
  showLogo?: boolean;
  /** Custom logo color */
  logoColor?: string;
  /** Additional CSS classes */
  className?: string;
  /** Animate entry */
  animate?: boolean;
  /** Timestamp */
  timestamp?: Date | string;
}

/**
 * AI assistant message container
 *
 * Wrapper for AI responses with the Ray logo. Supports thinking state
 * animation and can contain any content (text, artifacts, forms).
 *
 * @example
 * ```tsx
 * // Simple text response
 * <AssistantMessage>
 *   Here's what I found...
 * </AssistantMessage>
 *
 * // Thinking state
 * <AssistantMessage isThinking>
 *   <ThinkingIndicator steps={steps} />
 * </AssistantMessage>
 *
 * // With rich content
 * <AssistantMessage isLast>
 *   <StreamingText content={response} />
 *   <DataTable data={tableData} />
 *   <SuggestionPills suggestions={followUps} />
 * </AssistantMessage>
 * ```
 */
export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  children,
  isThinking = false,
  isLast: _isLast = false,
  showLogo = true,
  logoColor,
  className = '',
  animate = true,
  timestamp,
}) => {
  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? { variants: messageEnter, initial: 'hidden', animate: 'visible' }
    : {};

  return (
    <Wrapper
      className={`flex gap-3 ${className}`}
      {...wrapperProps}
    >
      {/* Logo */}
      {showLogo && (
        <div className="shrink-0 mt-1">
          <Logo
            size="md"
            animate={isThinking ? 'rotate' : 'none'}
            color={logoColor}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className="
            text-[15px] leading-relaxed text-[#192839]
          "
        >
          {children}
        </div>

        {/* Timestamp */}
        {timestamp && !isThinking && (
          <span className="text-xs text-slate-400 mt-2 block">
            {formatTime(timestamp)}
          </span>
        )}
      </div>
    </Wrapper>
  );
};

export default AssistantMessage;
