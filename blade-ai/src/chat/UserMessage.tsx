import React from 'react';
import { motion } from 'motion/react';
import { Avatar } from '../primitives/Avatar';
import { messageEnter } from '../primitives/animations';

export interface Attachment {
  id: string;
  filename: string;
  type: 'image' | 'file' | 'document';
  url?: string;
  preview?: string;
}

export interface UserMessageProps {
  /** Message content */
  content: string;
  /** Message timestamp */
  timestamp?: Date | string;
  /** File attachments */
  attachments?: Attachment[];
  /** User avatar source */
  avatarSrc?: string;
  /** User initials for avatar fallback */
  avatarFallback?: string;
  /** Show avatar */
  showAvatar?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Animate entry */
  animate?: boolean;
}

/**
 * User message bubble (right-aligned)
 *
 * Displays a user's message with optional avatar, timestamp, and attachments.
 * Styled with a blue-tinted background to distinguish from AI responses.
 *
 * @example
 * ```tsx
 * <UserMessage
 *   content="Hello, can you help me with something?"
 *   timestamp={new Date()}
 *   avatarFallback="JD"
 * />
 * ```
 */
export const UserMessage: React.FC<UserMessageProps> = ({
  content,
  timestamp,
  attachments = [],
  avatarSrc,
  avatarFallback = 'U',
  showAvatar = true,
  className = '',
  animate = true,
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
      className={`flex justify-end gap-3 ${className}`}
      {...wrapperProps}
    >
      <div className="flex flex-col items-end max-w-[80%]">
        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 justify-end">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-sm"
              >
                {attachment.type === 'image' && attachment.preview ? (
                  <img
                    src={attachment.preview}
                    alt={attachment.filename}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-slate-700 truncate max-w-[150px]">
                      {attachment.filename}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Message bubble */}
        <div
          className="
            px-4 py-3 rounded-2xl rounded-tr-md
            bg-[#e6eafa] text-[#192839]
            text-[15px] leading-relaxed
          "
        >
          {content}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className="text-xs text-slate-400 mt-1 mr-1">
            {formatTime(timestamp)}
          </span>
        )}
      </div>

      {/* Avatar */}
      {showAvatar && (
        <Avatar
          src={avatarSrc}
          fallback={avatarFallback}
          variant="user"
          size="sm"
          className="mt-1"
        />
      )}
    </Wrapper>
  );
};

export default UserMessage;
