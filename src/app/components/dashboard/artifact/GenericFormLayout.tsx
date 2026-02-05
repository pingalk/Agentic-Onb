import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface GenericFormLayoutProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSubmit: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export const GenericFormLayout: React.FC<GenericFormLayoutProps> = ({
  title,
  subtitle,
  onClose,
  onSubmit,
  onCancel,
  children,
  submitLabel = "Save & Create",
  isSubmitting = false
}) => {
  return (
    <div className="flex flex-col h-full bg-white text-slate-900 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 shrink-0">
        <div>
          <h2 className="text-xl font-medium text-slate-900 leading-tight">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <button 
          onClick={onClose}
          className="p-2 -mr-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 border-t border-slate-100 bg-white shrink-0">
        <div className="max-w-2xl mx-auto flex items-center justify-end gap-3">
            {onCancel && (
                <button 
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                    Cancel
                </button>
            )}
            <button 
                onClick={onSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Processing...' : submitLabel}
                {!isSubmitting && <ChevronRight size={16} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="flex flex-col gap-4">
    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h3>
    <div className="flex flex-col gap-5">
      {children}
    </div>
  </div>
);

export const InputGroup: React.FC<{ label: string; children: React.ReactNode; required?: boolean }> = ({ label, children, required }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-sm font-medium text-slate-700 flex items-center gap-0.5">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    {...props}
    className={`w-full h-10 px-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400 ${props.className || ''}`}
  />
);
