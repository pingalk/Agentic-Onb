import React from 'react';
import { motion } from 'motion/react';

export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperStepStatus = 'pending' | 'active' | 'complete' | 'error';

export interface StepperStep {
  /** Step ID */
  id: string;
  /** Step label */
  label: string;
  /** Optional description */
  description?: string;
  /** Step status (overrides automatic detection) */
  status?: StepperStepStatus;
}

export interface StepperProps {
  /** Steps configuration */
  steps: StepperStep[];
  /** Currently active step (0-indexed) */
  activeStep: number;
  /** Orientation */
  orientation?: StepperOrientation;
  /** Click handler for steps */
  onStepClick?: (stepIndex: number, step: StepperStep) => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeConfig = {
  sm: { circle: 'w-6 h-6', text: 'text-xs', lineWidth: 'h-0.5', lineHeight: 'w-0.5' },
  md: { circle: 'w-8 h-8', text: 'text-sm', lineWidth: 'h-0.5', lineHeight: 'w-0.5' },
  lg: { circle: 'w-10 h-10', text: 'text-base', lineWidth: 'h-1', lineHeight: 'w-1' },
};

const statusStyles: Record<StepperStepStatus, { bg: string; border: string; text: string }> = {
  pending: { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-400' },
  active: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-white' },
  complete: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-white' },
  error: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-white' },
};

/**
 * Step indicator
 *
 * Visual stepper for multi-step processes.
 *
 * @example
 * ```tsx
 * <Stepper
 *   steps={[
 *     { id: 'details', label: 'Details' },
 *     { id: 'review', label: 'Review' },
 *     { id: 'confirm', label: 'Confirm' }
 *   ]}
 *   activeStep={1}
 *   onStepClick={(index) => goToStep(index)}
 * />
 * ```
 */
export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  onStepClick,
  size = 'md',
  className = '',
}) => {
  const { circle, text, lineWidth, lineHeight } = sizeConfig[size];

  const getStepStatus = (index: number, step: StepperStep): StepperStepStatus => {
    if (step.status) return step.status;
    if (index < activeStep) return 'complete';
    if (index === activeStep) return 'active';
    return 'pending';
  };

  const isVertical = orientation === 'vertical';

  return (
    <div
      className={`
        flex
        ${isVertical ? 'flex-col' : 'flex-row items-center'}
        ${className}
      `}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index, step);
        const styles = statusStyles[status];
        const isClickable = onStepClick && status !== 'pending';
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div
              className={`
                flex
                ${isVertical ? 'flex-row items-start' : 'flex-col items-center'}
                ${isClickable ? 'cursor-pointer' : ''}
              `}
              onClick={isClickable ? () => onStepClick(index, step) : undefined}
            >
              {/* Circle */}
              <motion.div
                className={`
                  ${circle} rounded-full
                  flex items-center justify-center
                  border-2 ${styles.border} ${styles.bg}
                  ${styles.text}
                  font-semibold ${text}
                  transition-colors
                `}
                whileHover={isClickable ? { scale: 1.1 } : undefined}
                whileTap={isClickable ? { scale: 0.95 } : undefined}
              >
                {status === 'complete' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : status === 'error' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>

              {/* Label & description */}
              <div
                className={`
                  ${isVertical ? 'ml-3' : 'mt-2 text-center'}
                `}
              >
                <span
                  className={`
                    block font-medium ${text}
                    ${status === 'pending' ? 'text-slate-400' : 'text-slate-900'}
                  `}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="block text-xs text-slate-500 mt-0.5">
                    {step.description}
                  </span>
                )}
              </div>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={`
                  ${
                    isVertical
                      ? `${lineHeight} h-8 ml-4 my-2`
                      : `${lineWidth} flex-1 mx-3 min-w-8`
                  }
                  ${index < activeStep ? 'bg-emerald-300' : 'bg-slate-200'}
                  rounded-full
                  transition-colors
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
