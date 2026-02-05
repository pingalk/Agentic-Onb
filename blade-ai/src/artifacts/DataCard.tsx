import React from 'react';
import { motion } from 'motion/react';
import { cardEnter, staggerContainer, staggerItem } from '../primitives/animations';

export interface DataField {
  /** Field label */
  label: string;
  /** Field value */
  value: React.ReactNode;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Highlight the value */
  highlight?: boolean;
  /** Full width (spans both columns) */
  fullWidth?: boolean;
}

export interface DataCardAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface DataCardProps {
  /** Card title */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Data fields to display */
  fields: DataField[];
  /** Action buttons */
  actions?: DataCardAction[];
  /** Additional CSS classes */
  className?: string;
  /** Animate entry */
  animate?: boolean;
  /** Layout style */
  layout?: 'grid' | 'stacked';
  /** Show dividers between fields */
  dividers?: boolean;
}

const actionVariantStyles: Record<string, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200',
  ghost: 'text-slate-600 hover:bg-slate-100',
};

/**
 * Key-value display card
 *
 * Shows structured data in a card format with labels and values.
 * Supports icons, highlighting, and action buttons.
 *
 * @example
 * ```tsx
 * <DataCard
 *   title="Transaction Details"
 *   subtitle="Payment ID: pay_123456"
 *   fields={[
 *     { label: 'Amount', value: '₹5,000.00', highlight: true },
 *     { label: 'Status', value: <Badge variant="success">Captured</Badge> },
 *     { label: 'Method', value: 'UPI' },
 *     { label: 'Date', value: 'Jan 15, 2025' },
 *     { label: 'Notes', value: 'Customer refund request', fullWidth: true }
 *   ]}
 *   actions={[
 *     { id: 'refund', label: 'Refund', variant: 'secondary', onClick: handleRefund },
 *     { id: 'details', label: 'View Details', variant: 'primary', onClick: handleDetails }
 *   ]}
 * />
 * ```
 */
export const DataCard: React.FC<DataCardProps> = ({
  title,
  subtitle,
  fields,
  actions = [],
  className = '',
  animate = true,
  layout = 'grid',
  dividers = false,
}) => {
  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? { variants: cardEnter, initial: 'hidden', animate: 'visible' }
    : {};

  const FieldContainer = animate ? motion.div : 'div';
  const fieldContainerProps = animate
    ? { variants: staggerContainer, initial: 'hidden', animate: 'visible' }
    : {};

  const FieldItem = animate ? motion.div : 'div';
  const fieldItemProps = animate ? { variants: staggerItem } : {};

  return (
    <Wrapper
      className={`
        bg-white rounded-xl border border-slate-200 overflow-hidden
        ${className}
      `}
      {...wrapperProps}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="px-5 py-4 border-b border-slate-100">
          {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}

      {/* Fields */}
      <FieldContainer
        className={`
          px-5 py-4
          ${layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-3'}
        `}
        {...fieldContainerProps}
      >
        {fields.map((field, index) => (
          <FieldItem
            key={field.label}
            className={`
              ${field.fullWidth && layout === 'grid' ? 'col-span-2' : ''}
              ${dividers && index > 0 && layout === 'stacked' ? 'border-t border-slate-100 pt-3' : ''}
            `}
            {...fieldItemProps}
          >
            <div className="flex items-start gap-2">
              {field.icon && (
                <span className="text-slate-400 mt-0.5 shrink-0">{field.icon}</span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  {field.label}
                </p>
                <p
                  className={`
                    text-sm
                    ${field.highlight ? 'font-semibold text-slate-900' : 'text-slate-700'}
                  `}
                >
                  {field.value}
                </p>
              </div>
            </div>
          </FieldItem>
        ))}
      </FieldContainer>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`
                flex items-center gap-2
                px-4 py-2 rounded-lg
                text-sm font-medium
                transition-colors
                ${actionVariantStyles[action.variant || 'secondary']}
              `}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </Wrapper>
  );
};

export default DataCard;
