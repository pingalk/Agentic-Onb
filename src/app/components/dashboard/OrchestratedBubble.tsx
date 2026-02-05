import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThumbsUp, ThumbsDown, Copy, Share } from 'lucide-react';
import { useStreamSequencer } from './useStreamSequencer';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import clsx from "clsx";
import svgPaths from "@/imports/svg-f5fzbit8qh";

// --- Physics Config ---
const sequencePhysics = {
    type: "spring",
    stiffness: 350,
    damping: 30,
    mass: 1
};

// --- Streaming Typography ---
const StreamingTypography = ({ 
    text, 
    speed = 15, 
    onComplete, 
    className,
    start = true
}: { 
    text: string, 
    speed?: number, 
    onComplete?: () => void,
    className?: string,
    start?: boolean
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        if (!start) return;

        let currentIndex = 0;
        setDisplayedText("");
        setIsComplete(false);

        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(interval);
                setIsComplete(true);
                if (onCompleteRef.current) onCompleteRef.current();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, start]);

    return (
        <span className={className}>
            {displayedText.split(/(₹[\d,]+\.?\d*)/g).map((part, i) => 
                part.match(/₹[\d,]+\.?\d*/) ? (
                    <span key={i} className="font-medium text-[#192839]">{part}</span>
                ) : (
                    part
                )
            )}
            {!isComplete && start && (
                <span className="inline-block w-[2px] h-[1em] bg-[#305EFF] ml-[1px] align-middle animate-pulse" />
            )}
        </span>
    );
};

// --- Suggestion Row ---
const SuggestionRow = ({ label, index, delay }: { label: string, index: number, delay: number }) => {
    // Icon logic: Index 0 uses the "Draft" icon (pen-like), others use the "Question" icon (sparkle/question)
    const path = index === 0 ? svgPaths.p21a7ef00 : svgPaths.p3bb0600;

    return (
        <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.3 }}
            className="group flex items-center gap-[4px] w-full text-left p-[4px] rounded-[4px] hover:bg-[#f1f5fa] transition-colors"
        >
            <div className="relative shrink-0 size-[24px]">
                 <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                    <path d={path} fill="#768EA7" />
                 </svg>
            </div>
            <span className="font-['TASA_Orbiter_Display'] font-medium text-[16px] leading-[26px] tracking-[0.16px] text-[#40566d] group-hover:text-[#192839]">
                {label}
            </span>
        </motion.button>
    );
};

// --- Main Component ---
interface OrchestratedBubbleProps {
    heading?: string;
    subtext?: string;
    dataAsset?: React.ReactNode;
    insight?: React.ReactNode;
    suggestions?: string[];
}

export const OrchestratedBubble = ({ 
    heading, 
    subtext, 
    dataAsset, 
    insight, 
    suggestions = [] 
}: OrchestratedBubbleProps) => {
    const { phase, onNarrativeComplete } = useStreamSequencer({
        hasDataAsset: !!dataAsset,
        hasInsight: !!insight,
        hasSuggestions: suggestions.length > 0
    });

    const [headingComplete, setHeadingComplete] = useState(false);
    const [subtextStarted, setSubtextStarted] = useState(false);

    // If no heading, mark it complete immediately
    useEffect(() => {
        if (!heading) {
            setHeadingComplete(true);
            setSubtextStarted(true);
        }
    }, [heading]);

    // If heading complete, wait 1.3s then start subtext
    useEffect(() => {
        if (headingComplete && subtext) {
            const timer = setTimeout(() => {
                setSubtextStarted(true);
            }, 1300);
            return () => clearTimeout(timer);
        } else if (headingComplete && !subtext) {
             onNarrativeComplete();
        }
    }, [headingComplete, subtext, onNarrativeComplete]);

    return (
        <div className="flex flex-col gap-[24px] w-full max-w-full text-left">
            {/* Layer 1: Narrative */}
            <div className="flex flex-col gap-[12px]">
                {heading && (
                    <h3 className="text-[18px] font-medium text-[#020202] leading-[26px]">
                        <StreamingTypography 
                            text={heading} 
                            speed={15} 
                            onComplete={() => setHeadingComplete(true)}
                        />
                    </h3>
                )}
                {subtext && (
                    <div className="text-[16px] leading-[26px] tracking-[0.16px] text-[#40566d]">
                        <StreamingTypography 
                            start={subtextStarted}
                            text={subtext} 
                            speed={10} 
                            onComplete={onNarrativeComplete}
                        />
                    </div>
                )}
            </div>

            {/* Layer 2: Data Asset */}
            {phase >= 2 && dataAsset && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={sequencePhysics}
                    className="overflow-hidden"
                >
                    <motion.div
                        initial={{ y: -5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        {dataAsset}
                    </motion.div>
                </motion.div>
            )}

            {/* Layer 3: Insight */}
            {phase >= 3 && insight && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ ...sequencePhysics, delay: 0.1 }}
                >
                    {insight}
                </motion.div>
            )}

            {/* Layer 4: Actions */}
            {phase >= 4 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-[16px]"
                >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="text-gray-400 hover:text-gray-700 transition-colors"><ThumbsUp size={16} /></button>
                        </TooltipTrigger>
                        <TooltipContent>Helpful</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="text-gray-400 hover:text-gray-700 transition-colors"><ThumbsDown size={16} /></button>
                        </TooltipTrigger>
                        <TooltipContent>Not helpful</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="text-gray-400 hover:text-gray-700 transition-colors"><Copy size={16} /></button>
                        </TooltipTrigger>
                        <TooltipContent>Copy response</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="text-gray-400 hover:text-gray-700 transition-colors"><Share size={16} /></button>
                        </TooltipTrigger>
                        <TooltipContent>Share response</TooltipContent>
                    </Tooltip>
                </motion.div>
            )}

            {/* Layer 5: Suggestions */}
            {phase >= 5 && suggestions.length > 0 && (
                <motion.div 
                    className="flex flex-col gap-[12px] w-full mt-[24px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <h4 className="text-[18px] font-['TASA_Orbiter_Display'] font-medium text-[#193f47] leading-[26px]">Suggestions</h4>
                    <div className="flex flex-col items-start w-full">
                        {suggestions.map((suggestion, idx) => (
                            <SuggestionRow key={idx} index={idx} label={suggestion} delay={idx * 0.1} />
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};
