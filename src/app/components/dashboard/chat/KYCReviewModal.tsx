import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';

interface KYCReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  businessModel?: string;
  bankAccount?: string;
  isTransitioningToPanel?: boolean;
  originRect?: DOMRect | null;
}

export const KYCReviewModal: React.FC<KYCReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  businessModel,
  bankAccount,
  isTransitioningToPanel = false,
  originRect
}) => {
  if (!isOpen) return null;

  // Calculate initial position from origin card if provided
  const getInitialPosition = () => {
    if (!originRect) return { x: '-50%', y: '-50%' };

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const originCenterX = originRect.left + originRect.width / 2;
    const originCenterY = originRect.top + originRect.height / 2;

    return {
      x: `calc(-50% + ${originCenterX - centerX}px)`,
      y: `calc(-50% + ${originCenterY - centerY}px)`
    };
  };

  const initialPos = getInitialPosition();

  const details = [
    { label: 'PAN number', value: 'EIUGF5433G', verified: true },
    { label: 'Payment Channel', value: 'mokobara.com', verified: true },
    { label: 'Aadhar front', value: 'Image verified', verified: true },
    { label: 'Aadhar back', value: 'Image verified', verified: true },
    {
      label: 'Registered Address',
      value: 'B410, Salarpuria Arena Regency Max Grande ,Domlur karnataka third line',
      verified: true
    },
    {
      label: 'Business Category',
      value: businessModel || 'E-commerce, Fashion',
      verified: true
    },
    {
      label: 'Bank Account',
      value: bankAccount || '2028U32U38Q\nState Bank of India, Sarjapura Branch',
      verified: true
    }
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isTransitioningToPanel ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isTransitioningToPanel ? 0.3 : 0.2 }}
            className="fixed inset-0 z-[9998] bg-[rgba(0,0,0,0.8)]"
            onClick={isTransitioningToPanel ? undefined : onClose}
            style={{ pointerEvents: isTransitioningToPanel ? 'none' : 'auto' }}
          />

          {/* Modal - starts from origin card or right panel position, animates to center */}
          <motion.div
            initial={originRect ? {
              left: '50%',
              top: '50%',
              right: 'auto',
              x: initialPos.x,
              y: initialPos.y,
              opacity: 0,
              scale: 0.8
            } : {
              right: '0',
              top: '56px',
              left: 'auto',
              opacity: 1,
              scale: 1
            }}
            animate={isTransitioningToPanel ? {
              right: '0',
              top: '56px',
              left: 'auto',
              opacity: 1,
              scale: 1
            } : {
              left: '50%',
              top: '50%',
              right: 'auto',
              x: '-50%',
              y: '-50%',
              opacity: 1,
              scale: 1
            }}
            exit={isTransitioningToPanel ? {
              right: '0',
              top: '56px',
              left: 'auto',
              opacity: 1,
              scale: 1
            } : {
              left: '50%',
              top: '50%',
              right: 'auto',
              x: '-50%',
              y: '-50%',
              opacity: 0,
              scale: 0.95
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="fixed bg-gradient-to-b from-white to-[#f0f0f0] border-[1.5px] border-[rgba(0,0,0,0.1)] rounded-[16px] w-[393px] overflow-hidden z-[9999] backdrop-blur-[5.5px] shadow-[0px_8px_48px_4px_rgba(59,96,181,0.1)]"
            style={isTransitioningToPanel ? {
              height: 'calc(100vh - 56px)'
            } : {}}
          >
            {/* Top gradient overlay for depth */}
            <div className="absolute top-0 left-0 right-0 h-[24px] pointer-events-none z-20">
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
            </div>

            {/* Bottom gradient overlay for depth */}
            <div className="absolute bottom-0 left-0 right-0 h-[24px] pointer-events-none z-20">
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
            </div>

            {/* Close Button */}
            <div className="absolute top-4 right-4 z-30">
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/10 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="relative overflow-y-auto max-h-[calc(100vh-80px)] p-6">
              {/* CKYC Card */}
              <div className="border border-[rgba(108,132,157,0.18)] rounded-[12px] overflow-hidden bg-white shadow-sm">
                {/* Header Image Section */}
                <div className="relative h-[121px] rounded-t-[12px] overflow-hidden">
                  {/* Blurred background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop)',
                      filter: 'blur(3px)',
                      transform: 'scale(1.1)'
                    }}
                  />

                  {/* Overlay for better text contrast */}
                  <div className="absolute inset-0 bg-[rgba(0,0,0,0.25)]" />

                  {/* Text overlay */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
                    <h3 className="font-['TASA_Orbiter_Display',sans-serif] font-semibold text-[24px] leading-[32px] tracking-[0px] mb-1 drop-shadow-lg">
                      Co-Star Network
                    </h3>
                    <p className="font-['Inter',sans-serif] font-medium text-[10px] leading-[16px] tracking-[1px] text-white/90 uppercase drop-shadow-md">
                      A PRIVATE LIMITED COMPANY
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 space-y-4">
                  {details.map((detail, index) => (
                    <div key={index}>
                      <div className="flex gap-3 items-start">
                        <p className="font-['Inter',sans-serif] font-normal text-[11px] leading-[16px] text-[#40566d] opacity-60 w-[128px] shrink-0">
                          {detail.label}
                        </p>
                        <div className="flex-1 flex items-start justify-between gap-2 min-w-0">
                          <p className={`font-['Inter',sans-serif] font-medium text-[11px] leading-[16px] tracking-[0px] flex-1 min-w-0 break-words ${
                            detail.verified ? 'text-[#192839]' : 'text-[#768ea7]'
                          }`}>
                            {detail.value}
                          </p>
                          {detail.verified && (
                            <div className="shrink-0 w-3.5 h-3.5 flex items-center justify-center">
                              <Check size={10} className="text-[#04c982]" strokeWidth={2.5} />
                            </div>
                          )}
                        </div>
                      </div>
                      {index < details.length - 1 && (
                        <div className="h-[1px] bg-[rgba(0,0,0,0.08)] mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={onSubmit}
                className="w-full mt-6 h-12 border border-[#0354e0] rounded-[12px] text-white font-sans font-medium text-[14px] tracking-[-0.112px] transition-all flex items-center justify-center gap-2 overflow-hidden hover:opacity-90 relative"
                style={{
                  backgroundImage: 'linear-gradient(-23.46deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)'
                }}
              >
                {/* Glass effect inset shadows */}
                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_0px_#0e54cc,inset_0px_0px_0px_0.5px_#1566f1,inset_0px_-2px_0px_0px_rgba(255,255,255,0.18),inset_0px_1.5px_0px_0px_rgba(255,255,255,0.32)]" />
                Submit application
              </button>
            </div>

            {/* Inset shadow for depth */}
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_1px_white]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
