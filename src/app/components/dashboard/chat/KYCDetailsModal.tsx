import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';

export interface KYCDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  onSettled?: () => void;
  businessModel?: string;
  bankAccount?: string;
}

export const KYCDetailsModal: React.FC<KYCDetailsModalProps> = ({
  isOpen,
  onClose,
  onSettled,
  businessModel,
  bankAccount
}) => {
  const [hasSlid, setHasSlid] = React.useState(false);

  // Slide to right panel after 1 second, then notify parent
  React.useEffect(() => {
    if (isOpen) {
      // Wait 1 second as modal, then trigger slide to right
      const timer = setTimeout(() => {
        setHasSlid(true);
        // Notify parent that panel has settled
        setTimeout(() => {
          onSettled?.();
        }, 500); // Wait for slide animation to complete
      }, 1000); // Wait 1 second before sliding
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
    {
      label: 'Business Category',
      value: businessModel || 'Pending...',
      verified: !!businessModel
    },
    {
      label: 'Bank Account',
      value: bankAccount || 'Pending...',
      verified: !!bankAccount
    }
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
              scale: 0.95,
              x: '-50%',
              y: '-50%'
            }}
            animate={hasSlid ? {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0
            } : {
              opacity: 1,
              scale: 1,
              x: '-50%',
              y: '-50%'
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              x: '-50%',
              y: '-50%'
            }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { type: 'spring', stiffness: 300, damping: 30 },
              x: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] },
              y: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className={`fixed bg-gradient-to-b from-white to-[#f0f0f0] overflow-hidden z-[9999] ${
              hasSlid ? 'shadow-sm border-l-[1.5px] border-l-[rgba(0,0,0,0.1)] rounded-l-[16px]' : 'backdrop-blur-[5.5px] shadow-[0px_8px_48px_4px_rgba(59,96,181,0.1)] border-[1.5px] border-[rgba(0,0,0,0.1)] rounded-[16px] w-[393px]'
            }`}
            style={hasSlid ? {
              right: '0',
              top: '56px',
              bottom: '0',
              height: 'calc(100vh - 56px)',
              width: '393px'
            } : {
              left: '50%',
              top: '50%'
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
            <div className="relative overflow-y-auto h-full p-2">
              {/* CKYC Card */}
              <div className="border border-[rgba(108,132,157,0.18)] overflow-hidden bg-white shadow-sm rounded-[12px]">
                {/* Header Image Section */}
                <div className="relative h-[121px] overflow-hidden rounded-t-[12px]">
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
