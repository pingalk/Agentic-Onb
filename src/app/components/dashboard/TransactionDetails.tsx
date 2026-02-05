import React from 'react';
import svgPaths from "../../../imports/svg-mr37vl21kr";
import Ray from "../../../imports/Ray";
import { clsx } from "clsx";
import { X } from "lucide-react";
import imgRectangle2410 from "figma:asset/d024c6efab0c4bd636928982d221175aaae5198f.png";

interface TransactionDetailsProps {
    id?: string;
    onBack?: () => void;
    hideTimeline?: boolean;
}

function Wrapper5({ children }: React.PropsWithChildren<{}>) {
  return (
    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 20 20" className="block size-full">
      <g id="Substate">{children}</g>
    </svg>
  );
}

function Wrapper4({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        {children}
      </svg>
    </div>
  );
}
type Wrapper3Props = {
  additionalClassNames?: string;
};

function Wrapper3({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper3Props>) {
  return (
    <div className={clsx("h-0 relative", additionalClassNames)}>
      <div className="absolute inset-[-0.5px_0]" style={{ "--stroke-0": "rgba(108, 132, 157, 1)" } as React.CSSProperties}>
        {children}
      </div>
    </div>
  );
}

function Wrapper2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        {children}
      </svg>
    </div>
  );
}

function Wrapper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper2>
      <g id="icon">{children}</g>
    </Wrapper2>
  );
}

// Replaced fixed-width SVG wrapper with responsive div
function Divider({ isDashed = false }: { isDashed?: boolean }) {
  return (
    <div className={clsx("w-full h-px relative shrink-0", isDashed ? "border-t border-dashed border-[#6C849D] opacity-[0.18]" : "bg-[#6C849D] opacity-[0.18]")} />
  );
}

type Group3015172HelperProps = {
  additionalClassNames?: string;
};

function Group3015172Helper({ additionalClassNames = "" }: Group3015172HelperProps) {
  return (
    <div style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties} className={clsx("[grid-area:1_/_1] flex h-[52px] items-center justify-center ml-[10px] relative w-0", additionalClassNames)}>
      <div className="flex-none rotate-[90deg]">
        <Wrapper3 additionalClassNames="w-[52px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 1">
            <path d="M0 0.5H52" id="Line 221" stroke="var(--stroke-0, #6C849D)" strokeOpacity="0.18" />
          </svg>
        </Wrapper3>
      </div>
    </div>
  );
}
type HelperProps = {
  text: string;
  text1: string;
};

function Helper({ text, text1 }: HelperProps) {
  return (
    <div className="content-stretch flex gap-[6px] items-start relative shrink-0 text-[14px] w-full flex-wrap">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-medium justify-center relative shrink-0 text-[#192839]">
        <p className="leading-[20px] text-nowrap">{text}</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] justify-center relative shrink-0 text-[#40566d]">
        <p className="leading-[20px] text-nowrap">{text1}</p>
      </div>
    </div>
  );
}

function Clock() {
  return (
    <Wrapper4>
      <g id="clock">
        <g id="path">
          <path d={svgPaths.p30f4d900} fill="var(--fill-0, #C65C10)" />
          <path clipRule="evenodd" d={svgPaths.p303f9e40} fill="var(--fill-0, #C65C10)" fillRule="evenodd" />
        </g>
      </g>
    </Wrapper4>
  );
}

function Check() {
  return (
    <Wrapper4>
      <g id="check">
        <path clipRule="evenodd" d={svgPaths.p1d8ed000} fill="var(--fill-0, #008743)" fillRule="evenodd" id="path" />
      </g>
    </Wrapper4>
  );
}
type Text5Props = {
  text: string;
};

function Text5({ text }: Text5Props) {
  return (
    <div className="content-stretch flex gap-[6px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#192839] text-[14px] whitespace-normal">
        <p className="leading-[20px]">{text}</p>
      </div>
    </div>
  );
}
type Text4Props = {
  text: string;
};

function Text4({ text }: Text4Props) {
  return (
    <div className="content-stretch flex items-baseline opacity-[0.64] relative shrink-0">
      <p className="font-['Inter:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#192839] text-[10px] text-nowrap text-right">{text}</p>
    </div>
  );
}
type TitleText1Props = {
  text: string;
};

function TitleText1({ text }: TitleText1Props) {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[200px] sm:w-[140px]">
      <p className="font-['Inter:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#40566d] text-[14px] text-nowrap">{text}</p>
    </div>
  );
}
type ValueTextProps = {
  text: string;
};

