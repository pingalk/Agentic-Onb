import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import svgPaths from "../../../imports/svg-zsawxnofnb";
import { useFormStore } from './FormStore';
import Ray from '../../../imports/Ray';

function StepCount({ count }: { count: number }) {
  return (
    <div className="bg-[#222] relative rounded-[100px] shrink-0 size-[24px]">
      <p className="absolute font-['Inter'] font-medium leading-[20px] left-[calc(50%-3.5px)] not-italic text-[14px] text-white top-[calc(50%-10px)]">
        {count}
      </p>
    </div>
  );
}

function Subtext({ text }: { text: string }) {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Inter'] font-normal leading-[18px] not-italic relative shrink-0 text-[#222] text-[12px]">
        {text}
      </p>
    </div>
  );
}

function StepContent({ title, text }: { title: string, text: string }) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <p className="font-['Inter'] font-medium leading-[20px] not-italic relative shrink-0 text-[#222] text-[14px]">
        {title}
      </p>
      <Subtext text={text} />
    </div>
  );
}

function MainContent({ count, title, text }: { count: number, title: string, text: string }) {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <StepCount count={count} />
      <StepContent title={title} text={text} />
    </div>
  );
}

function ChangeButton({ onClick }: { onClick: () => void }) {
  return (
    <button 
        onClick={onClick}
        className="bg-[rgba(108,132,157,0.12)] content-stretch flex gap-[4px] h-[32px] items-center justify-center px-[12px] relative rounded-[4px] shrink-0 hover:bg-[rgba(108,132,157,0.2)] transition-colors"
    >
      <div className="flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#192839] text-[12px] text-center">
        <p className="leading-[18px]">Change</p>
      </div>
    </button>
  );
}

function Step({ count, title, text, onEdit }: { count: number, title: string, text: string, onEdit: () => void }) {
  return (
    <div className="bg-white relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-between px-[4px] py-[12px] relative w-full">
          <MainContent count={count} title={title} text={text} />
          <ChangeButton onClick={onEdit} />
        </div>
      </div>
    </div>
  );
}

// --- Icons & Graphics ---

function PlusIcon() {
  return (
    <div className="absolute left-1/2 size-[20px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <path d={svgPaths.p83dad00} fill="#768EA7" />
      </svg>
    </div>
  );
}

function MicIcon() {
  return (
    <div className="absolute left-1/2 size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g>
          <path clipRule="evenodd" d={svgPaths.p36c9dec0} fill="#768EA7" fillRule="evenodd" />
          <path d={svgPaths.p6ec300} fill="#768EA7" />
        </g>
      </svg>
    </div>
  );
}

function SendIcon() {
    return (
        <div className="flex-none rotate-[180deg]">
             {/* Using the same frame approach as original code for the gradient button */}
            <div className="relative size-[16px]">
                <div className="absolute inset-[-1.25%_-7.5%_-26.25%_-7.5%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.4006 20.4004">
                        <g filter="url(#filter0_d_4041_62525)">
                            <path d={svgPaths.p4a27f00} fill="white" />
                            <path d={svgPaths.p359eb400} stroke="white" strokeWidth="0.2" />
                        </g>
                        <defs>
                            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="20.4004" id="filter0_d_4041_62525" width="18.4006" x="0" y="-4.47035e-08">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                                <feOffset dy="2" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4041_62525" />
                                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4041_62525" mode="normal" result="shape" />
                            </filter>
                        </defs>
                    </svg>
                </div>
            </div>
        </div>
    )
}

function CloseIcon() {
  return (
    <div className="relative shrink-0 size-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <path d={svgPaths.p3061172} fill="#2C7BF6" />
      </svg>
    </div>
  );
}

// --- Action Widget Variant 2 ---

