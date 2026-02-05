import React, { useEffect, useState } from 'react';
import Card1 from "@/imports/Card1";
import Card2 from "@/imports/Card2";
import Card3 from "@/imports/Card3";
import svgPaths from "@/imports/svg-fk2cc1j6pm";
import { motion } from 'motion/react';
import clsx from "clsx";
import Ray from "@/imports/Ray";

// --- Icons & SVGs ---

function SearchIcon() {
  return (
    <svg className="block size-[16px]" fill="none" viewBox="0 0 16 16">
      <path clipRule="evenodd" d={svgPaths.p9de6b00} fill="#40566D" fillRule="evenodd" />
    </svg>
  );
}

function ListSearchIcon() {
  return (
    <svg className="block size-[16px]" fill="none" viewBox="0 0 16 16">
      <path d={svgPaths.p3a34d00} fill="#40566D" />
      <path clipRule="evenodd" d={svgPaths.p1727b600} fill="#40566D" fillRule="evenodd" />
    </svg>
  );
}

function TimelineIcon() {
  return (
    <svg className="block size-[16px]" fill="none" viewBox="0 0 16 16">
      <path d={svgPaths.p3f56f7c0} fill="#40566D" />
    </svg>
  );
}

function BuildIcon() {
  return (
    <svg className="block size-[16px]" fill="none" viewBox="0 0 16 16">
      <path d={svgPaths.p3072b700} fill="#40566D" />
    </svg>
  );
}

function RaySmallIcon() {
  return (
    <svg className="block size-[16px]" fill="none" viewBox="0 0 16 16">
      <path d={svgPaths.pe4107c0} fill="#40566D" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="block size-[20px]" fill="none" viewBox="0 0 20 20">
      <path d={svgPaths.p83dad00} fill="#768EA7" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg className="block size-[16px]" fill="none" viewBox="0 0 16 16">
      <path clipRule="evenodd" d={svgPaths.p36c9dec0} fill="#768EA7" fillRule="evenodd" />
      <path d={svgPaths.p6ec300} fill="#768EA7" />
    </svg>
  );
}

