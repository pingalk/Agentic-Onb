import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';

export interface KYCDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  onSettled?: () => void;
}

export const KYCDetailsModal: React.FC<KYCDetailsModalProps> = ({
  isOpen,
  onClose,
  onSettled
}) => {
  const [hasSlid, setHasSlid] = React.useState(false);
  const [centerOffsetX, setCenterOffsetX] = React.useState(0);

  // Calculate offset needed to center modal from right-anchored position
  React.useEffect(() => {
    const calculateOffset = () => {
      const viewportWidth = window.innerWidth;
      const modalWidth = 393;
      const rightPadding = 8;
      // Modal is anchored at right: 8px
      // To center it, we need to move it left by: (viewportWidth/2) - (modalWidth/2) - rightPadding
      const centerPosition = (viewportWidth - modalWidth) / 2;
      const rightPosition = viewportWidth - modalWidth - rightPadding;
      const offset = -(rightPosition - centerPosition);
      setCenterOffsetX(offset);
    };

    calculateOffset();
    window.addEventListener('resize', calculateOffset);
    return () => window.removeEventListener('resize', calculateOffset);
  }, []);

  // Reset slide state when modal closes and notify parent
  React.useEffect(() => {
    if (isOpen) {
      // Wait 3 seconds as modal, then trigger slide to right
      const timer = setTimeout(() => {
        setHasSlid(true);
        // Notify parent that panel has settled
        setTimeout(() => {
          onSettled?.();
        }, 500); // Wait for slide animation to complete
      }, 3000); // Wait 3 seconds before sliding
      return () => clearTimeout(timer);
    } else {
      setHasSlid(false);
    }
  }, [isOpen, onSettled]);

  if (!isOpen) return null;

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
    { label: 'Business model', value: 'Pending...', verified: false },
    { label: 'Bank Account', value: 'Pending...', verified: false }
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - fades out when panel settles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hasSlid ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] bg-[rgba(0,0,0,0.8)]"
            onClick={hasSlid ? undefined : onClose}
            style={{ pointerEvents: hasSlid ? 'none' : 'auto' }}
          />

          {/* Panel - transitions from centered modal to right-anchored panel */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1,
              height: hasSlid ? 'calc(100vh - 64px - 8px)' : 'auto'
            }}
            exit={{
              opacity: 0,
              scale: 0.95
            }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { type: 'spring', stiffness: 300, damping: 30 },
              height: { type: 'spring', stiffness: 200, damping: 25, duration: 0.5 }
            }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-gradient-to-b from-white to-[#f0f0f0] border-[1.5px] border-[rgba(0,0,0,0.1)] rounded-[16px] w-[393px] overflow-hidden z-[9999] transition-all duration-500 ${
              hasSlid ? 'shadow-sm' : 'backdrop-blur-[5.5px] shadow-[0px_8px_48px_4px_rgba(59,96,181,0.1)]'
            }`}
            style={hasSlid ? {
              position: 'fixed',
              right: '8px',
              top: '64px'
            } : {
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Top gradient overlay for depth */}
            <div className="absolute top-0 left-0 right-0 h-[24px] pointer-events-none z-20">
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
            </div>

            {/* Bottom gradient overlay for depth */}
            <div className="absolute bottom-0 left-0 right-0 h-[24px] pointer-events-none z-20">
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
            </div>


            {/* Scrollable Content */}
            <div className="relative overflow-y-auto h-full p-6">
              {/* CKYC Card */}
              <div className="border border-[rgba(108,132,157,0.18)] rounded-[12px] overflow-hidden bg-white shadow-sm">
                {/* Header Image Section */}
                <div className="relative h-[121px] rounded-t-[12px] overflow-hidden">
                  {/* Blurred background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: 'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop)',
                      filter: 'blur(3px)',
                      transform: 'scale(1.1)'
                    }}
                  />

                  {/* Gradient overlay for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/80 via-[#3b82f6]/75 to-[#60a5fa]/70" />
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
