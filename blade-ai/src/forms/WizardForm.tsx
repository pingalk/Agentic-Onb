import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FormStep, type StepStatus } from './FormStep';

export interface WizardStep {
  /** Step ID */
  id: string;
  /** Step title */
  title: string;
  /** Step content renderer */
  content: (props: WizardStepProps) => React.ReactNode;
  /** Validation function */
  validate?: (data: Record<string, unknown>) => boolean | string;
  /** Summary generator */
  getSummary?: (data: Record<string, unknown>) => string;
}

export interface WizardStepProps {
  /** Current step data */
  data: Record<string, unknown>;
  /** Update step data */
  updateData: (updates: Record<string, unknown>) => void;
  /** Go to next step */
  next: () => void;
  /** Go to previous step */
  prev: () => void;
  /** Is this the last step */
  isLast: boolean;
  /** Is this the first step */
  isFirst: boolean;
}

export interface WizardFormProps {
  /** Wizard steps */
  steps: WizardStep[];
  /** Called when wizard completes */
  onComplete: (data: Record<string, unknown>) => void;
  /** Initial form data */
  initialData?: Record<string, unknown>;
  /** Called when step changes */
  onStepChange?: (stepIndex: number, stepId: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Show step indicators */
  showStepIndicators?: boolean;
}

/**
 * Multi-step wizard form
 *
 * Orchestrates a multi-step form with validation and navigation.
 *
 * @example
 * ```tsx
 * <WizardForm
 *   steps={[
 *     {
 *       id: 'details',
 *       title: 'Payment Details',
 *       content: ({ data, updateData, next }) => (
 *         <PaymentDetailsStep
 *           data={data}
 *           onChange={updateData}
 *           onNext={next}
 *         />
 *       ),
 *       validate: (data) => !!data.amount,
 *       getSummary: (data) => `Amount: ${data.amount}`
 *     },
 *     {
 *       id: 'confirm',
 *       title: 'Confirm',
 *       content: ({ data, prev }) => (
 *         <ConfirmStep data={data} onBack={prev} />
 *       )
 *     }
 *   ]}
 *   onComplete={(data) => processPayment(data)}
 * />
 * ```
 */
export const WizardForm: React.FC<WizardFormProps> = ({
  steps,
  onComplete,
  initialData = {},
  onStepChange,
  className = '',
  showStepIndicators = true,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [data, setData] = useState<Record<string, unknown>>(initialData);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<number, string>>({});

  const updateData = (updates: Record<string, unknown>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const getStepStatus = (index: number): StepStatus => {
    if (errors[index]) return 'error';
    if (completedSteps.has(index)) return 'complete';
    if (index === currentStepIndex) return 'active';
    return 'pending';
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      // Can only go to completed steps or current step
      if (index <= currentStepIndex || completedSteps.has(index - 1)) {
        setCurrentStepIndex(index);
        onStepChange?.(index, steps[index].id);
      }
    }
  };

  const next = () => {
    const step = steps[currentStepIndex];

    // Validate current step
    if (step.validate) {
      const result = step.validate(data);
      if (result !== true) {
        setErrors((prev) => ({
          ...prev,
          [currentStepIndex]: typeof result === 'string' ? result : 'Validation failed',
        }));
        return;
      }
    }

    // Clear any errors
    setErrors((prev) => {
      const next = { ...prev };
      delete next[currentStepIndex];
      return next;
    });

    // Mark step as complete
    setCompletedSteps((prev) => new Set([...prev, currentStepIndex]));

    // Go to next step or complete
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onStepChange?.(nextIndex, steps[nextIndex].id);
    } else {
      onComplete(data);
    }
  };

  const prev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onStepChange?.(prevIndex, steps[prevIndex].id);
    }
  };

  const stepProps: WizardStepProps = {
    data,
    updateData,
    next,
    prev,
    isLast: currentStepIndex === steps.length - 1,
    isFirst: currentStepIndex === 0,
  };

  return (
    <div className={className}>
      {/* Progress indicators */}
      {showStepIndicators && (
        <div className="flex items-center gap-2 mb-6">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = status !== 'pending';

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => goToStep(index)}
                  disabled={!isClickable}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-full
                    text-sm font-medium
                    transition-colors
                    ${
                      status === 'active'
                        ? 'bg-blue-100 text-blue-700'
                        : status === 'complete'
                          ? 'bg-emerald-100 text-emerald-700'
                          : status === 'error'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-400'
                    }
                    ${isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
                  `}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-current/20">
                    {status === 'complete' ? '✓' : index + 1}
                  </span>
                  <span className="hidden sm:inline">{step.title}</span>
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 max-w-8
                      ${completedSteps.has(index) ? 'bg-emerald-300' : 'bg-slate-200'}
                    `}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Steps */}
      <div className="space-y-0">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isExpanded = index === currentStepIndex;
          const summary = step.getSummary?.(data);

          return (
            <FormStep
              key={step.id}
              title={step.title}
              stepNumber={index + 1}
              status={status}
              summary={summary}
              isExpanded={isExpanded}
              onToggle={() => goToStep(index)}
              showConnector={index < steps.length - 1}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {step.content(stepProps)}

                {/* Error message */}
                {errors[index] && (
                  <p className="text-sm text-red-500 mt-2">{errors[index]}</p>
                )}
              </motion.div>
            </FormStep>
          );
        })}
      </div>
    </div>
  );
};

export default WizardForm;
