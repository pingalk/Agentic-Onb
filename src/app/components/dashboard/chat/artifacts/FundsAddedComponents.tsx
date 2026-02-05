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

export const SettlementCard = () => {
  return (
    <div className="relative rounded-[12px] w-full max-w-[573px] overflow-hidden border border-[rgba(181,217,250,0.23)] shadow-[0px_6px_32px_4px_rgba(184,196,214,0.06)] h-[108px]" 
         style={{ backgroundImage: "linear-gradient(rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 71.787%, rgb(227, 246, 255) 100%)" }}>
      
      {/* Icon Box Frame3 -> Frame2 -> Frame5 */}
      <div className="absolute left-[8px] top-[8px] size-[96px]">
        {/* Frame2 */}
        <div className="absolute inset-0 rounded-[6px] overflow-clip" style={{ backgroundImage: "linear-gradient(115.198deg, rgb(255, 255, 255) 22.005%, rgb(234, 245, 251) 90.552%)" }}>
           {/* Frame5 */}
           <div className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] rounded-[135.714px] overflow-clip size-[76px]">
               <CreditCardClockIcon />
           </div>
        </div>
      </div>

      {/* Progress Bars Frame4 */}
      <div className="absolute flex gap-[2px] items-center left-[115px] top-[71px] content-stretch">
        <div className="bg-[#10c382] h-[4px] shrink-0 w-[77px]" />
        <div className="bg-[#dfdfdf] h-[4px] shrink-0 w-[77px]" />
        <div className="bg-[#dfdfdf] h-[4px] shrink-0 w-[77px]" />
        <div className="bg-[#dfdfdf] h-[4px] shrink-0 w-[77px]" />
      </div>

      {/* Status Text */}
      <p className="absolute left-[115px] top-[83px] text-[10px] text-black opacity-50 font-medium leading-[14px] font-sans">
        Settlement status: Scheduled
      </p>

      {/* Main Content Text */}
      <div className="absolute left-[118px] top-[12px] leading-[0]">
         <span className="block leading-[24px] text-[#0f78ad] text-[18px] font-sans font-medium">Settlement on the way</span>
         <span className="block h-[2px]" /> {/* Spacer per Figma <br> */}
         <span className="block leading-[20px] text-[#768ea7] text-[14px] font-normal font-sans">Settlement scheduled for Jan 24, 2026 10:00 AM</span>
      </div>

      {/* Amount - Right Aligned - Amount -> Root -> AmountBase */}
      <div className="absolute right-[16px] top-[12px] flex items-end justify-end">
         <div className="flex items-baseline relative shrink-0 gap-[2px]">
            {/* Currency Symbol */}
            <div className="flex items-baseline opacity-64 relative shrink-0">
               <p className="font-medium leading-[20px] text-[#192839] text-[14px] text-right font-sans">₹</p>
            </div>
            
            {/* Value Container */}
            <div className="flex items-baseline relative shrink-0">
               {/* Main Value */}
               <div className="flex items-baseline relative shrink-0">
                  <p className="font-medium leading-[26px] text-[#192839] text-[20px] text-right font-sans">1,26,000</p>
               </div>
               {/* Decimal Container */}
               <div className="flex items-baseline opacity-64 relative shrink-0">
                  <p className="font-medium leading-[20px] text-[#192839] text-[14px] text-right font-sans">.00</p>
               </div>
            </div>
         </div>
      </div>

      {/* Inner Shadow overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_1px_white,inset_0px_1.5px_0px_1px_white]" />
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
