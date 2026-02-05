import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface EditableFieldProps {
  /** Current value */
  value: string;
  /** Save handler */
  onSave: (value: string) => void;
  /** Cancel handler */
  onCancel?: () => void;
  /** Error message */
  error?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Field type */
  type?: 'text' | 'number' | 'email';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Start in edit mode */
  startEditing?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Label text */
  label?: string;
  /** Is saving */
  isSaving?: boolean;
}

const sizeStyles = {
  sm: { text: 'text-sm', input: 'px-2 py-1 text-sm', icon: 'w-4 h-4' },
  md: { text: 'text-base', input: 'px-3 py-2 text-base', icon: 'w-5 h-5' },
  lg: { text: 'text-lg', input: 'px-4 py-2.5 text-lg', icon: 'w-5 h-5' },
};

/**
 * Inline edit field
 *
 * Value display that switches to edit mode on click.
 *
 * @example
 * ```tsx
 * <EditableField
 *   label="Customer Name"
 *   value={customerName}
 *   onSave={(newName) => updateCustomer({ name: newName })}
 *   placeholder="Enter name"
 * />
 * ```
 */
export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  onCancel,
  error,
  placeholder = 'Enter value',
  type = 'text',
  size = 'md',
  startEditing = false,
  className = '',
  label,
  isSaving = false,
}) => {
  const [isEditing, setIsEditing] = useState(startEditing);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const styles = sizeStyles[size];

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
          {label}
        </span>
      )}

      <AnimatePresence mode="wait">
        {isEditing ? (
          // Edit mode
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              placeholder={placeholder}
              disabled={isSaving}
              className={`
                flex-1 rounded-lg border
                ${error ? 'border-red-300' : 'border-slate-300'}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:bg-slate-50 disabled:text-slate-500
                ${styles.input}
              `}
            />

            {/* Action buttons */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="
                p-2 rounded-lg
                text-emerald-600 hover:bg-emerald-50
                disabled:opacity-50
                transition-colors
              "
              aria-label="Save"
            >
              {isSaving ? (
                <motion.div
                  className={`${styles.icon} border-2 border-emerald-600 border-t-transparent rounded-full`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="
                p-2 rounded-lg
                text-slate-400 hover:bg-slate-100 hover:text-slate-600
                disabled:opacity-50
                transition-colors
              "
              aria-label="Cancel"
            >
              <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </motion.div>
        ) : (
          // Display mode
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleEdit}
            className={`
              group flex items-center gap-2
              cursor-pointer
              hover:bg-slate-50 rounded-lg
              -mx-2 px-2 py-1
              transition-colors
            `}
          >
            <span className={`${styles.text} text-slate-900`}>
              {value || <span className="text-slate-400">{placeholder}</span>}
            </span>

            <svg
              className={`
                ${styles.icon} text-slate-400
                opacity-0 group-hover:opacity-100
                transition-opacity
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default EditableField;
