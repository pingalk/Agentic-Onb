import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { X, Check, Loader2, ChevronDown } from 'lucide-react';

export interface CaptureSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (setting: 'auto' | 'manual') => void;
}

export const CaptureSettingsModal: React.FC<CaptureSettingsModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [selectedOption, setSelectedOption] = useState<'auto' | 'manual'>('manual');
  const [captureWindow, setCaptureWindow] = useState('12 Mins');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedOption('manual');
      setStep(1);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step === 1) {
      if (selectedOption === 'auto') {
        // Auto capture - submit directly
        setIsSubmitting(true);
        setTimeout(() => {
          onComplete('auto');
        }, 800);
      } else {
        // Manual capture - could have step 2, but for now just complete
        setIsSubmitting(true);
        setTimeout(() => {
          onComplete('manual');
        }, 800);
      }
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

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
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 bottom-[130px] z-[60] flex items-center justify-center pointer-events-none p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="pointer-events-auto w-full max-w-[420px] bg-white rounded-[12px] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="text-[22px] font-medium text-[#192839]">
              Capture Settings
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
            <div className="border border-[#e2e8f0] rounded-[8px] overflow-hidden">
              {/* Automatic Capture Option */}
              <label
                className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${
                  selectedOption === 'auto' ? 'bg-[#f0f4ff]' : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="mt-0.5">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedOption === 'auto'
                        ? 'border-[#305EFF] bg-white'
                        : 'border-[#cbd5e1]'
                    }`}
                  >
                    {selectedOption === 'auto' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#305EFF]" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    type="radio"
                    name="captureOption"
                    value="auto"
                    checked={selectedOption === 'auto'}
                    onChange={() => setSelectedOption('auto')}
                    className="sr-only"
                  />
                  <p className="text-[16px] font-medium text-[#192839]">
                    Automatic Capture
                  </p>
                  <p className="text-[14px] text-[#64748b] mt-0.5">
                    Sit back, relax! Authorised payments will be captured automatically.
                  </p>
                </div>
              </label>

              {/* Divider */}
              <div className="border-t border-[#e2e8f0]" />

              {/* Manual Capture Option */}
              <label
                className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${
                  selectedOption === 'manual' ? 'bg-[#f0f4ff]' : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="mt-0.5">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedOption === 'manual'
                        ? 'border-[#305EFF] bg-white'
                        : 'border-[#cbd5e1]'
                    }`}
                  >
                    {selectedOption === 'manual' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#305EFF]" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    type="radio"
                    name="captureOption"
                    value="manual"
                    checked={selectedOption === 'manual'}
                    onChange={() => setSelectedOption('manual')}
                    className="sr-only"
                  />
                  <p className="text-[16px] font-medium text-[#192839]">
                    Manual Capture
                  </p>
                  <p className="text-[14px] text-[#64748b] mt-0.5">
                    Payments have to be captured manually by you via the API or the dashboard
                  </p>

                  {/* Capture Window Dropdown - only show when manual is selected */}
                  {selectedOption === 'manual' && (
                    <div className="mt-4">
                      <p className="text-[14px] text-[#40566d] mb-2">
                        Capture payments manually authorised within
                      </p>
                      <div className="relative">
                        <select
                          value={captureWindow}
                          onChange={(e) => setCaptureWindow(e.target.value)}
                          className="w-full h-[44px] px-3 pr-10 border-b-2 border-[#305EFF] bg-transparent text-[16px] text-[#192839] outline-none appearance-none cursor-pointer"
                        >
                          <option value="5 Mins">5 Mins</option>
                          <option value="10 Mins">10 Mins</option>
                          <option value="12 Mins">12 Mins</option>
                          <option value="15 Mins">15 Mins</option>
                          <option value="30 Mins">30 Mins</option>
                        </select>
                        <ChevronDown
                          size={20}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between">
            {/* Step Indicators */}
            <div className="flex gap-2">
              <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-[#305EFF]' : 'bg-[#cbd5e1]'}`} />
              <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-[#305EFF]' : 'bg-[#cbd5e1]'}`} />
            </div>

            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="h-[42px] px-8 rounded-[6px] text-[14px] font-medium bg-[#305EFF] text-white hover:bg-[#1a4cd6] transition-colors flex items-center justify-center min-w-[100px]"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                'Next'
              )}
            </button>
          </div>
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

export default CaptureSettingsModal;
