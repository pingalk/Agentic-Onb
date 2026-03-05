import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface KYCOTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  phoneNumber: string;
  originRect?: DOMRect | null;
}

export const KYCOTPModal: React.FC<KYCOTPModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  phoneNumber,
  originRect
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset OTP when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleOTPChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, 6);

    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setIsSubmitting(true);
      onVerify(otpString);
    }
  };

  const handleChange = () => {
    // Close modal and allow user to change phone number
    onClose();
  };

  const isComplete = otp.every(digit => digit !== '');

  if (!isOpen) return null;

  // Calculate initial position from origin card if provided
  const getInitialPosition = () => {
    if (!originRect) return { x: 0, y: 20, scale: 0.95 };

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const originCenterX = originRect.left + originRect.width / 2;
    const originCenterY = originRect.top + originRect.height / 2;

    return {
      x: originCenterX - centerX,
      y: originCenterY - centerY,
      scale: 0.8
    };
  };

  const initialPos = getInitialPosition();

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)]" />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: initialPos.scale, x: initialPos.x, y: initialPos.y }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative backdrop-blur-[5.5px] bg-gradient-to-b from-white to-[#f0f0f0] border-[1.5px] border-[rgba(0,0,0,0.1)] rounded-[16px] shadow-[0px_8px_48px_4px_rgba(59,96,181,0.1)] w-[555px] h-[380px] flex flex-col items-center justify-center p-10"
          >
            {/* Inset shadow for depth */}
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_1px_white]" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-[30px] h-[30px] flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Title with Gradient */}
            <h2
              className="font-['TASA_Orbiter_Display',sans-serif] font-normal text-[32px] leading-[38px] text-center mb-4 bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, rgb(5, 5, 5) 0%, rgb(46, 66, 165) 37.048%, rgb(46, 66, 165) 73.478%, rgb(5, 5, 5) 100%)'
              }}
            >
              Verify to autofill KYC
            </h2>

            {/* Subtitle */}
            <div className="flex items-center gap-1 mb-8">
              <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[rgba(0,0,0,0.56)] tracking-[-0.182px]">
                Enter the OTP sent to number ending {phoneNumber}
              </p>
              <button
                onClick={handleChange}
                className="font-['Inter',sans-serif] font-medium text-[14px] text-[#2563EB] hover:text-[#1d4ed8] underline ml-1"
              >
                Change
              </button>
            </div>

            {/* OTP Input Boxes */}
            <div className="flex gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-[43px] h-[64px] bg-gradient-to-b from-white to-[#fbfbfb] border-[0.7px] border-[rgba(0,0,0,0.1)] rounded-[4px] text-center font-['TASA_Orbiter_Display',sans-serif] font-medium text-[48px] leading-[56px] text-[#050505] tracking-[-1px] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                  style={{
                    caretColor: 'transparent'
                  }}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={!isComplete || isSubmitting}
              className="relative w-[362px] h-[48px] border border-[#0354e0] rounded-[12px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] text-white font-['Inter',sans-serif] font-medium text-[14px] tracking-[-0.112px] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{
                backgroundImage: isComplete ? 'linear-gradient(-23.46deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)' : 'linear-gradient(-23.46deg, rgba(21, 102, 241, 0.5) 54.842%, rgba(71, 147, 253, 0.5) 98.573%)'
              }}
            >
              {/* Inset shadow */}
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_0px_rgba(255,255,255,0.2),inset_0px_2px_0px_0px_rgba(255,255,255,0.2)]" />
              {isSubmitting ? 'Verifying...' : 'Verify & autofill KYC'}
            </button>

            {/* Disclaimer */}
            <p className="font-['Inter',sans-serif] font-normal text-[10px] leading-[13px] text-[rgba(0,0,0,0.72)] tracking-[-0.13px] text-center mt-6 max-w-[500px]">
              By entering the OTP, you authorise Razorpay to fetch your CKYC details from CERSAI.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
