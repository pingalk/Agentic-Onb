import React from 'react';
import { motion } from 'motion/react';

export interface SelectOption {
  /** Option value */
  value: string;
  /** Display label */
  label: string;
  /** Optional description */
  description?: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
}

export interface SelectableOptionsProps {
  /** Available options */
  options: SelectOption[];
  /** Selected value(s) */
  selected: string | string[];
  /** Change handler */
  onChange: (selected: string | string[]) => void;
  /** Allow multiple selection */
  multiple?: boolean;
  /** Layout direction */
  direction?: 'horizontal' | 'vertical' | 'grid';
  /** Columns for grid layout */
  columns?: 2 | 3 | 4;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-base',
};

/**
 * Multi-select option chips
 *
 * Selectable option buttons for single or multiple selection.
 *
 * @example
 * ```tsx
 * // Single select
 * <SelectableOptions
 *   options={[
 *     { value: 'upi', label: 'UPI', icon: <UpiIcon /> },
 *     { value: 'card', label: 'Card', icon: <CardIcon /> },
 *     { value: 'netbanking', label: 'Net Banking' }
 *   ]}
 *   selected={paymentMethod}
 *   onChange={setPaymentMethod}
 * />
 *
 * // Multi-select
 * <SelectableOptions
 *   options={[
 *     { value: 'email', label: 'Email' },
 *     { value: 'sms', label: 'SMS' },
 *     { value: 'whatsapp', label: 'WhatsApp' }
 *   ]}
 *   selected={notifications}
 *   onChange={setNotifications}
 *   multiple
 *   direction="horizontal"
 * />
 * ```
 */
export const SelectableOptions: React.FC<SelectableOptionsProps> = ({
  options,
  selected,
  onChange,
  multiple = false,
  direction = 'vertical',
  columns = 2,
  size = 'md',
  className = '',
}) => {
  const selectedSet = new Set(Array.isArray(selected) ? selected : [selected]);

  const handleSelect = (value: string) => {
    if (multiple) {
      const currentSelected = Array.isArray(selected) ? selected : [selected];
      const newSelected = selectedSet.has(value)
        ? currentSelected.filter((v) => v !== value)
        : [...currentSelected, value];
      onChange(newSelected);
    } else {
      onChange(value);
    }
  };

  const isSelected = (value: string) => selectedSet.has(value);

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  const containerClass = {
    horizontal: 'flex flex-wrap gap-2',
    vertical: 'flex flex-col gap-2',
    grid: `grid ${gridCols[columns]} gap-2`,
  };

  return (
    <div className={`${containerClass[direction]} ${className}`}>
      {options.map((option) => {
        const selected = isSelected(option.value);

        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => !option.disabled && handleSelect(option.value)}
            whileHover={!option.disabled ? { scale: 1.02 } : undefined}
            whileTap={!option.disabled ? { scale: 0.98 } : undefined}
            disabled={option.disabled}
            className={`
              flex items-center gap-3
              ${sizeStyles[size]}
              rounded-xl border-2
              text-left
              transition-all
              ${
                selected
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }
              ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Selection indicator */}
            <div
              className={`
                shrink-0 w-5 h-5 rounded-full
                flex items-center justify-center
                border-2 transition-colors
                ${
                  selected
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300 bg-white'
                }
              `}
            >
              {selected && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              )}
            </div>

            {/* Icon */}
            {option.icon && (
              <span className={selected ? 'text-blue-600' : 'text-slate-500'}>
                {option.icon}
              </span>
            )}

            {/* Label and description */}
            <div className="flex-1 min-w-0">
              <span className="font-medium">{option.label}</span>
              {option.description && (
                <p
                  className={`
                    text-xs mt-0.5
                    ${selected ? 'text-blue-600' : 'text-slate-500'}
                  `}
                >
                  {option.description}
                </p>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default SelectableOptions;
