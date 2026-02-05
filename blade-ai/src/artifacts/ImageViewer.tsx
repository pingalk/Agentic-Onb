import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface ImageViewerProps {
  /** Image source URL */
  src: string;
  /** Alt text */
  alt?: string;
  /** Enable zoom on click */
  zoomable?: boolean;
  /** Caption text */
  caption?: string;
  /** Aspect ratio (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Maximum height */
  maxHeight?: number | string;
  /** Object fit */
  fit?: 'cover' | 'contain' | 'fill';
  /** Additional CSS classes */
  className?: string;
  /** Called when image fails to load */
  onError?: () => void;
}

/**
 * Image viewer with optional zoom
 *
 * Displays an image with optional lightbox zoom functionality.
 *
 * @example
 * ```tsx
 * <ImageViewer
 *   src="/chart.png"
 *   alt="Monthly revenue chart"
 *   caption="Revenue trends for Q4 2024"
 *   zoomable
 *   aspectRatio="16/9"
 * />
 * ```
 */
export const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  alt = '',
  zoomable = true,
  caption,
  aspectRatio,
  maxHeight = 400,
  fit = 'contain',
  className = '',
  onError,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div
        className={`
          flex flex-col items-center justify-center
          bg-slate-100 rounded-lg
          p-8 text-slate-400
          ${className}
        `}
        style={{
          aspectRatio,
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        }}
      >
        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <>
      {/* Image container */}
      <figure className={`relative ${className}`}>
        <div
          className={`
            overflow-hidden rounded-lg bg-slate-100
            ${zoomable ? 'cursor-zoom-in' : ''}
          `}
          style={{
            aspectRatio,
            maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
          }}
          onClick={zoomable ? () => setIsZoomed(true) : undefined}
        >
          <img
            src={src}
            alt={alt}
            onError={handleError}
            className={`
              w-full h-full
              ${fit === 'cover' ? 'object-cover' : ''}
              ${fit === 'contain' ? 'object-contain' : ''}
              ${fit === 'fill' ? 'object-fill' : ''}
            `}
          />

          {/* Zoom hint */}
          {zoomable && (
            <div
              className="
                absolute inset-0
                flex items-center justify-center
                bg-black/0 hover:bg-black/10
                transition-colors
              "
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="
                  p-2 rounded-full bg-white/90 shadow-lg
                  opacity-0 group-hover:opacity-100
                "
              >
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </motion.div>
            </div>
          )}
        </div>

        {/* Caption */}
        {caption && (
          <figcaption className="mt-2 text-sm text-slate-500 text-center">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="
              fixed inset-0 z-50
              flex items-center justify-center
              bg-black/80 cursor-zoom-out
              p-4
            "
            onClick={() => setIsZoomed(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="
                absolute top-4 right-4
                p-2 rounded-full
                bg-white/10 text-white
                hover:bg-white/20
                transition-colors
              "
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Zoomed image */}
            <motion.img
              src={src}
              alt={alt}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Caption */}
            {caption && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  absolute bottom-4 left-0 right-0
                  text-center text-white/80 text-sm
                "
              >
                {caption}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageViewer;
