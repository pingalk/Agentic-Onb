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
}

export const UPIVerificationModal: React.FC<UPIVerificationModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onMockPayment
}) => {
  const [step, setStep] = useState<'qr' | 'success'>('qr');

  // Reset to QR step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('qr');
    }
  }, [isOpen]);

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={step === 'qr' ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[9999] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
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
                      <svg width="100" height="24" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.24 10.432c0-2.24-.64-4.032-2.816-4.032H17.6v8.064h3.824c2.176 0 2.816-1.792 2.816-4.032zm-2.816 6.208H17.6v8.96h-3.136V4.224h6.96c4.032 0 5.952 2.496 5.952 6.208 0 2.624-1.088 4.608-3.2 5.568l4.032 9.6h-3.392l-3.392-8.96z" fill="#3395FF"/>
                      </svg>
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
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">GPay</span>
                      </div>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">PE</span>
                      </div>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">Paytm</span>
                      </div>
                    </div>
                  </div>

                  {/* Mock Payment Button (for demo) */}
                  <button
                    onClick={handleMockPayment}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-sans font-medium text-[14px] rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm"
                  >
                    Mock Payment Completion
                  </button>

                  {/* Manual Entry Option */}
                  <button className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between px-5 hover:bg-gray-100 transition-colors">
                    <span className="font-sans text-[14px] font-medium text-[#192839]">
                      Enter account details manually
                    </span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 space-y-6"
                >
                  {/* Header with Logo */}
                  <div className="flex items-center justify-between">
                    <svg width="100" height="24" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24.24 10.432c0-2.24-.64-4.032-2.816-4.032H17.6v8.064h3.824c2.176 0 2.816-1.792 2.816-4.032zm-2.816 6.208H17.6v8.96h-3.136V4.224h6.96c4.032 0 5.952 2.496 5.952 6.208 0 2.624-1.088 4.608-3.2 5.568l4.032 9.6h-3.392l-3.392-8.96z" fill="#3395FF"/>
                    </svg>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Success Content */}
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
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
