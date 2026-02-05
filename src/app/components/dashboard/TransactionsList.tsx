import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import tableSvgPaths from "../../../imports/svg-oln59mq616";
import topSvgPaths from "../../../imports/svg-ca7pvfxu0c";
import { clsx } from "clsx";
import { Check, AlertCircle } from "lucide-react";
import imgGeminiGeneratedImageK30W93K30W93K30W19 from "figma:asset/a34d5728d95c39b20fd660ee602d74c17675bd80.png";
import imgFolderCoins from "figma:asset/8761dd39fb591864584de200c4c1b7839b118554.png";
import Ray from "../../../imports/Ray";

const SPINNER_PATH = "M8.00001 11.333C8.3682 11.333 8.667 11.6318 8.667 12V14.667C8.66682 15.035 8.36808 15.333 8.00001 15.333C7.63193 15.333 7.3332 15.035 7.33302 14.667V12C7.33302 11.6318 7.63182 11.333 8.00001 11.333ZM4.70216 10.3555C4.96251 10.0951 5.38419 10.0951 5.64454 10.3555C5.90487 10.6158 5.90488 11.0375 5.64454 11.2979L3.75782 13.1846C3.49748 13.4449 3.07578 13.4449 2.81544 13.1846C2.55511 12.9242 2.55514 12.5026 2.81544 12.2422L4.70216 10.3555ZM10.3555 10.3555C10.6158 10.0951 11.0375 10.0951 11.2979 10.3555L13.1846 12.2422C13.4449 12.5026 13.4449 12.9243 13.1846 13.1846C12.9243 13.4449 12.5026 13.4449 12.2422 13.1846L10.3555 11.2979C10.0951 11.0375 10.0951 10.6158 10.3555 10.3555ZM4.00001 7.33302C4.3682 7.33302 4.667 7.63182 4.667 8.00001C4.667 8.36819 4.36819 8.667 4.00001 8.667H1.33302C0.964977 8.66683 0.667008 8.36809 0.667003 8.00001C0.667003 7.63193 0.964973 7.33319 1.33302 7.33302H4.00001ZM14.667 7.33302C15.035 7.3332 15.333 7.63193 15.333 8.00001C15.333 8.36808 15.035 8.66682 14.667 8.667H12C11.6318 8.667 11.333 8.3682 11.333 8.00001C11.333 7.63182 11.6318 7.33302 12 7.33302H14.667ZM2.81544 2.81544C3.07578 2.5551 3.49747 2.55512 3.75782 2.81544L5.64454 4.70216C5.90487 4.96251 5.90488 5.3842 5.64454 5.64454C5.3842 5.90488 4.96251 5.90487 4.70216 5.64454L2.81544 3.75782C2.55512 3.49747 2.5551 3.07578 2.81544 2.81544ZM12.2422 2.81544C12.5026 2.55514 12.9242 2.55511 13.1846 2.81544C13.4449 3.07578 13.4449 3.49748 13.1846 3.75782L11.2979 5.64454C11.0375 5.90488 10.6158 5.90487 10.3555 5.64454C10.0951 5.38419 10.0951 4.96251 10.3555 4.70216L12.2422 2.81544ZM8.00001 0.667003C8.36809 0.667008 8.66683 0.964977 8.667 1.33302V4.00001C8.667 4.36819 8.36819 4.667 8.00001 4.667C7.63182 4.667 7.33302 4.3682 7.33302 4.00001V1.33302C7.33319 0.964973 7.63193 0.667003 8.00001 0.667003Z";

function StatusBadge({ status }: { status: string }) {
  const isCaptured = status === 'Captured';
  const isFailed = status === 'Failed';
  const isAuthorised = status === 'Authorised';

  let bgClass = 'bg-[rgba(18,145,208,0.09)]'; // Default/Blue
  let textClass = 'text-[#0f78ad]';
  let icon = (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" viewBox="0 0 16 16">
        <path d={SPINNER_PATH} fill="currentColor" />
      </svg>
    </div>
  );

  if (isCaptured) {
    bgClass = 'bg-[rgba(0,162,81,0.09)]';
    textClass = 'text-[#008743]';
    icon = <Check size={14} strokeWidth={3} className="shrink-0" />;
  } else if (isFailed) {
    bgClass = 'bg-[rgba(217,45,32,0.09)]';
    textClass = 'text-[#d92d20]';
    icon = <AlertCircle size={14} strokeWidth={2.5} className="shrink-0" />;
  }

  return (
    <div className={`${bgClass} ${textClass} content-stretch flex gap-[4px] h-[24px] items-center px-[12px] relative rounded-[1000px] shrink-0 w-fit`}>
      {icon}
      <p className="font-['Inter:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px]">{status}</p>
    </div>
  );
}

interface TransactionsListProps {
    onViewDetails: (id: string) => void;
    isRayOpen?: boolean;
}

