import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { Check, User, Link2, CreditCard, Loader2 } from 'lucide-react';
import Minimize from "@/imports/Minimize";
import Maximize from "@/imports/Maximize";
import Close from "@/imports/Close";
import PaymentLink from "@/imports/PaymentLink";
import svgPaths from './svg-accordion';
import { PaymentLinkSteps } from './PaymentLinkSteps';
import { SubscriptionSteps } from './SubscriptionSteps';
export { getFieldOrder } from './PaymentLinkSteps';
import { 
    initialSubscriptionData, 
    parseSubscriptionIntent, 
    validateSubscriptionStep 
} from './useSubscriptionForm';

// --- Success View Component ---
const SuccessView = ({ intent }: { intent: string }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-[120px] w-full absolute inset-0 bg-white z-20"
        >
            <div 
                className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3"
            >
                <motion.svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <motion.path 
                        d="M20 6L9 17l-5-5" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                    />
                </motion.svg>
            </div>
            <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-['Inter:SemiBold',sans-serif] text-[16px] text-[#192839]"
            >
                {intent === 'create_subscription' ? 'Subscription Created!' : 'Payment Link Created!'}
            </motion.p>
        </motion.div>
    );
};

// --- Smart Logic / Parser ---
export const parseInitialIntent = (query: string) => {
  const lowerQuery = query.toLowerCase();

  // 1. Check Subscription
  const subscriptionIntent = parseSubscriptionIntent(query);
  if (subscriptionIntent) return subscriptionIntent;
  
  // 2. Check Payment Link
  if (lowerQuery.includes('payment link') || lowerQuery.includes('create link')) {
    // 1. Extract Amount
    const amountMatch = query.match(/(\d+)/);
    const amount = amountMatch ? amountMatch[0] : '';
    
    // 2. Extract Email (Simple Regex)
    const emailMatch = query.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : '';

    // 3. Extract Phone (Simple 10 digit)
    const phoneMatch = query.match(/\b\d{10}\b/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    // 4. Extract Purpose
    let purpose = '';
    if (lowerQuery.includes('for')) {
        const parts = query.split(/for/i);
        if (parts.length > 1) {
            let rawPurpose = parts.slice(1).join('for').trim();
            if (amount) rawPurpose = rawPurpose.replace(amount, '');
            if (email) rawPurpose = rawPurpose.replace(email, '');
            if (phone) rawPurpose = rawPurpose.replace(phone, '');
            rawPurpose = rawPurpose.replace(/\s+/g, ' ').trim();

            if (rawPurpose.length > 0) {
                 const isJunk = /^[^a-zA-Z0-9]+$/.test(rawPurpose);
                 if (!isJunk) {
                     purpose = rawPurpose;
                 }
            }
        }
    }

    return {
      intent: 'create_payment_link',
      data: {
        amount: amount,
        purpose: purpose,
        customerEmail: email,
        customerPhone: phone,
        currency: 'INR'
      }
    };
  }

  // Detect Invoice Intent for Guardrail
  if (lowerQuery.includes('invoice')) {
      return { intent: 'create_invoice', data: {} };
  }

  return null;
};

// --- State Management ---
type NavigationSource = 'WIZARD_GENERIC' | 'TARGETED_ENTRY' | 'REVIEW_HUB';

export const useActionFlow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'expanded' | 'minimized'>('expanded');
  const [wiggleTrigger, setWiggleTrigger] = useState(0);
  const [activeStep, setActiveStep] = useState(0); 
  const [activeField, setActiveField] = useState<string | null>(null);
  const [navigationSource, setNavigationSource] = useState<NavigationSource>('WIZARD_GENERIC');
  const [intent, setIntent] = useState<'create_payment_link' | 'create_subscription'>('create_payment_link');
  
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    customerEmail: '',
    customerPhone: '',
    shouldExpire: false,
    requireReminder: false,
    ...initialSubscriptionData
  });

  const [status, setStatus] = useState<'editing' | 'submitting' | 'success'>('editing');
  const [viewMode, setViewMode] = useState<'overlay' | 'split' | 'card'>('overlay');
  const [isCloseConfirming, setIsCloseConfirming] = useState(false);

  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(null);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openTransactionDetails = (id: string) => {
      setIntent('view_transaction' as any); // Type cast since we're extending intents dynamically
      setActiveTransactionId(id);
      setIsOpen(true);
      setViewMode('split');
      setMode('expanded');
  };

  const startFlow = (initialData: any) => {
    // Check if intent is provided in initialData or infer
    // Usually initialData comes from parseInitialIntent which returns { intent, data }
    // But startFlow signature in App.tsx might be `startFlow(result.data)`.
    // We'll assume the caller sets intent separately or we check `initialData.intent` if passed.
    // Wait, parseInitialIntent returns { intent, data }.
    // If the caller passes the whole object: startFlow(result)
    
    let flowIntent = 'create_payment_link';
    let flowData = initialData;

    if (initialData && initialData.intent) {
        flowIntent = initialData.intent;
        flowData = initialData.data;
    }

    setIntent(flowIntent as any);
    const newData = { ...formData, ...flowData };
    setFormData(newData);
    setIsOpen(true);
    setMode('expanded');
    setActiveField(null);
    setStatus('editing'); 

    if (flowIntent === 'create_subscription') {
        setActiveStep(0);
        setNavigationSource('WIZARD_GENERIC');
        return;
    }

    // Payment Link Routing Logic
    const hasLinkDetails = !!newData.amount && !!newData.purpose;
    const hasCustomerDetails = !!newData.customerEmail || !!newData.customerPhone;
    const isGeneric = !newData.amount && !newData.purpose && !newData.customerEmail && !newData.customerPhone;

    if (hasLinkDetails && hasCustomerDetails) {
        setNavigationSource('TARGETED_ENTRY');
        setActiveStep(3);
        return;
    }

    if (!isGeneric) {
        setNavigationSource('TARGETED_ENTRY');
        if (hasLinkDetails) {
            setActiveStep(1);
        } else {
            setActiveStep(0);
        }
        return;
    }

    setNavigationSource('WIZARD_GENERIC');
    setActiveStep(0);
  };

  const handleStepCompletion = (currentStepId: number) => {
      setActiveField(null); 
      
      if (intent === 'create_subscription') {
          // Linear progression
          if (currentStepId < 2) {
              return setActiveStep(currentStepId + 1);
          }
          return setActiveStep(3); // Review
      }

      if (navigationSource === 'REVIEW_HUB') {
         return setActiveStep(3); 
      }
    
      if (navigationSource === 'TARGETED_ENTRY') {
         return setActiveStep(3); 
      }
    
      if (currentStepId === 0) {
         return setActiveStep(1);
      }
      
      if (currentStepId === 1) {
          return setActiveStep(3);
      }

      if (currentStepId === 2) {
          return setActiveStep(3);
      }
      
      return setActiveStep(3);
  };

  const nextStep = () => {
      if (activeStep === 3) {
          console.log("Submitting flow:", formData);
          close();
      } else {
          handleStepCompletion(activeStep);
      }
  };
  
  const goToReview = () => setActiveStep(3);
  
  const editStep = (stepIndex: number) => {
      setNavigationSource('REVIEW_HUB');
      setActiveStep(stepIndex);
      setActiveField(null);
  };

  const close = () => {
      setIsOpen(false);
      setActiveField(null);
      setIsCloseConfirming(false);
  };

  const requestClose = () => {
      setMode('minimized');
      setIsCloseConfirming(true);
  };

  const confirmClose = () => {
      setIsOpen(false);
      setIsCloseConfirming(false);
      setFormData({ ...initialSubscriptionData });
      // Might want to reset intent too, or keep it.
  };

  const cancelClose = () => {
      setMode('expanded');
      setIsCloseConfirming(false);
  };

  return {
    isOpen,
    activeStep,
    formData,
    activeField,
    setActiveField,
    updateField,
    startFlow,
    nextStep,
    goToReview,
    close,
    requestClose,
    confirmClose,
    cancelClose,
    setActiveStep,
    editStep,
    status,
    setStatus,
    mode,
    setMode,
    minimize: () => setMode('minimized'),
    maximize: () => setMode('expanded'),
    triggerWiggle: () => setWiggleTrigger(prev => prev + 1),
    wiggleTrigger,
    intent,
    viewMode,
    setViewMode,
    isCloseConfirming,
    activeTransactionId,
    openTransactionDetails
  };
};


