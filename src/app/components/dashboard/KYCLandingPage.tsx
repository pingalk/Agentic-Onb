import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface KYCLandingPageProps {
  onPhoneSubmit: (phoneNumber: string, otp: string) => void;
}

export const KYCLandingPage: React.FC<KYCLandingPageProps> = ({ onPhoneSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const panNumber = 'XXXXXXXX';

  const handleSendOTP = () => {
    if (phoneNumber.length >= 10) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setOtpSent(true);
      }, 800);
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      setIsSubmitting(true);
      setTimeout(() => {
        onPhoneSubmit(phoneNumber, otp);
      }, 800);
    }
  };

  const maskedPhone = phoneNumber
    ? 'xxxxxxxxxx'.slice(0, -4) + phoneNumber.slice(-4)
    : 'xxxxxxxxxx';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {!otpSent ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Ray Branding */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Hello! Starting KYC now</h1>
                  <p className="text-lg text-gray-600 mt-2">
                    I'm here to handle your onboarding so you can get back to building.
                  </p>
                </div>
              </div>

              {/* Phone Entry Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              >
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Share your phone number linked to your PAN or Aadhaar
                    </h2>
                    <p className="text-sm text-gray-600">
                      I'll fetch your business details directly from the Central KYC registry (CERSAI).
                      I'll handle the heavy lifting so you don't have to upload a single extra document.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <p className="text-xs text-gray-500">
                        Enter the phone number linked to PAN {panNumber}
                      </p>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full h-12 px-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="+91"
                        disabled={isSubmitting}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && phoneNumber.length >= 10) {
                            handleSendOTP();
                          }
                        }}
                      />
                    </div>

                    <button
                      onClick={handleSendOTP}
                      disabled={phoneNumber.length < 10 || isSubmitting}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                      {isSubmitting ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Ray Branding */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Verify your number</h1>
                  <p className="text-lg text-gray-600 mt-2">
                    We've sent a code to {maskedPhone}
                  </p>
                </div>
              </div>

              {/* OTP Entry Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              >
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Enter the 6-digit code
                    </h2>
                    <p className="text-sm text-gray-600">
                      A 6-digit OTP has been sent to your number {maskedPhone}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        OTP Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full h-16 px-4 text-center text-3xl tracking-[0.5em] font-medium border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="000000"
                        autoFocus
                        disabled={isSubmitting}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && otp.length === 6) {
                            handleVerifyOTP();
                          }
                        }}
                      />
                    </div>

                    <button
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6 || isSubmitting}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                      {isSubmitting ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <>
                          Verify & Continue
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setOtpSent(false)}
                      className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                      disabled={isSubmitting}
                    >
                      Change phone number
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          Powered by Ray AI • Secure & Encrypted
        </motion.p>
      </div>
    </div>
  );
};
