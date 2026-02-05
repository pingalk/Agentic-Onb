import React, { useState } from 'react';
import { motion } from 'motion/react';
import Ray from "../../../imports/Ray";
import { useMagicColor } from '../../../context/MagicColorContext';

// Figma asset URLs
const imgLoader = "https://www.figma.com/api/mcp/asset/d5cfc44f-5d34-4983-a8c0-36f7b0223cbb";
const imgFrame = "https://www.figma.com/api/mcp/asset/9d30b34f-c7fe-468a-b540-96faba1ecd8b";
const imgLine1486 = "https://www.figma.com/api/mcp/asset/f8eaa493-312e-44ba-a5c3-50f8d2308f3b";
const imgFrame2147239214 = "https://www.figma.com/api/mcp/asset/b2f9f04d-f441-447e-b6b6-507578833c86";
const imgLine1490 = "https://www.figma.com/api/mcp/asset/678e39f5-ea6a-48a9-b9b5-c288436133b5";
const imgLine1496 = "https://www.figma.com/api/mcp/asset/7141724b-217f-41fd-8f93-639759e23e7c";
const imgVector5274 = "https://www.figma.com/api/mcp/asset/b9b1f82a-7683-47c4-9bae-048f6688b8ea";
const imgLine1474 = "https://www.figma.com/api/mcp/asset/f0870462-1916-436f-a2af-8edc859061fa";
const imgLine1475 = "https://www.figma.com/api/mcp/asset/8a9a3728-6b74-4928-900f-a86957178d6b";
const imgLine1476 = "https://www.figma.com/api/mcp/asset/77b59671-1731-492a-b0be-ba27c48e1026";
const imgLine1477 = "https://www.figma.com/api/mcp/asset/7bfc7e75-d047-41cf-b29d-f8b0469ce6a5";
const imgVector5273 = "https://www.figma.com/api/mcp/asset/81d5f4c1-ac00-4c41-95b9-70a1c81390cd";
const imgEllipse9641 = "https://www.figma.com/api/mcp/asset/41a524dc-08ac-4794-b222-cdcf7a018b87";
const imgFrame1 = "https://www.figma.com/api/mcp/asset/60469a8a-c2df-4b14-a9b9-aaaa67176529";
const imgVector = "https://www.figma.com/api/mcp/asset/e2e89649-9251-4291-8aee-9073c53d18e4";
const imgImage24871 = "https://www.figma.com/api/mcp/asset/8bef74e7-3112-4ba4-861b-a5bf827f17e1";
const imgGroup2147233986 = "https://www.figma.com/api/mcp/asset/13ea3b37-e654-44f2-ba85-054b80e4f78e";

// Donut chart slices
const img = "https://www.figma.com/api/mcp/asset/a28217ba-94e8-4da0-b576-2d12cee5ed31";
const img1 = "https://www.figma.com/api/mcp/asset/0e5e1198-af58-4399-94c7-cd8b5f30f8c3";
const img2 = "https://www.figma.com/api/mcp/asset/2f0a4b09-fa87-4fbc-8f0a-606f9ced80d2";
const img3 = "https://www.figma.com/api/mcp/asset/74c609b0-3604-4f6f-881c-cfb8289fe0a6";
const img4 = "https://www.figma.com/api/mcp/asset/29272a5a-1a59-4769-ac05-714ce5792b49";
const img5 = "https://www.figma.com/api/mcp/asset/f9ccdc61-ea7f-429c-b10c-c9e3bbc970e0";

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
      <div className="-scale-y-100 rotate-180">
        <div className="size-4">
          <img alt="" className="block size-full" src={imgFrame} style={{ filter: isHovered ? 'brightness(0) saturate(100%)' : 'none' }} />
        </div>
      </div>
    </motion.div>
  </div>
);

