import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Check as LucideCheck } from 'lucide-react';
import svgPaths from "@/imports/svg-m0923jgy3a";
import closeSvgPaths from "@/imports/svg-6bdbcn7a1a";
import closeButtonSvgPaths from "@/imports/svg-hep29ltwk2";
import closeSmallSvgPaths from "@/imports/svg-ce3x7zys9c";
import imgChatGptImageOct282025032150Pm2 from "figma:asset/bac6c683adc820f5ac390a46127dd3011074110c.png";

interface AddFundsWidgetProps {
  initialAmount?: string;
  onConfirm?: (amount: string, purpose: string) => void;
  onClose?: () => void;
}

// --- Icons & Assets ---

function CloseIcon() {
  return (
    <div className="relative size-full" data-name="close">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={closeSvgPaths.p2f9c6900} fill="var(--fill-0, #192839)" id="path" />
        </g>
      </svg>
    </div>
  );
}

// --- Success State Components ---

function Heading({ amount }: { amount: string }) {
  // Simple formatting for the amount (e.g. 46000 -> 46,000)
  const displayAmount = !isNaN(Number(amount.replace(/,/g, ''))) 
      ? Number(amount.replace(/,/g, '')).toLocaleString('en-IN') 
      : amount;

  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Heading">
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
    <div className="absolute left-[11px] size-[24px] top-[11px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="check">
          <path clipRule="evenodd" d={svgPaths.p9937370} fill="var(--fill-0, white)" fillRule="evenodd" id="path" />
        </g>
      </svg>
    </div>
  );
}

function SuccessIcon() {
  return (
    <div className="absolute left-[-10px] overflow-clip rounded-[100px] size-[44px] top-0" data-name="Success icon" style={{ backgroundImage: "linear-gradient(152.176deg, rgb(0, 158, 92) 32.335%, rgba(0, 158, 92, 0.51) 100.81%)" }}>
      <CheckIcon />
    </div>
  );
}

function SuccessVisual() {
  return (
    <div className="h-[88px] relative shrink-0 w-[100px]">
      <div className="absolute left-[12px] size-[88px] top-0" data-name="ChatGPT Image Oct 28, 2025, 03_21_50 PM 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgChatGptImageOct282025032150Pm2} />
      </div>
      <SuccessIcon />
    </div>
  );
}

// --- Main Widget ---

