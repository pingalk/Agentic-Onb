import React, { useState } from 'react';
import { motion } from 'motion/react';
import Ray from "../../../imports/Ray";
import { useMagicColor } from '../../../context/MagicColorContext';

// SVG-based Arrow Icon component
const ArrowIcon = ({ color = "#7d7d7d" }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 12L10 8L6 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// SVG-based Semi-Donut Chart component
const DonutChart = () => (
  <svg viewBox="0 0 180 100" className="w-full h-full">
    <defs>
      <clipPath id="semiCircleClip">
        <rect x="0" y="0" width="180" height="100" />
      </clipPath>
    </defs>
    <g clipPath="url(#semiCircleClip)">
      {/* Blue slice - Online (50%) - left half */}
      <path d="M90 90 L30 90 A60 60 0 0 1 90 30 Z" fill="#305eff" />
      {/* Green slice - Offline (30%) - middle-right */}
      <path d="M90 90 L90 30 A60 60 0 0 1 138 58 Z" fill="#10b981" />
      {/* Pink slice - i18n (20%) - far right */}
      <path d="M90 90 L138 58 A60 60 0 0 1 150 90 Z" fill="#f472b6" />
      {/* Inner white semi-circle for donut effect */}
      <path d="M90 90 L50 90 A40 40 0 0 1 130 90 Z" fill="white" />
    </g>
  </svg>
);

// SVG-based Area Chart component
const AreaChart = () => (
  <svg viewBox="0 0 253 92" className="w-full h-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#305eff" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#305eff" stopOpacity="0.05" />
      </linearGradient>
    </defs>
    {/* Area fill */}
    <path d="M0 92 L0 60 Q30 65 57 55 T116 45 T175 25 T234 10 L253 8 L253 92 Z" fill="url(#areaGradient)" />
    {/* Line */}
    <path d="M0 60 Q30 65 57 55 T116 45 T175 25 T234 10 L253 8" fill="none" stroke="#305eff" strokeWidth="2" />
    {/* End dot */}
    <circle cx="246" cy="10" r="4" fill="#305eff" />
  </svg>
);

// Checkmark icon for Payment Links card
const CheckmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="#10b981" />
    <path d="M5 9L8 12L13 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Payout icon for Payment Links description
const PayoutIcon = () => (
  <span className="bg-[#305eff] rounded-full shadow-[0px_2px_4px_0px_rgba(106,109,113,0.1)] size-6 inline-flex items-center justify-center">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1V13M1 7H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </span>
);

interface HomeCardsProps {
  animPhase: number;
  onPromptSelect?: (prompt: string) => void;
}

// Card footer component with Ray icon and arrow
const CardFooter = ({ label, isHovered, magicColor }: { label: string; isHovered: boolean; magicColor: string }) => (
  <div className="flex gap-2 items-center px-2 py-3 w-full">
    <style>{`
      @keyframes shimmerCard {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .shimmer-card-text {
        background: linear-gradient(90deg, ${magicColor} 0%, ${magicColor}80 50%, ${magicColor} 100%);
        background-size: 200% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: shimmerCard 2s linear infinite;
      }
    `}</style>
    <motion.div
      className="shrink-0 size-4"
      style={{ '--fill-0': isHovered ? magicColor : '#7d7d7d' } as React.CSSProperties}
      animate={{ rotate: isHovered ? [0, 90, 180, 270, 360] : 0 }}
      transition={isHovered ? {
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
        repeat: Infinity
      } : { duration: 0.3, ease: "easeOut" }}
    >
      <Ray static />
    </motion.div>
    <p
      className={`flex-1 font-['Inter',sans-serif] font-normal text-[14px] tracking-[-0.182px] transition-colors duration-300 ${isHovered ? 'shimmer-card-text' : ''}`}
      style={!isHovered ? { color: '#7d7d7d' } : undefined}
    >
      {label}
    </p>
    <motion.div
      className="flex items-center justify-center shrink-0"
      animate={{ x: isHovered ? 4 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <ArrowIcon color={isHovered ? '#050505' : '#7d7d7d'} />
    </motion.div>
  </div>
);

export const HomeCards: React.FC<HomeCardsProps> = ({ animPhase, onPromptSelect }) => {
  const { config: magicColorConfig } = useMagicColor();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-5 items-start w-full max-w-[850px]">
      {/* Critical Downtime Card */}
      <motion.div
        className="border border-[#dee1e3] flex flex-col gap-2 items-center p-2 rounded-xl shrink-0 w-[269px] cursor-pointer transition-shadow hover:shadow-md"
        style={{ backgroundImage: "linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 93.453%, rgb(247, 247, 248) 100%)" }}
        initial={{ opacity: 0, y: 26 }}
        animate={animPhase >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
        transition={{ duration: 0.8, delay: 0, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHoveredCard('critical')}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="bg-gradient-to-b from-white from-[47%] to-[#fef2f2] h-[221px] overflow-hidden relative rounded-lg w-[253px] p-4 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#7d7d7d] leading-[18px]">Key Update</p>
            <p className="font-['Inter',sans-serif] font-medium text-[20px] text-[#d92d20] tracking-[-0.528px] leading-[28px]">
              Critical Downtime
            </p>
            <p className="font-['Inter',sans-serif] font-normal text-[14px] text-[#7d7d7d] leading-[20px]">
              All users transacting through HDFC bank are likely to face failures.
            </p>
          </div>
        </div>
        <CardFooter label="Deep dive into reason" isHovered={hoveredCard === 'critical'} magicColor={magicColorConfig.primary} />
      </motion.div>

      {/* Ticket Resolved Card */}
      <motion.div
        className="border border-[#dee1e3] flex flex-col gap-2 items-center p-2 rounded-xl shrink-0 w-[269px] cursor-pointer transition-shadow hover:shadow-md"
        style={{ backgroundImage: "linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 93.453%, rgb(247, 247, 248) 100%)" }}
        initial={{ opacity: 0, y: 26 }}
        animate={animPhase >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHoveredCard('ticket')}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="bg-gradient-to-b from-white from-[47%] to-[#f8f8f8] h-[221px] overflow-hidden relative rounded-lg w-[253px] p-4 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#7d7d7d] leading-[18px]">Key Update</p>
            <p className="font-['Inter',sans-serif] font-medium text-[20px] text-[#050505] tracking-[-0.528px] leading-[28px]">
              Ticket #20323783 resolved
            </p>
            <p className="font-['Inter',sans-serif] font-normal text-[14px] text-[#7d7d7d] leading-[20px]">
              Issue has been resolved. You can take further actions or track the support ticket here.
            </p>
          </div>
        </div>
        <CardFooter label="View ticket details" isHovered={hoveredCard === 'ticket'} magicColor={magicColorConfig.primary} />
      </motion.div>

      {/* Settlement Card */}
      <motion.div
        className="border border-[#dee1e3] flex flex-col gap-2 items-center p-2 rounded-xl shrink-0 w-[269px] cursor-pointer transition-shadow hover:shadow-md"
        style={{ backgroundImage: "linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 93.453%, rgb(247, 247, 248) 100%)" }}
        initial={{ opacity: 0, y: 26 }}
        animate={animPhase >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHoveredCard('settlement')}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="bg-gradient-to-b from-white from-[47%] to-[#f8f8f8] h-[221px] overflow-hidden relative rounded-lg w-[253px]">
          {/* Timeline - gray dashed vertical line */}
          <div className="absolute left-[10px] top-[44px] bottom-[40px] w-[1px] border-l border-dashed border-[#cbd5e1]" />

          {/* Timeline markers - blue horizontal dashes */}
          <div className="absolute left-[6px] top-[54px] w-[10px] h-[2px] bg-[#305eff]" />
          <div className="absolute left-[6px] top-[152px] w-[10px] h-[2px] bg-[#cbd5e1]" />

          {/* Label */}
          <div className="absolute left-[22px] top-[12px]">
            <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#7d7d7d] leading-[18px]">Settlement</p>
          </div>

          {/* Amount */}
          <div className="absolute flex flex-col gap-1 left-[22px] top-[44px] w-[151px]">
            <div className="flex gap-[2px] items-start text-[#050505] leading-[38px]">
              <span className="font-['Inter',sans-serif] font-medium text-[30px]">₹</span>
              <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium text-[32px]">1.2k</span>
            </div>
            <p className="font-['Inter',sans-serif] font-normal text-[14px] text-[#7d7d7d] leading-[20px]">
              Will deposit today 9:00 PM
            </p>
          </div>

          {/* Deposited yesterday */}
          <p className="absolute left-[22.5px] top-[151px] text-[14px] leading-[20px] w-[190px] font-['Inter',sans-serif]">
            <span className="font-medium text-[#050505]">₹20,000 </span>
            <span className="text-[#7d7d7d] font-normal">deposited yesterday</span>
          </p>
        </div>
        <CardFooter label="See eligible transactions" isHovered={hoveredCard === 'settlement'} magicColor={magicColorConfig.primary} />
      </motion.div>

      {/* Balance Card */}
      <motion.div
        className="border border-[#dee1e3] flex flex-col gap-2 items-center p-2 rounded-xl shrink-0 w-[269px] cursor-pointer transition-shadow hover:shadow-md"
        style={{ backgroundImage: "linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 93.453%, rgb(247, 247, 248) 100%)" }}
        initial={{ opacity: 0, y: 26 }}
        animate={animPhase >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHoveredCard('balance')}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="bg-gradient-to-b from-white from-[47%] to-[#f8f8f8] h-[221px] overflow-hidden relative rounded-lg w-[253px]">
          {/* Donut Chart - SVG based */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[180px] h-[100px] top-[120px]">
            <DonutChart />
          </div>

          {/* Label and Amount */}
          <div className="absolute flex flex-col gap-3 left-[12.5px] top-3 w-[229px]">
            <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#7d7d7d] leading-[18px]">Balance</p>
            <div className="flex gap-[2px] items-start text-[#050505] leading-[38px]">
              <span className="font-['Inter',sans-serif] font-medium text-[30px]">₹</span>
              <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium text-[32px]">35k</span>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute flex flex-wrap gap-3 items-start justify-center left-[10px] top-[92px]">
            <div className="flex gap-2 items-center px-1">
              <div className="bg-[#305eff] rounded-sm size-3" />
              <p className="font-['Inter',sans-serif] font-normal text-[14px] text-[#768ea7] leading-[20px]">Online</p>
            </div>
            <div className="flex gap-2 items-center px-1">
              <div className="bg-[#10b981] rounded-sm size-3" />
              <p className="font-['Inter',sans-serif] font-normal text-[14px] text-[#768ea7] leading-[20px]">Offline</p>
            </div>
            <div className="flex gap-2 items-center px-1">
              <div className="bg-[#f472b6] rounded-sm size-3" />
              <p className="font-['Inter',sans-serif] font-normal text-[14px] text-[#768ea7] leading-[20px]">i18n</p>
            </div>
          </div>
        </div>
        <CardFooter label="See eligible transactions" isHovered={hoveredCard === 'balance'} magicColor={magicColorConfig.primary} />
      </motion.div>

      {/* Collected Payment Card */}
      <motion.div
        className="border border-[#dee1e3] flex flex-col gap-2 items-center p-2 rounded-xl shrink-0 w-[269px] cursor-pointer transition-shadow hover:shadow-md"
        style={{ backgroundImage: "linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 93.453%, rgb(247, 247, 248) 100%)" }}
        initial={{ opacity: 0, y: 26 }}
        animate={animPhase >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHoveredCard('collected')}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="bg-gradient-to-b from-white from-[47%] to-[#f8f8f8] h-[221px] overflow-hidden relative rounded-lg w-full">
          {/* Label and Amount */}
          <div className="absolute flex flex-col gap-3 left-3 top-3 w-[229px]">
            <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#7d7d7d] leading-[18px]">Collected Payment</p>
            <div className="flex flex-col gap-2 text-[#050505]">
              <div className="flex gap-[2px] items-start leading-[38px]">
                <span className="font-['Inter',sans-serif] font-medium text-[30px]">₹</span>
                <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium text-[32px]">12k</span>
              </div>
              <p className="font-['Inter',sans-serif] font-medium tracking-[-0.528px]">
                <span className="font-semibold text-[#009457] text-[14px]">▲</span>
                <span className="text-[#009457] text-[16px]">14%</span>
                <span className="text-[16px] text-[#050505]"> from last week</span>
              </p>
            </div>
          </div>

          {/* Area Chart - SVG based */}
          <div className="absolute left-0 right-0 bottom-0 h-[92px]">
            <AreaChart />
          </div>
        </div>
        <CardFooter label="See eligible transactions" isHovered={hoveredCard === 'collected'} magicColor={magicColorConfig.primary} />
      </motion.div>

      {/* Payment Links Card */}
      <motion.div
        className="border border-[#dee1e3] flex flex-col h-[286px] items-center overflow-hidden p-[2px] rounded-xl shrink-0 w-[269px]"
        style={{ backgroundImage: "linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 93.453%, rgb(247, 247, 248) 100%)" }}
        initial={{ opacity: 0, y: 26 }}
        animate={animPhase >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="flex flex-1 flex-col gap-3 p-[18px] rounded-lg w-full relative overflow-hidden"
          style={{ backgroundImage: "linear-gradient(146.40deg, rgb(226, 239, 255) 51.056%, rgb(105, 172, 255) 113.14%)" }}
        >
          {/* Label */}
          <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#050505] leading-[18px]">Payment Links</p>

          {/* Description with inline icon */}
          <div className="flex flex-col gap-2 w-[193px]">
            <p className="font-['Inter',sans-serif] font-medium text-[16px] text-[#050505] tracking-[-0.528px] leading-[24px]">
              Share <PayoutIcon /> payout links for instant payments, no bank details needed.
            </p>
          </div>

          {/* Sign up button */}
          <button
            className="h-7 px-3 rounded-lg text-white text-[12px] font-medium leading-[17px] tracking-[-0.156px] w-fit font-['Inter',sans-serif]"
            style={{ backgroundImage: "linear-gradient(124.5deg, rgb(66, 136, 255) 1.4269%, rgb(21, 102, 241) 45.158%)" }}
          >
            Sign up
          </button>

          {/* Girl with phone image */}
          <div className="absolute bottom-0 right-0 w-[158px] h-[282px] overflow-hidden">
            <img
              src="/girl-img.png"
              alt="Woman using payment links"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Payment Links floating chip */}
          <div className="absolute right-[20px] top-[165px]">
            <div className="bg-white rounded-lg shadow-md px-2 py-1.5 flex items-center gap-1">
              <CheckmarkIcon />
              <p className="font-['Inter',sans-serif] font-medium text-[8px] text-[#40566d] leading-[1.3]">Payment Links</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeCards;
