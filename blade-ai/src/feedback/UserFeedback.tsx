import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type FeedbackType = 'thumbs' | 'rating' | 'emoji';
export type FeedbackValue = 'positive' | 'negative' | number | string;

export interface UserFeedbackProps {
  /** Feedback type */
  type?: FeedbackType;
  /** Callback when feedback is submitted */
  onSubmit?: (value: FeedbackValue, comment?: string) => void;
  /** Show comment input after selection */
  showComment?: boolean;
  /** Comment placeholder */
  commentPlaceholder?: string;
  /** Pre-selected value */
  value?: FeedbackValue | null;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeConfig = {
  sm: { button: 'w-7 h-7', icon: 'w-4 h-4', gap: 'gap-1' },
  md: { button: 'w-9 h-9', icon: 'w-5 h-5', gap: 'gap-2' },
  lg: { button: 'w-11 h-11', icon: 'w-6 h-6', gap: 'gap-3' },
};

const emojis = ['😞', '😐', '🙂', '😊', '😍'];

/**
 * User feedback collector
 *
 * Thumbs up/down, rating, or emoji feedback.
 *
 * @example
 * ```tsx
 * <UserFeedback
 *   type="thumbs"
 *   showComment
 *   onSubmit={(value, comment) => {
 *     sendFeedback({ rating: value, comment });
 *   }}
 * />
 * ```
 */
export const UserFeedback: React.FC<UserFeedbackProps> = ({
  type = 'thumbs',
  onSubmit,
  showComment = false,
  commentPlaceholder = 'Any additional feedback?',
  value: controlledValue,
  size = 'md',
  className = '',
}) => {
  const [selectedValue, setSelectedValue] = useState<FeedbackValue | null>(
    controlledValue ?? null
  );
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { button, icon, gap } = sizeConfig[size];

  const handleSelect = (value: FeedbackValue) => {
    setSelectedValue(value);

    if (showComment) {
      setShowCommentInput(true);
    } else {
      handleSubmit(value);
    }
  };

  const handleSubmit = (value?: FeedbackValue) => {
    const finalValue = value ?? selectedValue;
    if (finalValue !== null) {
      onSubmit?.(finalValue, comment || undefined);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        className={`flex items-center gap-2 text-sm text-slate-500 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Thanks for your feedback!
      </motion.div>
    );
  }

  const renderThumbs = () => (
    <div className={`flex ${gap}`}>
      <motion.button
        onClick={() => handleSelect('positive')}
        className={`
          ${button} rounded-lg flex items-center justify-center
          transition-colors
          ${
            selectedValue === 'positive'
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
          }
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Thumbs up"
      >
        <svg className={icon} fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
      </motion.button>

      <motion.button
        onClick={() => handleSelect('negative')}
        className={`
          ${button} rounded-lg flex items-center justify-center
          transition-colors
          ${
            selectedValue === 'negative'
              ? 'bg-red-100 text-red-600'
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
          }
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Thumbs down"
      >
        <svg className={icon} fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
        </svg>
      </motion.button>
    </div>
  );

  const renderRating = () => (
    <div className={`flex ${gap}`}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <motion.button
          key={rating}
          onClick={() => handleSelect(rating)}
          className={`
            ${button} rounded-lg flex items-center justify-center
            transition-colors
            ${
              selectedValue !== null && rating <= (selectedValue as number)
                ? 'bg-amber-100 text-amber-500'
                : 'bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-amber-400'
            }
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Rate ${rating} star${rating > 1 ? 's' : ''}`}
        >
          <svg className={icon} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </motion.button>
      ))}
    </div>
  );

  const renderEmoji = () => (
    <div className={`flex ${gap}`}>
      {emojis.map((emoji, index) => (
        <motion.button
          key={index}
          onClick={() => handleSelect(emoji)}
          className={`
            ${button} rounded-lg flex items-center justify-center text-xl
            transition-colors
            ${
              selectedValue === emoji
                ? 'bg-blue-100 ring-2 ring-blue-400'
                : 'bg-slate-100 hover:bg-slate-200'
            }
          `}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`React with ${emoji}`}
        >
          {emoji}
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className={className}>
      {type === 'thumbs' && renderThumbs()}
      {type === 'rating' && renderRating()}
      {type === 'emoji' && renderEmoji()}

      <AnimatePresence>
        {showCommentInput && (
          <motion.div
            className="mt-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={commentPlaceholder}
              className="w-full p-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <button
              onClick={() => handleSubmit()}
              className="mt-2 px-3 py-1.5 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Submit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserFeedback;
