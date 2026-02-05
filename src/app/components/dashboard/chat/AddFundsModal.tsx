import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import svgPaths from "@/imports/svg-m0923jgy3a";
import imgChatGptImageOct282025032150Pm2 from "figma:asset/bac6c683adc820f5ac390a46127dd3011074110c.png";

export interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (amount: string, purpose: string) => void;
  initialAmount?: string;
}

// --- Success State Components ---

function Heading({ amount }: { amount: string }) {
  const displayAmount = !isNaN(Number(amount.replace(/,/g, '')))
      ? Number(amount.replace(/,/g, '')).toLocaleString('en-IN')
      : amount;

  return (
    <div className="bg-white relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[4px] relative w-full">
          <p className="font-['TASA_Orbiter_Display',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#222] text-[18px] text-center">
            Congrats! ₹{displayAmount} has been added
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="absolute left-[11px] size-[24px] top-[11px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path clipRule="evenodd" d={svgPaths.p9937370} fill="var(--fill-0, white)" fillRule="evenodd" />
        </g>
      </svg>
    </div>
  );
}

function SuccessIcon() {
  return (
    <div className="absolute left-[-10px] overflow-clip rounded-[100px] size-[44px] top-0" style={{ backgroundImage: "linear-gradient(152.176deg, rgb(0, 158, 92) 32.335%, rgba(0, 158, 92, 0.51) 100.81%)" }}>
      <CheckIcon />
    </div>
  );
}

function SuccessVisual() {
  return (
    <div className="h-[88px] relative shrink-0 w-[100px]">
      <div className="absolute left-[12px] size-[88px] top-0">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgChatGptImageOct282025032150Pm2} />
      </div>
      <SuccessIcon />
    </div>
  );
}

// --- Main Modal ---

export const AddFundsModal: React.FC<AddFundsModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialAmount = ''
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [purpose, setPurpose] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<'amount' | 'purpose' | null>(null);

  const amountInputRef = useRef<HTMLInputElement>(null);
  const purposeInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(initialAmount);
      setPurpose('');
      setIsSuccess(false);
      setIsSubmitting(false);
      // Focus appropriate field after a short delay
      setTimeout(() => {
        if (initialAmount) {
          purposeInputRef.current?.focus();
        } else {
          amountInputRef.current?.focus();
        }
      }, 100);
    }
  }, [isOpen, initialAmount]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSuccess) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, isSuccess]);

  const handleSubmit = () => {
    if (!amount || !purpose || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSuccess(true);
      setIsSubmitting(false);

      // Auto-close after showing success
      setTimeout(() => {
        onComplete(amount, purpose);
      }, 2000);
    }, 800);
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      purposeInputRef.current?.focus();
    }
  };

  const handlePurposeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (amount && purpose) {
        handleSubmit();
      }
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Scrim */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/40"
        onClick={!isSuccess ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="pointer-events-auto w-full max-w-[420px] bg-white rounded-[12px] shadow-2xl flex flex-col overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col w-full"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                  <h2 className="text-[22px] font-medium text-[#192839]">
                    Add Funds via UPI
                  </h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                  <p className="font-['Inter',sans-serif] font-medium text-[#40566d] text-[15px] leading-[24px] mb-4">
                    How much would you like to add?
                  </p>

                  {/* Input Group */}
                  <div className="flex flex-col items-start pb-px relative shrink-0 w-full isolate mb-4">
                    {/* Amount Input */}
                    <div className={`relative shrink-0 w-full mb-[-1px] ${focusedField === 'amount' ? 'z-20' : 'z-10'}`}>
                      <div className={`bg-white h-[52px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full transition-all duration-200 ${focusedField === 'amount' ? 'ring-2 ring-[#305EFF]/20' : ''}`}>
                        <div
                          className={`absolute inset-0 pointer-events-none rounded-tl-[8px] rounded-tr-[8px] border-l border-r border-t border-solid transition-colors duration-200 ${focusedField === 'amount' ? 'border-[#305EFF] z-10' : 'border-[#e3eaf3]'}`}
                        />
                        <div className="flex flex-row items-center size-full relative z-20">
                          <div className="content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative size-full">
                            <span className={`font-['Inter'] font-bold text-[18px] leading-[24px] ${amount ? 'text-[#192839]' : 'text-slate-300'}`}>₹</span>
                            <input
                              ref={amountInputRef}
                              type="text"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              onFocus={() => setFocusedField('amount')}
                              onBlur={() => setFocusedField(null)}
                              onKeyDown={handleAmountKeyDown}
                              className="w-full bg-transparent outline-none font-['Inter'] font-bold text-[#192839] text-[18px] leading-[24px] placeholder-slate-300"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Purpose Input */}
                    <div className={`relative shrink-0 w-full ${focusedField === 'purpose' ? 'z-20' : 'z-10'}`}>
                      <div className={`bg-white h-[52px] relative rounded-bl-[8px] rounded-br-[8px] shrink-0 w-full transition-all duration-200 ${focusedField === 'purpose' ? 'ring-2 ring-[#305EFF]/20' : ''}`}>
                        <div
                          className={`absolute inset-0 pointer-events-none rounded-bl-[8px] rounded-br-[8px] border border-solid transition-colors duration-200 ${focusedField === 'purpose' ? 'border-[#305EFF] z-10' : 'border-[#e3eaf3]'}`}
                        />
                        <div className="flex flex-row items-center size-full relative z-20">
                          <div className="content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative size-full">
                            <input
                              ref={purposeInputRef}
                              type="text"
                              value={purpose}
                              onChange={(e) => setPurpose(e.target.value)}
                              onFocus={() => setFocusedField('purpose')}
                              onBlur={() => setFocusedField(null)}
                              onKeyDown={handlePurposeKeyDown}
                              className="w-full bg-transparent outline-none font-['Inter'] font-normal text-[#192839] text-[16px] leading-[24px] placeholder-[#94a3b8]"
                              placeholder="Enter purpose"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={!amount || !purpose || isSubmitting}
                    className="h-[42px] px-8 rounded-[6px] text-[14px] font-medium bg-[#305EFF] text-white hover:bg-[#1a4cd6] transition-colors flex items-center justify-center min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      'Confirm & Proceed'
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 px-6"
              >
                <Heading amount={amount} />
                <div className="mt-6">
                  <SuccessVisual />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && modalContent}
    </AnimatePresence>,
    document.body
  );
};

export default AddFundsModal;
