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
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)]" />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative backdrop-blur-[5.5px] bg-gradient-to-b from-white to-[#f0f0f0] border-[1.5px] border-[rgba(0,0,0,0.1)] rounded-[16px] shadow-[0px_8px_48px_4px_rgba(59,96,181,0.1)] w-[393px] max-h-[90vh] overflow-y-auto"
          >
            {/* Top gradient overlay */}
            <div className="absolute top-[-1.5px] left-[-1.5px] right-[-1.5px] h-[16px] pointer-events-none mix-blend-darken">
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent rounded-t-[16px]" />
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-[-1.5px] left-[-1.5px] right-[-1.5px] h-[16px] pointer-events-none mix-blend-darken">
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent rounded-b-[16px]" />
            </div>

            {/* Content */}
            <div className="relative p-6">
              {/* CKYC Card */}
              <div className="border border-[rgba(108,132,157,0.18)] rounded-[12px] overflow-hidden">
                {/* Header Image Section */}
                <div className="relative h-[121px] rounded-t-[8px] overflow-hidden">
                  {/* Placeholder image with gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]" />
                  <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)]" />

                  {/* Text overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h3 className="font-['TASA_Orbiter_Display',sans-serif] font-semibold text-[24px] leading-[32px] tracking-[0px] mb-1">
                      Co-Star Network
                    </h3>
                    <p className="font-['Inter',sans-serif] font-medium text-[10px] leading-[16px] tracking-[1px] text-white/88 uppercase">
                      A PRIVATE LIMITED COMPANY
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4 space-y-4">
                  {details.map((detail, index) => (
                    <div key={index}>
                      <div className="flex gap-2 items-start">
                        <p className="font-['Inter',sans-serif] font-normal text-[10px] leading-[14px] text-[#40566d] opacity-50 w-[120px] shrink-0">
                          {detail.label}
                        </p>
                        <div className="flex-1 flex items-start justify-between gap-1 min-w-0">
                          <p className={`font-['Inter',sans-serif] font-medium text-[10px] leading-[14px] tracking-[0px] flex-1 min-w-0 break-words ${
                            detail.verified ? 'text-[#192839]' : 'text-[#768ea7]'
                          }`}>
                            {detail.value}
                          </p>
                          {detail.verified && (
                            <div className="shrink-0 w-3 h-3 flex items-center justify-center">
                              <Check size={9} className="text-[#04c982]" strokeWidth={2.5} />
                            </div>
                          )}
                        </div>
                      </div>
                      {index < details.length - 1 && (
                        <div className="h-[1px] bg-[rgba(0,0,0,0.1)] mt-4" />
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
