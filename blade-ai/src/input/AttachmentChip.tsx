import React from 'react';
import { motion } from 'motion/react';

export type AttachmentType = 'image' | 'file' | 'document' | 'video' | 'audio';

export interface AttachmentChipProps {
  /** File name to display */
  filename: string;
  /** Type of attachment for icon */
  type?: AttachmentType;
  /** Preview URL for images */
  preview?: string;
  /** File size in bytes */
  size?: number;
  /** Upload progress (0-100) */
  progress?: number;
  /** Called when remove button clicked */
  onRemove?: () => void;
  /** Called when chip clicked */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Show as error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
}

const typeIcons: Record<AttachmentType, React.ReactNode> = {
  image: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  file: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  ),
  document: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  video: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  ),
  audio: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
      />
    </svg>
  ),
};

/**
 * Attached file display chip
 *
 * Shows an attached file with icon, name, optional preview, and remove button.
 * Supports upload progress indication.
 *
 * @example
 * ```tsx
 * // Image with preview
 * <AttachmentChip
 *   filename="screenshot.png"
 *   type="image"
 *   preview="/preview.jpg"
 *   onRemove={() => removeFile(id)}
 * />
 *
 * // File with progress
 * <AttachmentChip
 *   filename="document.pdf"
 *   type="document"
 *   size={1024000}
 *   progress={65}
 * />
 *
 * // Error state
 * <AttachmentChip
 *   filename="large-file.zip"
 *   type="file"
 *   error
 *   errorMessage="File too large"
 *   onRemove={() => removeFile(id)}
 * />
 * ```
 */
export const AttachmentChip: React.FC<AttachmentChipProps> = ({
  filename,
  type = 'file',
  preview,
  size,
  progress,
  onRemove,
  onClick,
  className = '',
  error = false,
  errorMessage,
}) => {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isUploading = progress !== undefined && progress < 100;
  const truncatedName =
    filename.length > 20 ? filename.slice(0, 8) + '...' + filename.slice(-8) : filename;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`
        inline-flex items-center gap-2
        px-3 py-2 rounded-lg
        text-sm
        ${error ? 'bg-red-50 border border-red-200' : 'bg-slate-100 border border-slate-200'}
        ${onClick ? 'cursor-pointer hover:bg-slate-200' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Preview or Icon */}
      {type === 'image' && preview ? (
        <img
          src={preview}
          alt={filename}
          className="w-8 h-8 rounded object-cover"
        />
      ) : (
        <span className={error ? 'text-red-500' : 'text-slate-500'}>
          {typeIcons[type]}
        </span>
      )}

      {/* File info */}
      <div className="flex flex-col min-w-0">
        <span
          className={`truncate font-medium ${error ? 'text-red-700' : 'text-slate-700'}`}
          title={filename}
        >
          {truncatedName}
        </span>
        {(size || errorMessage) && (
          <span className={`text-xs ${error ? 'text-red-500' : 'text-slate-400'}`}>
            {error && errorMessage ? errorMessage : size ? formatBytes(size) : ''}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {isUploading && (
        <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      )}

      {/* Remove button */}
      {onRemove && !isUploading && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={`
            p-1 rounded-full
            hover:bg-slate-300
            transition-colors
            ${error ? 'text-red-500 hover:bg-red-100' : 'text-slate-400'}
          `}
          aria-label="Remove attachment"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </motion.div>
  );
};

export default AttachmentChip;
