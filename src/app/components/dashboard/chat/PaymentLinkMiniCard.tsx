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
  formId?: string; // Used for querying the element for auto-open animations
  onAnimationComplete?: () => void; // Called when card animation finishes
}

export const PaymentLinkMiniCard: React.FC<PaymentLinkMiniCardProps> = ({
  formData,
  status,
  onClick,
  isLoading = false,
  linkUrl,
  isAnimatingToModal = false,
  formId,
  onAnimationComplete
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

  // When completed, render as a div (non-clickable) - Premium styling
  if (isCompleted) {
    return (
      <motion.div
        className="w-full max-w-[420px] text-left rounded-xl overflow-hidden border border-[#d1fae5] transition-shadow hover:shadow-md"
        style={{ background: 'linear-gradient(180deg, rgb(255,255,255) 0%, rgb(255,255,255) 72%, rgb(240,253,244) 100%)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        onAnimationComplete={onAnimationComplete}
      >
        <div className="p-4">
          {/* Success label */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#22c55e]/10">
              <Check size={12} className="text-[#22c55e]" />
            </div>
            <span className="text-[12px] font-medium text-[#22c55e] tracking-[-0.3px]">
              Payment Link Created
            </span>
          </div>

          {/* Amount - Display font */}
          <div className="text-[24px] font-['TASA_Orbiter_Display'] font-medium text-[#050505]">
            ₹{formatAmount(formData.amount)}
          </div>

          {/* Purpose */}
          {formData.purpose && (
            <p className="text-[14px] text-[#7d7d7d] mt-1 leading-[20px]">
              {truncatePurpose(formData.purpose)}
            </p>
          )}

          {/* Email */}
          {formData.email && (
            <p className="text-[12px] text-[#a0a0a0] mt-1">{formData.email}</p>
          )}

          {/* Link URL with copy button */}
          {linkUrl && (
            <div className="mt-3 flex items-center gap-2 p-2.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
              <Link2 size={14} className="text-[#64748b] flex-shrink-0" />
              <span className="text-[13px] text-[#305EFF] truncate flex-1">
                {linkUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center w-7 h-7 rounded hover:bg-[#e2e8f0] transition-colors flex-shrink-0"
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

  // Draft state - clickable button - Premium styling
  // When animating to modal, hide entire card instantly (morphing element takes over)
  return (
    <motion.button
      ref={cardRef}
      onClick={handleClick}
      data-form-id={formId}
      className="w-full max-w-[420px] text-left relative rounded-xl overflow-hidden border border-[#dee1e3] transition-shadow hover:shadow-md"
      style={{
        background: 'linear-gradient(180deg, rgb(255,255,255) 0%, rgb(255,255,255) 72%, rgb(247,247,248) 100%)',
        pointerEvents: isAnimatingToModal ? 'none' : 'auto',
        visibility: isAnimatingToModal ? 'hidden' : 'visible'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={isAnimatingToModal ? {} : { scale: 1.01 }}
      whileTap={isAnimatingToModal ? {} : { scale: 0.99 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      onAnimationComplete={onAnimationComplete}
    >
      <div className="p-4">
        {/* Label row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#305EFF]/10">
            <Link2 size={12} className="text-[#305EFF]" />
          </div>
          <span className="text-[12px] font-medium text-[#7d7d7d] tracking-[-0.3px]">
            Payment Link Draft
          </span>
          <ChevronRight size={14} className="text-[#7d7d7d] ml-auto" />
        </div>

        {isLoading ? (
          /* Skeleton State */
          <div className="flex flex-col gap-2">
            <div className="h-[28px] w-[100px] bg-[#e2e8f0] rounded animate-pulse" />
            <div className="h-[16px] w-[180px] bg-[#e2e8f0] rounded animate-pulse" />
            <div className="h-[14px] w-[120px] bg-[#e2e8f0] rounded animate-pulse" />
          </div>
        ) : (
          <>
            {/* Amount - Display font */}
            <div className="text-[24px] font-['TASA_Orbiter_Display'] font-medium text-[#050505]">
              ₹{formatAmount(formData.amount)}
            </div>

            {/* Purpose */}
            {formData.purpose && (
              <p className="text-[14px] text-[#7d7d7d] mt-1 leading-[20px]">
                {truncatePurpose(formData.purpose)}
              </p>
            )}

            {/* Email */}
            {formData.email && (
              <p className="text-[12px] text-[#a0a0a0] mt-1">{formData.email}</p>
            )}
          </>
        )}
      </div>
    </motion.button>
  );
};

export default PaymentLinkMiniCard;
