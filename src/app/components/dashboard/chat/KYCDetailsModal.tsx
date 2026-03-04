import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';

export interface KYCDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
}

export const KYCDetailsModal: React.FC<KYCDetailsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [hasSlid, setHasSlid] = React.useState(false);
  const [slideDistance, setSlideDistance] = React.useState(0);

  // Calculate slide distance based on viewport
  React.useEffect(() => {
    const calculateDistance = () => {
      const viewportWidth = window.innerWidth;
      const modalWidth = 393;
      const rightPadding = 32;
      // Distance from center to right edge position
      const distance = (viewportWidth / 2) - rightPadding - (modalWidth / 2);
      setSlideDistance(distance);
    };

    calculateDistance();
    window.addEventListener('resize', calculateDistance);
    return () => window.removeEventListener('resize', calculateDistance);
  }, []);

  // Reset slide state when modal closes
  React.useEffect(() => {
    if (isOpen) {
      // Trigger slide to right after initial center animation
      const timer = setTimeout(() => {
        setHasSlid(true);
      }, 400); // Delay to allow center animation to complete
      return () => clearTimeout(timer);
    } else {
      setHasSlid(false);
    }
  }, [isOpen]);

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999]"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)]" />

          {/* Modal Card - positioned at center, then slides right */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: hasSlid ? slideDistance : 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { type: 'spring', stiffness: 300, damping: 30 },
              y: { type: 'spring', stiffness: 300, damping: 30 },
              x: {
                type: 'spring',
                stiffness: 200,
                damping: 25
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-[5.5px] bg-gradient-to-b from-white to-[#f0f0f0] border-[1.5px] border-[rgba(0,0,0,0.1)] rounded-[16px] shadow-[0px_8px_48px_4px_rgba(59,96,181,0.1)] w-[393px] max-h-[90vh] overflow-hidden"
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
            <div className="relative overflow-y-auto max-h-[90vh] p-6">
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
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