function ValueText({ text }: ValueTextProps) {
  return (
    <div className="content-stretch flex gap-[4px] items-center w-full">
      <p className="font-['Inter:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#192839] text-[14px] whitespace-normal break-words w-full">{text}</p>
    </div>
  );
}

function IconWrapper() {
  return (
    <Wrapper4>
      <g id="icon-wrapper">
        <path d={svgPaths.p248ccd00} fill="var(--fill-0, #2950DA)" id="Union" />
      </g>
    </Wrapper4>
  );
}
type TitleTextProps = {
  text: string;
};

function TitleText({ text }: TitleTextProps) {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[200px] sm:w-[140px]">
      <p className="font-['Inter:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#40566d] text-[14px] text-nowrap">{text}</p>
      <Wrapper2>
        <g id="leadingIcon">
          <g id="path">
            <path d={svgPaths.p1cfc0d00} fill="var(--fill-0, #768EA7)" />
            <path d={svgPaths.p3d5cc00} fill="var(--fill-0, #768EA7)" />
            <path clipRule="evenodd" d={svgPaths.p5dfc700} fill="var(--fill-0, #768EA7)" fillRule="evenodd" />
          </g>
        </g>
      </Wrapper2>
    </div>
  );
}
type HeadingTextProps = {
  text: string;
};

function HeadingText({ text }: HeadingTextProps) {
  return (
    <div className="basis-0 content-stretch flex grow items-start min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#192839] text-[16px] text-nowrap">
        <p className="leading-[24px]">{text}</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <Wrapper1>
      <path d={svgPaths.p2a77d300} fill="var(--fill-0, #2950DA)" id="Union" />
    </Wrapper1>
  );
}
type Text3Props = {
  text: string;
};

function Text3({ text }: Text3Props) {
  return (
    <div className="content-stretch flex items-baseline opacity-[0.64] relative shrink-0">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#192839] text-[10px] text-nowrap text-right">{text}</p>
    </div>
  );
}

type Text2Props = {
  text: string;
};

function Text2({ text }: Text2Props) {
  return (
    <div className="content-stretch flex items-baseline opacity-[0.64] relative shrink-0">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#d92d20] text-[10px] text-nowrap text-right">{text}</p>
    </div>
  );
}
type Text1Props = {
  text: string;
};

function Text1({ text }: Text1Props) {
  return (
    <div className="content-stretch flex items-baseline opacity-[0.64] relative shrink-0">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#008743] text-[10px] text-nowrap text-right">{text}</p>
    </div>
  );
}
type TextProps = {
  text: string;
  additionalClassNames?: string;
};

function Text({ text, additionalClassNames = "" }: TextProps) {
  return (
    <div className={clsx("content-stretch flex items-center relative shrink-0", additionalClassNames)}>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#40566d] text-[14px] text-nowrap">{text}</p>
    </div>
  );
}
type LabelTextProps = {
  text: string;
};

