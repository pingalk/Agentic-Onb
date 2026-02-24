// src/data/demoConfig.ts

// Flow types for query-based routing
export type FlowType = 'settlement' | 'double_debit' | 'refund' | 'support' | 'payment_link' | 'failed_payment' | null;

// Helper to detect flow type from user query
export const detectFlowType = (query: string): FlowType => {
  const text = query.toLowerCase();

  // Settlement flow
  if (text.includes('settlement') || text.includes('when is my next') || text.includes('upcoming settlement') || text.includes('instant settlement')) {
    return 'settlement';
  }

  // Double debit flow
  if (text.includes('double') || text.includes('charged twice') || text.includes('arvind') || text.includes('duplicate payment')) {
    return 'double_debit';
  }

  // Refund flow
  if (text.includes('refund') || text.includes('unauthorized') || text.includes('auto-capture')) {
    return 'refund';
  }

  // Support flow
  if (text.includes('ticket') || text.includes('support') || text.includes('escalate')) {
    return 'support';
  }

  // Payment link flow
  if (text.includes('payment link') || text.includes('create link') || text.includes('send link')) {
    return 'payment_link';
  }

  // Failed payment flow
  if (text.includes('failed') || text.includes('timeout') || text.includes('bank issue')) {
    return 'failed_payment';
  }

  return null;
};

// Landing page configuration
export const LANDING_CONFIG = {
  greeting: "Good afternoon",
  subGreeting: "What can I do for you today?",
};
