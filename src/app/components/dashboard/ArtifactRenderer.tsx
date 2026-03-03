import React from 'react';
import { useFormStore } from './FormStore';
import { SubscriptionFlatForm, PaymentLinkFlatForm } from './FlatForms';
import { TransactionDetailsArtifact } from './TransactionDetailsArtifact';
import {
  KYCPhoneVerificationForm,
  KYCWebsiteForm,
  KYCPaymentChannelsForm,
  KYCBusinessModelForm,
  KYCBankVerificationForm,
  KYCDocumentUploadForm,
  KYCAddressEntryForm,
  KYCReviewSubmitForm,
  KYCBankManualForm
} from './KYCForms';

interface ArtifactRendererProps {
  intent?: string;
}

export const ArtifactRenderer: React.FC<ArtifactRendererProps> = () => {
  const { intent } = useFormStore();

  if (intent === 'view_transaction') {
    return <TransactionDetailsArtifact />;
  }

  if (intent === 'create_subscription') {
    return <SubscriptionFlatForm />;
  }

  if (intent === 'create_payment_link') {
    return <PaymentLinkFlatForm />;
  }

  // KYC Onboarding forms
  if (intent === 'kyc_phone_verification') {
    return <KYCPhoneVerificationForm />;
  }

  if (intent === 'kyc_website') {
    return <KYCWebsiteForm />;
  }

  if (intent === 'kyc_payment_channels') {
    return <KYCPaymentChannelsForm />;
  }

  if (intent === 'kyc_business_model') {
    return <KYCBusinessModelForm />;
  }

  if (intent === 'kyc_bank_verification') {
    return <KYCBankVerificationForm />;
  }

  if (intent === 'kyc_document_upload') {
    return <KYCDocumentUploadForm />;
  }

  if (intent === 'kyc_address_entry') {
    return <KYCAddressEntryForm />;
  }

  if (intent === 'kyc_review_submit') {
    return <KYCReviewSubmitForm />;
  }

  if (intent === 'kyc_bank_manual') {
    return <KYCBankManualForm />;
  }

  // Default fallback
  return (
      <div className="flex items-center justify-center h-full text-slate-400">
          Unknown Intent: {intent}
      </div>
  );
};
