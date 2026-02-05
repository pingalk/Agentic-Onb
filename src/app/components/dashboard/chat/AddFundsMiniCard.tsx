import React from 'react';
import { motion } from 'motion/react';
import { Wallet, ChevronRight } from 'lucide-react';

export interface AddFundsMiniCardProps {
  formData: {
    amount: string;
    purpose?: string;
  };
  onClick?: () => void;
  isLoading?: boolean;
}

export const AddFundsMiniCard: React.FC<AddFundsMiniCardProps> = ({
  formData,
  onClick,
  isLoading = false
}) => {
  const formatAmount = (amount: string) => {
    const num = parseInt(amount.replace(/,/g, ''), 10);
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <motion.button
      onClick={onClick}
      className="w-full max-w-[320px] text-left bg-white border border-[#305EFF]/30 rounded-[12px] overflow-hidden transition-shadow duration-200 hover:border-[#305EFF]/50 hover:shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#305EFF]/5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#305EFF]/10">
            <Wallet size={14} className="text-[#305EFF]" />
          </div>
          <span className="text-[13px] font-medium text-[#305EFF]">
            Add Funds Draft
          </span>
        </div>
        <ChevronRight size={16} className="text-[#94a3b8]" />
      </div>

      {/* Content */}
      <div className="px-3 py-2.5 border-t border-[#f1f5f9]">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-[18px] w-[72px] bg-[#e2e8f0] rounded animate-pulse" />
              <div className="h-[14px] w-[100px] bg-[#e2e8f0] rounded animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-medium text-[#1e293b]">
              ₹{formatAmount(formData.amount)}
            </span>
            {formData.purpose && (
              <>
                <span className="text-[#cbd5e1]">•</span>
                <span className="text-[13px] text-[#64748b]">
                  {formData.purpose}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </motion.button>
  );
};

export default AddFundsMiniCard;
