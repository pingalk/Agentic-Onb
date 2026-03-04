import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { CheckCircle } from 'lucide-react';

interface SuccessAnimationProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  isOpen,
  onComplete
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Reset states
      setShowMessage(false);
      setVideoEnded(false);

      // Play video
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
        // If video fails to play, show message immediately
        setVideoEnded(true);
        setShowMessage(true);
      });
    }
  }, [isOpen]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    // Show message after video ends
    setTimeout(() => {
      setShowMessage(true);
    }, 200);
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-white"
        >
          {/* Video Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              onEnded={handleVideoEnd}
              playsInline
              muted
            >
              <source src="/success-animation.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Success Message Overlay - appears after video ends */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                    delay: 0.2
                  }}
                  className="mb-8"
                >
                  <div className="w-20 h-20 bg-[#04c982] rounded-full flex items-center justify-center">
                    <CheckCircle size={48} className="text-white" strokeWidth={2.5} fill="white" />
                  </div>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-sans text-[32px] font-semibold text-[#04c982] leading-[40px] text-center mb-4"
                >
                  Congratulations!<br />
                  Your application is successfully submitted
                </motion.h1>

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="font-sans text-[16px] text-[#576375] leading-[24px] text-center max-w-xl"
                >
                  Your onboarding is complete. Begin testing payments right away. We'll handle the remaining verification behind the scenes.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
