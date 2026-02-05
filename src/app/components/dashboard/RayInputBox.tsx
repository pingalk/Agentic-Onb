import React, { useRef, useLayoutEffect, useState } from 'react';
import { ArrowUp, Mic, Plus, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

// Image Attachment Chip Component (Input Box variant - with close button)
interface ImageAttachmentChipProps {
  filename: string;
  fileType: string;
  thumbnailUrl?: string;
  onRemove?: () => void;
}

// Stylized screenshot thumbnail mockup
const ScreenshotThumbnail = () => (
  <div className="w-[32px] h-[40px] rounded-[4px] overflow-hidden shadow-[0px_2px_16px_0px_rgba(25,40,57,0.09)] bg-[#efe6f7] relative">
    {/* Purple header bar */}
    <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#5f259e]" />
    {/* White content rows */}
    <div className="absolute top-[7px] left-[1px] right-[1px] h-[6px] bg-white rounded-[1px]" />
    <div className="absolute top-[14px] left-[1px] right-[1px] h-[9px] bg-white rounded-[1px]">
      <div className="absolute left-[2px] top-[3px] w-[4px] h-[4px] bg-[#7034b2] rounded-[1px]" />
    </div>
    <div className="absolute top-[24px] left-[1px] right-[1px] h-[9px] bg-white rounded-[1px]">
      <div className="absolute left-[2px] top-[2px] w-[4px] h-[4px] bg-white rounded-[1px]" />
    </div>
    <div className="absolute top-[34px] left-[1px] right-[1px] h-[6px] bg-white rounded-[1px]" />
  </div>
);

export const ImageAttachmentChip: React.FC<ImageAttachmentChipProps> = ({
  filename,
  fileType,
  thumbnailUrl,
  onRemove
}) => {
  return (
    <div className="relative inline-flex items-center gap-[10px] p-[8px] pr-[12px] bg-[#EAEEFF] rounded-[12px] shrink-0">
      {/* Stylized screenshot thumbnail */}
      <ScreenshotThumbnail />

      {/* File info */}
      <div className="flex flex-col justify-center">
        <span className="font-['Inter',sans-serif] text-[14px] font-medium text-[#192839] leading-[20px]">{filename}</span>
        <span className="font-['Inter',sans-serif] text-[14px] font-medium text-[#768ea7] leading-[20px]">{fileType}</span>
      </div>

      {/* Close button - floating at top right, dark gray */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-[-5px] right-[-5px] w-[20px] h-[20px] flex items-center justify-center rounded-full bg-[#768EA7] hover:bg-[#5a7189] transition-colors"
        >
          <X size={12} strokeWidth={2.5} className="text-white" />
        </button>
      )}
    </div>
  );
};

interface RayInputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  variant?: 'hero' | 'compact';
  placeholder?: string;
  animatePlaceholder?: boolean; // Enable flip animation for cycling placeholders
  showShadow?: boolean; // Control shadow visibility for entry animation
  autoFocus?: boolean;
  attachmentChip?: {
    filename: string;
    fileType: string;
    thumbnailUrl?: string;
  } | null;
  onRemoveAttachment?: () => void;
}

