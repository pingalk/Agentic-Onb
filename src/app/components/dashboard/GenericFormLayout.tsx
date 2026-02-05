import React from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  onClose?: () => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
      <h2 className="text-xl font-medium text-slate-900">{title}</h2>
      {onClose && (
        <button 
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => {
  return (
    <div className="p-6 border-b border-gray-100 last:border-0">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wide">{title}</h3>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      <div className="flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
};

export const TransactionDetailsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="p-6 border-b border-gray-100 last:border-0 hover:bg-slate-50/50 transition-colors">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
};

export const TransactionDetailRow: React.FC<{ label: string; value: React.ReactNode; isCopyable?: boolean }> = ({ label, value, isCopyable }) => {
    return (
        <div className="flex justify-between items-start group">
            <span className="text-sm text-slate-500 font-medium">{label}</span>
            <div className="flex items-center gap-2 text-sm text-slate-900 font-medium text-right">
                {value}
                {isCopyable && (
                    <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 transition-all">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

interface InputRowProps {
  label: string;
  children: React.ReactNode;
  helpText?: string;
  required?: boolean;
}

export const InputRow: React.FC<InputRowProps> = ({ label, children, helpText, required }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helpText && <p className="text-xs text-slate-500">{helpText}</p>}
    </div>
  );
};

interface FormFooterProps {
  primaryAction: {
    label: string;
    onClick: () => void;
    isLoading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const FormFooter: React.FC<FormFooterProps> = ({ primaryAction, secondaryAction }) => {
  return (
    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3 sticky bottom-0 z-10">
      {secondaryAction && (
        <button
          onClick={secondaryAction.onClick}
          className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all"
        >
          {secondaryAction.label}
        </button>
      )}
      <button
        onClick={primaryAction.onClick}
        disabled={primaryAction.isLoading}
        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {primaryAction.isLoading ? 'Processing...' : primaryAction.label}
      </button>
    </div>
  );
};

export const GenericFormLayout = {
  Header: FormHeader,
  Section: FormSection,
  InputRow: InputRow,
  Footer: FormFooter
};