function LabelText({ text }: LabelTextProps) {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2950da] text-[12px] text-center text-nowrap">
        <p className="leading-[18px]">{text}</p>
      </div>
    </div>
  );
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({ id, onBack, hideTimeline = false }) => {
  return (
    <div className="w-full flex justify-center p-8 bg-slate-50 min-h-full p-[0px]">
    <div className="content-stretch flex flex-col gap-[12px] items-start relative w-full max-w-[1000px]">
      <div className="content-stretch flex flex-col lg:flex-row gap-[16px] items-start relative shrink-0 w-full">
        {/* Left Column */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full lg:flex-1 min-w-0">
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="bg-white content-stretch flex flex-col items-start p-[24px] relative rounded-[4px] shrink-0 w-full" data-name="Card">
              <div aria-hidden="true" className="absolute border border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-[4px]" />
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="card-content-holder">
                <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="card-body">
                  <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative rounded-[4px] shrink-0" data-name="Identifier card content">
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                        <div className="relative shrink-0 size-[60px]" data-name="State">
                          <div className="absolute bg-[rgba(217,45,32,0.09)] content-stretch flex inset-0 items-start overflow-clip p-[14px] rounded-[4px]">
                            <div className="relative shrink-0 size-[32px]" data-name="close">
                              <X size={32} color="#D92D20" strokeWidth={2.5} />
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 flex-1 min-w-0">
                          <div className="content-stretch flex gap-[8px] items-center relative shrink-0 flex-wrap">
                            <div className="content-stretch flex items-end justify-end relative shrink-0" data-name="Amount">
                              <div className="content-stretch flex items-baseline relative shrink-0" data-name="root">
                                <div className="content-stretch flex gap-[2px] items-baseline relative shrink-0" data-name="_AmountBase">
                                  <div className="content-stretch flex items-baseline opacity-[0.64] relative shrink-0" data-name="currency-symbol-container">
                                    <p className="font-['Inter:SemiBold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[#192839] text-[20px] text-nowrap text-right">₹</p>
                                  </div>
                                  <div className="content-stretch flex items-baseline relative shrink-0" data-name="value-container">
                                    <div className="content-stretch flex items-baseline relative shrink-0" data-name="main-value-container">
                                      <p className="font-['TASA_Orbiter_Display:SemiBold',sans-serif] leading-[38px] not-italic relative shrink-0 text-[#192839] text-[32px] text-nowrap text-right">1,000</p>
                                    </div>
                                    <div className="content-stretch flex items-baseline opacity-[0.64] relative shrink-0" data-name="decimal-container">
                                      <p className="font-['TASA_Orbiter_Display:SemiBold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[#192839] text-[20px] text-nowrap text-right">.00</p>
                                    </div>
                                  </div>
                                  <p className="absolute font-['Inter:Regular',sans-serif] leading-[14px] left-[21px] not-italic opacity-0 text-[#192839] text-[10px] text-nowrap text-right top-0 translate-x-[-100%]">INR</p>
                                </div>
                              </div>
                            </div>
                            <div className="content-stretch flex items-start overflow-clip relative shrink-0" data-name="Badge/failed">
                              <div className="content-stretch flex flex-col items-start justify-center relative rounded-[4px] shrink-0" data-name="root">
                                <div className="bg-[rgba(217,45,32,0.09)] content-stretch flex gap-[4px] h-[24px] items-center px-[12px] py-0 relative rounded-[1000px] shrink-0" data-name="wrapper">
                                  <p className="font-['Inter:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#d92d20] text-[12px] text-nowrap">Failed</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col font-['Lato:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#192839] text-[0px] w-[min-content]">
                            <p className="font-['Inter:Regular',sans-serif] whitespace-normal">
                              <span className="leading-[24px] text-[16px]">{`Created on Thu Feb 2, `}</span>
                              <span className="leading-[20px] text-[#768ea7] text-[14px]">12:17am</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Ray Explanation Block */}
                      <div className="w-full mt-2 p-3 bg-gradient-to-r from-[#F0F5FF] to-white border border-[#DEE1E3] rounded-lg flex gap-3 items-start">
                        <div className="w-5 h-5 shrink-0 mt-0.5">
                            <Ray />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#192839] text-sm leading-5 font-medium">
                                Payment failed due to mismatch in account details.
                            </p>
                            <p className="text-[#64748B] text-sm leading-5">
                                Ask the customer to check their details and retry.
                            </p>
                            <div className="flex gap-3 mt-1">
                                <button className="text-[#2950DA] text-xs font-medium hover:underline">
                                    Send payment link
                                </button>
                                <button className="text-[#2950DA] text-xs font-medium hover:underline">
                                    View error codes
                                </button>
                            </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Hidden Section */}
            {/*
            <div className="bg-white content-stretch flex flex-col items-start relative rounded-[4px] shrink-0 w-full" data-name="Card">
              <div aria-hidden="true" className="absolute border border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-[4px]" />
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="card-content-holder">
                <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="card-body">
                  <div className="basis-0 content-stretch flex flex-col grow items-center justify-center min-h-px min-w-px relative rounded-[4px] shrink-0" data-name="Slot">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Amount breakup content">
                      <div className="bg-white relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" data-name="Breakup">
                        <div className="content-stretch flex flex-col items-start overflow-clip pb-[12px] pt-[16px] px-[16px] relative rounded-[inherit] w-full">
                          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full">
                            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                              <Text text="Gross amount" additionalClassNames="gap-[2px]" />
                              <div className="content-stretch flex items-end justify-end relative shrink-0" data-name="Amount">
                                <div className="content-stretch flex items-baseline relative shrink-0" data-name="root">
                                  <div className="content-stretch flex gap-[2px] items-baseline relative shrink-0" data-name="_AmountBase">
                                    <Text1 text="₹" />
                                    <div className="content-stretch flex items-baseline relative shrink-0" data-name="value-container">
                                      <div className="content-stretch flex items-baseline relative shrink-0" data-name="main-value-container">
                                        <p className="font-['Inter:Semi_Bold',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#008743] text-[14px] text-nowrap text-right">5,000</p>
                                      </div>
                                      <Text1 text=".00" />
                                    </div>
                                    <p className="absolute font-['Inter:Regular',sans-serif] leading-[14px] left-[21px] not-italic opacity-0 text-[#008743] text-[10px] text-nowrap text-right top-0 translate-x-[-100%]">INR</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Divider isDashed />
                            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                              <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                                <Text text="Deductions" />
                                <div className="relative shrink-0 size-[16px]" data-name="chevron-down">
                                  <div className="absolute inset-[0_-18.75%_0_0]">
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 16">
                                      <g id="chevron-down">
                                        <path clipRule="evenodd" d={svgPaths.p2b042d70} fill="var(--fill-0, #40566D)" fillRule="evenodd" id="path" />
                                      </g>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="content-stretch flex items-end justify-end relative shrink-0" data-name="Amount">
                                <div className="content-stretch flex items-baseline relative shrink-0" data-name="root">
                                  <div className="content-stretch flex gap-[2px] items-baseline relative shrink-0" data-name="_AmountBase">
                                    <Text2 text="₹" />
                                    <div className="content-stretch flex items-baseline relative shrink-0" data-name="value-container">
                                      <div className="content-stretch flex items-baseline relative shrink-0" data-name="main-value-container">
                                        <p className="font-['Inter:Semi_Bold',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#d92d20] text-[14px] text-nowrap text-right">200</p>
                                      </div>
                                      <Text2 text=".00" />
                                    </div>
                                    <p className="absolute font-['Inter:Regular',sans-serif] leading-[14px] left-[21px] not-italic opacity-0 text-[#d92d20] text-[10px] text-nowrap text-right top-0 translate-x-[-100%]">INR</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Divider />
                            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                              <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                                <p className="font-['Inter:Semi_Bold',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#192839] text-[14px] text-nowrap">Net amount</p>
                              </div>
                              <div className="content-stretch flex items-end justify-end relative shrink-0" data-name="Amount">
                                <div className="content-stretch flex items-baseline relative shrink-0" data-name="root">
                                  <div className="content-stretch flex gap-[2px] items-baseline relative shrink-0" data-name="_AmountBase">
                                    <Text3 text="₹" />
                                    <div className="content-stretch flex items-baseline relative shrink-0" data-name="value-container">
                                      <div className="content-stretch flex items-baseline relative shrink-0" data-name="main-value-container">
                                        <p className="font-['Inter:Semi_Bold',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#192839] text-[14px] text-nowrap text-right">1,000</p>
                                      </div>
                                      <Text3 text=".00" />
                                    </div>
                                    <p className="absolute font-['Inter:Regular',sans-serif] leading-[14px] left-[21px] not-italic opacity-0 text-[#192839] text-[10px] text-nowrap text-right top-0 translate-x-[-100%]">INR</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div aria-hidden="true" className="absolute border border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-tl-[4px] rounded-tr-[4px]" />
                      </div>
                      <div className="bg-[#f1f5fa] content-stretch flex flex-col items-start px-[16px] py-[12px] relative rounded-bl-[4px] rounded-br-[4px] shrink-0 w-full" data-name="Footer">
                        <div aria-hidden="true" className="absolute border-[0px_1px_1px] border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-bl-[4px] rounded-br-[4px]" />
                        <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full flex-wrap">
                          <p className="font-['Inter:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#40566d] text-[12px] whitespace-normal">Net amount to be deposited in your bank account by Jan 17</p>
                          <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
                            <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="root">
                              <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="wrapper">
                                <LabelText text="settlement cycle" />
                                <div className="content-stretch flex items-center relative shrink-0" data-name="trailing-icon">
                                  <Icon />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            */}
          </div>
          <div className="bg-white content-stretch flex flex-col items-start relative rounded-[4px] shrink-0 w-full" data-name="Card">
            <div aria-hidden="true" className="absolute border border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-[4px]" />
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="card-content-holder">
              <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="card-body">
                <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Slot">
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Payment Card/Desktop">
                    <div className="bg-[rgba(108,132,157,0.09)] content-stretch flex gap-[8px] h-[56px] items-center pl-[20px] pr-[16px] py-[16px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" data-name="Header">
                      <HeadingText text="Details" />
                    </div>
                    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start px-[20px] py-[16px] relative rounded-bl-[4px] rounded-br-[4px] shrink-0 w-full" data-name="Body">
                      <div aria-hidden="true" className="absolute border-[0px_1px_1px] border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-bl-[4px] rounded-br-[4px]" />
                      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Default State">
                        <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="List Item">
                          <TitleText text="Payment ID" />
                          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 flex-1 min-w-0" data-name="Value list">
                            <div className="h-[20px] relative shrink-0 w-full" data-name="Value">
                              <div className="absolute content-stretch flex gap-[4px] items-center left-0 top-0 w-full" data-name="value">
                                <p className="font-['Inter:Semi_Bold',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#192839] text-[14px] truncate">pay_LM93MI0K4sEmbQ</p>
                                <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="copy">
                                  <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="root">
                                    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="wrapper">
                                      <IconWrapper />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Divider />
                        <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="List Item">
                          <TitleText text="Bank RRN" />
                          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 flex-1 min-w-0" data-name="Value list">
                            <div className="h-[20px] relative shrink-0 w-full" data-name="Value">
                              <ValueText text="123456789012" />
                            </div>
                          </div>
                        </div>
                        <Divider />
                        <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="List Item">
                          <TitleText text="Order ID" />
                          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 flex-1 min-w-0" data-name="Value list">
                            <div className="h-[20px] relative shrink-0 w-full" data-name="Value">
                              <div className="absolute content-stretch flex gap-[4px] items-center left-0 top-0 w-full" data-name="value">
                                <p className="font-['Inter:Semi_Bold',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#192839] text-[14px] truncate">order_usfeiufgey3247</p>
                                <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="copy">
                                  <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="root">
                                    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="wrapper">
                                      <IconWrapper />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Divider />
                        <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="List Item">
                          <TitleText1 text="Payment method" />
                          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 flex-1 min-w-0" data-name="Value list">
                            <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Value">
                              <p className="font-['Inter:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#192839] text-[14px] text-nowrap">Credit Card</p>
                              <div className="content-stretch flex gap-[4px] items-start relative shrink-0">
                                <p className="font-['Inter:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#40566d] text-[14px] text-nowrap">(</p>
                                <div className="h-[18px] relative rounded-[4px] shrink-0 w-[30px]">
                                  <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[4px] size-full" src={imgRectangle2410} />
                                </div>
                                <p className="font-['Inter:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#40566d] text-[14px] text-nowrap">xxxx3456)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Divider />
                        <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="List Item">
                          <TitleText1 text="Customer details" />
                          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 flex-1 min-w-0" data-name="Value list">
                            <div className="h-[20px] relative shrink-0 w-full" data-name="Value">
                              <ValueText text="Aditi Arora" />
                            </div>
                            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Value">
                              <Wrapper4>
                                <g id="phone">
                                  <path clipRule="evenodd" d={svgPaths.p36b4c680} fill="var(--fill-0, #192839)" fillRule="evenodd" id="path" />
                                </g>
                              </Wrapper4>
                              <p className="font-['Inter:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#192839] text-[14px] text-nowrap">+91-8976047563</p>
                            </div>
                            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Value">
                              <Wrapper4>
                                <g id="mail">
                                  <path clipRule="evenodd" d={svgPaths.p6f0b900} fill="var(--fill-0, #192839)" fillRule="evenodd" id="path" />
                                </g>
                              </Wrapper4>
                              <p className="font-['Inter:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#192839] text-[14px] text-nowrap">aditi.a@razorpay.com</p>
                            </div>
                          </div>
                        </div>
                        <Divider />
                        <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="List Item">
                          <TitleText1 text="Fee bearer" />
                          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 flex-1 min-w-0" data-name="Value list">
                            <div className="h-[20px] relative shrink-0 w-full" data-name="Value">
                              <ValueText text="You pay the Razorpay platform fee" />
                            </div>
                          </div>
                        </div>
                        <Divider />
                        <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="List Item">
                          <TitleText1 text="Description" />
                          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 flex-1 min-w-0" data-name="Value list">
                            <div className="h-[20px] relative shrink-0 w-full" data-name="Value">
                              <ValueText text="--" />
                            </div>
                          </div>
                        </div>
                        <Divider />
                        <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="List Item">
                          <TitleText1 text="Notes" />
                          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 flex-1 min-w-0" data-name="Value list">
                            <div className="h-[20px] relative shrink-0 w-full" data-name="Value">
                              <ValueText text="--" />
                            </div>
                          </div>
                        </div>
                        <Divider />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white content-stretch flex flex-col items-start relative rounded-[4px] shrink-0 w-full" data-name="Card">
            <div aria-hidden="true" className="absolute border border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-[4px]" />
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="card-content-holder">
              <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="card-body">
                <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Refund Card">
                  <div className="bg-[rgba(108,132,157,0.09)] content-stretch flex gap-[8px] h-[56px] items-center pl-[20px] pr-[16px] py-[16px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" data-name="Header">
                    <HeadingText text="Refund" />
                  </div>
                  <div className="bg-white content-stretch flex flex-col gap-[16px] items-start px-[20px] py-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Body">
                    <div aria-hidden="true" className="absolute border-[0px_1px] border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-[2px]" />
                    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                         <div className="flex flex-col gap-4 w-full">
                            <p className="font-['Inter:Regular',sans-serif] text-[#192839] text-[14px]">No refunds issued for this payment</p>
                            <div className="content-stretch flex items-center relative shrink-0 w-max cursor-pointer">
                                <LabelText text="Issue refund" />
                            </div>
                         </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column (Timeline) */}
        {!hideTimeline && (
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 hidden lg:inline-grid">
          <div className="[grid-area:1_/_1] bg-white border border-[rgba(108,132,157,0.18)] border-solid h-[1334px] ml-0 mt-0 rounded-[4px] w-[334px]" />
          <div className="[grid-area:1_/_1] content-stretch flex gap-[4px] items-start ml-[16px] mt-[16px] relative" data-name="Heading">
            <p className="font-['TASA_Orbiter_Display:SemiBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#192839] text-[18px] w-[240px]">Timeline</p>
          </div>
          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[16px] mt-[76px] place-items-start relative">
            <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[40px] items-start ml-0 mt-0 relative">
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-name="TImeline molecule/default">
                <div className="bg-[rgba(0,162,81,0.09)] content-stretch flex items-center justify-center p-[4px] relative rounded-[100px] shrink-0 size-[20px]" data-name="State">
                  <Check />
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[262px]" data-name="Timeline atom">
                  <Text5 text="Payment created" />
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#40566d] text-[12px] w-full">
                    <p className="leading-[18px]">Thu Feb 2, 2023, 12:17am</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-name="TImeline molecule/default">
                <div className="bg-[rgba(217,45,32,0.09)] content-stretch flex items-center justify-center p-[4px] relative rounded-[100px] shrink-0 size-[20px]" data-name="State">
                   <div className="relative shrink-0 size-[16px]" data-name="close">
                      <X size={12} color="#D92D20" strokeWidth={3} />
                   </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[262px]" data-name="Timeline atom">
                  <Text5 text="Payment failed" />
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#40566d] text-[12px] w-full">
                    <p className="leading-[18px]">Fri Feb 19, 2023, 1:12pm</p>
                  </div>
                </div>
              </div>
            </div>
            <Group3015172Helper additionalClassNames="mt-[24px]" />
            <Group3015172Helper additionalClassNames="mt-[104px]" />
            <Group3015172Helper additionalClassNames="mt-[184px]" />
            <div className="[grid-area:1_/_1] flex h-[92px] items-center justify-center ml-[10px] mt-[264px] relative w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
              <div className="flex-none rotate-[90deg]">
                <Wrapper3 additionalClassNames="w-[92px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 92 1">
                    <path d="M0 0.5H92" id="Line 225" stroke="var(--stroke-0, #6C849D)" strokeOpacity="0.18" />
                  </svg>
                </Wrapper3>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