export const RayInputBox: React.FC<RayInputBoxProps> = ({
  value,
  onChange,
  onSend,
  variant = 'hero',
  placeholder = "Ask anything...",
  animatePlaceholder = false,
  showShadow = false, // Default to no shadow; shows on focus or when explicitly set
  autoFocus = false,
  attachmentChip = null,
  onRemoveAttachment
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Configuration based on variant
  const isHero = variant === 'hero';
  const minHeight = 48; // Always start at 2 lines (48px = 2 × 24px line-height)
  const maxHeight = 160; // Approx 5-6 lines
  const fontSize = isHero ? 'text-lg' : 'text-[15px]';
  const paddingRight = isHero ? 'pr-36' : 'pr-28'; // Ensure text never overlaps buttons

  // Smooth Auto-Resize Logic
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to read scrollHeight correctly (shrink if needed)
    textarea.style.height = '0px';
    
    // Calculate new height constrained by min/max
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    
    textarea.style.height = `${newHeight}px`;
  }, [value, minHeight, maxHeight]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Background color: white for compact (chat), slate-50 for hero (landing)
  const bgColor = isHero ? 'bg-[#f8fafc]' : 'bg-white';

  return (
    <motion.div
      layout
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      className={`${bgColor} relative rounded-[26px] w-full`}
    >
      <div className="content-stretch flex flex-col gap-[4px] items-end justify-end overflow-clip px-[20px] py-[16px] relative rounded-[inherit] size-full">
        {/* Attachment Chip - displayed above the textarea */}
        <AnimatePresence>
          {attachmentChip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="w-full flex items-center mb-[8px]"
            >
              <ImageAttachmentChip
                filename={attachmentChip.filename}
                fileType={attachmentChip.fileType}
                thumbnailUrl={attachmentChip.thumbnailUrl}
                onRemove={onRemoveAttachment}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoFocus={autoFocus}
            placeholder={animatePlaceholder ? '' : placeholder}
            className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full bg-transparent border-none outline-none resize-none font-['TASA_Orbiter_Display',sans-serif] leading-[24px] text-[#40566d] text-[18px] tracking-[0.36px] placeholder:text-[#768ea7]"
            style={{
              minHeight: '48px',
              height: '48px'
            }}
          />
          {/* Animated placeholder overlay - staggered character reveal (shows even when focused, as long as no text) */}
          {animatePlaceholder && !value && (
            <AnimatePresence mode="wait">
              <motion.div
                key={placeholder}
                className="absolute top-0 left-0 pointer-events-none font-['TASA_Orbiter_Display',sans-serif] leading-[24px] text-[#768ea7] text-[18px] tracking-[0.36px]"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              >
                {placeholder.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                    initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.15,
                      delay: i * 0.025,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        
        {/* Buttons */}
        <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0 w-[197px]">
          {/* Secondary Actions (Mic/Plus) */}
          <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
            {/* Plus Button - Flat with hover background */}
            <button className="relative rounded-[8px] shrink-0 size-[32px] hover:bg-[rgba(0,0,0,0.04)] transition-colors group" title="Add attachment">
              <div className="absolute left-1/2 size-[20px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
                <Plus size={20} className="text-[#768EA7]" />
              </div>
            </button>
            
            {/* Mic Button - Flat with hover background */}
            <button className="relative rounded-[8px] shrink-0 size-[32px] hover:bg-[rgba(0,0,0,0.04)] transition-colors group" title="Voice input">
              <div className="absolute left-1/2 size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
                <Mic size={16} className="text-[#768EA7]" />
              </div>
            </button>
          </div>
          
          {/* Send Button - UP Arrow (no rotation) - enabled if text OR attachment */}
          <button
            onClick={onSend}
            disabled={!value.trim() && !attachmentChip}
            className="bg-[rgba(0,0,0,0.04)] relative rounded-[100px] shrink-0 size-[32px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="overflow-clip relative rounded-[inherit] size-full">
              <div className="absolute border border-[#0354e0] border-solid inset-0 rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]" style={{ backgroundImage: "linear-gradient(-73.0125deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)" }}>
                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_0px_rgba(255,255,255,0.2),inset_0px_2px_0px_0px_rgba(255,255,255,0.2)]" />
              </div>
              <div className="absolute flex items-center justify-center left-1/2 size-[16px] top-[8px] translate-x-[-50%]">
                <ArrowUp size={16} strokeWidth={2} className="text-white" />
              </div>
            </div>
            <div aria-hidden="true" className="absolute border-[0.5px] border-solid border-white inset-0 pointer-events-none rounded-[100px]" />
          </button>
        </div>
      </div>
      
      <div aria-hidden="true" className={clsx("absolute border border-[#6db7e8] border-solid inset-0 pointer-events-none rounded-[26px] transition-shadow duration-300", (showShadow || isFocused) && "shadow-[0px_6px_32px_4px_rgba(25,40,57,0.09)]")} />
    </motion.div>
  );
};