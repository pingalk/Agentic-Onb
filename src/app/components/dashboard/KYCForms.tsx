import React, { useState, useEffect } from 'react';
import { GenericFormLayout } from './GenericFormLayout';
import { useFormStore } from './FormStore';
import { motion } from 'motion/react';
import { Check, Globe, Upload, Smartphone, ShoppingCart, Store, CreditCard, Building } from 'lucide-react';
import { Label } from '@/app/components/ui/label';

// Phone & OTP verification form
export const KYCPhoneVerificationForm = () => {
  const { formData, updateField, nextStep, status, requestClose } = useFormStore();
  const [otpSent, setOtpSent] = useState(false);
  const isSubmitting = status === 'submitting';
  const panNumber = formData.panNumber || 'XXXXXXXX';

  const handleSendOTP = () => {
    if (formData.phoneNumber && formData.phoneNumber.length >= 10) {
      setOtpSent(true);
      updateField('otpSent', true);
    }
  };

  const handleVerifyOTP = () => {
    if (formData.otp && formData.otp.length === 6) {
      nextStep();
    }
  };

  const maskedPhone = formData.phoneNumber
    ? 'xxxxxxxxxx'.slice(0, -4) + formData.phoneNumber.slice(-4)
    : 'xxxxxxxxxx';

  return (
    <div className="flex flex-col h-full bg-white">
      <GenericFormLayout.Header
        title="Auto-fill KYC details"
        onClose={requestClose}
      />

      <div className="flex-1 overflow-y-auto">
        <GenericFormLayout.Section
          title={otpSent ? "" : ""}
          description={
            otpSent
              ? `A 6-digit OTP has been sent to your number ${maskedPhone}`
              : `Enter the phone number linked to PAN ${panNumber}`
          }
        >
          <div className="space-y-4">
            {!otpSent ? (
              <GenericFormLayout.InputRow label="Phone Number" required>
                <input
                  type="tel"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => updateField('phoneNumber', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="+91"
                />
              </GenericFormLayout.InputRow>
            ) : (
              <GenericFormLayout.InputRow label="OTP Code" required>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.otp || ''}
                  onChange={(e) => updateField('otp', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center text-2xl tracking-widest"
                  placeholder="000000"
                  autoFocus
                />
              </GenericFormLayout.InputRow>
            )}
          </div>
        </GenericFormLayout.Section>
      </div>

      <GenericFormLayout.Footer
        primaryAction={{
          label: otpSent ? 'Verify OTP' : 'Send OTP',
          onClick: otpSent ? handleVerifyOTP : handleSendOTP,
          isLoading: isSubmitting,
          disabled: otpSent ? (formData.otp?.length !== 6) : (!formData.phoneNumber || formData.phoneNumber.length < 10)
        }}
      />
    </div>
  );
};

// Website entry form
export const KYCWebsiteForm = () => {
  const { formData, updateField, nextStep, requestClose } = useFormStore();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleSubmit = () => {
    if (formData.websiteUrl) {
      setIsScanning(true);
    } else {
      // Skip to next step if no website
      nextStep();
    }
  };

  useEffect(() => {
    if (isScanning && scanProgress < 100) {
      const timer = setInterval(() => {
        setScanProgress(prev => {
          const next = prev + 2;
          if (next >= 100) {
            clearInterval(timer);
            setTimeout(() => nextStep(), 500);
            return 100;
          }
          return next;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isScanning, scanProgress, nextStep]);

  if (isScanning) {
    return (
      <div className="flex flex-col h-full bg-white">
        <GenericFormLayout.Header
          title="Analyzing Website"
          onClose={requestClose}
        />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Scanning your website...</span>
                <span className="font-medium">{scanProgress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                  initial={{ width: '0%' }}
                  animate={{ width: `${scanProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {scanProgress < 30 && '🔍 Scanning homepage...'}
              {scanProgress >= 30 && scanProgress < 60 && '📊 Analyzing business category...'}
              {scanProgress >= 60 && scanProgress < 90 && '🎯 Extracting product information...'}
              {scanProgress >= 90 && '✅ Analysis complete!'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <GenericFormLayout.Header
        title="Website Information"
        onClose={requestClose}
      />

      <div className="flex-1 overflow-y-auto">
        <GenericFormLayout.Section
          title="Do you have a live website?"
          description="Website live? Drop the link here to fast-track your activation."
        >
          <GenericFormLayout.InputRow label="Website URL">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={formData.websiteUrl || ''}
                onChange={(e) => updateField('websiteUrl', e.target.value)}
                className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="https://www.example.com"
              />
            </div>
          </GenericFormLayout.InputRow>
          <p className="text-xs text-gray-500 pl-1 mt-2">
            No pressure if you don't have one—you can add it later
          </p>
        </GenericFormLayout.Section>
      </div>

      <GenericFormLayout.Footer
        primaryAction={{
          label: formData.websiteUrl ? 'Continue' : 'Skip for Now',
          onClick: handleSubmit
        }}
      />
    </div>
  );
};

// Payment channels selection
export const KYCPaymentChannelsForm = () => {
  const { formData, updateField, nextStep, requestClose } = useFormStore();

  const channels = [
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'android', label: 'Android App', icon: Smartphone },
    { id: 'ios', label: 'iOS App', icon: Smartphone },
    { id: 'offline', label: 'Offline Stores', icon: Store },
    { id: 'nocode', label: 'No-code Payments', icon: CreditCard },
    { id: 'others', label: 'Others', icon: ShoppingCart },
  ];

  const selectedChannels = (formData.paymentChannels || []) as string[];

  const toggleChannel = (channelId: string) => {
    const updated = selectedChannels.includes(channelId)
      ? selectedChannels.filter(c => c !== channelId)
      : [...selectedChannels, channelId];
    updateField('paymentChannels', updated);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <GenericFormLayout.Header
        title="Payment Channels"
        onClose={requestClose}
      />

      <div className="flex-1 overflow-y-auto">
        <GenericFormLayout.Section
          title="Where would you like to accept payments?"
          description="Select all that apply—you can always add more later"
        >
          <div className="grid grid-cols-2 gap-3">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const isSelected = selectedChannels.includes(channel.id);
              return (
                <button
                  key={channel.id}
                  onClick={() => toggleChannel(channel.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className={`font-medium text-sm ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                      {channel.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </GenericFormLayout.Section>
      </div>

      <GenericFormLayout.Footer
        primaryAction={{
          label: 'Continue',
          onClick: nextStep,
          disabled: selectedChannels.length === 0
        }}
      />
    </div>
  );
};

// Business model confirmation
export const KYCBusinessModelForm = () => {
  const { formData, updateField, nextStep, requestClose } = useFormStore();
  const [isEditing, setIsEditing] = useState(false);
  const businessModel = formData.businessModel || 'E-commerce for Fashion Accessories';

  const handleChipClick = (confirmed: boolean) => {
    if (confirmed) {
      updateField('businessModelConfirmed', true);
      nextStep();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <GenericFormLayout.Header
        title="Business Model Confirmation"
        onClose={requestClose}
      />

      <div className="flex-1 overflow-y-auto">
        <GenericFormLayout.Section
          title="Confirm your business"
          description="Does this look accurate?"
        >
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Building className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{businessModel}</p>
                  <p className="text-sm text-gray-600">Based on your website</p>
                </div>
              </div>
            </div>

            {!isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={() => handleChipClick(true)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Yes, this is correct
                </button>
                <button
                  onClick={() => handleChipClick(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 transition-colors"
                >
                  No, change
                </button>
              </div>
            ) : (
              <GenericFormLayout.InputRow label="Business Category">
                <input
                  type="text"
                  value={formData.businessModel || ''}
                  onChange={(e) => updateField('businessModel', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Enter your business category"
                />
              </GenericFormLayout.InputRow>
            )}
          </div>
        </GenericFormLayout.Section>
      </div>

      {isEditing && (
        <GenericFormLayout.Footer
          primaryAction={{
            label: 'Confirm',
            onClick: nextStep
          }}
        />
      )}
    </div>
  );
};

// Document upload (non-CKYC users)
export const KYCDocumentUploadForm = () => {
  const { formData, updateField, nextStep, requestClose } = useFormStore();

  return (
    <div className="flex flex-col h-full bg-white">
      <GenericFormLayout.Header
        title="Upload Aadhaar Card"
        onClose={requestClose}
      />

      <div className="flex-1 overflow-y-auto">
        <GenericFormLayout.Section
          title="Document Upload"
          description="Upload front and back of your Aadhaar card"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Aadhaar Front</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Aadhaar Back</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
          </div>
        </GenericFormLayout.Section>
      </div>

      <GenericFormLayout.Footer
        primaryAction={{
          label: 'Continue',
          onClick: nextStep
        }}
      />
    </div>
  );
};

// Address entry (non-CKYC users)
export const KYCAddressEntryForm = () => {
  const { formData, updateField, nextStep, requestClose } = useFormStore();

  return (
    <div className="flex flex-col h-full bg-white">
      <GenericFormLayout.Header
        title="Registered Address"
        onClose={requestClose}
      />

      <div className="flex-1 overflow-y-auto">
        <GenericFormLayout.Section
          title="Business Address"
          description="Enter your complete registered address"
        >
          <div className="space-y-4">
            <GenericFormLayout.InputRow label="Street Address" required>
              <input
                type="text"
                value={formData.registeredAddress || ''}
                onChange={(e) => updateField('registeredAddress', e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Street Address"
              />
            </GenericFormLayout.InputRow>
            <div className="grid grid-cols-2 gap-4">
              <GenericFormLayout.InputRow label="City" required>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="City"
                />
              </GenericFormLayout.InputRow>
              <GenericFormLayout.InputRow label="State" required>
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => updateField('state', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="State"
                />
              </GenericFormLayout.InputRow>
            </div>
            <GenericFormLayout.InputRow label="Pincode" required>
              <input
                type="text"
                maxLength={6}
                value={formData.pincode || ''}
                onChange={(e) => updateField('pincode', e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Pincode"
              />
            </GenericFormLayout.InputRow>
          </div>
        </GenericFormLayout.Section>
      </div>

      <GenericFormLayout.Footer
        primaryAction={{
          label: 'Continue',
          onClick: nextStep,
          disabled: !formData.registeredAddress || !formData.city || !formData.state || !formData.pincode
        }}
      />
    </div>
  );
};

// Review and submit
export const KYCReviewSubmitForm = () => {
  const { formData, nextStep, requestClose } = useFormStore();

  return (
    <div className="flex flex-col h-full bg-white">
      <GenericFormLayout.Header
        title="Review Your Application"
        onClose={requestClose}
      />

      <div className="flex-1 overflow-y-auto">
        <GenericFormLayout.Section
          title="Application Summary"
          description="Review all your details before submitting"
        >
          <div className="space-y-3 divide-y divide-gray-100">
            {formData.phoneNumber && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Phone Number</span>
                <span className="text-sm font-medium text-gray-900">{formData.phoneNumber}</span>
              </div>
            )}
            {formData.panNumber && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">PAN Number</span>
                <span className="text-sm font-medium text-gray-900">{formData.panNumber}</span>
              </div>
            )}
            {formData.websiteUrl && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Website</span>
                <span className="text-sm font-medium text-gray-900">{formData.websiteUrl}</span>
              </div>
            )}
            {formData.businessModel && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Business Model</span>
                <span className="text-sm font-medium text-gray-900">{formData.businessModel}</span>
              </div>
            )}
            {formData.paymentChannels && formData.paymentChannels.length > 0 && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Payment Channels</span>
                <span className="text-sm font-medium text-gray-900">{(formData.paymentChannels as string[]).join(', ')}</span>
              </div>
            )}
            {formData.accountNumber && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Bank Account</span>
                <span className="text-sm font-medium text-gray-900">****{formData.accountNumber.slice(-4)}</span>
              </div>
            )}
          </div>
        </GenericFormLayout.Section>
      </div>

      <GenericFormLayout.Footer
        primaryAction={{
          label: 'Submit Application',
          onClick: nextStep
        }}
      />
    </div>
  );
};

// Bank manual entry
export const KYCBankManualForm = () => {
  const { formData, updateField, nextStep, status, requestClose } = useFormStore();
  const [verifying, setVerifying] = useState(false);
  const isSubmitting = status === 'submitting';

  const handleVerify = () => {
    if (formData.accountNumber && formData.ifscCode) {
      setVerifying(true);
      setTimeout(() => {
        setVerifying(false);
        nextStep();
      }, 3000);
    }
  };

  if (verifying) {
    return (
      <div className="flex flex-col h-full bg-white">
        <GenericFormLayout.Header
          title="Verifying Bank Account"
          onClose={requestClose}
        />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <motion.div
              className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-sm text-gray-600">Penny drop in progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <GenericFormLayout.Header
        title="Manual Bank Verification"
        onClose={requestClose}
      />

      <div className="flex-1 overflow-y-auto">
        <GenericFormLayout.Section
          title="Bank Account Details"
          description="Enter your account details for verification"
        >
          <div className="space-y-4">
            <GenericFormLayout.InputRow label="Account Number" required>
              <input
                type="text"
                value={formData.accountNumber || ''}
                onChange={(e) => updateField('accountNumber', e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Enter your account number"
              />
            </GenericFormLayout.InputRow>
            <GenericFormLayout.InputRow label="IFSC Code" required>
              <input
                type="text"
                value={formData.ifscCode || ''}
                onChange={(e) => updateField('ifscCode', e.target.value.toUpperCase())}
                className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Enter IFSC code"
              />
            </GenericFormLayout.InputRow>
          </div>
        </GenericFormLayout.Section>
      </div>

      <GenericFormLayout.Footer
        primaryAction={{
          label: 'Verify Account',
          onClick: handleVerify,
          isLoading: isSubmitting,
          disabled: !formData.accountNumber || !formData.ifscCode
        }}
      />
    </div>
  );
};

// Bank verification
export const KYCBankVerificationForm = () => {
  const { formData, updateField, nextStep, status, requestClose } = useFormStore();
  const [method, setMethod] = useState<'upi' | 'manual'>('upi');
  const [verifying, setVerifying] = useState(false);
  const isSubmitting = status === 'submitting';

  const handleVerify = () => {
    if (method === 'manual' && formData.accountNumber && formData.ifscCode) {
      setVerifying(true);
      setTimeout(() => {
        setVerifying(false);
        nextStep();
      }, 3000);
    } else if (method === 'upi') {
      nextStep();
    }
  };

  if (verifying) {
    return (
      <div className="flex flex-col h-full bg-white">
        <GenericFormLayout.Header
          title="Verifying Bank Account"
          onClose={requestClose}
        />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <motion.div
              className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-sm text-gray-600">Penny drop in progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <GenericFormLayout.Header
        title="Bank Account Verification"
        onClose={requestClose}
      />

      <div className="flex-1 overflow-y-auto">
        <GenericFormLayout.Section
          title="Link your bank account"
          description="Choose your preferred verification method"
        >
          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={() => setMethod('upi')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  method === 'upi' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="text-sm font-medium">UPI / RazorpayX</div>
                <div className="text-xs text-gray-600 mt-1">Fastest method</div>
              </button>
              <button
                onClick={() => setMethod('manual')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  method === 'manual' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="text-sm font-medium">Manual Entry</div>
                <div className="text-xs text-gray-600 mt-1">Account + IFSC</div>
              </button>
            </div>

            {method === 'upi' && (
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="font-medium">Scan QR to link via UPI</p>
                  <p className="text-sm text-gray-600">Or click below to open RazorpayX app</p>
                </div>
              </div>
            )}

            {method === 'manual' && (
              <div className="space-y-4">
                <GenericFormLayout.InputRow label="Account Number" required>
                  <input
                    type="text"
                    value={formData.accountNumber || ''}
                    onChange={(e) => updateField('accountNumber', e.target.value)}
                    className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Enter your account number"
                  />
                </GenericFormLayout.InputRow>
                <GenericFormLayout.InputRow label="IFSC Code" required>
                  <input
                    type="text"
                    value={formData.ifscCode || ''}
                    onChange={(e) => updateField('ifscCode', e.target.value.toUpperCase())}
                    className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Enter IFSC code"
                  />
                </GenericFormLayout.InputRow>
              </div>
            )}
          </div>
        </GenericFormLayout.Section>
      </div>

      <GenericFormLayout.Footer
        primaryAction={{
          label: method === 'upi' ? 'Open RazorpayX' : 'Verify Account',
          onClick: handleVerify,
          isLoading: isSubmitting,
          disabled: method === 'manual' && (!formData.accountNumber || !formData.ifscCode)
        }}
      />
    </div>
  );
};
