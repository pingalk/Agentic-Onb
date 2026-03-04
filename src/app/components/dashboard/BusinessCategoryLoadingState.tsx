import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import Ray from '@/imports/Ray';

const BUSINESS_CATEGORY_STEPS = [
  'Identifying your business category',
  'Reviewing your website content',
  'Understanding your products/ services',
  'Mapping your business category'
];

interface BusinessCategoryLoadingStateProps {
  onComplete?: () => void;
}

export const BusinessCategoryLoadingState: React.FC<BusinessCategoryLoadingStateProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Progress through steps every 2 seconds
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < BUSINESS_CATEGORY_STEPS.length - 1) {
          return prev + 1;
        } else {
          // All steps completed
          clearInterval(interval);
          if (onComplete) {
            // Call onComplete after a brief delay to show the last step as completed
            setTimeout(onComplete, 500);
          }
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 pl-0"
    >
      {/* Ray Logo */}
      <motion.div
        className="w-4 h-4 shrink-0 mt-0.5"
        animate={{
          rotate: [0, 90, 90, 180, 180, 270, 270, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1],
          times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 1]
        }}
      >
        <Ray static />
      </motion.div>

      {/* Loading Steps */}
      <div className="flex flex-col gap-0">
        {BUSINESS_CATEGORY_STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex items-center gap-2 py-0.5"
            >
              {/* Icon */}
              <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                {isCompleted && (
                  <Check size={12} className="text-[#04c982]" strokeWidth={2.5} />
                )}
                {isActive && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <X size={12} className="text-[#04c982]" strokeWidth={2.5} />
                  </motion.div>
                )}
              </div>

              {/* Step Text */}
              <span
                className="text-[14px] leading-[20px] tracking-[0px] font-['Inter',sans-serif] font-medium"
                style={{
                  background: isActive || isCompleted
                    ? 'linear-gradient(90deg, #04c982 0%, #2581fb 100%)'
                    : '#7d7d7d',
                  WebkitBackgroundClip: isActive || isCompleted ? 'text' : 'unset',
                  backgroundClip: isActive || isCompleted ? 'text' : 'unset',
                  WebkitTextFillColor: isActive || isCompleted ? 'transparent' : '#7d7d7d',
                  color: isActive || isCompleted ? 'transparent' : '#7d7d7d'
                }}
              >
                {step}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
