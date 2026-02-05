import React from 'react';
import { motion } from 'motion/react';
import { Settings, ChevronRight, Check } from 'lucide-react';

export interface CaptureSettingsMiniCardProps {
  status: 'draft' | 'completed';
  currentSetting?: 'auto' | 'manual';
  onClick?: () => void;
  isLoading?: boolean;
}

export const CaptureSettingsMiniCard: React.FC<CaptureSettingsMiniCardProps> = ({
  status,
  currentSetting = 'manual',
  onClick,
  isLoading = false
}) => {
  const isDraft = status === 'draft';
  const isCompleted = status === 'completed';

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
              Settings Updated
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-3 py-2.5 border-t border-[#f1f5f9]">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-medium text-[#1e293b]">
              Auto Capture
            </span>
            <span className="text-[#cbd5e1]">•</span>
            <span className="text-[13px] text-[#64748b]">
              Enabled
            </span>
          </div>
          <div className="mt-1 text-[12px] text-[#94a3b8]">
            Payments will be captured automatically
          </div>
        </div>
      </motion.div>
    );
  }

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
            <Settings size={14} className="text-[#305EFF]" />
          </div>
          <span className="text-[13px] font-medium text-[#305EFF]">
            Capture Settings
          </span>
        </div>
        <ChevronRight size={16} className="text-[#94a3b8]" />
      </div>

      {/* Content */}
      <div className="px-3 py-2.5 border-t border-[#f1f5f9]">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <div className="h-[18px] w-[120px] bg-[#e2e8f0] rounded animate-pulse" />
            <div className="h-[14px] w-[180px] bg-[#e2e8f0] rounded animate-pulse" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-medium text-[#1e293b]">
                {currentSetting === 'manual' ? 'Manual Capture' : 'Auto Capture'}
              </span>
              <span className="text-[#cbd5e1]">•</span>
              <span className="text-[13px] text-[#64748b]">
                Current setting
              </span>
            </div>
            <div className="mt-1 text-[12px] text-[#94a3b8]">
              Click to change to Auto Capture
            </div>
          </>
        )}
      </div>
    </motion.button>
  );
};

export default CaptureSettingsMiniCard;
