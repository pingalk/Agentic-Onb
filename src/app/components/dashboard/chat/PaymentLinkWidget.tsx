import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';
import closeSmallSvgPaths from "@/imports/svg-ce3x7zys9c";

// --- Types ---
export interface PaymentLinkPrefill {
  amount?: string;
  purpose?: string;
  email?: string;
  phone?: string;
}

interface PaymentLinkWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: { linkUrl: string; amount: string; purpose: string }) => void;
  prefill?: PaymentLinkPrefill;
}

// --- Helper: Parse user input for payment link intent ---
export const parsePaymentLinkIntent = (query: string): PaymentLinkPrefill | null => {
  const lowerQuery = query.toLowerCase();

  // Check if this is a payment link request
  if (!lowerQuery.includes('payment link') && !lowerQuery.includes('create link')) {
    return null;
  }

  // Extract Amount
  const amountMatch = query.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
  const amount = amountMatch ? amountMatch[1].replace(/,/g, '') : '';

  // Extract Email
  const emailMatch = query.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract Phone (10 digit Indian mobile)
  const phoneMatch = query.match(/\b\d{10}\b/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract Purpose (text after "for")
  let purpose = '';
  if (lowerQuery.includes('for')) {
    const parts = query.split(/\bfor\b/i);
    if (parts.length > 1) {
      let rawPurpose = parts.slice(1).join('for').trim();
      // Remove extracted values
      if (amount) rawPurpose = rawPurpose.replace(new RegExp(amount.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
      if (email) rawPurpose = rawPurpose.replace(email, '');
      if (phone) rawPurpose = rawPurpose.replace(phone, '');
      // Clean up
      rawPurpose = rawPurpose.replace(/\s+/g, ' ').replace(/^[\s,to]+|[\s,]+$/g, '').trim();

      if (rawPurpose.length > 0 && !/^[^a-zA-Z0-9]+$/.test(rawPurpose)) {
        purpose = rawPurpose;
      }
    }
  }

  return { amount, purpose, email, phone };
};

// --- Calculate initial step based on prefilled data ---
const calculateInitialStep = (prefill?: PaymentLinkPrefill): number => {
  if (!prefill) return 0;

  const hasAmount = !!prefill.amount;
  const hasPurpose = !!prefill.purpose;
  const hasContact = !!prefill.email || !!prefill.phone;

  // If all main fields are filled, go to step 2 (Other Details)
  if (hasAmount && hasPurpose && hasContact) return 2;
  // If payment details are complete but no contact, go to step 1 (Customer Details)
  if (hasAmount && hasPurpose) return 1;
  // Otherwise start from step 0
  return 0;
};

// --- Visual Components ---
const StepperIcon = ({ state, stepNumber, isLast }: { state: 'completed' | 'active' | 'pending', stepNumber: number, isLast: boolean }) => {
  return (
    <div className="relative flex flex-col items-center h-full w-[24px]">
      <div className={`
        relative z-10 flex items-center justify-center w-[24px] h-[24px] rounded-full text-[12px] font-bold transition-colors duration-300
        ${state === 'completed' ? 'bg-black text-white' : ''}
        ${state === 'active' ? 'bg-black text-white' : ''}
        ${state === 'pending' ? 'bg-transparent border border-[#cbd5e1] text-[#94a3b8]' : ''}
      `}>
        {state === 'completed' ? (
          <Check size={14} strokeWidth={3} />
        ) : (
          <span>{stepNumber}</span>
        )}
      </div>

      {!isLast && (
        <div className={`
          absolute top-[24px] bottom-[-4px] w-[1px]
          ${state === 'completed' ? 'bg-black' : ''}
          ${state === 'active' ? 'border-l border-dashed border-gray-400' : ''}
          ${state === 'pending' ? 'bg-[#cbd5e1]' : ''}
        `}></div>
      )}
    </div>
  );
};

// Radio button components
const RadioSelected = () => (
  <div className="relative shrink-0 size-[16px]">
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
      <circle cx="8" cy="8" fill="#305EFF" r="8" />
      <circle cx="8" cy="8" fill="white" r="3" />
    </svg>
  </div>
);

const RadioUnselected = () => (
  <div className="relative shrink-0 size-[16px]">
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7.25" stroke="#CBD5E2" strokeWidth="1.5" />
    </svg>
  </div>
);

// --- Main Widget Component ---
export const PaymentLinkWidget: React.FC<PaymentLinkWidgetProps> = ({
  isOpen,
  onClose,
  onComplete,
  prefill
}) => {
  // Form State
  const [formData, setFormData] = useState({
    amount: prefill?.amount || '',
    purpose: prefill?.purpose || '',
    email: prefill?.email || '',
    phone: prefill?.phone || '',
    shouldExpire: false,
    reminder: false
  });

  // Step State: 0=Payment Details, 1=Customer Details, 2=Other Details, 3=Review
  const [activeStep, setActiveStep] = useState(() => calculateInitialStep(prefill));
  const [status, setStatus] = useState<'editing' | 'submitting' | 'success'>('editing');

  // Refs for focus management
  const amountRef = useRef<HTMLInputElement>(null);
  const purposeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

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
      setActiveStep(calculateInitialStep(prefill));
    }
  }, [prefill]);

  // Focus first empty field in active step
  useEffect(() => {
    if (status !== 'editing') return;

    setTimeout(() => {
      if (activeStep === 0) {
        if (!formData.amount) {
          amountRef.current?.focus();
        } else if (!formData.purpose) {
          purposeRef.current?.focus();
        } else {
          amountRef.current?.focus();
        }
      } else if (activeStep === 1) {
        if (!formData.email) {
          emailRef.current?.focus();
        } else {
          phoneRef.current?.focus();
        }
      }
    }, 100);
  }, [activeStep, status]);

  // Update field helper
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Step validation
  const isStep0Valid = !!formData.amount && !!formData.purpose;
  const isStep1Valid = true; // Customer details are optional
  const isStep2Valid = true; // Other details always valid (has defaults)
  const isFormValid = isStep0Valid;

  // Check if all steps have been visited (for review state)
  const allStepsComplete = activeStep === 3;

  // Get step state
  const getStepState = (stepId: number): 'completed' | 'active' | 'pending' => {
    if (activeStep === stepId) return 'active';
    if (activeStep > stepId) return 'completed';
    return 'pending';
  };

  // Handle step completion
  const handleNextStep = (currentStep: number) => {
    if (currentStep === 0) {
      setActiveStep(1);
    } else if (currentStep === 1) {
      setActiveStep(2);
    } else if (currentStep === 2) {
      setActiveStep(3); // Go to review
    }
  };

  // Handle "Change" click from review
  const handleEdit = (stepId: number) => {
    setActiveStep(stepId);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!isFormValid || status !== 'editing') return;

    setStatus('submitting');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');

      // Generate mock link
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

  // Render summary for completed steps
  const renderSummary = (stepId: number) => {
    if (stepId === 0) {
      if (!formData.amount && !formData.purpose) return null;
      return `₹${formData.amount || '0'} • ${formData.purpose || '-'}`;
    }
    if (stepId === 1) {
      if (!formData.email && !formData.phone) return "Not added";
      return [formData.email, formData.phone].filter(Boolean).join(" • ");
    }
    if (stepId === 2) {
      return `Expiry: ${formData.shouldExpire ? 'Yes' : 'No'} • Reminder: ${formData.reminder ? 'Yes' : 'No'}`;
    }
    return null;
  };

  // Define field order for keyboard navigation
  const step0Fields = [amountRef, purposeRef];
  const step1Fields = [emailRef, phoneRef];

  // Handle key navigation with Enter, ArrowUp, and ArrowDown
  const handleKeyDown = (
    e: React.KeyboardEvent,
    currentRef: React.RefObject<HTMLInputElement>,
    prevRef?: React.RefObject<HTMLInputElement>,
    nextRef?: React.RefObject<HTMLInputElement>,
    isLastInStep?: boolean,
    stepValidation?: boolean,
    currentStep?: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isLastInStep && stepValidation !== false && currentStep !== undefined) {
        // Move to next step
        handleNextStep(currentStep);
      } else if (nextRef?.current) {
        nextRef.current.focus();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (nextRef?.current) {
        nextRef.current.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (prevRef?.current) {
        prevRef.current.focus();
      }
    }
  };

  // Global keyboard listener for review screen (Enter to submit)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (activeStep === 3 && e.key === 'Enter' && isFormValid && status === 'editing') {
        e.preventDefault();
        handleSubmit();
      }
    };

    if (activeStep === 3) {
      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }
  }, [activeStep, isFormValid, status]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute bottom-[130px] left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-[#EAEEFF] rounded-[12px] p-[4px] shadow-2xl z-50 border border-white/50"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-[16px] right-[16px] size-[24px] flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity z-50 rounded-full hover:bg-black/5"
      >
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <path d={closeSmallSvgPaths.p38bb2100} fill="#192839" />
        </svg>
      </button>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          // Success State
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[8px] p-6 flex flex-col items-center justify-center min-h-[160px]"
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
              className="font-['TASA_Orbiter_Display',sans-serif] font-medium text-[18px] text-[#192839]"
            >
              Payment Link Created!
            </motion.p>
          </motion.div>
        ) : (
          // Form State
          <motion.div
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col w-full"
          >
            {/* Header */}
            <div className="p-[12px] pb-0">
              <p className="font-['TASA_Orbiter_Display',sans-serif] font-medium text-[18px] text-[#192839] leading-[24px]">
                Let's create a payment link
              </p>
            </div>

            {/* Steps Container */}
            <div className="bg-white rounded-[8px] m-[4px] mt-[12px] p-[20px] flex flex-col border border-[rgba(108,132,157,0.12)]">

              {/* Step 0: Payment Link Details */}
              <div className="flex gap-3 w-full">
                <div className="flex flex-col items-center min-w-[32px]">
                  <StepperIcon state={getStepState(0)} stepNumber={1} isLast={false} />
                </div>
                <div className="flex-1 flex flex-col gap-3 pb-6">
                  <div
                    className="flex flex-col justify-center min-h-[24px]"
                  >
                    <div className="flex items-center justify-between">
                      <p className={`font-['Inter',sans-serif] font-medium text-[14px] transition-colors ${getStepState(0) === 'pending' ? 'text-slate-400' : 'text-[#192839]'}`}>
                        Payment link Details
                      </p>
                      {getStepState(0) === 'completed' && (
                        <button
                          onClick={() => handleEdit(0)}
                          className="font-['Inter',sans-serif] text-[13px] font-medium text-[#305EFF] hover:text-[#1a4cd6] transition-colors"
                        >
                          Change
                        </button>
                      )}
                    </div>
                    {getStepState(0) === 'completed' && (
                      <p className="text-[13px] text-gray-500 mt-1">{renderSummary(0)}</p>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeStep === 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col">
                          {/* Amount Input */}
                          <div className="group bg-white h-[48px] rounded-t-[4px] w-full border border-[#e3eaf3] flex items-center transition-all duration-200 focus-within:border-[#305EFF] focus-within:ring-1 focus-within:ring-[#305EFF] focus-within:z-10">
                            <div className="flex items-center px-[12px] w-full">
                              <span className="font-['Inter',sans-serif] font-bold text-[16px] text-[#40566d] mr-1">₹</span>
                              <input
                                ref={amountRef}
                                type="text"
                                value={formData.amount}
                                onChange={(e) => updateField('amount', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, amountRef, undefined, purposeRef, false)}
                                className="font-['Inter',sans-serif] font-bold text-[16px] text-[#40566d] w-full outline-none bg-transparent placeholder:text-slate-300"
                                placeholder="0.00"
                              />
                            </div>
                          </div>

                          {/* Purpose Input */}
                          <div className="group bg-white h-[48px] rounded-b-[4px] w-full border border-[#e3eaf3] border-t-0 flex items-center transition-all duration-200 focus-within:border-[#305EFF] focus-within:ring-1 focus-within:ring-[#305EFF] focus-within:z-10 -mt-[1px]">
                            <div className="flex items-center px-[12px] w-full">
                              <input
                                ref={purposeRef}
                                type="text"
                                value={formData.purpose}
                                onChange={(e) => updateField('purpose', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, purposeRef, amountRef, undefined, true, isStep0Valid, 0)}
                                className="font-['Inter',sans-serif] text-[16px] text-[#40566d] w-full outline-none bg-transparent placeholder:text-[#40566d]/40"
                                placeholder="Payment for"
                              />
                            </div>
                          </div>

                          {/* Next Button */}
                          <button
                            onClick={() => handleNextStep(0)}
                            disabled={!isStep0Valid}
                            className={`mt-3 h-[36px] w-full rounded-[6px] font-['Inter',sans-serif] font-medium text-[14px] transition-all duration-200 relative overflow-hidden
                              ${isStep0Valid
                                ? 'text-white cursor-pointer shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] active:scale-[0.98]'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            style={isStep0Valid ? {
                              background: 'linear-gradient(-73deg, #1566f1 54.84%, #4793fd 98.57%)',
                              boxShadow: 'inset 0px 2px 0px 0px rgba(255,255,255,0.2)'
                            } : undefined}
                          >
                            Proceed
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Step 1: Customer Details */}
              <div className="flex gap-3 w-full">
                <div className="flex flex-col items-center min-w-[32px]">
                  <StepperIcon state={getStepState(1)} stepNumber={2} isLast={false} />
                </div>
                <div className="flex-1 flex flex-col gap-3 pb-6">
                  <div
                    className="flex flex-col justify-center min-h-[24px]"
                  >
                    <div className="flex items-center justify-between">
                      <p className={`font-['Inter',sans-serif] font-medium text-[14px] transition-colors ${getStepState(1) === 'pending' ? 'text-slate-400' : 'text-[#192839]'}`}>
                        Customer Details
                      </p>
                      {getStepState(1) === 'completed' && (
                        <button
                          onClick={() => handleEdit(1)}
                          className="font-['Inter',sans-serif] text-[13px] font-medium text-[#305EFF] hover:text-[#1a4cd6] transition-colors"
                        >
                          Change
                        </button>
                      )}
                    </div>
                    {getStepState(1) === 'completed' && (
                      <p className="text-[13px] text-gray-500 mt-1">{renderSummary(1)}</p>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col">
                          {/* Email Input */}
                          <div className="group bg-white h-[48px] rounded-t-[4px] w-full border border-[#e3eaf3] flex items-center transition-all duration-200 focus-within:border-[#305EFF] focus-within:ring-1 focus-within:ring-[#305EFF] focus-within:z-10">
                            <div className="flex items-center px-[12px] w-full">
                              <input
                                ref={emailRef}
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, emailRef, undefined, phoneRef, false)}
                                className="font-['Inter',sans-serif] text-[16px] text-[#40566d] w-full outline-none bg-transparent placeholder:text-[#40566d]/40"
                                placeholder="customer@example.com"
                              />
                            </div>
                          </div>

                          {/* Phone Input */}
                          <div className="group bg-white h-[48px] rounded-b-[4px] w-full border border-[#e3eaf3] border-t-0 flex items-center transition-all duration-200 focus-within:border-[#305EFF] focus-within:ring-1 focus-within:ring-[#305EFF] focus-within:z-10 -mt-[1px]">
                            <div className="flex items-center px-[12px] w-full">
                              <span className="font-['Inter',sans-serif] text-[16px] text-[#40566d]/60 mr-2">+91</span>
                              <input
                                ref={phoneRef}
                                type="text"
                                value={formData.phone}
                                onChange={(e) => updateField('phone', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, phoneRef, emailRef, undefined, true, true, 1)}
                                className="font-['Inter',sans-serif] text-[16px] text-[#40566d] w-full outline-none bg-transparent placeholder:text-[#40566d]/40"
                                placeholder="Phone number (optional)"
                              />
                            </div>
                          </div>

                          {/* Next & Skip Buttons */}
                          <div className="flex flex-col gap-1 mt-3">
                            <button
                              onClick={() => handleNextStep(1)}
                              className="h-[36px] w-full rounded-[6px] text-white font-['Inter',sans-serif] font-medium text-[14px] transition-all shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] active:scale-[0.98]"
                              style={{
                                background: 'linear-gradient(-73deg, #1566f1 54.84%, #4793fd 98.57%)',
                                boxShadow: 'inset 0px 2px 0px 0px rgba(255,255,255,0.2)'
                              }}
                            >
                              Proceed
                            </button>
                            <button
                              onClick={() => handleNextStep(1)}
                              className="h-[32px] w-full rounded-[4px] hover:bg-slate-50 font-['Inter',sans-serif] font-medium text-[13px] text-[#768ea7] transition-colors"
                            >
                              Skip
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Step 2: Other Details */}
              <div className="flex gap-3 w-full">
                <div className="flex flex-col items-center min-w-[32px]">
                  <StepperIcon state={getStepState(2)} stepNumber={3} isLast={true} />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div
                    className="flex flex-col justify-center min-h-[24px]"
                  >
                    <div className="flex items-center justify-between">
                      <p className={`font-['Inter',sans-serif] font-medium text-[14px] transition-colors ${getStepState(2) === 'pending' ? 'text-slate-400' : 'text-[#192839]'}`}>
                        Other Details
                      </p>
                      {getStepState(2) === 'completed' && (
                        <button
                          onClick={() => handleEdit(2)}
                          className="font-['Inter',sans-serif] text-[13px] font-medium text-[#305EFF] hover:text-[#1a4cd6] transition-colors"
                        >
                          Change
                        </button>
                      )}
                    </div>
                    {getStepState(2) === 'completed' && (
                      <p className="text-[13px] text-gray-500 mt-1">{renderSummary(2)}</p>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-[20px]">
                          {/* Link Expiry */}
                          <div className="flex flex-col gap-[8px]">
                            <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#768ea7] leading-[18px]">
                              Should the link expire?
                            </p>
                            <div className="flex gap-[15px]">
                              <div
                                className="flex gap-[4px] items-center cursor-pointer w-[120px]"
                                onClick={() => updateField('shouldExpire', true)}
                              >
                                <div className="p-[2px]">{formData.shouldExpire ? <RadioSelected /> : <RadioUnselected />}</div>
                                <span className="font-['Inter',sans-serif] text-[14px] text-[#40566d]">Yes</span>
                              </div>
                              <div
                                className="flex gap-[4px] items-center cursor-pointer w-[120px]"
                                onClick={() => updateField('shouldExpire', false)}
                              >
                                <div className="p-[2px]">{!formData.shouldExpire ? <RadioSelected /> : <RadioUnselected />}</div>
                                <span className="font-['Inter',sans-serif] text-[14px] text-[#40566d]">No</span>
                              </div>
                            </div>
                          </div>

                          {/* Reminder */}
                          <div className="flex flex-col gap-[8px]">
                            <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#768ea7] leading-[18px]">
                              Is a reminder required?
                            </p>
                            <div className="flex gap-[15px]">
                              <div
                                className="flex gap-[4px] items-center cursor-pointer w-[120px]"
                                onClick={() => updateField('reminder', true)}
                              >
                                <div className="p-[2px]">{formData.reminder ? <RadioSelected /> : <RadioUnselected />}</div>
                                <span className="font-['Inter',sans-serif] text-[14px] text-[#40566d]">Yes</span>
                              </div>
                              <div
                                className="flex gap-[4px] items-center cursor-pointer w-[120px]"
                                onClick={() => updateField('reminder', false)}
                              >
                                <div className="p-[2px]">{!formData.reminder ? <RadioSelected /> : <RadioUnselected />}</div>
                                <span className="font-['Inter',sans-serif] text-[14px] text-[#40566d]">No</span>
                              </div>
                            </div>
                          </div>

                          {/* Next & Skip Buttons */}
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleNextStep(2)}
                              className="h-[36px] w-full rounded-[6px] text-white font-['Inter',sans-serif] font-medium text-[14px] transition-all shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] active:scale-[0.98]"
                              style={{
                                background: 'linear-gradient(-73deg, #1566f1 54.84%, #4793fd 98.57%)',
                                boxShadow: 'inset 0px 2px 0px 0px rgba(255,255,255,0.2)'
                              }}
                            >
                              Proceed
                            </button>
                            <button
                              onClick={() => handleNextStep(2)}
                              className="h-[32px] w-full rounded-[4px] hover:bg-slate-50 font-['Inter',sans-serif] font-medium text-[13px] text-[#768ea7] transition-colors"
                            >
                              Skip
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Review Footer - appears when all steps complete */}
            <AnimatePresence>
              {allStepsComplete && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: 0.2 }}
                  className="px-[16px] pb-[16px] pt-[4px]"
                >
                  <button
                    disabled={!isFormValid || status === 'submitting'}
                    onClick={handleSubmit}
                    className={`w-full h-[40px] rounded-[8px] font-['Inter',sans-serif] font-medium text-[14px] transition-all duration-200 flex items-center justify-center
                      ${isFormValid
                        ? 'bg-gradient-to-r from-[#1566f1] to-[#4793fd] text-white hover:opacity-90 shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.2)] active:scale-[0.98]'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                  >
                    {status === 'submitting' ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      'Confirm & Create Link'
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
