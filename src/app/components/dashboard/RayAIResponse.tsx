import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useAgenticStream } from './useAgenticStream';

interface RayAIResponseProps {
    headerText: string;
    dataContent: React.ReactNode;
    insightText?: string;
}

export const RayAIResponse: React.FC<RayAIResponseProps> = ({ headerText, dataContent, insightText }) => {
    const { phase, nextPhase, isStreamingHeader, showTable, showInsight, showActions } = useAgenticStream();
    const [displayedText, setDisplayedText] = useState("");

    // Layer 1: Smart Typewriter
    useEffect(() => {
        if (phase === 'STREAMING_HEADER') {
            let i = 0;
            // Clear text initially
            setDisplayedText("");
            
            const interval = setInterval(() => {
                setDisplayedText(headerText.slice(0, i + 1));
                i++;
                if (i === headerText.length) {
                    clearInterval(interval);
                    nextPhase(); // Move to RENDERING_TABLE
                }
            }, 15); // 15ms speed
            return () => clearInterval(interval);
        } else if (phase !== 'STREAMING_HEADER') {
             // Ensure full text is shown if we are in later phases (e.g. re-render)
             setDisplayedText(headerText);
        }
    }, [phase, headerText, nextPhase]);

    // Layer 2: Table Transition
    useEffect(() => {
        if (phase === 'RENDERING_TABLE') {
            // Simulate table rendering time (1.5s) then move to Insight
            const timer = setTimeout(() => {
                nextPhase();
            }, 1500); 
            return () => clearTimeout(timer);
        }
    }, [phase, nextPhase]);

    // Layer 3: Insight Transition
    useEffect(() => {
        if (phase === 'SHOWING_INSIGHT') {
             // Wait for insight animation to settle (0.8s) then show actions
             const timer = setTimeout(() => {
                 nextPhase(); // Move to IDLE
             }, 800);
             return () => clearTimeout(timer);
        }
    }, [phase, nextPhase]);

    return (
        <div className="flex flex-col gap-6 w-full max-w-[95%]">
            {/* Layer 1: Text Header & Subtext */}
            <div className="flex items-start gap-3">
                 <div className="size-6 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                 </div>
                 <div className="font-sans text-[16px] leading-[26px] text-[#40566d] pt-0.5">
                      {displayedText}
                      {isStreamingHeader && (
                          <span className="inline-block w-[2px] h-[18px] bg-blue-500 ml-1 align-middle animate-pulse" />
                      )}
                 </div>
            </div>

            {/* Layer 2: Data Asset (Table) */}
            {showTable && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="pl-9 w-full"
                >
                    {dataContent}
                </motion.div>
            )}

            {/* Layer 3: Ray Insight */}
            {showInsight && insightText && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="pl-9 w-full"
                >
                    <div className="flex gap-[10px] items-start p-[16px] bg-[rgba(18,145,208,0.06)] rounded-[12px] border border-[rgba(18,145,208,0.12)]">
                         <div className="shrink-0 size-[16px] flex items-center justify-center mt-[2px]">
                           <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                             <path d="M8 1L9.79 5.42L14.5 6.02L11 9.34L11.94 14L8 11.77L4.06 14L5 9.34L1.5 6.02L6.21 5.42L8 1Z" fill="#1291D0" stroke="#1291D0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                           </svg>
                         </div>
                         <div className="flex flex-col gap-[4px]">
                           <span className="text-[14px] font-medium text-[#1291D0]">Ray Insight</span>
                           <p className="text-[15px] leading-[24px] text-[#40566d]">
                             {insightText}
                           </p>
                         </div>
                    </div>
                </motion.div>
            )}

            {/* Layer 4 & 5: Footer Actions */}
            {showActions && (
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="pl-9 flex gap-2 mt-0"
                 >
                     <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
                         Download Report
                     </button>
                     <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
                         View Details
                     </button>
                 </motion.div>
            )}
        </div>
    );
};
