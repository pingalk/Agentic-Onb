import React, { createContext, useContext, ReactNode } from 'react';
import { useActionFlow } from './ActionAccordion';

// Define the extended interface
type FormContextType = ReturnType<typeof useActionFlow> & {
    divergenceCount: number;
    incrementDivergence: () => void;
    resetDivergence: () => void;
    focusTrigger?: number;
    triggerFocus?: () => void;
};

const FormContext = createContext<FormContextType | null>(null);

export const FormProvider = ({
  children,
  initialKycData
}: {
  children: ReactNode;
  initialKycData?: { phone: string; otp: string } | null;
}) => {
  const [divergenceCount, setDivergenceCount] = React.useState(0);
  const [focusTrigger, setFocusTrigger] = React.useState(0);

  const incrementDivergence = () => setDivergenceCount(c => c + 1);
  const resetDivergence = () => setDivergenceCount(0);
  const triggerFocus = () => setFocusTrigger(c => c + 1);

  const flow = useActionFlow();

  // Initialize KYC data if provided
  React.useEffect(() => {
    if (initialKycData) {
      flow.updateField('phoneNumber', initialKycData.phone);
      flow.updateField('otp', initialKycData.otp);
      flow.updateField('otpSent', true);
      flow.updateField('panNumber', 'XXXXXXXX');
    }
  }, [initialKycData]);
  
  // Extend the flow object with our new state
  const extendedFlow: FormContextType = {
      ...flow,
      divergenceCount,
      incrementDivergence,
      resetDivergence,
      focusTrigger,
      triggerFocus
  };

  return (
    <FormContext.Provider value={extendedFlow}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormStore = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormStore must be used within a FormProvider');
  }
  return context;
};
