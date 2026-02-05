import React, { useRef, useEffect, useCallback } from 'react';

export interface ChatInputProps {
  /** Current input value */
  value: string;
  /** Called when value changes */
  onChange: (value: string) => void;
  /** Called when user submits (Enter without Shift) */
  onSubmit: () => void;
  /** Placeholder text */
  placeholder?: string;
  /** Disable the input */
  disabled?: boolean;
  /** Maximum rows before scrolling */
  maxRows?: number;
  /** Minimum rows */
  minRows?: number;
  /** Additional CSS classes */
  className?: string;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Show character count */
  showCharCount?: boolean;
  /** Maximum characters */
  maxLength?: number;
  /** Called on focus */
  onFocus?: () => void;
  /** Called on blur */
  onBlur?: () => void;
}

/**
 * Auto-expanding chat textarea
 *
 * A textarea that grows with content up to maxRows, then scrolls.
 * Submit with Enter, new line with Shift+Enter.
 *
 * @example
 * ```tsx
 * const [input, setInput] = useState('');
 *
 * <ChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSubmit={() => {
 *     sendMessage(input);
 *     setInput('');
 *   }}
 *   placeholder="Type your message..."
 *   autoFocus
 * />
 * ```
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type a message...',
  disabled = false,
  maxRows = 6,
  minRows = 1,
  className = '',
  autoFocus = false,
  showCharCount = false,
  maxLength,
  onFocus,
  onBlur,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate scrollHeight
    textarea.style.height = 'auto';

    // Calculate line height
    const computedStyle = getComputedStyle(textarea);
    const lineHeight = parseInt(computedStyle.lineHeight) || 24;
    const paddingTop = parseInt(computedStyle.paddingTop) || 0;
    const paddingBottom = parseInt(computedStyle.paddingBottom) || 0;

    const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;

    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [minRows, maxRows]);

  // Adjust height on value change
  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  // Auto-focus
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    onChange(newValue);
  };

  return (
    <div className={`relative ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={minRows}
        className={`
          w-full resize-none
          px-4 py-3
          text-[15px] leading-6
          text-slate-900 placeholder-slate-400
          bg-white
          border border-slate-200 rounded-xl
          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          transition-colors duration-200
          blade-ai-scrollbar
        `}
        style={{
          minHeight: `${24 * minRows + 24}px`,
        }}
      />

      {/* Character count */}
      {showCharCount && maxLength && (
        <div
          className={`
            absolute bottom-2 right-3
            text-xs
            ${value.length >= maxLength ? 'text-red-500' : 'text-slate-400'}
          `}
        >
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default ChatInput;
