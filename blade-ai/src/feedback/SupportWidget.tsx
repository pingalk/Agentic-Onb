import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface SupportTicket {
  /** Issue type/category */
  type: string;
  /** Issue description */
  description: string;
  /** User email (optional) */
  email?: string;
  /** Priority level */
  priority?: 'low' | 'medium' | 'high';
}

export interface SupportWidgetProps {
  /** Callback when ticket is submitted */
  onSubmit: (ticket: SupportTicket) => void | Promise<void>;
  /** Whether form is submitting */
  isSubmitting?: boolean;
  /** Issue type options */
  issueTypes?: string[];
  /** Show email field */
  showEmail?: boolean;
  /** Show priority selector */
  showPriority?: boolean;
  /** Custom title */
  title?: string;
  /** Custom submit button label */
  submitLabel?: string;
  /** Additional CSS classes */
  className?: string;
}

const defaultIssueTypes = [
  'Bug Report',
  'Feature Request',
  'Question',
  'Account Issue',
  'Other',
];

/**
 * Support/help form widget
 *
 * Collapsible support ticket form.
 *
 * @example
 * ```tsx
 * <SupportWidget
 *   onSubmit={async (ticket) => {
 *     await submitSupportTicket(ticket);
 *   }}
 *   isSubmitting={isLoading}
 *   showEmail
 *   showPriority
 * />
 * ```
 */
export const SupportWidget: React.FC<SupportWidgetProps> = ({
  onSubmit,
  isSubmitting = false,
  issueTypes = defaultIssueTypes,
  showEmail = false,
  showPriority = false,
  title = 'Need Help?',
  submitLabel = 'Submit',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<SupportTicket>({
    type: '',
    description: '',
    email: '',
    priority: 'medium',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.description) return;

    await onSubmit(formData);
    setIsSuccess(true);

    // Reset after delay
    setTimeout(() => {
      setIsSuccess(false);
      setIsOpen(false);
      setFormData({
        type: '',
        description: '',
        email: '',
        priority: 'medium',
      });
    }, 2000);
  };

  const updateField = <K extends keyof SupportTicket>(
    field: K,
    value: SupportTicket[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={className}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {title}
        <motion.svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          animate={{ rotate: isOpen ? 180 : 0 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {isSuccess ? (
                <motion.div
                  className="flex flex-col items-center text-center p-4 bg-emerald-50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <svg
                    className="w-8 h-8 text-emerald-500 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="font-medium text-emerald-700">Request Submitted!</p>
                  <p className="text-sm text-emerald-600">We'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Issue type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Issue Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => updateField('type', e.target.value)}
                      className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select an issue type</option>
                      {issueTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Email (optional) */}
                  {showEmail && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="your@email.com"
                        className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {/* Priority (optional) */}
                  {showPriority && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Priority
                      </label>
                      <div className="flex gap-2">
                        {(['low', 'medium', 'high'] as const).map((priority) => (
                          <button
                            key={priority}
                            type="button"
                            onClick={() => updateField('priority', priority)}
                            className={`
                              flex-1 py-1.5 text-sm font-medium rounded-lg
                              transition-colors capitalize
                              ${
                                formData.priority === priority
                                  ? priority === 'high'
                                    ? 'bg-red-100 text-red-700'
                                    : priority === 'medium'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }
                            `}
                          >
                            {priority}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Describe your issue or question..."
                      className="w-full p-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.type || !formData.description}
                    className={`
                      w-full py-2 px-4 rounded-lg font-medium text-sm
                      transition-colors
                      ${
                        isSubmitting || !formData.type || !formData.description
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Submitting...
                      </span>
                    ) : (
                      submitLabel
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportWidget;