export const AddFundsWidget: React.FC<AddFundsWidgetProps> = ({ initialAmount = '', onConfirm, onClose }) => {
  const [amount, setAmount] = useState(initialAmount);
  const [purpose, setPurpose] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Focus states for styling
  const [focusedField, setFocusedField] = useState<'amount' | 'purpose' | null>(null);

  const amountInputRef = useRef<HTMLInputElement>(null);
  const purposeInputRef = useRef<HTMLInputElement>(null);

  // Update amount if initialAmount changes
  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
    }
  }, [initialAmount]);

  // Focus logic on mount
  useEffect(() => {
    // If we have an initial amount, focus the purpose field
    if (initialAmount) {
        purposeInputRef.current?.focus();
    } else {
        // Otherwise start at the amount field
        amountInputRef.current?.focus();
    }
  }, [initialAmount]);

  const handleSubmit = () => {
    if (!amount || !purpose) return;
    
    setIsSuccess(true);
    
    // Delay the actual callback slightly so the user sees the success state
    setTimeout(() => {
        onConfirm?.(amount, purpose);
    }, 2000); 
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-[130px] left-1/2 -translate-x-1/2 w-[400px] bg-[#eaeeff] rounded-[8px] p-[4px] shadow-2xl z-50 border border-white/50"
    >
      {/* Dismiss Button - Absolute Positioned */}
      <button 
        onClick={onClose}
        className="absolute top-[12px] right-[12px] size-[24px] flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity z-50 rounded-full hover:bg-black/5"
      >
        <div className="relative size-full" data-name="close">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <g>
              <path d={closeSmallSvgPaths.p38bb2100} fill="var(--fill-0, #192839)" id="path" />
            </g>
          </svg>
        </div>
      </button>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col w-full"
          >
            {/* Header Section */}
            <div className="flex flex-col items-start w-full relative">
                <div className="flex items-start justify-between p-[12px] w-full bg-transparent">
                <div className="flex gap-[8px] items-start flex-1">
                    <div className="flex flex-col items-start w-full">
                    <p className="font-['TASA_Orbiter_Display',sans-serif] font-medium leading-[24px] text-[#192839] text-[18px] w-full">
                        Add Funds via UPI
                    </p>
                    </div>
                </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-[8px] w-full p-[12px] flex flex-col gap-[10px] border border-[rgba(108,132,157,0.18)] shadow-sm">
                
                {/* Step 1: Inputs */}
                <div className="flex flex-col gap-[12px]">
                {/* Header Row */}
                <div className="flex justify-between items-center">
                    <p className="font-['Inter',sans-serif] font-medium text-[#222] text-[16px] leading-[24px]">
                    How much would you like to add?
                    </p>
                </div>

                {/* Input Group Container - Implements the collapsed border design */}
                <div className="flex flex-col items-start pb-px relative shrink-0 w-full isolate">
                    {/* Top Input (Amount) */}
                    <div className={`relative shrink-0 w-full mb-[-1px] z-${focusedField === 'amount' ? '20' : '10'}`}>
                        <div className={`bg-white h-[48px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full transition-all duration-200 ${focusedField === 'amount' ? 'ring-2 ring-blue-500/20' : ''}`}>
                            {/* Border Element */}
                            <div 
                                aria-hidden="true" 
                                className={`absolute inset-0 pointer-events-none rounded-tl-[8px] rounded-tr-[8px] border-l border-r border-t border-solid transition-colors duration-200 ${focusedField === 'amount' ? 'border-blue-500 z-10' : 'border-[#e3eaf3]'}`} 
                            />
                            
                            {/* Input Content */}
                            <div className="flex flex-row items-center size-full relative z-20">
                                <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
                                    <div className="flex-[1_0_0] min-h-px min-w-px relative">
                                        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                                            <div className="content-stretch flex items-center relative w-full gap-1">
                                                {/* Currency Symbol */}
                                                <span className={`font-['Inter'] font-bold text-[16px] leading-[24px] ${amount ? 'text-[#40566d]' : 'text-slate-300'}`}>₹</span>
                                                <input 
                                                    ref={amountInputRef}
                                                    type="text" 
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    onFocus={() => setFocusedField('amount')}
                                                    onBlur={() => setFocusedField(null)}
                                                    onKeyDown={handleAmountKeyDown}
                                                    className="w-full bg-transparent outline-none font-['Inter'] font-bold text-[#40566d] text-[16px] leading-[24px] placeholder-slate-300"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Input (Purpose) */}
                    <div className={`relative shrink-0 w-full z-${focusedField === 'purpose' ? '20' : '10'}`}>
                        <div className={`bg-white h-[48px] relative rounded-bl-[8px] rounded-br-[8px] shrink-0 w-full transition-all duration-200 ${focusedField === 'purpose' ? 'ring-2 ring-blue-500/20' : ''}`}>
                            {/* Border Element */}
                            <div 
                                aria-hidden="true" 
                                className={`absolute inset-0 pointer-events-none rounded-bl-[8px] rounded-br-[8px] border border-solid transition-colors duration-200 ${focusedField === 'purpose' ? 'border-blue-500 z-10' : 'border-[#e3eaf3]'}`} 
                            />
                            
                            {/* Input Content */}
                            <div className="flex flex-row items-center size-full relative z-20">
                                <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
                                    <div className="flex-[1_0_0] min-h-px min-w-px relative">
                                        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                                            <div className="content-stretch flex items-center relative w-full">
                                                <input 
                                                    ref={purposeInputRef}
                                                    type="text"
                                                    value={purpose}
                                                    onChange={(e) => setPurpose(e.target.value)}
                                                    onFocus={() => setFocusedField('purpose')}
                                                    onBlur={() => setFocusedField(null)}
                                                    onKeyDown={handlePurposeKeyDown}
                                                    className="w-full bg-transparent outline-none font-['Inter'] font-normal text-[#40566d] text-[16px] leading-[24px] placeholder-[#40566d]/40"
                                                    placeholder="Enter purpose"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>

                {/* Action Button */}
                <button 
                onClick={handleSubmit}
                disabled={!amount || !purpose}
                className="h-[36px] w-full rounded-[8px] bg-gradient-to-r from-[#1566f1] to-[#4793fd] flex items-center justify-center text-white text-[12px] font-medium shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.2)] hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Confirm & Proceed
                </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white relative rounded-[8px] shrink-0 w-full"
          >
             <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
                <div className="content-stretch flex flex-col gap-[20px] items-center justify-center px-[12px] py-[24px] relative w-full">
                  <Heading amount={amount} />
                  <SuccessVisual />
                </div>
             </div>
             <div aria-hidden="true" className="absolute border border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
