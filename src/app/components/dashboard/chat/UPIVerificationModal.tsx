import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { X, CheckCircle } from 'lucide-react';
import QRCode from 'react-qr-code';

interface UPIVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onMockPayment?: () => void;
  originRect?: DOMRect | null;
}

export const UPIVerificationModal: React.FC<UPIVerificationModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onMockPayment,
  originRect
}) => {
  const [step, setStep] = useState<'qr' | 'success'>('qr');

  // Reset to QR step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('qr');
    }
  }, [isOpen]);

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

  const handleMockPayment = () => {
    // Call the onMockPayment callback first (to send user message)
    if (onMockPayment) {
      onMockPayment();
    }

    setStep('success');

    // Auto-close after 2 seconds and trigger completion
    setTimeout(() => {
      onComplete();
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[rgba(0,0,0,0.8)] z-[9998]"
            onClick={step === 'qr' ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: initialPos.scale, x: initialPos.x, y: initialPos.y }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md backdrop-blur-[5.5px] bg-gradient-to-b from-white to-[#f0f0f0] border-[1.5px] border-[rgba(0,0,0,0.1)] rounded-[16px] shadow-[0px_8px_48px_4px_rgba(59,96,181,0.1)] z-[9999] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Inset shadow for depth */}
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_1px_white]" />
            <AnimatePresence mode="wait">
              {step === 'qr' ? (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 space-y-6"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src="/rzp-logo-positive.svg" alt="Razorpay" className="h-6" />
                    </div>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-2">
                    <h2 className="font-sans text-[20px] font-semibold text-[#020202] leading-[28px]">
                      Verify your bank account via UPI
                    </h2>
                    <p className="font-sans text-[14px] text-[#576375] leading-[20px]">
                      ₹1 will be debited & refunded in 48 hours. This account will be used for your payment deposits.
                    </p>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <QRCode
                        value="upi://pay?pa=razorpay@axis&pn=Razorpay&am=1.00&cu=INR"
                        size={200}
                        level="M"
                      />
                    </div>
                  </div>

                  {/* UPI Apps */}
                  <div className="space-y-3">
                    <p className="font-sans text-[13px] font-medium text-[#576375] text-center">
                      Scan with any app
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/google-pay-icon.svg" alt="Google Pay" className="w-10 h-10" />
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/phonepe-icon.svg" alt="PhonePe" className="w-10 h-10" />
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/paytm-icon.svg" alt="Paytm" className="w-10 h-10" />
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/bhim-icon.svg" alt="BHIM" className="w-10 h-10" />
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/amazon-pay-icon.svg" alt="Amazon Pay" className="w-10 h-10" />
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/cred-icon.svg" alt="CRED" className="w-10 h-10" />
                      </div>
                    </div>
                  </div>

                  {/* Mock Payment Button (for demo) */}
                  <button
                    onClick={handleMockPayment}
                    className="relative w-full h-[48px] border border-[#0354e0] rounded-[12px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] text-white font-['Inter',sans-serif] font-medium text-[14px] tracking-[-0.112px] transition-all flex items-center justify-center hover:opacity-90"
                    style={{
                      backgroundImage: 'linear-gradient(-23.46deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)'
                    }}
                  >
                    {/* Inset shadow */}
                    <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_0px_rgba(255,255,255,0.2),inset_0px_2px_0px_0px_rgba(255,255,255,0.2)]" />
                    Mock Payment Completion
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 space-y-6"
                >
                  {/* Header with Logo */}
                  <div className="flex items-center justify-between">
                    <img src="/rzp-logo-positive.svg" alt="Razorpay" className="h-6" />
                    <button
                      onClick={onClose}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Success Content */}
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle size={48} className="text-green-600" strokeWidth={2} />
                    </motion.div>

                    <div className="text-center space-y-2">
                      <h2 className="font-sans text-[18px] font-medium text-[#192839] leading-[26px] max-w-sm">
                        Congratulations, your bank details have been captured successfully
                      </h2>
                      <p className="font-sans text-[14px] text-[#576375] leading-[20px]">
                        Back to chat in 2 sec
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
