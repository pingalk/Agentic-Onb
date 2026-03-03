import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SparkRipplesBackground } from './SparkRipplesBackground';
import { useDemo } from '../../../context/DemoContext';
import { useMagicColor } from '../../../context/MagicColorContext';
import Ray from '../../../imports/Ray';

interface KYCLandingPageProps {
  onPhoneSubmit: (phoneNumber: string, otp: string) => void;
}

export const KYCLandingPage: React.FC<KYCLandingPageProps> = ({ onPhoneSubmit }) => {
  const [step, setStep] = useState<'video' | 'pan' | 'panConfirm' | 'phone' | 'otp'>('video');
  const [panNumber, setPanNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animPhase, setAnimPhase] = useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const panTransitionVideoRef = React.useRef<HTMLVideoElement>(null);

  const { gradientConfig, sparkRipplesConfig } = useDemo();
  const { config: currentMagicColor } = useMagicColor();

  // Handle video timeupdate to stop 2.8 seconds before end
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const timeRemaining = video.duration - video.currentTime;

      // Stop video 2.8 seconds before the end and transition
      if (timeRemaining <= 2.8 && timeRemaining > 0) {
        video.pause();
        setStep('pan');
        setAnimPhase(3); // Show card immediately
      }
    }
  };

  const handleSkipVideo = () => {
    setStep('pan');
    setAnimPhase(3); // Show card immediately
  };

  // Entry animation sequence for form steps
  useEffect(() => {
    if (step !== 'video') {
      const t1 = setTimeout(() => setAnimPhase(1), 200);  // Ray appears
      const t2 = setTimeout(() => setAnimPhase(2), 600);  // Title
      const t3 = setTimeout(() => setAnimPhase(3), 1000); // Card appears
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [step]);

  const handlePanSubmit = () => {
    if (panNumber.length === 10) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep('panConfirm');
        setAnimPhase(3); // Reset to show card
      }, 800);
    }
  };

  const handlePanConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('phone');
      setAnimPhase(3); // Reset to show card
    }, 800);
  };

  const handleSendOTP = () => {
    if (phoneNumber.length >= 10) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep('otp');
        setAnimPhase(3); // Reset to show card
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: step === 'video' ? '#000000' : '#f8f8f8' }}>
      {/* SparkRipples Background - only for form steps */}
      {step !== 'intro' && (
        <SparkRipplesBackground
          className="absolute inset-0"
          opacity={0.3}
          muted={true}
          loop={false}
          playbackRate={0.8}
        />
      )}
      <div className={`relative z-10 w-full ${step === 'video' ? '' : 'max-w-2xl p-6'}`}>
        <AnimatePresence mode="wait">
          {step === 'video' ? (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black"
            >
              {/* Full-screen Video */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                onTimeUpdate={handleVideoTimeUpdate}
                src="/kyc-intro.mp4"
              />

              {/* Skip Button */}
              <button
                onClick={handleSkipVideo}
                className="absolute top-6 right-6 z-20 px-4 py-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white font-sans text-[14px] rounded-lg transition-all"
              >
                Skip
              </button>
            </motion.div>
          ) : step === 'pan' ? (
            <motion.div
              key="pan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* PAN Entry Card - Figma glass morphism style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{
                  opacity: animPhase >= 3 ? 1 : 0,
                  scale: animPhase >= 3 ? 1 : 0.96
                }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="relative backdrop-blur-[5.5px] bg-gradient-to-b from-white to-[#f0f0f0] border-[1.5px] border-[rgba(0,0,0,0.1)] rounded-[16px] shadow-[0px_8px_48px_4px_rgba(59,96,181,0.1)] overflow-hidden"
              >
                {/* Inner shadow for depth */}
                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_1px_white]" />

                <div className="relative p-8 space-y-6">
                  {/* Title with gradient inside card */}
                  <motion.div
                    initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                    animate={{
                      opacity: animPhase >= 2 ? 1 : 0,
                      y: animPhase >= 2 ? 0 : 8,
                      filter: animPhase >= 2 ? 'blur(0px)' : 'blur(8px)'
                    }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center space-y-3"
                  >
                    <h1
                      className="font-sans font-normal text-[32px] leading-[38px] text-transparent bg-clip-text text-center"
                      style={{
                        backgroundImage: 'linear-gradient(90deg, rgb(5, 5, 5) 0%, rgb(46, 66, 165) 37.048%, rgb(46, 66, 165) 73.478%, rgb(5, 5, 5) 100%)'
                      }}
                    >
                      Tell us your Business PAN
                    </h1>
                    <p className="font-sans font-normal text-[14px] leading-[20px] tracking-[-0.182px] text-[rgba(0,0,0,0.56)] text-center">
                      If you are not registered, enter your personal PAN
                    </p>
                  </motion.div>

                  <div className="space-y-4">
                    {/* Large PAN input field */}
                    <input
                      type="text"
                      maxLength={10}
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="w-full h-[60px] px-5 text-center font-sans text-[40px] leading-[46px] font-medium text-[rgba(0,0,0,0.32)] border-0 bg-transparent focus:outline-none focus:text-[#020202] transition-colors uppercase tracking-wide placeholder:text-[rgba(0,0,0,0.32)] placeholder:normal-case"
                      placeholder="Enter PAN"
                      disabled={isSubmitting}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && panNumber.length === 10) {
                          handlePanSubmit();
                        }
                      }}
                    />

                    <button
                      onClick={handlePanSubmit}
                      disabled={panNumber.length !== 10 || isSubmitting}
                      className="relative w-full h-12 border border-[#0354e0] rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans font-medium text-[14px] tracking-[-0.112px] transition-all flex items-center justify-center gap-2 overflow-hidden"
                      style={{
                        backgroundImage: 'linear-gradient(-23.46deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)'
                      }}
                    >
                      {/* Glass effect inset shadows */}
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_0px_#0e54cc,inset_0px_0px_0px_0.5px_#1566f1,inset_0px_-2px_0px_0px_rgba(255,255,255,0.18),inset_0px_1.5px_0px_0px_rgba(255,255,255,0.32)]" />
                      {isSubmitting ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : step === 'panConfirm' ? (
            <motion.div
              key="panConfirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* PAN Confirmation Card - Figma glass morphism style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{
                  opacity: animPhase >= 3 ? 1 : 0,
                  scale: animPhase >= 3 ? 1 : 0.96
                }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="relative backdrop-blur-[5.5px] bg-gradient-to-b from-white to-[#f0f0f0] border-[1.5px] border-[rgba(0,0,0,0.1)] rounded-[16px] shadow-[0px_8px_48px_4px_rgba(59,96,181,0.1)] overflow-hidden"
              >
                {/* Inner shadow for depth */}
                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_1px_white]" />

                <div className="relative p-8 space-y-6">
                  {/* Back Link */}
                  <button
                    onClick={() => setStep('pan')}
                    className="font-sans font-medium text-[14px] leading-[20px] tracking-[-0.182px] text-[rgba(0,0,0,0.72)] hover:text-[#0e54cc] transition-colors flex items-center gap-1"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back
                  </button>

                  {/* Title with gradient */}
                  <motion.div
                    initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                    animate={{
                      opacity: animPhase >= 2 ? 1 : 0,
                      y: animPhase >= 2 ? 0 : 8,
                      filter: animPhase >= 2 ? 'blur(0px)' : 'blur(8px)'
                    }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center space-y-3"
                  >
                    <h1
                      className="font-sans font-normal text-[32px] leading-[38px] text-transparent bg-clip-text text-center"
                      style={{
                        backgroundImage: 'linear-gradient(90deg, rgb(5, 5, 5) 0%, rgb(46, 66, 165) 37.048%, rgb(46, 66, 165) 73.478%, rgb(5, 5, 5) 100%)'
                      }}
                    >
                      Confirm your PAN details
                    </h1>
                    <p className="font-sans font-normal text-[14px] leading-[20px] tracking-[-0.182px] text-[rgba(0,0,0,0.56)] text-center">
                      Make sure all the details are correct
                    </p>
                  </motion.div>

                  {/* Video Area */}
                  <div className="flex items-center justify-center py-8">
                    <div className="w-full max-w-[356px] h-[188px] rounded-[9.3px] overflow-hidden p-[1px]">
                      <video
                        ref={panTransitionVideoRef}
                        className="w-full h-full object-cover rounded-[8.3px]"
                        autoPlay
                        muted
                        loop
                        playsInline
                        src="/pan-transition.mov"
                      />
                    </div>
                  </div>

                  {/* Confirm Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={handlePanConfirm}
                      disabled={isSubmitting}
                      className="relative w-[362px] h-12 border border-[#0354e0] rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans font-medium text-[14px] tracking-[-0.112px] transition-all flex items-center justify-center gap-2 overflow-hidden"
                      style={{
                        backgroundImage: 'linear-gradient(-23.46deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)'
                      }}
                    >
                      {/* Glass effect inset shadows */}
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_0px_#0e54cc,inset_0px_0px_0px_0.5px_#1566f1,inset_0px_-2px_0px_0px_rgba(255,255,255,0.18),inset_0px_1.5px_0px_0px_rgba(255,255,255,0.32)]" />
                      {isSubmitting ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <>
                          Confirm and proceed
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : step === 'phone' ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Ray Icon + Branding */}
              <motion.div className="text-center space-y-6">
                {/* Ray Icon with spring animation matching RayDashboard */}
                <motion.div
                  className="inline-block w-[64px] h-[64px]"
                  style={{ '--fill-0': currentMagicColor.primary } as React.CSSProperties}
                  initial={{ opacity: 0, rotate: -90, scale: 0.3 }}
                  animate={{
                    opacity: animPhase >= 1 ? 1 : 0,
                    rotate: animPhase >= 1 ? 0 : -90,
                    scale: animPhase >= 1 ? 1 : 0.3
                  }}
                  transition={{
                    opacity: { duration: 0.5 },
                    rotate: {
                      type: "spring",
                      stiffness: 100,
                      damping: 10,
                      duration: 1.5
                    },
                    scale: {
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                      duration: 1.2
                    }
                  }}
                >
                  <Ray static />
                </motion.div>

                {/* Title with character animation */}
                <motion.div
                  initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                  animate={{
                    opacity: animPhase >= 2 ? 1 : 0,
                    y: animPhase >= 2 ? 0 : 8,
                    filter: animPhase >= 2 ? 'blur(0px)' : 'blur(8px)'
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="space-y-3"
                >
                  <h1 className="font-sans font-normal text-[28px] md:text-[40px] leading-[36px] md:leading-[48px] tracking-[-0.5px] text-[#020202]">
                    Share your phone number
                  </h1>
                  <p className="font-sans font-normal text-[16px] md:text-[18px] leading-[24px] tracking-[-0.2px] text-[#40566d]">
                    Enter the phone number linked to PAN {panNumber}
                  </p>
                </motion.div>
              </motion.div>

              {/* Phone Entry Card - Figma glass morphism style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{
                  opacity: animPhase >= 3 ? 1 : 0,
                  scale: animPhase >= 3 ? 1 : 0.96
                }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="relative backdrop-blur-[5.5px] bg-gradient-to-b from-white to-[#f0f0f0] border-[1.5px] border-[rgba(0,0,0,0.1)] rounded-[16px] shadow-[0px_8px_48px_4px_rgba(59,96,181,0.1)] overflow-hidden"
              >
                {/* Inner shadow for depth */}
                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_1px_white]" />

                <div className="relative p-8 space-y-6">
                  <div className="space-y-3">
                    <h2 className="font-sans text-[18px] font-medium text-[#020202] leading-[24px] tracking-[-0.2px]">
                      Share your phone number linked to your PAN or Aadhaar
                    </h2>
                    <p className="font-sans text-[14px] text-[#40566d] leading-[20px]">
                      I'll fetch your business details directly from the Central KYC registry (CERSAI).
                      I'll handle the heavy lifting so you don't have to upload a single extra document.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-sans text-[13px] font-medium text-[#192839]">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full h-14 px-5 font-sans text-[16px] border-2 border-gray-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                        placeholder="+91"
                        disabled={isSubmitting}
                        autoFocus
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
                      className="relative w-full h-12 border border-[#0354e0] rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans font-medium text-[14px] tracking-[-0.112px] transition-all flex items-center justify-center gap-2 overflow-hidden"
                      style={{
                        backgroundImage: 'linear-gradient(-23.46deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)'
                      }}
                    >
                      {/* Glass effect inset shadows */}
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_0px_#0e54cc,inset_0px_0px_0px_0.5px_#1566f1,inset_0px_-2px_0px_0px_rgba(255,255,255,0.18),inset_0px_1.5px_0px_0px_rgba(255,255,255,0.32)]" />
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
          ) : step === 'otp' ? (
            <motion.div
              key="otp"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Ray Icon + Branding */}
              <div className="text-center space-y-6">
                {/* Ray Icon */}
                <div
                  className="inline-block w-[64px] h-[64px]"
                  style={{ '--fill-0': currentMagicColor.primary } as React.CSSProperties}
                >
                  <Ray static />
                </div>

                {/* Title */}
                <div className="space-y-3">
                  <h1 className="font-sans font-normal text-[28px] md:text-[40px] leading-[36px] md:leading-[48px] tracking-[-0.5px] text-[#020202]">
                    Verify your number
                  </h1>
                  <p className="font-sans font-normal text-[16px] md:text-[18px] leading-[24px] tracking-[-0.2px] text-[#40566d]">
                    We've sent a code to {maskedPhone}
                  </p>
                </div>
              </div>

              {/* OTP Entry Card - Figma glass morphism style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="relative backdrop-blur-[5.5px] bg-gradient-to-b from-white to-[#f0f0f0] border-[1.5px] border-[rgba(0,0,0,0.1)] rounded-[16px] shadow-[0px_8px_48px_4px_rgba(59,96,181,0.1)] overflow-hidden"
              >
                {/* Inner shadow for depth */}
                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_1px_white]" />

                <div className="relative p-8 space-y-6">
                  <div className="space-y-3">
                    <h2 className="font-sans text-[18px] font-medium text-[#020202] leading-[24px] tracking-[-0.2px]">
                      Enter the 6-digit code
                    </h2>
                    <p className="font-sans text-[14px] text-[#40566d] leading-[20px]">
                      A 6-digit OTP has been sent to your number {maskedPhone}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-sans text-[13px] font-medium text-[#192839]">
                        OTP Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full h-16 px-4 text-center font-sans text-3xl tracking-[0.5em] font-medium border-2 border-gray-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
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
                      className="relative w-full h-12 border border-[#0354e0] rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans font-medium text-[14px] tracking-[-0.112px] transition-all flex items-center justify-center gap-2 overflow-hidden"
                      style={{
                        backgroundImage: 'linear-gradient(-23.46deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)'
                      }}
                    >
                      {/* Glass effect inset shadows */}
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_0px_#0e54cc,inset_0px_0px_0px_0.5px_#1566f1,inset_0px_-2px_0px_0px_rgba(255,255,255,0.18),inset_0px_1.5px_0px_0px_rgba(255,255,255,0.32)]" />
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
                      onClick={() => setStep('phone')}
                      className="w-full font-sans text-[14px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      disabled={isSubmitting}
                    >
                      Change phone number
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};
