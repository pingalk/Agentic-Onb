import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cardEnter } from '../primitives/animations';

export type FieldType = 'text' | 'email' | 'number' | 'select' | 'textarea';

export interface FormField {
  /** Field name (key) */
  name: string;
  /** Field label */
  label: string;
  /** Field type */
  type?: FieldType;
  /** Placeholder text */
  placeholder?: string;
  /** Required field */
  required?: boolean;
  /** Default value */
  defaultValue?: string;
  /** Options for select type */
  options?: Array<{ label: string; value: string }>;
  /** Validation pattern */
  pattern?: RegExp;
  /** Error message */
  errorMessage?: string;
}

export interface InlineFormProps {
  /** Form fields */
  fields: FormField[];
  /** Submit handler */
  onSubmit: (values: Record<string, string>) => void;
  /** Cancel handler */
  onCancel?: () => void;
  /** Layout direction */
  layout?: 'vertical' | 'horizontal';
  /** Submit button text */
  submitLabel?: string;
  /** Cancel button text */
  cancelLabel?: string;
  /** Form title */
  title?: string;
  /** Is submitting */
  isSubmitting?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Animate entry */
  animate?: boolean;
}

/**
 * Single-step inline form
 *
 * Simple form for collecting data inline in the chat.
 *
 * @example
 * ```tsx
 * <InlineForm
 *   title="Quick Refund"
 *   fields={[
 *     { name: 'amount', label: 'Amount', type: 'number', required: true },
 *     { name: 'reason', label: 'Reason', type: 'select',
 *       options: [
 *         { label: 'Customer request', value: 'customer' },
 *         { label: 'Duplicate payment', value: 'duplicate' }
 *       ]
 *     }
 *   ]}
 *   onSubmit={(values) => processRefund(values)}
 *   submitLabel="Process Refund"
 * />
 * ```
 */
export const InlineForm: React.FC<InlineFormProps> = ({
  fields,
  onSubmit,
  onCancel,
  layout = 'vertical',
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  title,
  isSubmitting = false,
  className = '',
  animate = true,
}) => {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      initial[field.name] = field.defaultValue || '';
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = values[field.name];

      if (field.required && !value.trim()) {
        newErrors[field.name] = field.errorMessage || `${field.label} is required`;
      } else if (field.pattern && value && !field.pattern.test(value)) {
        newErrors[field.name] = field.errorMessage || `Invalid ${field.label}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  const Wrapper = animate ? motion.form : 'form';
  const wrapperProps = animate
    ? { variants: cardEnter, initial: 'hidden', animate: 'visible' }
    : {};

  const renderField = (field: FormField) => {
    const value = values[field.name];
    const error = errors[field.name];
    const commonProps = {
      id: field.name,
      name: field.name,
      placeholder: field.placeholder,
      disabled: isSubmitting,
      className: `
        w-full px-3 py-2
        text-sm text-slate-900
        bg-white border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        disabled:bg-slate-50 disabled:text-slate-500
        ${error ? 'border-red-300' : 'border-slate-200'}
      `,
    };

    switch (field.type) {
      case 'select':
        return (
          <select
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
          >
            <option value="">{field.placeholder || 'Select...'}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            rows={3}
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.type || 'text'}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );
    }
  };

  return (
    <Wrapper
      onSubmit={handleSubmit}
      className={`
        bg-white border border-slate-200 rounded-xl p-5
        ${className}
      `}
      {...wrapperProps}
    >
      {/* Title */}
      {title && (
        <h3 className="text-base font-semibold text-slate-900 mb-4">{title}</h3>
      )}

      {/* Fields */}
      <div
        className={`
          ${layout === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-4'}
        `}
      >
        {fields.map((field) => (
          <div
            key={field.name}
            className={layout === 'horizontal' ? 'flex-1 min-w-[200px]' : ''}
          >
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {errors[field.name] && (
              <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="
              px-4 py-2 rounded-lg
              text-sm font-medium text-slate-600
              hover:bg-slate-100
              disabled:opacity-50
              transition-colors
            "
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            px-4 py-2 rounded-lg
            text-sm font-medium text-white
            bg-blue-600 hover:bg-blue-700
            disabled:opacity-50
            transition-colors
            flex items-center gap-2
          "
        >
          {isSubmitting && (
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          )}
          {submitLabel}
        </button>
      </div>
    </Wrapper>
  );
};

export default InlineForm;
