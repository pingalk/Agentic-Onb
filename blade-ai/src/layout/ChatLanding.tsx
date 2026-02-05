import React from 'react';
import { motion } from 'motion/react';
import { Logo } from '../primitives/Logo';
import { staggerContainer, staggerItem } from '../primitives/animations';

export interface SuggestionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface ChatLandingProps {
  /** Welcome title */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Suggested prompts */
  suggestions?: SuggestionItem[];
  /** Called when suggestion is clicked */
  onSuggestionClick?: (suggestion: SuggestionItem) => void;
  /** Custom logo element */
  logo?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Animate entry */
  animate?: boolean;
}

/**
 * Welcome screen with prompts
 *
 * Initial landing state for a chat interface with suggested prompts.
 *
 * @example
 * ```tsx
 * <ChatLanding
 *   title="Hi, I'm Ray"
 *   subtitle="How can I help you today?"
 *   suggestions={[
 *     { id: '1', label: 'Show me recent transactions' },
 *     { id: '2', label: 'Create a payment link' },
 *     { id: '3', label: 'Check settlement status' }
 *   ]}
 *   onSuggestionClick={(s) => setInput(s.label)}
 * />
 * ```
 */
export const ChatLanding: React.FC<ChatLandingProps> = ({
  title = 'How can I help you?',
  subtitle,
  suggestions = [],
  onSuggestionClick,
  logo,
  className = '',
  animate = true,
}) => {
  const Container = animate ? motion.div : 'div';
  const containerProps = animate
    ? { variants: staggerContainer, initial: 'hidden', animate: 'visible' }
    : {};

  const Item = animate ? motion.div : 'div';
  const itemProps = animate ? { variants: staggerItem } : {};

  return (
    <Container
      className={`
        flex flex-col items-center justify-center
        px-6 py-12
        text-center
        ${className}
      `}
      {...containerProps}
    >
      {/* Logo */}
      <Item {...itemProps}>
        {logo || <Logo size="xl" className="mb-6" />}
      </Item>

      {/* Title */}
      <Item {...itemProps}>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">{title}</h1>
      </Item>

      {/* Subtitle */}
      {subtitle && (
        <Item {...itemProps}>
          <p className="text-base text-slate-500 mb-8 max-w-md">{subtitle}</p>
        </Item>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Item {...itemProps} className="w-full max-w-lg">
          <div className="flex flex-col gap-2">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                onClick={() => onSuggestionClick?.(suggestion)}
                initial={animate ? { opacity: 0, y: 10 } : undefined}
                animate={animate ? { opacity: 1, y: 0 } : undefined}
                transition={animate ? { delay: 0.3 + index * 0.1 } : undefined}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="
                  flex items-center gap-3
                  w-full px-4 py-3
                  text-left text-sm text-slate-700
                  bg-white border border-slate-200 rounded-xl
                  hover:border-slate-300 hover:bg-slate-50
                  transition-colors
                  shadow-sm
                "
              >
                {suggestion.icon && (
                  <span className="text-slate-400">{suggestion.icon}</span>
                )}
                <span>{suggestion.label}</span>
                <svg
                  className="w-4 h-4 text-slate-400 ml-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            ))}
          </div>
        </Item>
      )}
    </Container>
  );
};

export default ChatLanding;