const springConfig = { type: "spring", stiffness: 350, damping: 30, mass: 1 };

export const ActionAccordion = ({ flow }: { flow: any }) => {
  // Common handleSubmit
  const handleSubmit = () => {
    if (flow.status !== 'editing') return;
    flow.setStatus('submitting');
    setTimeout(() => {
        flow.setStatus('success');
        flow.maximize(); 
        console.log("Submitting flow:", flow.formData);
        setTimeout(() => {
             flow.close();
        }, 1500);
    }, 800);
  };

  // Wiggle Logic
  const controls = useAnimation();
  useEffect(() => {
      if (flow.wiggleTrigger > 0) {
          controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } });
      }
  }, [flow.wiggleTrigger]);

  // Focus Logic
  useEffect(() => {
      if (flow.focusTrigger > 0 && flow.activeField) {
           // Try to find the input by name or id
           const input = document.querySelector(`input[name="${flow.activeField}"]`) as HTMLInputElement || 
                         document.querySelector(`textarea[name="${flow.activeField}"]`) as HTMLTextAreaElement;
           if (input) {
               input.focus();
           }
      }
  }, [flow.focusTrigger]);

  if (!flow.isOpen) return null;

  return (
    <motion.div animate={controls} className="w-full flex justify-center">
        <motion.div 
          layout
          initial={{ y: 20, opacity: 0 }}
          animate={flow.status === 'success' ? { height: 120, y: 0, opacity: 1 } : { height: 'auto', y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={springConfig}
          className={`bg-[#edece8] flex flex-col items-start p-[4px] rounded-[8px] shadow-xl relative overflow-hidden mx-auto ${flow.mode === 'minimized' ? 'w-[280px]' : 'w-full max-w-[560px]'}`}
        >
            <AnimatePresence mode="wait">
                {flow.mode === 'minimized' ? (
                     <motion.div 
                          key="minimized"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-[40px] flex items-center justify-between px-3 bg-white/80 backdrop-blur-md rounded-[4px]"
                      >
                           <div className="flex items-center gap-2 overflow-hidden">
                               <div className="w-[20px] h-[20px] shrink-0"><PaymentLink /></div>
                               <span className="text-[14px] font-medium text-slate-700 whitespace-nowrap">
                                   {flow.intent === 'create_subscription' ? 'Creating Subscription...' : 'Creating Payment Link...'}
                               </span>
                           </div>
                           <button onClick={flow.maximize} className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors">
                               <div className="w-[14px] h-[14px]"><Maximize /></div>
                           </button>
                      </motion.div>
                ) : (
                    flow.status === 'success' ? (
                        <SuccessView key="success" intent={flow.intent} />
                    ) : (
                        <motion.div 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full flex flex-col"
                        >
                            {/* Header */}
                            <div className="content-stretch flex items-start justify-between p-[12px] relative w-full">
                                <div className="content-stretch flex flex-col items-start pb-[2px] pt-0 px-0 relative shrink-0 w-full">
                                    <div className="flex justify-between w-full items-center">
                                        <p className="font-['TASA_Orbiter_Display:SemiBold',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#192839] text-[18px] text-nowrap">
                                            {flow.intent === 'create_subscription' ? 'Let’s create a subscription' : 'Let’s create a payment link'}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <button onClick={flow.minimize} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded">
                                                <div className="w-[16px] h-[16px]"><Minimize /></div>
                                            </button>
                                            <button onClick={flow.requestClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded">
                                                <div className="w-[16px] h-[16px]"><Close /></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
        
                            {/* Dynamic Content Container */}
                            {flow.intent === 'create_subscription' ? (
                                <SubscriptionSteps flow={flow} onSubmit={handleSubmit} />
                            ) : (
                                <PaymentLinkSteps flow={flow} onSubmit={handleSubmit} />
                            )}
                        </motion.div>
                    )
                )}
            </AnimatePresence>
        </motion.div>
    </motion.div>
  );
};
