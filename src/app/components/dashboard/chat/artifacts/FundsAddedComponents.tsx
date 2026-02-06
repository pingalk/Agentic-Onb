import React from 'react';
import svgPaths from '@/imports/svg-rvo2ii4voy';
import { motion } from 'motion/react';
import Ray from '@/imports/Ray';

// --- Assets ---

// Frame 2147239029
function CheckIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 162, 81, 1)" } as React.CSSProperties}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <g>
            <rect fill="#00A251" height="20" rx="3.33333" width="20" />
            {/* The provided path pa561c00 seems to be the icon inside the green box */}
            <path d={svgPaths.pa561c00} fill="white" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// Icon from Frame5 -> Frame2 -> Frame3 structure
function CreditCardClockIcon() {
  return (
    <div className="absolute left-1/2 size-[38px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
      <svg className="block size-full" fill="none" viewBox="0 0 38 38" preserveAspectRatio="none">
         <path d={svgPaths.p4f7f000} fill="var(--fill-0, #0F78AD)"/>
      </svg>
    </div>
  );
}

// --- Components ---

export const FundsAddedHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex gap-[6px] items-center relative shrink-0">
      <CheckIcon />
      <h3 className="font-sans font-medium text-[18px] leading-[26px] text-[#020202]">
        {title}
      </h3>
    </div>
  );
};

// Component for the body text to match Frame7 styling exactly
export const FundsAddedBody = () => {
  return (
    <div className="flex flex-col gap-[12px] text-[16px] text-[#40566d] tracking-[0.16px] w-full max-w-[580px]">
      <p className="leading-[26px]">
        <span className="font-medium text-[#192839]">Great news! We have received your ₹46,000.</span>
        <span> This has cleared your negative balance, and the hold on your funds has been removed.</span>
      </p>
      <p className="leading-[26px]">
        <span className="font-medium text-[#192839]">What happens next? </span>
        <span> Your full settlement of ₹1.26 Lakhs is now scheduled to be transferred to your bank account by tomorrow, Jan 24.</span>
      </p>
    </div>
  );
};

export const SettlementCard = ({ amount = '3,10,000', date = 'Will deposit tomorrow 10:00 AM', step = 1 }: { amount?: string; date?: string; step?: number }) => {
  return (
    <div
      className="w-full max-w-[420px] rounded-xl overflow-hidden border border-[#dee1e3] transition-shadow hover:shadow-md"
      style={{ background: 'linear-gradient(180deg, rgb(255,255,255) 0%, rgb(255,255,255) 72%, rgb(247,247,248) 100%)' }}
    >
      <div className="p-4">
        {/* Label */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#305EFF]/10">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#305EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <span className="text-[12px] font-medium text-[#7d7d7d] tracking-[-0.3px]">Settlement</span>
        </div>

        {/* Amount - Display font */}
        <div className="text-[32px] font-['TASA_Orbiter_Display'] font-medium text-[#050505] leading-tight">
          ₹{amount}
        </div>

        {/* Date */}
        <p className="text-[14px] text-[#7d7d7d] mt-1">{date}</p>

        {/* Progress bar */}
        <div className="mt-3 flex gap-[2px]">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 ${s <= step ? 'bg-[#10c382]' : 'bg-[#dfdfdf]'}`}
            />
          ))}
        </div>
        <p className="text-[10px] text-[#7d7d7d] opacity-50 mt-1.5 font-medium">Settlement status: Scheduled</p>
      </div>
    </div>
  );
};

export const RayInsightCard = () => {
  return (
    <div className="w-full max-w-[688px] rounded-[12px] p-[12px] flex flex-col gap-[4px] border border-[rgba(18,145,208,0.18)] bg-gradient-to-b from-[rgba(237,247,247,0.5)] to-[rgba(18,145,208,0.09)]">
      <div className="flex gap-[8px] items-center">
         <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
           <path d="M8 1L9.79 5.42L14.5 6.02L11 9.34L11.94 14L8 11.77L4.06 14L5 9.34L1.5 6.02L6.21 5.42L8 1Z" fill="#1291D0" stroke="#1291D0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
         </svg>
         <p className="text-[14px] font-medium text-[#1291D0]">Ray Insight</p>
      </div>
      <p className="text-[14px] leading-[20px] text-[#40566d] tracking-[0.14px]">
        To avoid your settlements being paused during busy refund periods, you can use Refund Credits. Think of it as a separate 'wallet' used only for refunds, this way your settlements remain untouched and are processed seamlessly.
      </p>
    </div>
  );
};
