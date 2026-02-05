import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link2, Check, ChevronRight, Copy, CheckCircle } from 'lucide-react';

export interface SourceRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface PaymentLinkMiniCardProps {
  formData: {
    amount: string;
    purpose: string;
    email?: string;
  };
  status: 'draft' | 'completed';
  onClick?: (sourceRect: SourceRect) => void;
  isLoading?: boolean;
  linkUrl?: string;
  isAnimatingToModal?: boolean;
}

export const PaymentLinkMiniCard: React.FC<PaymentLinkMiniCardProps> = ({
  formData,
  status,
  onClick,
  isLoading = false,
  linkUrl,
  isAnimatingToModal = false
}) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (!onClick || isAnimatingToModal) return;

    // Capture bounding rect and pass to parent
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      onClick({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    }
  };

  const formatAmount = (amount: string) => {
    const num = parseInt(amount.replace(/,/g, ''), 10);
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const truncatePurpose = (purpose: string, maxLength: number = 28) => {
    if (purpose.length <= maxLength) return purpose;
    return purpose.substring(0, maxLength) + '...';
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (linkUrl) {
      navigator.clipboard.writeText(linkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isCompleted = status === 'completed';

  // When completed, render as a div (non-clickable)
  if (isCompleted) {
    return (
      <motion.div
        className="w-full max-w-[320px] text-left bg-white border border-[#22c55e]/30 rounded-[12px] overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#22c55e]/5">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#22c55e]/10">
              <Check size={14} className="text-[#22c55e]" />
            </div>
            <span className="text-[13px] font-medium text-[#22c55e]">
              Payment Link Created
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-3 py-2.5 border-t border-[#f1f5f9]">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-medium text-[#1e293b]">
              ₹{formatAmount(formData.amount)}
            </span>
            {formData.purpose && (
              <>
                <span className="text-[#cbd5e1]">•</span>
                <span className="text-[13px] text-[#64748b]">
                  {truncatePurpose(formData.purpose)}
                </span>
              </>
            )}
          </div>
          {formData.email && (
            <div className="mt-1 text-[12px] text-[#94a3b8]">
              {formData.email}
            </div>
          )}

          {/* Link URL with copy button */}
          {linkUrl && (
            <div className="mt-3 flex items-center gap-2 p-2 bg-[#f8fafc] rounded-[6px] border border-[#e2e8f0]">
              <Link2 size={14} className="text-[#64748b] flex-shrink-0" />
              <span className="text-[13px] text-[#305EFF] truncate flex-1">
                {linkUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center w-7 h-7 rounded-[4px] hover:bg-[#e2e8f0] transition-colors flex-shrink-0"
              >
                {copied ? (
                  <CheckCircle size={14} className="text-[#22c55e]" />
                ) : (
                  <Copy size={14} className="text-[#64748b]" />
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Draft state - clickable button
  // When animating to modal, hide entire card instantly (morphing element takes over)
  return (
    <motion.button
      ref={cardRef}
      onClick={handleClick}
      className={`
        w-full max-w-[320px] text-left relative
        bg-white border rounded-[12px] overflow-hidden
        transition-shadow duration-200
        border-[#305EFF]/30 hover:border-[#305EFF]/50 hover:shadow-md
      `}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={isAnimatingToModal ? {} : { scale: 1.01 }}
      whileTap={isAnimatingToModal ? {} : { scale: 0.99 }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
      }}
      style={{
        pointerEvents: isAnimatingToModal ? 'none' : 'auto',
        visibility: isAnimatingToModal ? 'hidden' : 'visible' // Instant hide, no flicker
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#305EFF]/5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#305EFF]/10">
            <Link2 size={14} className="text-[#305EFF]" />
          </div>
          <span className="text-[13px] font-medium text-[#305EFF]">
            Payment Link Draft
          </span>
        </div>
        <ChevronRight size={16} className="text-[#94a3b8]" />
      </div>

      {/* Content */}
      <div className="px-3 py-2.5 border-t border-[#f1f5f9]">
        {isLoading ? (
          /* Skeleton State */
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-[18px] w-[72px] bg-[#e2e8f0] rounded animate-pulse" />
              <div className="h-[14px] w-[140px] bg-[#e2e8f0] rounded animate-pulse" />
            </div>
            <div className="h-[14px] w-[120px] bg-[#e2e8f0] rounded animate-pulse" />
          </div>
        ) : (
          /* Actual Content */
          <>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-medium text-[#1e293b]">
                ₹{formatAmount(formData.amount)}
              </span>
              {formData.purpose && (
                <>
                  <span className="text-[#cbd5e1]">•</span>
                  <span className="text-[13px] text-[#64748b]">
                    {truncatePurpose(formData.purpose)}
                  </span>
                </>
              )}
            </div>
            {formData.email && (
              <div className="mt-1 text-[12px] text-[#94a3b8]">
                {formData.email}
              </div>
            )}
          </>
        )}
      </div>
    </motion.button>
  );
};

export default PaymentLinkMiniCard;
