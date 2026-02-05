import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface FooterActionsProps {
  /** Copy handler */
  onCopy?: () => void;
  /** Share handler */
  onShare?: () => void;
  /** Thumbs up handler */
  onThumbsUp?: () => void;
  /** Thumbs down handler */
  onThumbsDown?: () => void;
  /** Regenerate handler */
  onRegenerate?: () => void;
  /** Current feedback state */
  feedback?: 'up' | 'down' | null;
  /** Show copy button */
  showCopy?: boolean;
  /** Show share button */
  showShare?: boolean;
  /** Show feedback buttons */
  showFeedback?: boolean;
  /** Show regenerate button */
  showRegenerate?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md';
}

const sizeMap = {
  sm: {
    button: 'w-7 h-7',
    icon: 'w-3.5 h-3.5',
    gap: 'gap-1',
  },
  md: {
    button: 'w-8 h-8',
    icon: 'w-4 h-4',
    gap: 'gap-1.5',
  },
};

/**
 * Copy/share/feedback action strip
 *
 * Action buttons typically shown at the end of an AI message.
 *
 * @example
 * ```tsx
 * <FooterActions
 *   onCopy={() => copyToClipboard(content)}
 *   onThumbsUp={() => sendFeedback('positive')}
 *   onThumbsDown={() => sendFeedback('negative')}
 *   feedback={userFeedback}
 * />
 * ```
 */
export const FooterActions: React.FC<FooterActionsProps> = ({
  onCopy,
  onShare,
  onThumbsUp,
  onThumbsDown,
  onRegenerate,
  feedback,
  showCopy = true,
  showShare = false,
  showFeedback = true,
  showRegenerate = false,
  className = '',
  size = 'md',
}) => {
  const [copied, setCopied] = useState(false);

  const { button: buttonSize, icon: iconSize, gap } = sizeMap[size];

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ActionButton: React.FC<{
    onClick?: () => void;
    active?: boolean;
    activeColor?: string;
    tooltip?: string;
    children: React.ReactNode;
  }> = ({ onClick, active, activeColor = 'text-blue-600', tooltip, children }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        ${buttonSize}
        flex items-center justify-center
        rounded-lg
        transition-colors
        ${
          active
            ? `${activeColor} bg-slate-100`
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
        }
      `}
      title={tooltip}
    >
      {children}
    </motion.button>
  );

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {/* Copy */}
      {showCopy && onCopy && (
        <ActionButton onClick={handleCopy} active={copied} tooltip={copied ? 'Copied!' : 'Copy'}>
          {copied ? (
            <svg className={iconSize} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </ActionButton>
      )}

      {/* Share */}
      {showShare && onShare && (
        <ActionButton onClick={onShare} tooltip="Share">
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </ActionButton>
      )}

      {/* Regenerate */}
      {showRegenerate && onRegenerate && (
        <ActionButton onClick={onRegenerate} tooltip="Regenerate">
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </ActionButton>
      )}

      {/* Divider */}
      {showFeedback && (onCopy || onShare || onRegenerate) && (
        <div className="w-px h-4 bg-slate-200 mx-1" />
      )}

      {/* Thumbs up */}
      {showFeedback && onThumbsUp && (
        <ActionButton
          onClick={onThumbsUp}
          active={feedback === 'up'}
          activeColor="text-emerald-600"
          tooltip="Good response"
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
        </ActionButton>
      )}

      {/* Thumbs down */}
      {showFeedback && onThumbsDown && (
        <ActionButton
          onClick={onThumbsDown}
          active={feedback === 'down'}
          activeColor="text-red-600"
          tooltip="Bad response"
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
            />
          </svg>
        </ActionButton>
      )}
    </div>
  );
};

export default FooterActions;
