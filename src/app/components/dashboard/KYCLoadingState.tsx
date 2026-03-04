import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import Ray from '@/imports/Ray';

const KYC_STEPS = [
  'Securely connecting to CERSAI…',
  'Starting KYC verification...',
  'Fetching your Central KYC records…',
  'Validating submitted documents…',
  'Completing identity checks...'
];

export const KYCLoadingState: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Progress through steps every 2 seconds
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < KYC_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-1 pl-0"
    >
      {KYC_STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -5 }}
              animate={{
                opacity: isPending ? 0.5 : 1,
                x: 0
              }}
              transition={{
                delay: index * 0.1,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.3 }
              }}
              className="flex items-center gap-3 py-1"
            >
              {/* Icon */}
              <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isCompleted && (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <Check size={16} className="text-[#04c982]" strokeWidth={2.5} />
                    </motion.div>
                  )}
                  {isActive && (
                    <motion.div
                      key="active"
                      className="w-6 h-6"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        rotate: 360
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        scale: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                        opacity: { duration: 0.2 },
                        rotate: { duration: 2, repeat: Infinity, ease: 'linear' }
                      }}
                      style={{ '--fill-0': '#04c982' } as React.CSSProperties}
                    >
                      <Ray static />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step Text */}
              <motion.span
                className="text-[16px] leading-[24px] tracking-[0px] font-['Inter',sans-serif] font-medium"
                animate={{
                  opacity: isPending ? 0.5 : 1
                }}
                transition={{ duration: 0.3 }}
                style={{
                  background: isActive || isCompleted
                    ? 'linear-gradient(90deg, #04c982 0%, #2581fb 100%)'
                    : '#cbd5e0',
                  WebkitBackgroundClip: isActive || isCompleted ? 'text' : 'unset',
                  backgroundClip: isActive || isCompleted ? 'text' : 'unset',
                  WebkitTextFillColor: isActive || isCompleted ? 'transparent' : '#cbd5e0',
                  color: isActive || isCompleted ? 'transparent' : '#cbd5e0'
                }}
              >
                {step}
              </motion.span>
            </motion.div>
          );
        })}
    </motion.div>
  );
};
