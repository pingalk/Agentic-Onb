import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface VoiceInputProps {
  /** Called when recording state changes */
  onRecording?: (isRecording: boolean) => void;
  /** Called with transcript when speech is recognized */
  onTranscript?: (transcript: string) => void;
  /** Called on error */
  onError?: (error: string) => void;
  /** Current recording state (controlled) */
  isRecording?: boolean;
  /** Disable the button */
  disabled?: boolean;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeMap: Record<string, { button: string; icon: string }> = {
  sm: { button: 'w-8 h-8', icon: 'w-4 h-4' },
  md: { button: 'w-10 h-10', icon: 'w-5 h-5' },
  lg: { button: 'w-12 h-12', icon: 'w-6 h-6' },
};

/**
 * Voice recording button
 *
 * Button that activates voice input with visual feedback.
 * Uses Web Speech API for transcription when available.
 *
 * @example
 * ```tsx
 * const [isRecording, setIsRecording] = useState(false);
 *
 * <VoiceInput
 *   isRecording={isRecording}
 *   onRecording={setIsRecording}
 *   onTranscript={(text) => setInput(text)}
 *   onError={(err) => toast.error(err)}
 * />
 * ```
 */
export const VoiceInput: React.FC<VoiceInputProps> = ({
  onRecording,
  onTranscript,
  onError,
  isRecording: controlledIsRecording,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const [internalIsRecording, setInternalIsRecording] = useState(false);
  const isRecording = controlledIsRecording ?? internalIsRecording;

  const { button, icon } = sizeMap[size];

  const toggleRecording = useCallback(() => {
    if (disabled) return;

    // Check for Speech Recognition API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError?.('Speech recognition is not supported in this browser');
      return;
    }

    if (!isRecording) {
      // Start recording
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setInternalIsRecording(true);
        onRecording?.(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript?.(transcript);
      };

      recognition.onerror = (event: any) => {
        setInternalIsRecording(false);
        onRecording?.(false);
        onError?.(event.error || 'Speech recognition error');
      };

      recognition.onend = () => {
        setInternalIsRecording(false);
        onRecording?.(false);
      };

      try {
        recognition.start();
      } catch (err) {
        onError?.('Failed to start speech recognition');
      }
    } else {
      // Stop recording is handled by the recognition.onend
      setInternalIsRecording(false);
      onRecording?.(false);
    }
  }, [disabled, isRecording, onRecording, onTranscript, onError]);

  return (
    <motion.button
      onClick={toggleRecording}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      className={`
        ${button}
        rounded-full
        flex items-center justify-center
        relative
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${
          isRecording
            ? 'bg-red-500 text-white'
            : disabled
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }
        ${className}
      `}
      aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
    >
      {/* Pulsing ring when recording */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 0, 0.5],
            }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-red-500"
          />
        )}
      </AnimatePresence>

      {/* Microphone icon */}
      <svg
        className={`${icon} relative z-10`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    </motion.button>
  );
};

export default VoiceInput;
