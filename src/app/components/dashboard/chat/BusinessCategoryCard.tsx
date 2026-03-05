import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface BusinessCategoryCardProps {
  category: string;
  subCategory: string;
  onConfirm: () => void;
  onChange: () => void;
  isConfirmed?: boolean;
}

export const BusinessCategoryCard: React.FC<BusinessCategoryCardProps> = ({
  category,
  subCategory,
  onConfirm,
  onChange,
  isConfirmed = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-[531px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-['TASA_Orbiter_Deck',sans-serif] text-[18px] font-semibold text-[#020202] leading-[24px]">
              Business Category Detected
            </h3>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f9f2] rounded-md">
              <Check size={12} className="text-[#04c982]" strokeWidth={2.5} />
              <span className="font-sans text-[12px] font-medium text-[#04c982] leading-[16px]">
                Auto detected
              </span>
            </div>
          </div>

          <p className="font-sans text-[14px] text-[#576375] leading-[20px]">
            We've scraped your website and identified your business category. Confirm to personalise your setup.
          </p>
        </div>

        {/* Category Fields */}
        <div className="space-y-4">
          {/* Bank Account Number (Actually Category) */}
          <div className="flex justify-between items-start">
            <span className="font-sans text-[13px] font-medium text-[#576375] leading-[18px]">
              Bank Account Number
            </span>
            <span className="font-sans text-[13px] font-semibold text-[#020202] leading-[18px] text-right">
              {category}
            </span>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-gray-100" />

          {/* Bank IFSC code (Actually Sub-category) */}
          <div className="flex justify-between items-start">
            <span className="font-sans text-[13px] font-medium text-[#576375] leading-[18px]">
              Bank IFSC code
            </span>
            <span className="font-sans text-[13px] font-semibold text-[#020202] leading-[18px] text-right">
              {subCategory}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              if (!isConfirmed) onConfirm();
            }}
            disabled={isConfirmed}
            className="relative h-12 px-6 border rounded-[12px] text-white font-sans font-medium text-[14px] tracking-[-0.112px] transition-all inline-flex items-center justify-center gap-2 overflow-hidden disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundImage: isConfirmed
                ? 'linear-gradient(-23.46deg, rgb(156, 163, 175) 54.842%, rgb(209, 213, 219) 98.573%)'
                : 'linear-gradient(-23.46deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)',
              borderColor: isConfirmed ? '#9ca3af' : '#0354e0'
            }}
          >
            {/* Glass effect inset shadows */}
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_0px_#0e54cc,inset_0px_0px_0px_0.5px_#1566f1,inset_0px_-2px_0px_0px_rgba(255,255,255,0.18),inset_0px_1.5px_0px_0px_rgba(255,255,255,0.32)]" />
            {isConfirmed ? 'Confirmed' : 'Confirm'}
          </button>

          {!isConfirmed && (
            <button
              onClick={onChange}
              className="font-sans text-[14px] font-medium text-[#1566f1] hover:text-[#0e54cc] transition-colors"
            >
              Change
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