export const HomeCards: React.FC<HomeCardsProps> = ({ animPhase, onPromptSelect }) => {
  const { config: magicColorConfig } = useMagicColor();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="flex gap-5 items-start w-full max-w-[850px]">
      {/* Key Updates Card - Left Column - matches height of right column (2 cards + gap) */}
      <motion.div
        className="border border-[#dee1e3] flex flex-col items-center p-2 rounded-xl shrink-0 w-[268px]"
        style={{ backgroundImage: "linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 97.165%, rgb(247, 247, 248) 100%)" }}
        initial={{ opacity: 0, y: 26 }}
        animate={animPhase >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
        transition={{ duration: 0.8, delay: 0, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative rounded-lg w-full p-1">
          {/* Title */}
          <div className="flex items-center py-[5px] mb-3">
            <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#7d7d7d] leading-[18px]">
              Key updates
            </p>
          </div>

          {/* Cards Container */}
          <div className="flex flex-col gap-3 w-full">
            {/* Critical Downtime Card */}
            <div
              className="bg-[#fef2f2] flex flex-col h-[259px] justify-between p-3 rounded-lg w-full cursor-pointer transition-shadow hover:shadow-md"
              onMouseEnter={() => setHoveredCard('critical')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex flex-col gap-2 w-full">
                <p className="font-['Inter',sans-serif] font-medium text-[16px] text-[#d92d20] tracking-[-0.528px] leading-[24px]">
                  Critical Downtime
                </p>
                <p className="font-['Inter',sans-serif] font-normal text-[14px] text-[#7d7d7d] leading-[20px]">
                  All users transacting through HDFC bank are likely to face failures.
                </p>
              </div>
              <CardFooter label="Deep dive into reason" isHovered={hoveredCard === 'critical'} magicColor={magicColorConfig.primary} />
            </div>

            {/* Ticket Resolved Card */}
            <div
              className="bg-[#f8f8f8] flex flex-col flex-1 justify-between p-3 rounded-lg w-full min-h-[259px] cursor-pointer transition-shadow hover:shadow-md"
              onMouseEnter={() => setHoveredCard('ticket')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex flex-col gap-2 w-full">
                <p className="font-['Inter',sans-serif] font-medium text-[16px] text-[#050505] tracking-[-0.528px] leading-[24px]">
                  Ticket #20323783 resolved
                </p>
                <p className="font-['Inter',sans-serif] font-normal text-[14px] text-[#7d7d7d] leading-[20px]">
                  Issue has been resolved. You can take further actions or track the support ticket here
                </p>
              </div>
              <CardFooter label="Deep dive into reason" isHovered={hoveredCard === 'ticket'} magicColor={magicColorConfig.primary} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column - 2x2 Grid */}
      <div className="flex flex-wrap gap-5 items-start w-[558px]">
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
              <br />
              <span className="text-[#7d7d7d] font-normal">deposited yesterday</span>
            </p>

            {/* Decorative lines */}
            <div className="absolute h-0 left-[-16px] top-[-4px] w-[23px]">
              <img alt="" className="block size-full" src={imgLine1486} style={{ position: 'absolute', inset: '-1px 0 0 0' }} />
            </div>
            <div className="absolute h-[208px] left-[-19.5px] top-[12.99px] w-[23px]">
              <img alt="" className="block size-full" src={imgFrame2147239214} />
            </div>
            <div className="absolute h-0 left-[-16px] top-[63px] w-[31px]">
              <img alt="" className="block size-full" src={imgLine1490} style={{ position: 'absolute', inset: '-2px 0 0 0' }} />
            </div>
            <div className="absolute h-0 left-[-16px] top-[162px] w-[23px]">
              <img alt="" className="block size-full" src={imgLine1496} style={{ position: 'absolute', inset: '-2px 0 0 0' }} />
            </div>
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
            {/* Donut Chart */}
            <div className="absolute left-1/2 -translate-x-1/2 size-[162px] top-[141px]">
              <div className="absolute left-1/2 top-[calc(50%-40px)] -translate-x-1/2 -translate-y-1/2 h-[80px] w-[160px]">
                <div className="absolute inset-[0_0_-80px_0]">
                  <div className="absolute bottom-1/2 left-0 right-[50.6%] top-0">
                    <img alt="" className="block size-full" src={img} />
                  </div>
                </div>
                <div className="absolute inset-[0_0_-80px_0]">
                  <div className="absolute bottom-[72.63%] left-1/2 right-[14.64%] top-0">
                    <img alt="" className="block size-full" src={img1} />
                  </div>
                </div>
                <div className="absolute inset-[0_0_-80px_0]">
                  <div className="absolute inset-[14.64%_0_50.6%_72.63%]">
                    <img alt="" className="block size-full" src={img2} />
                  </div>
                </div>
                <div className="absolute inset-[0_0_-80px_0]">
                  <div className="absolute bottom-1/2 left-[-0.47%] right-[50.93%] top-[-0.46%]">
                    <img alt="" className="block size-full" src={img3} />
                  </div>
                </div>
                <div className="absolute inset-[0_0_-80px_0]">
                  <div className="absolute bottom-[85.68%] left-1/2 right-[14.99%] top-[-0.47%]">
                    <img alt="" className="block size-full" src={img4} />
                  </div>
                </div>
                <div className="absolute inset-[0_0_-80px_0]">
                  <div className="absolute inset-[14.31%_-0.46%_50.93%_85.02%]">
                    <img alt="" className="block size-full" src={img5} />
                  </div>
                </div>
              </div>
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
                <p className="font-['Inter',sans-serif] font-normal text-[14px] text-[#768ea7] leading-[20px]">i18n</p>
              </div>
              <div className="flex gap-2 items-center px-1">
                <div className="bg-[#f472b6] rounded-sm size-3" />
                <p className="font-['Inter',sans-serif] font-normal text-[14px] text-[#768ea7] leading-[20px]">POS</p>
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
                  <span className="text-[16px] text-[#050505]"> from last week.</span>
                </p>
              </div>
            </div>

            {/* Area Chart */}
            <div className="absolute h-[92px] left-[-13px] top-[130px] w-[247px]">
              <img alt="" className="block size-full" src={imgVector5274} />
            </div>
            <div className="absolute h-[53px] left-[-13px] top-[130px] w-[247px]">
              <img alt="" className="block size-full" src={imgVector5273} style={{ position: 'absolute', inset: '-1.41% 0 -1.28% -0.13%' }} />
            </div>

            {/* Grid lines */}
            <div className="absolute flex h-[91px] items-center justify-center left-[234px] top-[130px] w-0 rotate-90">
              <img alt="" className="h-0 w-[91px]" src={imgLine1474} />
            </div>
            <div className="absolute flex h-[91px] items-center justify-center left-[175px] top-[130px] w-0 rotate-90">
              <img alt="" className="h-0 w-[91px]" src={imgLine1475} />
            </div>
            <div className="absolute flex h-[67px] items-center justify-center left-[116px] top-[154px] w-0 rotate-90">
              <img alt="" className="h-0 w-[67px]" src={imgLine1476} />
            </div>
            <div className="absolute flex h-[73px] items-center justify-center left-[57px] top-[148px] w-0 rotate-90">
              <img alt="" className="h-0 w-[73px]" src={imgLine1477} />
            </div>

            {/* Dot at end of chart */}
            <div className="absolute left-[231px] size-[6px] top-[127px]">
              <img alt="" className="block size-full" src={imgEllipse9641} style={{ position: 'absolute', inset: '-58.33% -75% -91.67% -75%' }} />
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
                Share <span className="inline-block align-middle mx-1">
                  <span className="bg-[#305eff] rounded-full shadow-[0px_2px_4px_0px_rgba(106,109,113,0.1)] size-6 flex items-center justify-center">
                    <img alt="" className="size-4" src={imgFrame1} />
                  </span>
                </span> payout links for instant payments, no bank details needed.
              </p>
            </div>

            {/* Sign up button */}
            <button
              className="h-7 px-3 rounded-lg text-white text-[12px] font-medium leading-[17px] tracking-[-0.156px] w-fit font-['Inter',sans-serif]"
              style={{ backgroundImage: "linear-gradient(124.5deg, rgb(66, 136, 255) 1.4269%, rgb(21, 102, 241) 45.158%)" }}
            >
              Sign up
            </button>

            {/* Phone image */}
            <div className="absolute bottom-[-28px] right-0 h-[282px] w-[158px]">
              <img alt="" className="object-cover size-full" src={imgImage24871} />
            </div>

            {/* Payment Links floating chip */}
            <div className="absolute right-[10px] top-[162px]">
              <div className="h-[42.697px] w-[76px] relative">
                <img alt="" className="block size-full" src={imgVector} style={{ position: 'absolute', inset: '-1% -0.56% 8.03% -0.56%' }} />
              </div>
              <div className="absolute flex flex-col items-start justify-center h-[34px] overflow-hidden px-2 py-3 top-0 w-[71px]">
                <p className="font-['TASA_Orbiter_Display',sans-serif] font-medium text-[8.5px] text-[#40566d] leading-[1.3]">Payment Links</p>
              </div>
              <div className="absolute left-[9px] top-[-9px] size-[18px]">
                <img alt="" className="block size-full" src={imgGroup2147233986} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeCards;
