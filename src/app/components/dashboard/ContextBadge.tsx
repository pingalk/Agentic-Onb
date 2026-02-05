import React from 'react';
import svgPaths from "../../../imports/svg-54bb1u6kk8";

export const ContextBadge = () => {
  return (
    <div className="bg-[#f0f0f0] content-stretch flex gap-[7px] items-start overflow-clip px-[8px] py-[6px] relative rounded-[4px] shrink-0 inline-flex self-end mb-2">
      <div className="bg-white h-[39px] relative rounded-[4px] shadow-[0px_2px_16px_0px_rgba(25,40,57,0.09)] shrink-0 w-[32px] flex items-center justify-center">
          <svg className="block size-[16px]" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <g id="list">
              <g id="path">
                <path d={svgPaths.p367c4400} fill="var(--fill-0, #192839)" />
                <path d={svgPaths.p37e5eb00} fill="var(--fill-0, #192839)" />
                <path d={svgPaths.p1d3c5300} fill="var(--fill-0, #192839)" />
                <path d={svgPaths.p2344d400} fill="var(--fill-0, #192839)" />
                <path d={svgPaths.p2de6ed00} fill="var(--fill-0, #192839)" />
                <path d={svgPaths.p2a95b080} fill="var(--fill-0, #192839)" />
              </g>
            </g>
          </svg>
      </div>
      <div className="content-stretch flex flex-col font-['Inter:Medium',sans-serif] items-start not-italic relative shrink-0 text-nowrap justify-center h-[39px]">
        <p className="leading-[20px] relative shrink-0 text-[14px] text-black font-medium">Payment link creation</p>
        <p className="leading-[18px] relative shrink-0 text-[#767676] text-[12px]">Form</p>
      </div>
    </div>
  );
}
