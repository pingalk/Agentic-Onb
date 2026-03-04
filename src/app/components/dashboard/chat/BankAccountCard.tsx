import React from 'react';
import { motion } from 'motion/react';
import { Edit2 } from 'lucide-react';

interface BankAccountCardProps {
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountName?: string;
  onChangeAccount?: () => void;
}

export const BankAccountCard: React.FC<BankAccountCardProps> = ({
  bankName = 'HDFC Bank account',
  accountNumber = '2383237283283287372HA',
  ifscCode = 'SBI78236287362326663',
  accountName = 'Chinnaswamy Muthuswamy Venugopal Iyer',
  onChangeAccount
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="p-6 space-y-5">
        {/* Header with Bank Name and Verified Badge */}
        <div className="space-y-2">
          <h3 className="font-sans text-[18px] font-semibold text-[#020202] leading-[24px]">
            {bankName}
          </h3>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill="#04c982"/>
              <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-sans text-[12px] font-medium text-[#04c982] leading-[16px]">
              Verified
            </span>
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-4">
          {/* Bank Account Number */}
          <div className="flex justify-between items-start gap-4">
            <span className="font-sans text-[13px] font-normal text-[#576375] leading-[18px]">
              Bank Account Number
            </span>
            <span className="font-sans text-[13px] font-medium text-[#020202] leading-[18px] text-right break-all">
              {accountNumber}
            </span>
          </div>

          {/* Bank IFSC code */}
          <div className="flex justify-between items-start gap-4">
            <span className="font-sans text-[13px] font-normal text-[#576375] leading-[18px]">
              Bank IFSC code
            </span>
            <span className="font-sans text-[13px] font-medium text-[#020202] leading-[18px] text-right">
              {ifscCode}
            </span>
          </div>

          {/* Account name */}
          <div className="flex justify-between items-start gap-4">
            <span className="font-sans text-[13px] font-normal text-[#576375] leading-[18px]">
              Account name
            </span>
            <span className="font-sans text-[13px] font-medium text-[#020202] leading-[18px] text-right">
              {accountName}
            </span>
          </div>
        </div>

        {/* Change Account Link */}
        <button
          onClick={onChangeAccount}
          className="flex items-center gap-2 text-[#1566f1] hover:text-[#0e54cc] transition-colors font-sans text-[14px] font-medium"
        >
          <Edit2 size={14} />
          Change account
        </button>
      </div>
    </motion.div>
  );
};