const transactions = [
  { id: "pay_captured_23jan", rrn: "6482937429", amount: "₹ 21,312.12", status: "Captured", created: "23, Jan at 10 am" },
  { id: "pay_captured_22jan", rrn: "1242940202", amount: "₹ 8,750.50", status: "Captured", created: "22, Jan at 4 pm" },
  { id: "pay_failed_21jan", rrn: "9876543210", amount: "₹ 2,000.00", status: "Failed", created: "21, Jan at 9 am" },
  { id: "pay_auth_20jan", rrn: "4567891230", amount: "₹ 15,600.00", status: "Authorised", created: "20, Jan at 2 pm" },
  { id: "pay_captured_19jan", rrn: "3216549870", amount: "₹ 5,500.25", status: "Captured", created: "19, Jan at 6 pm" },
];

// --- Top Content Helpers (Renamed from TopContent.tsx) ---

function TopIcon12({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        {children}
      </svg>
    </div>
  );
}

function TopIcon16({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        {children}
      </svg>
    </div>
  );
}

function TopCardGradient({ children }: React.PropsWithChildren<{}>) {
  return (
    <div style={{ backgroundImage: "linear-gradient(rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 71.787%, rgb(247, 247, 248) 100%)" }} className="basis-0 grow min-h-px min-w-px relative rounded-[12px] shrink-0">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[20px] items-center px-[20px] py-[16px] relative w-full">{children}</div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-1.5px_0px_1px_white,inset_0px_1.5px_0px_1px_white]" />
      <div aria-hidden="true" className="absolute border border-[#dee1e3] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_6px_32px_4px_rgba(184,196,214,0.06)]" />
    </div>
  );
}

type TopLabelProps = {
  text: string;
};

function TopLabel({ text, children }: React.PropsWithChildren<TopLabelProps>) {
  return (
    <div className="content-stretch flex flex-col gap-px items-start justify-center relative shrink-0">
      <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#050505] text-[12px] text-nowrap tracking-[0.72px] uppercase">{text}</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">{children}</div>
      </div>
    </div>
  );
}

function TopIconFrame({ children }: React.PropsWithChildren<{}>) {
  return (
    <TopIcon16>
      <g id="Frame">{children}</g>
    </TopIcon16>
  );
}

type TopTrendProps = {
  text: string;
  colorClass: string;
  strokeColor: string;
};

function TopTrend({ text, colorClass, strokeColor }: TopTrendProps) {
  return (
    <div className="content-stretch flex gap-[2px] h-[24px] items-center relative shrink-0">
      <TopIconFrame>
        <path d={topSvgPaths.p26bd9c00} id="Vector" stroke={`var(--stroke-0, ${strokeColor})`} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </TopIconFrame>
      <p className={`font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 ${colorClass} text-[12px] text-nowrap tracking-[-0.156px]`}>{text}</p>
    </div>
  );
}

type TopValueProps = {
  text: string;
};

function TopValue({ text }: TopValueProps) {
  return (
    <div className="content-stretch flex items-start relative shrink-0">
      <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[14px]">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#050505] text-[23px] tracking-[-0.759px] w-full">
          <p className="leading-[normal]">{"₹"}</p>
        </div>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#050505] text-[24px] text-nowrap tracking-[-0.792px]">
        <p className="leading-[normal]">{text}</p>
      </div>
    </div>
  );
}

type GeminiImageProps = {
  additionalClassNames?: string;
};

function GeminiImage({ additionalClassNames = "" }: GeminiImageProps) {
  return (
    <div className={clsx("relative", additionalClassNames)}>
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgGeminiGeneratedImageK30W93K30W93K30W19} />
    </div>
  );
}

function TopChevronRight() {
  return (
    <TopIcon12>
      <g id="chevron-right">
        <path clipRule="evenodd" d={topSvgPaths.p361df540} fill="var(--fill-0, #606C75)" fillRule="evenodd" id="path" />
      </g>
    </TopIcon12>
  );
}


// --- Existing Helpers (Maintained for Table) ---

type BackgroundImage11Props = {
  additionalClassNames?: string;
};

