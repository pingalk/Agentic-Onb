import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Check, Sparkles, Upload, ExternalLink, Building, MapPin, Globe, Smartphone, ShoppingCart, Store, CreditCard } from 'lucide-react';

// Step type definition
type KYCStep =
  | 'intro'
  | 'phone-ckyc'
  | 'otp-verify'
  | 'documents-ckyc'
  | 'documents-upload'
  | 'address-entry'
  | 'website-entry'
  | 'website-scraping'
  | 'payment-channels'
  | 'business-model'
  | 'additional-docs'
  | 'bank-verification'
  | 'bank-manual'
  | 'penny-drop'
  | 'review-submit'
  | 'success';

interface KYCState {
  hasCKYC: boolean;
  phoneNumber: string;
  otp: string;
  panNumber: string;
  aadharFront: File | null;
  aadharBack: File | null;
  registeredAddress: string;
  state: string;
  city: string;
  pincode: string;
  hasWebsite: boolean;
  websiteUrl: string;
  paymentChannels: string[];
  businessCategory: string;
  businessModel: string;
  additionalDoc: File | null;
  accountNumber: string;
  ifscCode: string;
  upiSuccess: boolean;
  applicationSubmitted: boolean;
}

export const KYCOnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<KYCStep>('intro');
  const [state, setState] = useState<KYCState>({
    hasCKYC: true,
    phoneNumber: '',
    otp: '',
    panNumber: 'XXXPK1234X',
    aadharFront: null,
    aadharBack: null,
    registeredAddress: '',
    state: '',
    city: '',
    pincode: '',
    hasWebsite: false,
    websiteUrl: '',
    paymentChannels: [],
    businessCategory: '',
    businessModel: 'E-commerce for Fashion Accessories',
    additionalDoc: null,
    accountNumber: '',
    ifscCode: '',
    upiSuccess: false,
    applicationSubmitted: false,
  });

  const updateState = (updates: Partial<KYCState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleNext = (nextStep: KYCStep) => {
    setCurrentStep(nextStep);
  };

  // Ray intro message
  const IntroStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Hello! Starting KYC now</h2>
            <p className="text-base text-gray-600">
              I'm here to handle your onboarding so you can get back to building. I'll ask a few quick questions to get you set up.
            </p>
          </div>
          <Button
            onClick={() => handleNext(state.hasCKYC ? 'phone-ckyc' : 'website-entry')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Let's get started
          </Button>
        </div>
      </div>
    </motion.div>
  );

  // Phone number entry for CKYC
  const PhoneCKYCStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Share your phone number linked to your PAN or Aadhaar</h3>
            <p className="text-sm text-gray-600">
              I'll fetch your business details directly from the Central KYC registry (CERSAI). I'll handle the heavy lifting so you don't have to upload a single extra document.
            </p>
          </div>

          <Card className="p-6 border-gray-200">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Auto-fill KYC details</h4>
                  <Badge variant="secondary" className="text-xs">Secure</Badge>
                </div>
                <p className="text-sm text-gray-600">Enter the phone number linked to PAN {state.panNumber}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 "
                  value={state.phoneNumber}
                  onChange={(e) => updateState({ phoneNumber: e.target.value })}
                  className="text-base"
                />
              </div>
              <Button
                onClick={() => handleNext('otp-verify')}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={state.phoneNumber.length < 10}
              >
                Send OTP
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // OTP Verification
  const OTPVerifyStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <Card className="p-6 border-gray-200">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Auto-fill KYC details</h4>
                <p className="text-sm text-gray-600">
                  A 6-digit OTP has been sent to your number {state.phoneNumber.slice(-4).padStart(10, 'x')}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={state.otp}
                  onChange={(e) => updateState({ otp: e.target.value })}
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              <Button
                onClick={() => handleNext('documents-ckyc')}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={state.otp.length !== 6}
              >
                Verify OTP
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // Documents from CKYC
  const DocumentsCKYCStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Here is the information we were able to fetch</h3>
            <p className="text-sm text-gray-600">
              Great news! We've retrieved the official documents for your business linked to PAN {state.panNumber}. Take a quick look to confirm everything is current.
            </p>
          </div>

          <Card className="p-6 border-gray-200 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">PAN Card</p>
                    <p className="text-xs text-gray-600">{state.panNumber}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-700 border-green-700">Verified</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Aadhaar Card</p>
                    <p className="text-xs text-gray-600">xxxx xxxx 1234</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-700 border-green-700">Verified</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Business Address</p>
                    <p className="text-xs text-gray-600">Fetched from CKYC</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-700 border-green-700">Verified</Badge>
              </div>
            </div>
            <Button
              onClick={() => handleNext('website-entry')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Confirm & Continue
            </Button>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // Website Entry
  const WebsiteEntryStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Do you have a live existing website?</h3>
            <p className="text-sm text-gray-600">
              Website live? Drop the links here. No pressure if they aren't handy—you can add them later. I only suggest doing it now to fast-track your activation.
            </p>
          </div>

          <Card className="p-6 border-gray-200">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.example.com"
                      value={state.websiteUrl}
                      onChange={(e) => updateState({ websiteUrl: e.target.value, hasWebsite: true })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleNext('website-scraping')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!state.websiteUrl}
                >
                  Continue with Website
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleNext('payment-channels')}
                  className="flex-1"
                >
                  I don't have a website
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // Document Upload (for non-CKYC users)
  const DocumentsUploadStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Let's get the paperwork out of the way</h3>
            <p className="text-sm text-gray-600">
              To keep things moving, please upload a PDF or a quick photo of your Aadhar card, we need the front and back of the card.
            </p>
          </div>

          <Card className="p-6 border-gray-200">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Aadhaar Card - Front</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Aadhaar Card - Back</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>
              <Button
                onClick={() => handleNext('address-entry')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Continue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // Address Entry (for non-CKYC users)
  const AddressEntryStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Tell us where you're based</h3>
            <p className="text-sm text-gray-600">
              To keep your records accurate, please share your registered address (don't forget the State, City, and Pincode!). Just a quick type-in and RAY takes care of the rest.
            </p>
          </div>

          <Card className="p-6 border-gray-200">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Registered Address</Label>
                <Input
                  id="address"
                  placeholder="Street Address"
                  value={state.registeredAddress}
                  onChange={(e) => updateState({ registeredAddress: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={state.city}
                    onChange={(e) => updateState({ city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="State"
                    value={state.state}
                    onChange={(e) => updateState({ state: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  placeholder="Pincode"
                  maxLength={6}
                  value={state.pincode}
                  onChange={(e) => updateState({ pincode: e.target.value })}
                />
              </div>
              <Button
                onClick={() => handleNext('website-entry')}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!state.registeredAddress || !state.city || !state.state || !state.pincode}
              >
                Continue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // Bank Manual Entry
  const BankManualStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Let's try another way to get you set up</h3>
            <p className="text-sm text-gray-600">
              UPI didn't go through, but no worries—RAY can still get your bank verified. Just enter your Account Number and IFSC code below. Type out the details clearly.
            </p>
          </div>

          <Card className="p-6 border-gray-200">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account">Account Number</Label>
                <Input
                  id="account"
                  placeholder="Enter your account number"
                  value={state.accountNumber}
                  onChange={(e) => updateState({ accountNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifsc">IFSC Code</Label>
                <Input
                  id="ifsc"
                  placeholder="Enter IFSC code"
                  value={state.ifscCode}
                  onChange={(e) => updateState({ ifscCode: e.target.value.toUpperCase() })}
                />
              </div>
              <Button
                onClick={() => handleNext('penny-drop')}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!state.accountNumber || !state.ifscCode}
              >
                Verify Bank Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // Penny Drop Animation
  const PennyDropStep = () => {
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setVerifying(false);
        setTimeout(() => handleNext('review-submit'), 1500);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <motion.div
              animate={{ rotate: verifying ? 360 : 0 }}
              transition={{ duration: 2, repeat: verifying ? Infinity : 0, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {verifying ? 'Verifying your bank account...' : 'Bank account verified!'}
              </h3>
              <p className="text-sm text-gray-600">
                {verifying
                  ? 'We\'re sending a small test amount to your account to verify it.'
                  : 'Your bank details have been confirmed successfully.'}
              </p>
            </div>

            <Card className="p-6 border-gray-200">
              <div className="space-y-4">
                {verifying ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <p className="text-sm text-gray-600">Penny drop in progress...</p>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center py-8"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">Verification Complete</p>
                        <p className="text-sm text-gray-600">Account {state.accountNumber.slice(-4).padStart(10, 'x')}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    );
  };

  // Website Scraping Animation
  const WebsiteScrapingStep = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => handleNext('business-model'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(timer);
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Analyzing your website...</h3>
              <p className="text-sm text-gray-600">
                I'm scanning your website to understand your business model. This will just take a moment.
              </p>
            </div>

            <Card className="p-6 border-gray-200">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <AnimatePresence mode="wait">
                    {progress < 30 && (
                      <motion.p
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-gray-600"
                      >
                        🔍 Scanning homepage...
                      </motion.p>
                    )}
                    {progress >= 30 && progress < 60 && (
                      <motion.p
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-gray-600"
                      >
                        📊 Analyzing business category...
                      </motion.p>
                    )}
                    {progress >= 60 && progress < 90 && (
                      <motion.p
                        key="extracting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-gray-600"
                      >
                        🎯 Extracting product information...
                      </motion.p>
                    )}
                    {progress >= 90 && (
                      <motion.p
                        key="complete"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-green-600"
                      >
                        ✅ Analysis complete!
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    );
  };

  // Payment Channels Selection
  const PaymentChannelsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Where would you like to accept payments?</h3>
            <p className="text-sm text-gray-600">
              Select the options that are relevant to you, you can always add more once you are fully onboarded
            </p>
          </div>

          <Card className="p-6 border-gray-200">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'website', label: 'Website', icon: Globe },
                  { id: 'android', label: 'Android App', icon: Smartphone },
                  { id: 'ios', label: 'iOS App', icon: Smartphone },
                  { id: 'offline', label: 'Offline Stores', icon: Store },
                  { id: 'nocode', label: 'No-code Payment Methods', icon: CreditCard },
                  { id: 'others', label: 'Others', icon: ShoppingCart },
                ].map((channel) => {
                  const Icon = channel.icon;
                  const isSelected = state.paymentChannels.includes(channel.id);
                  return (
                    <button
                      key={channel.id}
                      onClick={() => {
                        const updated = isSelected
                          ? state.paymentChannels.filter(c => c !== channel.id)
                          : [...state.paymentChannels, channel.id];
                        updateState({ paymentChannels: updated });
                      }}
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
              <Button
                onClick={() => handleNext('business-model')}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={state.paymentChannels.length === 0}
              >
                Continue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // Business Model Confirmation
  const BusinessModelStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Please confirm your business model</h3>
            <p className="text-sm text-gray-600">
              I've had a quick look at your website and it looks like you're building an awesome {state.businessModel}. Does that sound about right? We just want to make sure we have your business category spot on so we can tailor everything to your needs.
            </p>
          </div>

          <Card className="p-6 border-gray-200">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Building className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{state.businessModel}</p>
                    <p className="text-sm text-gray-600">Based on your website</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleNext('bank-verification')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Yes, this is correct
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Allow user to change - in real app would show selection
                    alert('In production, this would show business category selection');
                  }}
                  className="flex-1"
                >
                  No, change
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // Bank Verification
  const BankVerificationStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Which bank account would you like to collect payments in?</h3>
            <p className="text-sm text-gray-600">
              Linking your bank via UPI is the fastest way to get you paid.
            </p>
          </div>

          <Card className="p-6 border-gray-200">
            <div className="space-y-4">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="font-medium">Scan QR to link via UPI</p>
                  <p className="text-sm text-gray-600">Or click below to open RazorpayX app</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleNext('review-submit')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Open RazorpayX
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleNext('bank-manual')}
                  className="flex-1"
                >
                  Enter Manually
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // Review & Submit
  const ReviewSubmitStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Thanks! We have received all your details</h3>
            <p className="text-sm text-gray-600">
              You're all done with your application, review all your details before you submit to ensure that we have captured all details correctly. Are you ready to review before final submit?
            </p>
          </div>

          <Card className="p-6 border-gray-200 space-y-4">
            <div className="space-y-3">
              <DetailRow label="Phone Number" value={state.phoneNumber} />
              <DetailRow label="PAN Number" value={state.panNumber} />
              <DetailRow label="Business Model" value={state.businessModel} />
              <DetailRow label="Payment Channels" value={state.paymentChannels.join(', ')} />
              {state.websiteUrl && <DetailRow label="Website" value={state.websiteUrl} />}
            </div>
            <Button
              onClick={() => handleNext('success')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Submit Application
            </Button>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // Success Screen
  const SuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">You're officially in!</h2>
            <p className="text-base text-gray-600">
              Now relax while the formal checks happen. We're sending a little surprise in the meantime.
            </p>
          </div>

          <Card className="p-6 border-green-200 bg-green-50">
            <div className="space-y-3">
              <p className="font-medium text-green-900">Your application has been submitted!</p>
              <p className="text-sm text-green-800">
                While the banks do their thing, keep an eye out for a little something sweet from us.
              </p>
              <div className="pt-3 border-t border-green-200">
                <p className="text-xs font-medium text-green-900 mb-1">Delivery Address:</p>
                <p className="text-sm text-green-800">{state.registeredAddress || '123 Business Street, Mumbai, MH 400001'}</p>
              </div>
            </div>
          </Card>

          <Button
            onClick={() => window.location.href = '/'}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return <IntroStep />;
      case 'phone-ckyc':
        return <PhoneCKYCStep />;
      case 'otp-verify':
        return <OTPVerifyStep />;
      case 'documents-ckyc':
        return <DocumentsCKYCStep />;
      case 'documents-upload':
        return <DocumentsUploadStep />;
      case 'address-entry':
        return <AddressEntryStep />;
      case 'website-entry':
        return <WebsiteEntryStep />;
      case 'website-scraping':
        return <WebsiteScrapingStep />;
      case 'payment-channels':
        return <PaymentChannelsStep />;
      case 'business-model':
        return <BusinessModelStep />;
      case 'bank-verification':
        return <BankVerificationStep />;
      case 'bank-manual':
        return <BankManualStep />;
      case 'penny-drop':
        return <PennyDropStep />;
      case 'review-submit':
        return <ReviewSubmitStep />;
      case 'success':
        return <SuccessStep />;
      default:
        return <IntroStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper component for detail rows
const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);
