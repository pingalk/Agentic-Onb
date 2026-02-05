import { useState, useCallback, useMemo } from 'react';

export interface WizardStep<T> {
  /** Step ID */
  id: string;
  /** Step title */
  title: string;
  /** Fields that belong to this step */
  fields?: (keyof T)[];
  /** Validation function for this step */
  validate?: (data: Partial<T>) => boolean | string | Promise<boolean | string>;
  /** Whether step can be skipped */
  optional?: boolean;
}

export interface UseFormWizardOptions<T> {
  /** Wizard steps configuration */
  steps: WizardStep<T>[];
  /** Initial form data */
  initialData?: Partial<T>;
  /** Callback when wizard completes */
  onComplete?: (data: T) => void | Promise<void>;
  /** Callback on step change */
  onStepChange?: (stepIndex: number, step: WizardStep<T>) => void;
}

export interface UseFormWizardReturn<T> {
  /** Current step index */
  currentStep: number;
  /** Current step configuration */
  currentStepConfig: WizardStep<T>;
  /** Total number of steps */
  totalSteps: number;
  /** Whether on first step */
  isFirstStep: boolean;
  /** Whether on last step */
  isLastStep: boolean;
  /** Form data */
  data: Partial<T>;
  /** Step validation errors */
  errors: Record<string, string>;
  /** Whether form is submitting */
  isSubmitting: boolean;
  /** Whether current step is valid */
  isStepValid: boolean;
  /** Go to next step */
  next: () => Promise<boolean>;
  /** Go to previous step */
  prev: () => void;
  /** Go to specific step */
  goToStep: (index: number) => void;
  /** Update form data */
  updateData: (updates: Partial<T>) => void;
  /** Set a specific field value */
  setField: <K extends keyof T>(field: K, value: T[K]) => void;
  /** Validate current step */
  validateStep: () => Promise<boolean>;
  /** Validate all steps */
  validateAll: () => Promise<boolean>;
  /** Submit the form */
  submit: () => Promise<void>;
  /** Reset the wizard */
  reset: () => void;
  /** Get step status */
  getStepStatus: (index: number) => 'pending' | 'active' | 'complete' | 'error';
  /** Check if step is accessible */
  canAccessStep: (index: number) => boolean;
}

/**
 * Hook for managing multi-step wizard form state
 *
 * @example
 * ```tsx
 * interface FormData {
 *   name: string;
 *   email: string;
 *   plan: string;
 *   amount: number;
 * }
 *
 * const {
 *   currentStep,
 *   currentStepConfig,
 *   data,
 *   next,
 *   prev,
 *   updateData,
 *   isLastStep,
 *   submit
 * } = useFormWizard<FormData>({
 *   steps: [
 *     {
 *       id: 'details',
 *       title: 'Customer Details',
 *       fields: ['name', 'email'],
 *       validate: (data) => !!data.name && !!data.email
 *     },
 *     {
 *       id: 'plan',
 *       title: 'Select Plan',
 *       fields: ['plan', 'amount'],
 *       validate: (data) => !!data.plan && (data.amount ?? 0) > 0
 *     },
 *     { id: 'review', title: 'Review & Confirm' }
 *   ],
 *   onComplete: async (data) => {
 *     await submitToServer(data);
 *   }
 * });
 * ```
 */
export function useFormWizard<T extends Record<string, unknown>>(
  options: UseFormWizardOptions<T>
): UseFormWizardReturn<T> {
  const { steps, initialData = {}, onComplete, onStepChange } = options;

  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<T>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentStepConfig = steps[currentStep];
  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const isStepValid = useMemo(() => {
    const stepConfig = steps[currentStep];
    if (!stepConfig.fields) return true;
    return stepConfig.fields.every((field) => data[field] !== undefined && data[field] !== '');
  }, [currentStep, data, steps]);

  const validateStep = useCallback(async (): Promise<boolean> => {
    const stepConfig = steps[currentStep];

    if (!stepConfig.validate) {
      return true;
    }

    try {
      const result = await stepConfig.validate(data);

      if (result === true) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[stepConfig.id];
          return newErrors;
        });
        return true;
      }

      const errorMessage = typeof result === 'string' ? result : 'Validation failed';
      setErrors((prev) => ({ ...prev, [stepConfig.id]: errorMessage }));
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Validation error';
      setErrors((prev) => ({ ...prev, [stepConfig.id]: errorMessage }));
      return false;
    }
  }, [currentStep, data, steps]);

  const validateAll = useCallback(async (): Promise<boolean> => {
    let allValid = true;
    const newErrors: Record<string, string> = {};

    for (const step of steps) {
      if (step.validate) {
        try {
          const result = await step.validate(data);
          if (result !== true) {
            allValid = false;
            newErrors[step.id] = typeof result === 'string' ? result : 'Validation failed';
          }
        } catch (error) {
          allValid = false;
          newErrors[step.id] = error instanceof Error ? error.message : 'Validation error';
        }
      }
    }

    setErrors(newErrors);
    return allValid;
  }, [data, steps]);

  const next = useCallback(async (): Promise<boolean> => {
    const isValid = await validateStep();

    if (!isValid && !steps[currentStep].optional) {
      return false;
    }

    if (currentStep < totalSteps - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setVisitedSteps((prev) => new Set([...prev, nextStep]));
      onStepChange?.(nextStep, steps[nextStep]);
      return true;
    }

    return false;
  }, [currentStep, totalSteps, validateStep, steps, onStepChange]);

  const prev = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep, steps[prevStep]);
    }
  }, [currentStep, steps, onStepChange]);

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSteps && visitedSteps.has(index)) {
        setCurrentStep(index);
        onStepChange?.(index, steps[index]);
      }
    },
    [totalSteps, visitedSteps, steps, onStepChange]
  );

  const updateData = useCallback((updates: Partial<T>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const submit = useCallback(async (): Promise<void> => {
    const isValid = await validateAll();

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onComplete?.(data as T);
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
    } finally {
      setIsSubmitting(false);
    }
  }, [validateAll, onComplete, data, currentStep]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setData(initialData);
    setErrors({});
    setIsSubmitting(false);
    setVisitedSteps(new Set([0]));
    setCompletedSteps(new Set());
  }, [initialData]);

  const getStepStatus = useCallback(
    (index: number): 'pending' | 'active' | 'complete' | 'error' => {
      if (errors[steps[index]?.id]) return 'error';
      if (index === currentStep) return 'active';
      if (completedSteps.has(index)) return 'complete';
      return 'pending';
    },
    [currentStep, completedSteps, errors, steps]
  );

  const canAccessStep = useCallback(
    (index: number): boolean => {
      return visitedSteps.has(index);
    },
    [visitedSteps]
  );

  return {
    currentStep,
    currentStepConfig,
    totalSteps,
    isFirstStep,
    isLastStep,
    data,
    errors,
    isSubmitting,
    isStepValid,
    next,
    prev,
    goToStep,
    updateData,
    setField,
    validateStep,
    validateAll,
    submit,
    reset,
    getStepStatus,
    canAccessStep,
  };
}

export default useFormWizard;
