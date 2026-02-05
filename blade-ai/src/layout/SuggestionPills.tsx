import React from 'react';
import { motion } from 'motion/react';
import { staggerContainer, staggerItem } from '../primitives/animations';

export interface SuggestionPillsProps {
  /** Array of suggestion strings */
  suggestions: string[];
  /** Click handler */
  onClick: (suggestion: string, index: number) => void;
  /** Show numbers before suggestions */
  numbered?: boolean;
  /** Stagger animation */
  stagger?: boolean;
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
  /** Maximum suggestions to show */
  maxVisible?: number;
  /** Highlighted suggestion index */
  highlightedIndex?: number | null;
  /** Additional CSS classes */
  className?: string;
  /** Pill size */
  size?: 'sm' | 'md';
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

/**
 * Follow-up suggestion pills
 *
 * Clickable suggestion buttons for follow-up questions.
 *
 * @example
 * ```tsx
 * <SuggestionPills
 *   suggestions={[
 *     "Show more details",
 *     "Refund this transaction",
 *     "Contact the customer"
 *   ]}
 *   onClick={(suggestion) => setInput(suggestion)}
 *   numbered
 *   stagger
 * />
 * ```
 */
export const SuggestionPills: React.FC<SuggestionPillsProps> = ({
  suggestions,
  onClick,
  numbered = false,
  stagger = true,
  direction = 'vertical',
  maxVisible,
  highlightedIndex = null,
  className = '',
  size = 'md',
}) => {
  const visibleSuggestions = maxVisible
    ? suggestions.slice(0, maxVisible)
    : suggestions;

  const Container = stagger ? motion.div : 'div';
  const containerProps = stagger
    ? { variants: staggerContainer, initial: 'hidden', animate: 'visible' }
    : {};

  const Item = stagger ? motion.button : 'button';
  const getItemProps = (_index: number) =>
    stagger
      ? {
          variants: staggerItem,
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
        }
      : {};

  return (
    <Container
      className={`
        flex
        ${direction === 'horizontal' ? 'flex-wrap gap-2' : 'flex-col gap-1'}
        ${className}
      `}
      {...containerProps}
    >
      {visibleSuggestions.map((suggestion, index) => {
        const isHighlighted = highlightedIndex === index;

        return (
          <Item
            key={index}
            onClick={() => onClick(suggestion, index)}
            className={`
              text-left
              ${sizeStyles[size]}
              font-medium rounded-lg
              transition-colors
              ${
                isHighlighted
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }
            `}
            {...getItemProps(index)}
          >
            {numbered && (
              <span
                className={`
                  mr-2
                  ${isHighlighted ? 'text-blue-500' : 'text-slate-400'}
                `}
              >
                {index + 1}.
              </span>
            )}
            {suggestion}
          </Item>
        );
      })}

      {/* Show more indicator */}
      {maxVisible && suggestions.length > maxVisible && (
        <span className="text-xs text-slate-400 px-3 py-1">
          +{suggestions.length - maxVisible} more
        </span>
      )}
    </Container>
  );
};

export default SuggestionPills;
