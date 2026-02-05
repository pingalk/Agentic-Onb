import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { Check, Loader2, X, Mail, Phone, Calendar, ExternalLink, Link2 } from 'lucide-react';
import { PaymentLinkPrefill } from './PaymentLinkWidget';
import { SourceRect } from './PaymentLinkMiniCard';

export interface PaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: { linkUrl: string; amount: string; purpose: string }) => void;
  prefill?: PaymentLinkPrefill;
  sourceRect?: SourceRect | null;
  onMorphComplete?: () => void;
}

// Checkbox component
const Checkbox = ({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <div
      onClick={() => onChange(!checked)}
      className={`
        w-[18px] h-[18px] rounded-[4px] border-[1.5px] flex items-center justify-center transition-all
        ${checked ? 'bg-[#305EFF] border-[#305EFF]' : 'bg-white border-[#cbd5e1] hover:border-[#94a3b8]'}
      `}
    >
      {checked && <Check size={12} strokeWidth={3} className="text-white" />}
    </div>
    <span className="text-[14px] text-[#40566d]">{label}</span>
  </label>
);

// --- Main Modal Component ---
export const PaymentLinkModal: React.FC<PaymentLinkModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  prefill,
  sourceRect,
  onMorphComplete
}) => {
  // Form State
  const [formData, setFormData] = useState({
    amount: prefill?.amount || '',
    purpose: prefill?.purpose || '',
    email: prefill?.email || '',
    phone: prefill?.phone || '',
    notifyEmail: false,
    notifySms: false,
    referenceId: '',
    noExpiry: true,
    expiryDate: '',
    enablePartialPayment: false
  });

  const [status, setStatus] = useState<'editing' | 'submitting' | 'success'>('editing');
  const [morphPhase, setMorphPhase] = useState<'morphing' | 'complete' | 'closing'>('morphing');

  // Refs for focus management
  const amountRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Calculate target rect (modal position)
  const getTargetRect = () => {
    // Modal is centered, max-w-[520px], positioned with bottom-[130px]
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const modalWidth = Math.min(520, windowWidth - 32);
    const modalHeight = Math.min(windowHeight * 0.65, 600);
    const bottomOffset = 130;

    return {
      top: (windowHeight - bottomOffset - modalHeight) / 2,
      left: (windowWidth - modalWidth) / 2,
      width: modalWidth,
      height: modalHeight
    };
  };

  // Update form data when prefill changes
  useEffect(() => {
    if (prefill) {
      setFormData(prev => ({
        ...prev,
        amount: prefill.amount || prev.amount,
        purpose: prefill.purpose || prev.purpose,
        email: prefill.email || prev.email,
        phone: prefill.phone || prev.phone
      }));
    }
  }, [prefill]);

  // Reset morph phase when modal opens
  useEffect(() => {
    if (isOpen) {
      setMorphPhase('morphing');
    }
  }, [isOpen]);

  // Focus amount field after morph completes
  useEffect(() => {
    if (isOpen && status === 'editing' && morphPhase === 'complete') {
      setTimeout(() => {
        amountRef.current?.focus();
      }, 100);
    }
  }, [isOpen, status, morphPhase]);

  // Update field helper
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Form validation
  const isFormValid = !!formData.amount;

  // Handle form submission
  const handleSubmit = () => {
    if (!isFormValid || status !== 'editing') return;

    setStatus('submitting');

    setTimeout(() => {
      setStatus('success');

      const linkId = Math.random().toString(36).substring(2, 10);
      const linkUrl = `https://rzp.io/l/${linkId}`;

      setTimeout(() => {
        onComplete({
          linkUrl,
          amount: formData.amount,
          purpose: formData.purpose
        });
      }, 1500);
    }, 800);
  };

  // Check if we have a valid source rect for morphing
  const hasSourceRect = sourceRect && sourceRect.width > 0;

  // Handle close with reverse morph animation
  const handleClose = () => {
    if (hasSourceRect && morphPhase === 'complete') {
      // Trigger closing animation
      setMorphPhase('closing');
    } else {
      // No source rect or not complete, just close immediately
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen && morphPhase !== 'closing') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, morphPhase]);

  if (!isOpen) return null;

  const targetRect = getTargetRect();

  const modalContent = (
    <>
      {/* Scrim - fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: morphPhase === 'closing' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 bg-black/40"
        onClick={handleClose}
      />

      {/* Morphing element - blank white card that transforms from mini card to modal shape */}
      {/* Uses AnimatePresence for smooth exit fade when transitioning to modal content */}
      <AnimatePresence>
        {hasSourceRect && morphPhase === 'morphing' && (
          <motion.div
            className="fixed z-[59] bg-white overflow-hidden pointer-events-none"
            initial={{
              top: sourceRect.top,
              left: sourceRect.left,
              width: sourceRect.width,
              height: sourceRect.height,
              borderRadius: 12,
              boxShadow: '0 0 0 1px rgba(48, 94, 255, 0.3)', // Match mini card border
            }}
            animate={{
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
              borderRadius: 8,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // Modal shadow
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15 }
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 28,
              mass: 0.7,
            }}
            onAnimationComplete={() => {
              if (morphPhase === 'morphing') {
                setMorphPhase('complete');
                onMorphComplete?.();
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Closing morph - reverse animation from modal back to mini card */}
      {hasSourceRect && morphPhase === 'closing' && (
        <motion.div
          className="fixed z-[60] bg-white overflow-hidden pointer-events-none"
          initial={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            borderRadius: 8,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
          animate={{
            top: sourceRect.top,
            left: sourceRect.left,
            width: sourceRect.width,
            height: sourceRect.height,
            borderRadius: 12,
            boxShadow: '0 0 0 1px rgba(48, 94, 255, 0.3)',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 28,
            mass: 0.7,
          }}
          onAnimationComplete={() => {
            onClose();
          }}
        />
      )}

      {/* Modal Container - shows after morph or immediately if no source rect, hides when closing */}
      <AnimatePresence>
        {(morphPhase === 'complete' || (!hasSourceRect && morphPhase !== 'closing')) && (
          <div className="fixed inset-0 bottom-[130px] z-[60] flex items-center justify-center pointer-events-none p-4">
            <motion.div
              ref={modalRef}
              initial={hasSourceRect ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={hasSourceRect
                ? { duration: 0.15 } // Quick fade-in to crossfade with morphing element
                : { type: 'spring', damping: 25, stiffness: 300 }
              }
              className="pointer-events-auto w-full max-w-[520px] bg-white rounded-[8px] shadow-2xl flex flex-col max-h-[65vh]"
            >
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 flex flex-col items-center justify-center min-h-[200px]"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
                      className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3"
                    >
                      <Check size={24} strokeWidth={3} className="text-white" />
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="font-medium text-[18px] text-[#192839]"
                    >
                      Payment Link Created!
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: hasSourceRect ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: hasSourceRect ? 0 : 0.25 }}
                    className="flex flex-col w-full overflow-hidden"
                  >
                    {/* Header - Fixed */}
                    <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-[#e2e8f0]">
                      <h2 className="text-[22px] font-medium text-[#3a4755]">
                        Standard Payment Link
                      </h2>
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
                      <div className="flex flex-col gap-5">

                        {/* Amount */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[14px] font-medium text-[#3a4755]">
                            Amount<span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center h-[44px] border border-[#e2e8f0] rounded-[6px] bg-white focus-within:border-[#305EFF] focus-within:ring-1 focus-within:ring-[#305EFF] transition-all">
                            <div className="flex items-center justify-center w-[44px] h-full border-r border-[#e2e8f0] bg-[#f8fafc]">
                              <span className="text-[16px] font-medium text-[#64748b]">₹</span>
                            </div>
                            <input
                              ref={amountRef}
                              type="text"
                              value={formData.amount}
                              onChange={(e) => updateField('amount', e.target.value)}
                              className="flex-1 h-full px-3 text-[15px] text-[#1e293b] outline-none bg-transparent placeholder:text-[#94a3b8]"
                              placeholder="100.00"
                            />
                          </div>
                        </div>

                        {/* Payment For */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[14px] font-medium text-[#3a4755]">
                            Payment For
                          </label>
                          <input
                            type="text"
                            value={formData.purpose}
                            onChange={(e) => updateField('purpose', e.target.value)}
                            className="h-[44px] px-3 border border-[#e2e8f0] rounded-[6px] text-[15px] text-[#1e293b] outline-none bg-white focus:border-[#305EFF] focus:ring-1 focus:ring-[#305EFF] transition-all placeholder:text-[#94a3b8]"
                            placeholder="Payment description"
                          />
                        </div>

                        {/* Customer Details */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[14px] font-medium text-[#3a4755]">
                            Customer Details
                          </label>
                          <div className="flex gap-3">
                            {/* Email */}
                            <div className="flex-1 flex items-center h-[44px] border border-[#e2e8f0] rounded-[6px] bg-white focus-within:border-[#305EFF] focus-within:ring-1 focus-within:ring-[#305EFF] transition-all">
                              <div className="flex items-center justify-center w-[40px] h-full">
                                <Mail size={16} className="text-[#94a3b8]" />
                              </div>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                className="flex-1 h-full pr-3 text-[15px] text-[#1e293b] outline-none bg-transparent placeholder:text-[#94a3b8]"
                                placeholder="john@example.c"
                              />
                            </div>
                            {/* Phone */}
                            <div className="flex-1 flex items-center h-[44px] border border-[#e2e8f0] rounded-[6px] bg-white focus-within:border-[#305EFF] focus-within:ring-1 focus-within:ring-[#305EFF] transition-all">
                              <div className="flex items-center justify-center w-[40px] h-full">
                                <Phone size={16} className="text-[#94a3b8]" />
                              </div>
                              <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => updateField('phone', e.target.value)}
                                className="flex-1 h-full pr-3 text-[15px] text-[#1e293b] outline-none bg-transparent placeholder:text-[#94a3b8]"
                                placeholder="+91 9876543210"
                              />
                            </div>
                          </div>

                          {/* Notify checkboxes */}
                          <div className="flex gap-6 mt-2">
                            <Checkbox
                              checked={formData.notifyEmail}
                              onChange={(checked) => updateField('notifyEmail', checked)}
                              label="Notify via Email"
                            />
                            <Checkbox
                              checked={formData.notifySms}
                              onChange={(checked) => updateField('notifySms', checked)}
                              label="Notify via SMS"
                            />
                          </div>

                          {/* More ways to notify */}
                          <a
                            href="#"
                            className="flex items-center gap-1 text-[14px] text-[#305EFF] hover:text-[#1a4cd6] mt-1 w-fit"
                            onClick={(e) => e.preventDefault()}
                          >
                            More ways to notify
                            <ExternalLink size={14} />
                          </a>
                        </div>

                        {/* Reference Id */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[14px] font-medium text-[#3a4755]">
                            Reference Id
                          </label>
                          <input
                            type="text"
                            value={formData.referenceId}
                            onChange={(e) => updateField('referenceId', e.target.value)}
                            className="h-[44px] px-3 border border-[#e2e8f0] rounded-[6px] text-[15px] text-[#1e293b] outline-none bg-white focus:border-[#305EFF] focus:ring-1 focus:ring-[#305EFF] transition-all placeholder:text-[#94a3b8]"
                            placeholder="123456"
                          />
                        </div>

                        {/* Link Expiry */}
                        <div className="flex flex-col gap-2">
                          <label className="text-[14px] font-medium text-[#3a4755]">
                            Link Expiry
                          </label>
                          <Checkbox
                            checked={formData.noExpiry}
                            onChange={(checked) => updateField('noExpiry', checked)}
                            label="No Expiry"
                          />
                          <div className="flex items-center h-[44px] w-[180px] border border-[#e2e8f0] rounded-[6px] bg-white">
                            <input
                              type="text"
                              value={formData.expiryDate}
                              onChange={(e) => updateField('expiryDate', e.target.value)}
                              disabled={formData.noExpiry}
                              className={`flex-1 h-full px-3 text-[15px] outline-none bg-transparent placeholder:text-[#94a3b8] ${formData.noExpiry ? 'text-[#94a3b8]' : 'text-[#1e293b]'}`}
                              placeholder="DD-MM-YYYY"
                            />
                            <div className="flex items-center justify-center w-[40px] h-full border-l border-[#e2e8f0] bg-[#f8fafc] rounded-r-[6px]">
                              <Calendar size={16} className="text-[#64748b]" />
                            </div>
                          </div>
                        </div>

                        {/* Reminders */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[14px] font-medium text-[#3a4755]">
                            Reminders
                          </label>
                          <p className="text-[14px] text-[#64748b]">
                            Reminders is not set to payment links with no expiry date.
                          </p>
                          <a
                            href="#"
                            className="text-[14px] text-[#305EFF] hover:text-[#1a4cd6] w-fit"
                            onClick={(e) => e.preventDefault()}
                          >
                            Set it up here
                          </a>
                        </div>

                        {/* Partial Payment */}
                        <div className="flex flex-col gap-2">
                          <label className="text-[14px] font-medium text-[#3a4755]">
                            Partial Payment
                          </label>
                          <Checkbox
                            checked={formData.enablePartialPayment}
                            onChange={(checked) => updateField('enablePartialPayment', checked)}
                            label="Enable Partial Payment"
                          />
                        </div>

                        {/* Notes */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[14px] font-medium text-[#3a4755]">
                            Notes
                          </label>
                          <a
                            href="#"
                            className="text-[14px] text-[#305EFF] hover:text-[#1a4cd6] w-fit"
                            onClick={(e) => e.preventDefault()}
                          >
                            + Add New
                          </a>
                        </div>

                      </div>
                    </div>

                    {/* Footer - Fixed */}
                    <div className="flex-shrink-0 px-6 py-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex gap-3 justify-end rounded-b-[8px]">
                      <button
                        onClick={handleClose}
                        className="h-[42px] px-6 rounded-[6px] text-[14px] font-medium text-[#64748b] bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || status === 'submitting'}
                        className={`h-[42px] px-6 rounded-[6px] text-[14px] font-medium transition-all flex items-center justify-center min-w-[160px]
                          ${isFormValid
                            ? 'bg-[#5B7FFF] text-white hover:bg-[#4a6ee8]'
                            : 'bg-[#cbd5e1] text-white cursor-not-allowed'
                          }`}
                      >
                        {status === 'submitting' ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          'Create Payment Link'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );

  // Render via portal to document body
  return createPortal(
    <AnimatePresence>
      {isOpen && modalContent}
    </AnimatePresence>,
    document.body
  );
};

export default PaymentLinkModal;
