import React from 'react';

export interface ChatContainerProps {
  /** Chat content (MessageList, input, etc.) */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Maximum width constraint */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Background variant */
  background?: 'default' | 'subtle' | 'transparent';
}

const maxWidthMap: Record<string, string> = {
  sm: 'max-w-lg',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-full',
};

const backgroundMap: Record<string, string> = {
  default: 'bg-white',
  subtle: 'bg-slate-50',
  transparent: 'bg-transparent',
};

/**
 * Full chat layout container
 *
 * Provides the outer structure for a chat interface with proper
 * scrolling behavior and layout constraints.
 *
 * @example
 * ```tsx
 * <ChatContainer maxWidth="lg">
 *   <MessageList messages={messages} />
 *   <ChatInput onSubmit={handleSubmit} />
 * </ChatContainer>
 * ```
 */
export const ChatContainer: React.FC<ChatContainerProps> = ({
  children,
  className = '',
  maxWidth = 'lg',
  background = 'default',
}) => {
  return (
    <div
      className={`
        blade-ai-reset blade-ai-text
        flex flex-col h-full w-full
        ${backgroundMap[background]}
        ${className}
      `}
    >
      <div
        className={`
          flex flex-col h-full w-full mx-auto
          ${maxWidthMap[maxWidth]}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default ChatContainer;
