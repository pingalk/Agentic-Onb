import React, { useState } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'user' | 'assistant';

const sizeMap: Record<AvatarSize, { container: string; text: string }> = {
  xs: { container: 'w-5 h-5', text: 'text-[10px]' },
  sm: { container: 'w-6 h-6', text: 'text-xs' },
  md: { container: 'w-8 h-8', text: 'text-sm' },
  lg: { container: 'w-10 h-10', text: 'text-base' },
  xl: { container: 'w-12 h-12', text: 'text-lg' },
};

const variantStyles: Record<AvatarVariant, string> = {
  user: 'bg-blue-100 text-blue-700',
  assistant: 'bg-emerald-100 text-emerald-700',
};

export interface AvatarProps {
  /** Image source URL */
  src?: string;
  /** Fallback text (initials or single character) */
  fallback?: string;
  /** Alt text for image */
  alt?: string;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Variant determines color scheme */
  variant?: AvatarVariant;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Avatar component for user or assistant representation
 *
 * Displays an image avatar with fallback to initials. Supports different
 * sizes and color variants for distinguishing users from AI assistants.
 *
 * @example
 * ```tsx
 * // User avatar with image
 * <Avatar src="/user.jpg" alt="John Doe" variant="user" />
 *
 * // Assistant avatar with fallback
 * <Avatar fallback="AI" variant="assistant" size="lg" />
 *
 * // User avatar with initials
 * <Avatar fallback="JD" variant="user" />
 * ```
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  fallback,
  alt = '',
  size = 'md',
  variant = 'user',
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const showFallback = !src || imageError;

  const { container, text } = sizeMap[size];

  // Get initials from fallback (max 2 characters)
  const initials = fallback?.slice(0, 2).toUpperCase() || '?';

  return (
    <div
      className={`
        ${container}
        shrink-0 rounded-full overflow-hidden
        flex items-center justify-center
        ${showFallback ? variantStyles[variant] : ''}
        ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className={`${text} font-medium select-none`}>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
