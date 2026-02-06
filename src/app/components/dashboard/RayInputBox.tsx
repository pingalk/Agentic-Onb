import React, { useRef, useLayoutEffect, useState } from 'react';
import { ArrowUp, Plus, X, Image as ImageIcon, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

// Image Attachment Chip Component (Input Box variant - with close button)
interface ImageAttachmentChipProps {
  filename: string;
  fileType: string;
  thumbnailUrl?: string;
  onRemove?: () => void;
}

// WhatsApp-style chat thumbnail mockup (square)
const WhatsAppThumbnail = () => (
  <div className="w-[40px] h-[40px] rounded-[6px] overflow-hidden shadow-[0px_2px_8px_0px_rgba(0,0,0,0.12)] bg-[#efeae2] relative">
    {/* WhatsApp green header bar */}
    <div className="absolute top-0 left-0 right-0 h-[10px] bg-[#008069]" />
    {/* Chat background with message bubbles */}
    <div className="absolute top-[12px] left-[3px] right-[3px] bottom-[3px]">
      {/* Incoming message (white, left) */}
      <div className="absolute top-0 left-0 w-[20px] h-[8px] bg-white rounded-[2px]" />
      {/* Outgoing message (green, right) */}
      <div className="absolute top-[10px] right-0 w-[16px] h-[8px] bg-[#d9fdd3] rounded-[2px]" />
      {/* Another incoming message */}
      <div className="absolute top-[20px] left-0 w-[24px] h-[6px] bg-white rounded-[2px]" />
    </div>
  </div>
);

export const ImageAttachmentChip: React.FC<ImageAttachmentChipProps> = ({
  filename,
  fileType,
  thumbnailUrl,
  onRemove
}) => {
  return (
    <div
      className="relative inline-flex items-center gap-[10px] p-[8px] pr-[12px] rounded-[12px] shrink-0 border border-blue-100/50 shadow-[0_2px_8px_rgba(59,130,246,0.08)]"
      style={{
        background: 'linear-gradient(135deg, #EEF4FF 0%, #E0ECFF 50%, #D4E4FF 100%)',
      }}
    >
      {/* WhatsApp-style chat thumbnail */}
      <WhatsAppThumbnail />

      {/* File info */}
      <div className="flex flex-col justify-center">
        <span className="font-['Inter',sans-serif] text-[14px] font-medium text-[#192839] leading-[20px]">{filename}</span>
        <span className="font-['Inter',sans-serif] text-[14px] font-medium text-blue-500 leading-[20px]">{fileType}</span>
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
  isStreaming?: boolean; // When true, show stop button instead of send
  onStopStreaming?: () => void;
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
  onRemoveAttachment,
  isStreaming = false,
  onStopStreaming
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Configuration based on variant
  const isHero = variant === 'hero';
  const minHeight = 24; // Single line height
  const maxHeight = 72; // Max ~3 lines

  // Smooth Auto-Resize Logic
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to read scrollHeight correctly (shrink if needed)
    textarea.style.height = `${minHeight}px`;

    // Calculate new height constrained by min/max
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);

    textarea.style.height = `${newHeight}px`;
  }, [value, minHeight, maxHeight]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
    // Tab key fills in the placeholder text (only when input is empty and animatePlaceholder is enabled)
    if (e.key === 'Tab' && animatePlaceholder && !value && placeholder) {
      e.preventDefault();
      onChange(placeholder);
    }
  };

  // Background color: white for compact (chat), slate-50 for hero (landing)
  const bgColor = isHero ? 'bg-[#f8fafc]' : 'bg-white';

  return (
    <motion.div
      layout
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      className={`${bgColor} relative rounded-[20px] w-full`}
    >
      {/* Attachment Chip - displayed above the main input when present */}
      <AnimatePresence>
        {attachmentChip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="px-[16px] pt-[12px]"
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

      {/* Compact variant: single-line layout with buttons inline */}
      {!isHero && (
        <div className="flex items-center gap-[8px] px-[16px] py-[10px]">
          {/* Text Input Area - flex container to vertically center textarea content */}
          <div className="relative flex-1 min-w-0 flex items-center min-h-[28px]">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus={autoFocus}
              placeholder={placeholder}
              rows={1}
              className="w-full bg-transparent border-none outline-none resize-none font-['TASA_Orbiter_Display',sans-serif] leading-[28px] text-[#40566d] text-[16px] tracking-[0.32px] placeholder:text-[#768ea7] p-0"
              style={{
                minHeight: '28px',
                height: '28px',
                maxHeight: '72px',
                overflow: value.includes('\n') ? 'auto' : 'hidden'
              }}
            />
          </div>

          {/* Buttons - inline with input */}
          <div className="flex items-center gap-[4px] shrink-0">
            {/* Plus Button */}
            <button className="relative rounded-[8px] shrink-0 size-[28px] hover:bg-[rgba(0,0,0,0.04)] transition-colors flex items-center justify-center" title="Add attachment">
              <Plus size={18} className="text-[#768EA7]" />
            </button>

            {/* Send/Stop Button - shows stop when streaming */}
            {isStreaming ? (
              <button
                onClick={onStopStreaming}
                className="relative rounded-[100px] shrink-0 size-[28px] bg-[#0a0a0a] hover:bg-black transition-all active:scale-95 flex items-center justify-center"
              >
                <Square size={12} fill="white" className="text-white" />
              </button>
            ) : (
              <button
                onClick={onSend}
                disabled={!value.trim() && !attachmentChip}
                className="bg-[rgba(0,0,0,0.04)] relative rounded-[100px] shrink-0 size-[28px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="overflow-clip relative rounded-[inherit] size-full">
                  <div className="absolute border border-[#0354e0] border-solid inset-0 rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]" style={{ backgroundImage: "linear-gradient(-73.0125deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)" }}>
                    <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_0px_rgba(255,255,255,0.2),inset_0px_2px_0px_0px_rgba(255,255,255,0.2)]" />
                  </div>
                  <div className="absolute flex items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <ArrowUp size={14} strokeWidth={2} className="text-white" />
                  </div>
                </div>
                <div aria-hidden="true" className="absolute border-[0.5px] border-solid border-white inset-0 pointer-events-none rounded-[100px]" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hero variant: original multi-line layout with buttons below */}
      {isHero && (
        <div className="flex flex-col">
          {/* Text Input Area */}
          <div className="relative px-[16px] pt-[16px] pb-[8px]">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus={autoFocus}
              placeholder={attachmentChip ? 'Ask me anything about this image...' : (animatePlaceholder ? '' : placeholder)}
              rows={1}
              className="w-full bg-transparent border-none outline-none resize-none font-['TASA_Orbiter_Display',sans-serif] leading-[24px] text-[#40566d] text-[16px] tracking-[0.32px] placeholder:text-[#768ea7]"
              style={{
                minHeight: '24px',
                height: '24px',
                maxHeight: '72px',
                overflow: value.includes('\n') ? 'auto' : 'hidden'
              }}
            />
            {/* Animated placeholder overlay - stops cycling when attachment is present */}
            {animatePlaceholder && !value && !attachmentChip && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={placeholder}
                  className="absolute top-[16px] left-[16px] pointer-events-none font-['TASA_Orbiter_Display',sans-serif] leading-[24px] text-[#768ea7] text-[16px] tracking-[0.32px] flex items-center"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                >
                  <span>
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
                  </span>
                  {/* Tab key indicator - small icon */}
                  <motion.span
                    className="ml-1.5 inline-flex items-center justify-center px-[5px] h-[16px] rounded-[3px] bg-[#e2e8f0] border border-[#cbd5e1] text-[9px] font-medium text-[#94a3b8] font-['Inter',sans-serif] leading-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: placeholder.length * 0.025 + 0.1,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    Tab
                  </motion.span>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Buttons row - below input */}
          <div className="flex items-center justify-end gap-[4px] px-[12px] pb-[12px]">
            {/* Plus Button */}
            <button className="relative rounded-[8px] shrink-0 size-[32px] hover:bg-[rgba(0,0,0,0.04)] transition-colors flex items-center justify-center" title="Add attachment">
              <Plus size={20} className="text-[#768EA7]" />
            </button>

            {/* Send Button */}
            <button
              onClick={onSend}
              disabled={!value.trim() && !attachmentChip}
              className="bg-[rgba(0,0,0,0.04)] relative rounded-[100px] shrink-0 size-[32px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="overflow-clip relative rounded-[inherit] size-full">
                <div className="absolute border border-[#0354e0] border-solid inset-0 rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]" style={{ backgroundImage: "linear-gradient(-73.0125deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)" }}>
                  <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_0px_rgba(255,255,255,0.2),inset_0px_2px_0px_0px_rgba(255,255,255,0.2)]" />
                </div>
                <div className="absolute flex items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <ArrowUp size={16} strokeWidth={2} className="text-white" />
                </div>
              </div>
              <div aria-hidden="true" className="absolute border-[0.5px] border-solid border-white inset-0 pointer-events-none rounded-[100px]" />
            </button>
          </div>
        </div>
      )}

      <div aria-hidden="true" className={clsx("absolute border border-[#6db7e8] border-solid inset-0 pointer-events-none rounded-[20px] transition-shadow duration-300", (showShadow || isFocused) && "shadow-[0px_6px_32px_4px_rgba(25,40,57,0.09)]")} />
    </motion.div>
  );
};