function SendArrowIcon() {
  return (
    <svg className="block size-[16px]" fill="none" viewBox="0 0 18.4 20.4">
      <g filter="url(#filter0_d_send)">
        <path d={svgPaths.p4a27f00} fill="white" />
        <path d={svgPaths.p359eb400} stroke="white" strokeWidth="0.2" />
      </g>
      <defs>
        <filter id="filter0_d_send" x="0" y="0" width="18.4" height="20.4" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

// --- Components ---

interface SuggestionChipProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  bgColor?: string;
}

function SuggestionChip({ icon, label, onClick, bgColor = "bg-[#f8fafc]" }: SuggestionChipProps) {
  return (
    <button 
      onClick={onClick}
      className={`${bgColor} group flex items-center gap-[7px] px-[12px] py-[8px] rounded-[8px] border border-[rgba(108,132,157,0.18)] hover:border-[rgba(51,153,255,0.40)] hover:bg-[#F2F7FB] transition-colors cursor-pointer outline-none`}
    >
      <div className="size-[16px] shrink-0 text-[#40566d] group-hover:text-[#094c85] transition-colors">
        {icon}
      </div>
      <span className="font-['Inter:Medium',sans-serif] text-[16px] leading-[24px] text-[#40566d] whitespace-nowrap group-hover:text-[#094c85] transition-colors">
        {label}
      </span>
    </button>
  );
}

// Card Components

function CardGraph1() {
  return (
    <div className="h-[168px] w-full relative shrink-0">
       <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 221 168">
          <path d={svgPaths.p39b64df0} fill="url(#paint0_linear_card1)" />
          <defs>
            <linearGradient id="paint0_linear_card1" x1="110.5" y1="0" x2="110.5" y2="168" gradientUnits="userSpaceOnUse">
              <stop stopColor="#91E3BA" />
              <stop offset="0.44296" stopColor="#00BE5F" />
              <stop offset="1" stopColor="#00582C" />
            </linearGradient>
          </defs>
        </svg>
    </div>
  );
}

function CardGraph2() {
  return (
     <div className="absolute inset-0">
        <div className="absolute left-[20px] top-[177px] w-[270px] h-[167px] opacity-40">
           <svg className="size-full" viewBox="0 0 271.5 164.348" fill="none">
             <path d={svgPaths.p3bc18100} fill="#8CE2B7" />
           </svg>
        </div>
        <div className="absolute left-[21px] top-[177px] w-[270px] h-[71px]">
             <svg className="size-full" viewBox="0 0 273.5 74.2692" fill="none">
               <path d={svgPaths.p22b3cf00} stroke="#009D4E" strokeWidth="4" strokeLinecap="round" />
             </svg>
        </div>
     </div>
  );
}

function CardGraph3() {
   return (
    <div className="h-[168px] w-full relative shrink-0">
       <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 221 168">
          <path d={svgPaths.p39b64df0} fill="url(#paint0_linear_card3)" />
          <defs>
            <linearGradient id="paint0_linear_card3" x1="110.5" y1="0" x2="110.5" y2="168" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFC499" />
              <stop offset="0.44296" stopColor="#FF9040" />
              <stop offset="1" stopColor="#6B3005" />
            </linearGradient>
          </defs>
        </svg>
    </div>
   );
}

interface Variant2Props {
  prompt: string;
  setPrompt: (val: string) => void;
  onSend: () => void;
  onChipClick: (label: string) => void;
}

export default function Variant2Landing({ prompt, setPrompt, onSend, onChipClick }: Variant2Props) {
  return (
    <div className="flex flex-col items-center w-full h-full overflow-y-auto relative bg-white">
      
      <div className="w-full max-w-[960px] flex flex-col items-center pt-[130px] pb-[48px] px-8 gap-8 pr-[32px] pl-[32px]">
        
        {/* Greeting */}
        <div className="flex items-center gap-[7px]">
            <div className="size-[32px] shrink-0"><Ray /></div>
            <h2 className="font-['TASA_Orbiter_Display:Medium',sans-serif] text-[30px] leading-[34px] text-[#094c85] tracking-[-0.39px]">
                Good afternoon, Ishan!
            </h2>
        </div>

        {/* Input Box */}
        <div className="w-full max-w-[800px] min-h-[120px] bg-[#f8fafc] border border-[#6db7e8] rounded-[26px] shadow-[0px_6px_32px_4px_rgba(25,40,57,0.09)] relative flex flex-col p-5">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onSend();
                    }
                }}
                placeholder="Ask Ray anything related to Razorpay..."
                className="w-full h-full bg-transparent border-none outline-none text-[18px] text-[#192839] placeholder-[#768ea7] placeholder-opacity-60 resize-none font-['Inter:Medium',sans-serif] tracking-[-0.234px] flex-1"
            />
            
            {/* Input Actions */}
            <div className="flex justify-end items-center gap-2 mt-2">
                <div className="flex gap-1">
                    <button className="size-[32px] rounded-[8px] flex items-center justify-center hover:bg-slate-200 transition-colors border border-transparent hover:border-slate-300">
                        <PlusIcon />
                    </button>
                    <button className="size-[32px] rounded-[8px] flex items-center justify-center hover:bg-slate-200 transition-colors border border-transparent hover:border-slate-300">
                        <MicIcon />
                    </button>
                </div>
                
                {/* Send Button */}
                 <div 
                    onClick={onSend}
                    className="cursor-pointer bg-[rgba(0,0,0,0.04)] relative rounded-[100px] shrink-0 size-[32px] hover:opacity-90 transition-opacity"
                >
                    <div className="overflow-clip relative rounded-[inherit] size-full">
                        <div className="absolute border border-[#0354e0] border-solid inset-0 rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]" style={{ backgroundImage: "linear-gradient(-73.0125deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)" }}>
                            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_0px_rgba(255,255,255,0.2),inset_0px_2px_0px_0px_rgba(255,255,255,0.2)]" />
                        </div>
                        <div className="absolute flex items-center justify-center left-1/2 size-[16px] top-[8px] translate-x-[-50%]">
                            <div className="flex-none rotate-[180deg]">
                                <SendArrowIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap justify-center gap-[16px]">
            <SuggestionChip icon={<SearchIcon />} label="Recent transactions" onClick={() => onChipClick("Show recent transactions")} bgColor="bg-[#f8fafc] hover:!bg-[rgba(48,94,255,0.09)]" />
            <SuggestionChip icon={<ListSearchIcon />} label="Summarize" onClick={() => onChipClick("Summarize my payments")} bgColor="bg-[#f8fafc] hover:!bg-[rgba(48,94,255,0.09)]" />
            <SuggestionChip icon={<TimelineIcon />} label="Analyze" onClick={() => onChipClick("Analyze performance")} bgColor="bg-[#f8fafc] hover:!bg-[rgba(48,94,255,0.09)]" />
            <SuggestionChip icon={<BuildIcon />} label="Troubleshoot" onClick={() => onChipClick("Troubleshoot failed payments")} bgColor="bg-[#f8fafc] hover:!bg-[rgba(48,94,255,0.09)]" />
            <SuggestionChip icon={<RaySmallIcon />} label="Ray 101" onClick={() => onChipClick("What can Ray do?")} bgColor="bg-[#f8fafc] hover:!bg-[rgba(48,94,255,0.09)]" />
        </div>

        {/* Cards Grid */}
        <motion.div 
            className="flex flex-wrap justify-center gap-[26px] w-full mt-8 px-[0px] py-[56px]"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.15,
                        delayChildren: 0.2
                    }
                }
            }}
        >
            {/* Card 1: Payment success rate */}
            <motion.div 
                variants={{
                    hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
                    visible: { 
                        opacity: 1, 
                        y: 0, 
                        filter: 'blur(0px)',
                        transition: { 
                            duration: 0.8, 
                            ease: [0.22, 1, 0.36, 1] 
                        } 
                    }
                }}
                className="w-[273px] h-[360px] relative shrink-0"
            >
                <Card1 />
            </motion.div>

             {/* Card 2: Payment method split (Imported as Card3) */}
             <motion.div 
                variants={{
                    hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
                    visible: { 
                        opacity: 1, 
                        y: 0, 
                        filter: 'blur(0px)',
                        transition: { 
                            duration: 0.8, 
                            ease: [0.22, 1, 0.36, 1] 
                        } 
                    }
                }}
                className="w-[273px] h-[360px] relative shrink-0"
            >
                <Card3 />
            </motion.div>

            {/* Card 3: Payments collected (Imported as Card2) */}
            <motion.div 
                variants={{
                    hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
                    visible: { 
                        opacity: 1, 
                        y: 0, 
                        filter: 'blur(0px)',
                        transition: { 
                            duration: 0.8, 
                            ease: [0.22, 1, 0.36, 1] 
                        } 
                    }
                }}
                className="w-[273px] h-[360px] relative shrink-0"
            >
                <Card2 />
            </motion.div>
        </motion.div>

      </div>
    </div>
  );
}