export const ActionWidgetVariant2 = ({ flow }: { flow: ReturnType<typeof useFormStore> }) => {
  const { formData, setActiveStep } = flow;

  // Step 1: Key Details
  const amount = formData.amount ? `₹${formData.amount}` : '-';
  const purpose = formData.purpose || '-';
  const step1Text = `Amount: ${amount} | Payment for: ${purpose}`;

  // Step 2: Customer Details
  const contact = [formData.customerEmail, formData.customerPhone].filter(Boolean).join(" | ");
  const step2Text = contact || '-';

  // Step 3: Other Details
  const expiry = formData.shouldExpire ? "Expires" : "No link expiry";
  const reminder = formData.requireReminder ? "Reminder set" : "No reminder";
  const step3Text = `${expiry}, ${reminder}`;

  return (
    <div className="backdrop-blur-[5.5px] bg-white relative rounded-[24px] w-[560px] shadow-2xl">
      <div className="content-stretch flex flex-col items-start justify-between overflow-clip p-[12px] relative rounded-[inherit] size-full">
        
        {/* Steps List */}
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full mb-4">
          <Step count={1} title="Key Details" text={step1Text} onEdit={() => setActiveStep(0)} />
          <Step count={2} title="Customer Details" text={step2Text} onEdit={() => setActiveStep(1)} />
          <Step count={3} title="Other Details" text={step3Text} onEdit={() => setActiveStep(2)} />
        </div>

        {/* Separator */}
        <div className="bg-[#d9d9d9] h-px opacity-40 shrink-0 w-full mb-4" />

        {/* Input Box Area (Simulated) */}
        <div className="backdrop-blur-[5.5px] bg-[rgba(255,255,255,0.9)] content-stretch flex h-[96px] items-start justify-between overflow-clip pb-[4px] pt-[12px] relative rounded-[24px] shadow-[0px_6px_32px_4px_rgba(184,196,214,0.06)] shrink-0 w-full border border-blue-50">
            {/* Input Content */}
            <div className="flex-[1_0_0] min-h-px min-w-[260px] relative px-4">
                 <div className="flex gap-2 items-center">
                    <div className="size-[24px] shrink-0"><Ray /></div>
                    <input 
                        type="text" 
                        placeholder="Type your answer..."
                        className="font-['Inter'] font-medium text-[#7d7d7d] text-[16px] bg-transparent outline-none w-full"
                    />
                 </div>
            </div>

            {/* Actions Bottom Right */}
            <div className="absolute bottom-[5px] content-stretch flex items-end justify-between right-[12px] w-[464px]">
                 {/* Badge */}
                <div className="bg-[rgba(48,94,255,0.09)] content-stretch flex items-center justify-between overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0 mr-auto gap-2">
                    <p className="font-['Inter'] font-medium leading-[24px] text-[#2c7bf6] text-[14px]">
                        {flow.intent === 'create_payment_link' ? 'Create Payment link' : 'Create Subscription'}
                    </p>
                    <button onClick={flow.close} className="cursor-pointer">
                        <CloseIcon />
                    </button>
                </div>

                {/* Buttons */}
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                    <div className="flex gap-1">
                        <div className="bg-[rgba(0,0,0,0.04)] relative rounded-[38px] shrink-0 size-[32px] cursor-pointer hover:bg-slate-100">
                             <PlusIcon />
                        </div>
                        <div className="relative rounded-[38px] shrink-0 size-[32px] cursor-pointer hover:bg-slate-100">
                             <MicIcon />
                        </div>
                    </div>
                    <div className="bg-[rgba(0,0,0,0.04)] relative rounded-[100px] shrink-0 size-[32px] cursor-pointer active:scale-95 transition-transform">
                        <div className="overflow-clip relative rounded-[inherit] size-full">
                            <div className="absolute border border-[#0354e0] border-solid inset-0 rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]" style={{ backgroundImage: "linear-gradient(-73.0125deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)" }}></div>
                            <div className="absolute flex items-center justify-center left-1/2 size-[16px] top-[8px] translate-x-[-50%]">
                                <SendIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
      {/* Outer Border */}
      <div aria-hidden="true" className="absolute border-[#a4d4fe] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_6px_32px_4px_rgba(184,196,214,0.06)]" />
    </div>
  );
};