function BackgroundImage11({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage11Props>) {
  return (
    <div style={{ backgroundImage: "linear-gradient(rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 71.787%, rgb(247, 247, 248) 100%)" }} className={clsx("basis-0 grow min-h-px min-w-px relative rounded-[12px] shrink-0", additionalClassNames)}>
      {children}
    </div>
  );
}

type BackgroundImage10Props = {
  additionalClassNames?: string;
};

function BackgroundImage10({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage10Props>) {
  return (
    <div className={clsx("relative", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        {children}
      </svg>
    </div>
  );
}

function BackgroundImage9({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        {children}
      </svg>
    </div>
  );
}

function BackgroundImage8({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        {children}
      </svg>
    </div>
  );
}

function BackgroundImage7({ children }: React.PropsWithChildren<{}>) {
  return (
    <BackgroundImage11>
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[20px] items-center px-[20px] py-[16px] relative w-full">{children}</div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-1.5px_0px_1px_white,inset_0px_1.5px_0px_1px_white]" />
      <div aria-hidden="true" className="absolute border border-[#dee1e3] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_6px_32px_4px_rgba(184,196,214,0.06)]" />
    </BackgroundImage11>
  );
}

type BackgroundImageAndText5Props = {
  text: string;
};

function BackgroundImageAndText5({ text, children }: React.PropsWithChildren<BackgroundImageAndText5Props>) {
  return (
    <div className="content-stretch flex flex-col gap-px items-start justify-center relative shrink-0">
      <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#050505] text-[12px] text-nowrap tracking-[0.72px] uppercase">{text}</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">{children}</div>
      </div>
    </div>
  );
}

function BackgroundImage6({ children }: React.PropsWithChildren<{}>) {
  return (
    <BackgroundImage8>
      <g id="Frame">{children}</g>
    </BackgroundImage8>
  );
}

function BackgroundImage5({ children }: React.PropsWithChildren<{}>) {
  return (
    <BackgroundImage8>
      <g id="Frame 2147238423">{children}</g>
    </BackgroundImage8>
  );
}

type BackgroundImage4Props = {
  text: string;
};

function BackgroundImage4({ children, text }: React.PropsWithChildren<BackgroundImage4Props>) {
  return (
    <div className="w-[160px] h-[48px] relative shrink-0">
      <div className="flex flex-col items-end justify-center size-full">
        <div className="content-stretch flex flex-col items-end justify-center px-[24px] py-[16px] relative size-full">
          <div className="content-stretch flex items-center justify-center relative shrink-0">
            <p className="font-['Inter:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#050505] text-[14px] text-nowrap tracking-[-0.182px]">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundImage3() {
  return (
    <BackgroundImage5>
      <path d={tableSvgPaths.p2d4a6700} fill="var(--fill-0, #2858FE)" id="Subtract" />
    </BackgroundImage5>
  );
}

function MoreHorizontalBackgroundImage() {
  return (
    <BackgroundImage9>
      <g id="more-horizontal">
        <path d={tableSvgPaths.p28b02980} fill="var(--fill-0, #9F9F9F)" id="path" />
      </g>
    </BackgroundImage9>
  );
}

type TdBackgroundImageAndText1Props = {
  text: string;
};

function TdBackgroundImageAndText1({ text }: TdBackgroundImageAndText1Props) {
  return (
    <div className="content-stretch flex flex-col h-[48px] items-end justify-center px-[24px] py-[16px] relative shrink-0 w-[168px]">
      <p className="font-['Inter:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#050505] text-[14px] text-nowrap text-right tracking-[-0.182px]">{text}</p>
    </div>
  );
}

type DetailsBackgroundImageAndTextProps = {
  text: string;
  status: string;
};

function DetailsBackgroundImageAndText({ text, status }: DetailsBackgroundImageAndTextProps) {
  const colorClass = status === 'Captured' ? 'text-[#058e49]' : status === 'Authorised' ? 'text-[#077ef5]' : 'text-[#e34144]';
  
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
      <p className={`font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 ${colorClass} text-[12px] text-nowrap tracking-[-0.156px]`}>{text}</p>
    </div>
  );
}

type BackgroundImageAndText4Props = {
  text: string;
};

function BackgroundImageAndText4({ text }: BackgroundImageAndText4Props) {
  return (
    <div className="content-stretch flex flex-col h-[48px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[156px]">
      <p className="font-['Inter:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#050505] text-[14px] text-nowrap tracking-[-0.182px]">{text}</p>
    </div>
  );
}

type TdBackgroundImageAndTextProps = {
  text: string;
};

function TdBackgroundImageAndText({ text }: TdBackgroundImageAndTextProps) {
  return (
    <div className="content-stretch flex h-[48px] items-center pl-[20px] pr-[24px] py-[16px] relative shrink-0 w-[168px]">
      <p className="font-['Inter:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#050505] text-[14px] text-nowrap tracking-[-0.4px]">{text}</p>
    </div>
  );
}

type BackgroundImageAndText3Props = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText3({ text, additionalClassNames = "" }: BackgroundImageAndText3Props) {
  return (
    <div className={clsx("content-stretch flex flex-col items-end justify-center px-[24px] py-[16px] relative", additionalClassNames)}>
      <p className="font-['Inter:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[12px] text-nowrap text-right tracking-[0.72px] uppercase">{text}</p>
    </div>
  );
}

type BackgroundImage2Props = {
  text: string;
  text1: string;
};

function BackgroundImage2({ text, text1 }: BackgroundImage2Props) {
  return (
    <div className="content-stretch flex gap-[4px] items-baseline leading-[normal] not-italic relative shrink-0 text-nowrap">
      <p className="font-['Inter:Medium',sans-serif] relative shrink-0 text-[#050505] text-[14px] tracking-[-0.182px]">{text}</p>
      <p className="font-['Inter:Regular',sans-serif] relative shrink-0 text-[#606c75] text-[12px] tracking-[-0.156px]">{text1}</p>
    </div>
  );
}

function BackgroundImage1() {
  return (
    <BackgroundImage8>
      <g id="Frame 2147238422">
        <path d={tableSvgPaths.p42ce500} fill="var(--fill-0, #9F9F9F)" id="Subtract" />
      </g>
    </BackgroundImage8>
  );
}

type BackgroundImageAndText2Props = {
  text: string;
};

function BackgroundImageAndText2({ text }: BackgroundImageAndText2Props) {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0">
      <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[16px] text-nowrap tracking-[-0.528px]">{text}</p>
    </div>
  );
}

function TrailingIconBackgroundImage() {
  return (
    <BackgroundImage9>
      <g id="trailing-icon">
        <path clipRule="evenodd" d={tableSvgPaths.p11e63280} fill="var(--fill-0, #050505)" fillRule="evenodd" id="path" />
      </g>
    </BackgroundImage9>
  );
}

interface TransactionRowProps {
    data: typeof transactions[0];
    onViewDetails: (id: string) => void;
}

function TransactionRow({ data, onViewDetails }: TransactionRowProps) {
  const isAuthorised = data.status === 'Authorised';
  const isFailed = data.status === 'Failed';
  const isCaptured = data.status === 'Captured';

  const badgeBg = isCaptured ? 'bg-[#e1f0e9]' : isAuthorised ? 'bg-[#e8edf8]' : 'bg-[#ffeae3]';

  return (
    <div className="content-stretch flex items-start relative shrink-0 min-w-full w-fit hover:bg-slate-50 cursor-pointer transition-colors" data-name="tr" onClick={() => onViewDetails(data.id)}>
      <div aria-hidden="true" className="absolute border-[#e4e6e7] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex items-center pl-[18px] pr-0 py-[16px] relative self-stretch shrink-0" data-name="td">
        <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
          <BackgroundImage1 />
        </div>
      </div>
      <TdBackgroundImageAndText text={data.id} />
      <BackgroundImageAndText4 text={data.rrn} />
      <div className="content-stretch flex flex-col h-[48px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[128px]" data-name="td">
        <StatusBadge status={data.status} />
      </div>
      <TdBackgroundImageAndText1 text={data.amount} />
      <BackgroundImage4 text={data.created} />
      <div className="content-stretch flex flex-col h-[48px] items-end justify-center pl-[24px] pr-[26px] py-[16px] relative shrink-0 w-[72px]" data-name="td">
        <MoreHorizontalBackgroundImage />
      </div>
    </div>
  );
}

// --- Refactored Stats Components ---

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  trendText: string;
  trendColorClass: string;
  trendStrokeColor: string;
  subtext: React.ReactNode;
  labelLine: React.ReactNode;
}

function StatCard({ title, icon, value, trendText, trendColorClass, trendStrokeColor, subtext, labelLine }: StatCardProps) {
  return (
    <TopCardGradient>
      <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
            {icon}
            <TopLabel text={title}>
              {labelLine}
            </TopLabel>
          </div>
          <div className="flex flex-row items-center self-stretch">
            <div className="content-stretch flex h-full items-end pb-[1.5px] pt-0 px-0 relative shrink-0">
              <TopChevronRight />
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
          <div className="content-stretch flex gap-[8px] items-end relative shrink-0">
            <TopValue text={value} />
            <TopTrend text={trendText} colorClass={trendColorClass} strokeColor={trendStrokeColor} />
          </div>
          {subtext}
        </div>
      </div>
    </TopCardGradient>
  );
}

function RefundsIcon() {
  return (
    <TopIconFrame>
      <path d={topSvgPaths.p3fa96280} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
    </TopIconFrame>
  );
}

function DisputesIcon() {
  return (
    <TopIconFrame>
      <path d={topSvgPaths.p232aa180} id="Vector" stroke="var(--stroke-0, #050505)" strokeWidth="1.2" />
      <path d={topSvgPaths.p27165aa0} fill="var(--fill-0, #050505)" id="Vector_2" />
      <path d={topSvgPaths.p3ee2c000} fill="var(--fill-0, #050505)" id="Vector_3" />
    </TopIconFrame>
  );
}

function FailedIcon() {
  return (
    <TopIcon16>
      <g clipPath="url(#clip0_50_9347)" id="Frame">
        <path d={topSvgPaths.p32395700} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="1.2" />
      </g>
      <defs>
        <clipPath id="clip0_50_9347">
          <rect fill="white" height="16" width="16" />
        </clipPath>
      </defs>
    </TopIcon16>
  );
}

const STATS_DATA = [
  {
    title: "Refunds",
    icon: <RefundsIcon />,
    value: "5,421",
    trendText: "2%",
    trendColorClass: "text-[#d92d20]",
    trendStrokeColor: "#D92D20",
    labelLine: (
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61 1">
        <line id="Line 1465" opacity="0.4" stroke="var(--stroke-0, #606C75)" strokeDasharray="3 3" x2="61" y1="0.5" y2="0.5" />
      </svg>
    ),
    subtext: (
      <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[12px] text-nowrap tracking-[-0.156px]">3 processed</p>
    )
  },
  {
    title: "Disputes",
    icon: <DisputesIcon />,
    value: "652",
    trendText: "2%",
    trendColorClass: "text-[#d92d20]",
    trendStrokeColor: "#D92D20",
    labelLine: (
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 1">
        <line id="Line 1465" opacity="0.4" stroke="var(--stroke-0, #606C75)" strokeDasharray="3 3" x2="64" y1="0.5" y2="0.5" />
      </svg>
    ),
    subtext: (
      <div className="content-stretch flex gap-[4px] items-center leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[12px] text-nowrap tracking-[-0.156px]">
        <p className="font-['Inter:Medium',sans-serif] relative shrink-0">0 open</p>
        <p className="font-['Inter:Regular',sans-serif] relative shrink-0">·</p>
        <p className="font-['Inter:Medium',sans-serif] relative shrink-0">0 under review</p>
      </div>
    )
  },
  {
    title: "Failed",
    icon: <FailedIcon />,
    value: "03",
    trendText: "89%",
    trendColorClass: "text-[#008743]",
    trendStrokeColor: "#008743",
    labelLine: (
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 1">
        <line id="Line 1465" opacity="0.4" stroke="var(--stroke-0, #606C75)" strokeDasharray="3 3" x2="44" y1="0.5" y2="0.5" />
      </svg>
    ),
    subtext: (
      <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[12px] text-nowrap tracking-[-0.156px]">Payments</p>
    )
  }
];

export const TransactionsList: React.FC<TransactionsListProps> = ({ onViewDetails, isRayOpen = false }) => {
  const [activeFilter, setActiveFilter] = useState("Captured");

  const filters = [
    { label: "All", count: "320" },
    { label: "Captured", count: "45" },
    { label: "Failed", count: "125" },
    { label: "Authorised", count: "64" },
    { label: "Created", count: "127" },
  ];

  const filteredTransactions = transactions.filter(t => 
    activeFilter === "All" ? true : t.status === activeFilter
  );

  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative size-full p-8 p-[0px]">
      {/* Top Content (Replaced) */}
      <div className="content-stretch flex flex-col gap-[16px] items-start relative size-full" data-name="Top content">
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        <p className="font-['TASA_Orbiter_Display:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#050505] text-[20px] text-nowrap tracking-[-0.1px]">Transactions Overview</p>
        <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
          {!isRayOpen && (
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
              <p className="font-['Inter:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[12px] text-nowrap tracking-[-0.156px]">updated 28m ago</p>
              <TopIcon12>
                <g id="refresh">
                  <g id="path">
                    <path d={topSvgPaths.p3f1141b2} fill="var(--fill-0, #606C75)" />
                    <path d={topSvgPaths.p1cdb4600} fill="var(--fill-0, #606C75)" />
                  </g>
                </g>
              </TopIcon12>
            </div>
          )}
          <div className="bg-white content-stretch flex gap-[4px] h-[32px] items-center justify-center pl-[12px] pr-[10px] py-[8px] relative rounded-[8px] shrink-0" data-name="wrapper">
            <div aria-hidden="true" className="absolute border border-[#dee1e3] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#050505] text-[12px] text-nowrap tracking-[-0.156px]">Today</p>
            <TopIcon12>
              <g id="trailing-icon">
                <path clipRule="evenodd" d={topSvgPaths.p11e63280} fill="var(--fill-0, #050505)" fillRule="evenodd" id="path" />
              </g>
            </TopIcon12>
          </div>
          {!isRayOpen && (
            <div className="bg-white content-stretch flex gap-[4px] h-[32px] items-center justify-center pl-[12px] pr-[10px] py-[8px] relative rounded-[8px] shrink-0" data-name="wrapper">
              <div aria-hidden="true" className="absolute border border-[#dee1e3] border-solid inset-0 pointer-events-none rounded-[8px]" />
              <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#050505] text-[12px] text-nowrap tracking-[-0.156px]">Documentation</p>
              <TopIcon12>
                <g id="arrow-up-right">
                  <path d={topSvgPaths.p18ee7700} fill="var(--fill-0, #050505)" id="path" />
                </g>
              </TopIcon12>
            </div>
          )}
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
        <div className="h-[164px] relative rounded-[12px] shrink-0 w-full" data-name="39" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 71.787%, rgb(247, 247, 248) 100%)" }}>
          <div className="overflow-clip relative rounded-[inherit] size-full">
            <div className="absolute bottom-[-126.07px] flex h-[181.332px] items-center justify-center right-[-165.67px] w-[498.669px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
              <div className="flex-none rotate-[350.679deg]">
                <div className="h-[103.609px] relative w-[488.336px]">
                  <div className="absolute inset-[-138.15%_-29.31%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 774.598 389.871">
                      <g filter="url(#filter0_f_50_9410)" id="Ellipse 9335">
                        <ellipse cx="387.299" cy="194.935" fill="var(--fill-0, #B8E1FF)" rx="244.168" ry="51.8045" />
                      </g>
                      <defs>
                        <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="389.871" id="filter0_f_50_9410" width="774.598" x="0" y="0">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                          <feGaussianBlur result="effect1_foregroundBlur_50_9410" stdDeviation="71.5654" />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute content-stretch flex items-center justify-between left-[20px] right-[20px] top-[16px]">
              <TopLabel text="Collected amount">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 140 1">
                  <line id="Line 1465" opacity="0.4" stroke="var(--stroke-0, #606C75)" strokeDasharray="3 3" x2="140" y1="0.5" y2="0.5" />
                </svg>
              </TopLabel>
              <div className="flex flex-row items-center self-stretch">
                <div className="content-stretch flex h-full items-end pb-[1.5px] pt-0 px-0 relative shrink-0">
                  <TopChevronRight />
                </div>
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col gap-[8px] h-[95px] items-start justify-center left-[20px] top-[52px] w-[269.441px]">
              <div className="content-stretch flex gap-[2px] items-baseline relative shrink-0">
                <div className="content-stretch flex flex-col items-center justify-center relative shrink-0">
                  <p className="font-['Inter:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#050505] text-[31px] text-nowrap tracking-[-1.023px]">₹</p>
                </div>
                <p className="font-['TASA_Orbiter_Deck:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#050505] text-[54px] text-nowrap tracking-[-1.782px]">1,20,000.00</p>
              </div>
              <div className="content-stretch flex gap-[2px] h-[24px] items-center relative shrink-0">
                <TopIconFrame>
                  <path d={topSvgPaths.pbc1f4c0} id="Vector" stroke="var(--stroke-0, #01A653)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </TopIconFrame>
                <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#01a653] text-[12px] text-nowrap tracking-[-0.156px]">Up by 20%</p>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-[200px] pointer-events-none">
                <img src={imgFolderCoins} className="w-full h-full object-contain object-bottom" alt="Collected Amount Visual" />
            </div>
            <div className="absolute flex h-[73.762px] items-center justify-center left-[116.06px] mix-blend-overlay top-[173.62px] w-[67.224px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
              <div className="flex-none rotate-[30.917deg]">
                <div className="h-[60.89px] relative w-[41.891px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                    <g id="Ellipse 9451" style={{ mixBlendMode: "overlay" }}></g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_0px_0px_2px_white,inset_0px_-1.5px_0px_1px_white]" />
          <div aria-hidden="true" className="absolute border border-[#dee1e3] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_6px_32px_4px_rgba(184,196,214,0.06)]" />
        </div>
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Transaction Split">
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Breakdown">
            {STATS_DATA.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* Table Section (Maintained) */}
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full max-w-[1124px]">
        <div className="content-stretch flex flex-col items-start relative shrink-0">
          <div className="content-stretch flex gap-[4px] items-start relative shrink-0">
            {["Payments", "Orders", "Invoices"].map((tab) => {
              const isActive = tab === "Payments"; // Hardcoded active for visual parity
              return isActive ? (
                <div key={tab} className="h-[32px] relative rounded-[8px] shrink-0" style={{ backgroundImage: "linear-gradient(rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 71.787%, rgb(247, 247, 248) 100%)" }}>
                  <div className="content-stretch flex h-full items-center justify-center overflow-clip px-[12px] py-[16px] relative rounded-[inherit]">
                    <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#050505] text-[16px] tracking-[-0.528px]">{tab}</p>
                  </div>
                  <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_1px_white,inset_0px_1.5px_0px_1px_white]" />
                  <div aria-hidden="true" className="absolute border border-[#dee1e3] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_6px_32px_4px_rgba(184,196,214,0.06)]" />
                </div>
              ) : (
                <div key={tab} className="content-stretch flex h-[32px] items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0">
                  <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[16px] tracking-[-0.528px]">{tab}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ray Insight Card */}
        <div className="w-full relative rounded-[12px] overflow-hidden bg-[rgba(18,145,208,0.06)] border border-[rgba(18,145,208,0.12)] p-[12px] flex items-center gap-[12px]">
             <div className="w-[16px] h-[16px] shrink-0 flex items-center justify-center">
                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                   <path d="M8 1L9.79 5.42L14.5 6.02L11 9.34L11.94 14L8 11.77L4.06 14L5 9.34L1.5 6.02L6.21 5.42L8 1Z" fill="#1291D0" stroke="#1291D0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
             </div>
             <div className="flex flex-col gap-[4px]">
                 <span className="text-[14px] font-medium text-[#1291D0]">Ray Insight</span>
                 <p className="text-[15px] leading-[24px] text-[#40566d]">
                     30% of your failed payments this week were due to <span className="font-medium text-[#192839]">insufficient funds</span>.
                 </p>
             </div>
             <div className="ml-auto">
                <button className="text-[#305EFF] text-[13px] font-medium leading-[20px] px-3 py-1.5 hover:bg-[#305EFF]/10 rounded-md transition-colors">
                     View Analysis
                 </button>
             </div>
        </div>
        <div className="bg-[#f8f8f8] relative rounded-[12px] shrink-0 w-full">
          <div className="content-stretch flex flex-col items-start overflow-x-auto relative rounded-[inherit] w-full">
            <div className="h-[56px] relative shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center justify-between p-[12px] relative size-full">
                  <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
                    {filters.map((filter) => {
                      const isActive = activeFilter === filter.label;
                      return (
                        <div 
                          key={filter.label}
                          onClick={() => setActiveFilter(filter.label)}
                          className={clsx(
                            "h-[32px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200",
                            isActive ? "bg-white" : "content-stretch flex gap-[4px] items-center overflow-clip px-[8px] py-[6px]"
                          )}
                        >
                          {isActive ? (
                            <>
                              <div className="content-stretch flex gap-[4px] h-full items-center justify-center overflow-clip pl-[8px] pr-[10px] py-[6px] relative rounded-[inherit]">
                                <div className="content-stretch flex items-center relative shrink-0">
                                  <BackgroundImage5>
                                    <path d={tableSvgPaths.p2d4a6700} fill="var(--fill-0, #305EFF)" id="Subtract" />
                                  </BackgroundImage5>
                                </div>
                                <div className="content-stretch flex gap-[4px] items-baseline leading-[normal] not-italic relative shrink-0 text-[#305eff] text-nowrap">
                                  <p className="font-['Inter:SemiBold',sans-serif] relative shrink-0 text-[14px] tracking-[-0.182px]">{filter.label}</p>
                                  <p className="font-['Inter:Regular',sans-serif] relative shrink-0 text-[12px] tracking-[-0.156px]">{filter.count}</p>
                                </div>
                              </div>
                              <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.02)]" />
                              <div aria-hidden="true" className="absolute border border-[#2858fe] border-solid inset-0 pointer-events-none rounded-[8px]" />
                            </>
                          ) : (
                            <>
                              <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
                                <BackgroundImage1 />
                              </div>
                              <BackgroundImage2 text={filter.label} text1={filter.count} />
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="right-section">
                    <div className="bg-white relative rounded-[8px] shrink-0 size-[32px]">
                      <div className="content-stretch flex items-center justify-between overflow-clip px-[8px] py-0 relative rounded-[inherit] size-full">
                        <div className="relative shrink-0 size-[14px]" data-name="filter">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                            <g id="filter">
                              <path clipRule="evenodd" d={tableSvgPaths.p3e900c80} fill="var(--fill-0, #050505)" fillRule="evenodd" id="path" />
                            </g>
                          </svg>
                        </div>
                      </div>
                      <div aria-hidden="true" className="absolute border border-[#e7e7e7] border-solid inset-0 pointer-events-none rounded-[8px]" />
                    </div>
                    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-[180px]">
                      <div className="content-stretch flex items-center justify-between overflow-clip pl-[8px] pr-[10px] py-0 relative rounded-[inherit] size-full">
                        <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
                          <div className="overflow-clip relative shrink-0 size-[14px]" data-name="Frame">
                            <div className="absolute left-[calc(50%+0.06px)] size-[10.125px] top-[calc(50%+0.06px)] translate-x-[-50%] translate-y-[-50%]">
                              <div className="absolute inset-[-5.93%]">
                                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.325 11.325">
                                  <g id="Group 2147233780">
                                    <path d={tableSvgPaths.p1a97c780} id="Vector" stroke="var(--stroke-0, #606C75)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                                    <path d="M8.6625 8.6625L10.725 10.725" id="Vector_2" stroke="var(--stroke-0, #606C75)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <p className="font-['Inter:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[12px] text-nowrap tracking-[-0.156px]">Search...</p>
                        </div>
                        <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0">
                          <p className="font-['Inter:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#050505] text-[12px] text-nowrap tracking-[-0.156px]">RRN</p>
                          <TrailingIconBackgroundImage />
                        </div>
                      </div>
                      <div aria-hidden="true" className="absolute border border-[#e7e7e7] border-solid inset-0 pointer-events-none rounded-[8px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start pb-[8px] pt-0 px-0 relative shadow-[0px_2px_2px_1px_rgba(65,65,65,0.04)] shrink-0 w-full bg-white">
              <div className="content-stretch flex flex-col items-start mb-[-8px] relative shrink-0 min-w-full w-fit" data-name="table">
                <div className="relative shrink-0 min-w-full w-fit" data-name="tbody">
                  <div className="flex flex-col justify-center rounded-[inherit] min-w-full w-fit h-full">
                    <div className="content-stretch flex flex-col items-start justify-center px-[2px] py-0 relative min-w-full w-fit">
                      <div className="bg-white content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 min-w-full w-fit">
                        <div className="content-stretch flex h-[36px] items-start relative shrink-0 min-w-full w-fit" data-name="tr">
                          <div aria-hidden="true" className="absolute border-[#e4e6e7] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                          <div className="content-stretch flex h-full items-center pl-[18px] pr-0 py-[16px] relative shrink-0" data-name="td">
                            <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
                              <BackgroundImage1 />
                            </div>
                          </div>
                          <div className="content-stretch flex h-full items-center pl-[20px] pr-[24px] py-[16px] relative shrink-0 w-[168px]" data-name="td">
                            <p className="font-['Inter:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[12px] text-nowrap tracking-[0.72px] uppercase">Payment ID</p>
                          </div>
                          <div className="content-stretch flex flex-col h-full items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[156px]" data-name="td">
                            <p className="font-['Inter:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[12px] text-nowrap tracking-[0.72px] uppercase">Bank RRN</p>
                          </div>
                          <div className="content-stretch flex flex-col h-full items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[128px]" data-name="td">
                            <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="details">
                              <p className="font-['Inter:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[12px] text-nowrap tracking-[0.72px] uppercase">Status</p>
                            </div>
                          </div>
                          <BackgroundImageAndText3 text="Amount" additionalClassNames="h-full shrink-0 w-[168px]" />
                          <div className="w-[160px] h-full relative shrink-0" data-name="td">
                            <div className="flex flex-col items-end justify-center size-full">
                              <BackgroundImageAndText3 text="Created" additionalClassNames="size-full" />
                            </div>
                          </div>
                          <div className="content-stretch flex flex-col h-full items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[72px]" data-name="td">
                            <BackgroundImage9>
                              <g id="more-horizontal" opacity="0">
                                <path d={tableSvgPaths.p28b02980} fill="var(--fill-0, #768EA7)" id="path" />
                              </g>
                            </BackgroundImage9>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-col items-start relative shrink-0 min-w-full w-fit">
                          <AnimatePresence mode="popLayout" initial={false}>
                            {filteredTransactions.map((transaction) => (
                              <motion.div
                                key={`${transaction.id}-${transaction.created}`}
                                layout
                                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)", transition: { duration: 0.15 } }}
                                transition={{ 
                                  type: "spring", 
                                  stiffness: 450, 
                                  damping: 35, 
                                  mass: 1 
                                }}
                                className="w-full"
                              >
                                <TransactionRow data={transaction} onViewDetails={onViewDetails} />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative shrink-0 w-full" data-name="tfooter">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex items-center justify-between px-[20px] py-[8px] relative w-full">
                      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                        <p className="font-['Inter:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[12px] text-nowrap tracking-[-0.156px]">Showing</p>
                        <div className="bg-white content-stretch flex gap-[2px] h-[28px] items-center justify-center pl-[8px] pr-[6px] py-[8px] relative rounded-[8px] shrink-0" data-name="button-xsmall">
                          <div aria-hidden="true" className="absolute border border-[#e7e7e7] border-solid inset-0 pointer-events-none rounded-[8px]" />
                          <p className="font-['Inter:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[12px] text-nowrap tracking-[-0.156px]">10</p>
                          <BackgroundImage9>
                            <g id="chevron-down">
                              <path clipRule="evenodd" d={tableSvgPaths.p11e63280} fill="var(--fill-0, #606C75)" fillRule="evenodd" id="path" />
                            </g>
                          </BackgroundImage9>
                        </div>
                        <p className="font-['Inter:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606c75] text-[12px] text-nowrap tracking-[-0.156px]">of 240</p>
                      </div>
                      <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="pagination">
                        <div className="bg-white content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0 size-[28px]" data-name="button-xsmall">
                          <div aria-hidden="true" className="absolute border border-[#e7e7e7] border-solid inset-0 pointer-events-none rounded-[8px]" />
                          <BackgroundImage10>
                            <g id="chevron-left">
                              <path clipRule="evenodd" d={tableSvgPaths.p18afd780} fill="var(--fill-0, #606C75)" fillRule="evenodd" id="path" />
                            </g>
                          </BackgroundImage10>
                        </div>
                        <div className="bg-white content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0 size-[28px]" data-name="button-xsmall">
                          <div aria-hidden="true" className="absolute border border-[#e7e7e7] border-solid inset-0 pointer-events-none rounded-[8px]" />
                          <BackgroundImage10>
                            <g id="chevron-right">
                              <path clipRule="evenodd" d={topSvgPaths.p361df540} fill="var(--fill-0, #606C75)" fillRule="evenodd" id="path" />
                            </g>
                          </BackgroundImage10>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-1.5px_0px_1px_white,inset_0px_1.5px_0px_1px_rgba(255,255,255,0.7)]" />
          <div aria-hidden="true" className="absolute border border-[#e4e6e7] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_6px_32px_4px_rgba(184,196,214,0.08)]" />
        </div>
      </div>
    </div>
  );
}
