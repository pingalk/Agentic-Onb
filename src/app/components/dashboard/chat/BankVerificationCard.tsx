import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Zap } from 'lucide-react';

interface BankVerificationCardProps {
  onVerify: () => void;
  isVerified?: boolean;
}

export const BankVerificationCard: React.FC<BankVerificationCardProps> = ({ onVerify, isVerified = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-[531px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="p-6 space-y-5">
        {/* Header with Instant Badge */}
        <div className="flex items-center gap-3">
          <h3 className="font-sans text-[18px] font-semibold text-[#020202] leading-[24px]">
            Verify bank via UPI
          </h3>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f9f2] rounded-md">
            <Zap size={12} className="text-[#04c982]" fill="#04c982" />
            <span className="font-sans text-[12px] font-medium text-[#04c982] leading-[16px]">
              Instant
            </span>
          </div>
        </div>

        {/* Bullet Points */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-[#04c982] shrink-0 mt-0.5" fill="#04c982" strokeWidth={0} />
            <p className="font-sans text-[14px] font-medium text-[#192839] leading-[20px]">
              Scan the QR and pay ₹1 via UPI
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-[#04c982] shrink-0 mt-0.5" fill="#04c982" strokeWidth={0} />
            <p className="font-sans text-[14px] font-medium text-[#192839] leading-[20px]">
              The same ₹1 is refunded within 48 hours
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-[#04c982] shrink-0 mt-0.5" fill="#04c982" strokeWidth={0} />
            <p className="font-sans text-[14px] font-medium text-[#192839] leading-[20px]">
              Ray will auto fetch your bank details
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            if (!isVerified) onVerify();
          }}
          disabled={isVerified}
          className="relative h-12 px-6 border rounded-[12px] text-white font-sans font-medium text-[14px] tracking-[-0.112px] transition-all inline-flex items-center justify-center gap-2 overflow-hidden disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            backgroundImage: isVerified
              ? 'linear-gradient(-23.46deg, rgb(156, 163, 175) 54.842%, rgb(209, 213, 219) 98.573%)'
              : 'linear-gradient(-23.46deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)',
            borderColor: isVerified ? '#9ca3af' : '#0354e0'
          }}
        >
          {/* Glass effect inset shadows */}
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_0px_#0e54cc,inset_0px_0px_0px_0.5px_#1566f1,inset_0px_-2px_0px_0px_rgba(255,255,255,0.18),inset_0px_1.5px_0px_0px_rgba(255,255,255,0.32)]" />
          {isVerified ? 'Bank details added' : 'Add bank details via UPI'}
        </button>
      </div>
    </motion.div>
  );
};
