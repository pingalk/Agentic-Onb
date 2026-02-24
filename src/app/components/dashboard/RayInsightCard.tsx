import React from 'react';
import { motion } from 'motion/react';

interface RayInsightCardProps {
  title?: string;
  body: string;
  onClick?: () => void;
}

export const RayInsightCard: React.FC<RayInsightCardProps> = ({
  title = 'Ray Insight',
  body,
  onClick,
}) => {
  return (
    <motion.div
      className="relative bg-white border border-[#dee1e3] border-t rounded-[12px] overflow-hidden cursor-pointer shadow-[0px_6px_32px_4px_rgba(175,182,187,0.06)] hover:shadow-[0px_8px_40px_6px_rgba(175,182,187,0.1)] transition-shadow duration-200"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#f8fafb] to-transparent" />

      {/* Blue glow on right side */}
      <div
        className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none"
        style={{
          background: 'linear-gradient(270deg, rgba(37, 99, 235, 0.08) 0%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative p-6 flex flex-col gap-2">
        <p className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#192839]">
          {title}
        </p>
        <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[22px] text-[#40566d]">
          {body}
        </p>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#f8fafb] to-transparent" />

      {/* Inner shadow overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_#dee1e3,inset_0px_-1.5px_0px_1px_white]" />
    </motion.div>
  );
};

export default RayInsightCard;
