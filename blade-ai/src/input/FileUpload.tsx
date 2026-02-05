import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type FileUploadVariant = 'dropzone' | 'button';

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress?: number;
}

export interface FileUploadProps {
  /** Accepted file types (e.g., "image/*,.pdf") */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Called when files are selected/dropped */
  onUpload: (files: File[]) => void;
  /** Called on error */
  onError?: (error: string) => void;
  /** Display variant */
  variant?: FileUploadVariant;
  /** Allow multiple files */
  multiple?: boolean;
  /** Disable upload */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom button label */
  buttonLabel?: string;
  /** Dropzone label */
  dropzoneLabel?: string;
}

/**
 * Drag-drop file upload component
 *
 * Supports both dropzone and button variants with file validation.
 *
 * @example
 * ```tsx
 * // Dropzone
 * <FileUpload
 *   accept="image/*,.pdf"
 *   maxSize={5 * 1024 * 1024}
 *   onUpload={(files) => handleFiles(files)}
 *   variant="dropzone"
 *   multiple
 * />
 *
 * // Button
 * <FileUpload
 *   accept="image/*"
 *   onUpload={(files) => handleFiles(files)}
 *   variant="button"
 *   buttonLabel="Attach Image"
 * />
 * ```
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSize,
  maxFiles = 10,
  onUpload,
  onError,
  variant = 'dropzone',
  multiple = true,
  disabled = false,
  className = '',
  buttonLabel = 'Upload File',
  dropzoneLabel = 'Drop files here or click to browse',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFiles = useCallback(
    (files: FileList | File[]): File[] => {
      const fileArray = Array.from(files);
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of fileArray) {
        if (validFiles.length >= maxFiles) {
          errors.push(`Maximum ${maxFiles} files allowed`);
          break;
        }

        if (maxSize && file.size > maxSize) {
          errors.push(`${file.name} exceeds maximum size of ${formatBytes(maxSize)}`);
          continue;
        }

        // Check file type if accept is specified
        if (accept) {
          const acceptedTypes = accept.split(',').map((t) => t.trim());
          const isAccepted = acceptedTypes.some((type) => {
            if (type.startsWith('.')) {
              return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
            if (type.endsWith('/*')) {
              return file.type.startsWith(type.replace('/*', '/'));
            }
            return file.type === type;
          });

          if (!isAccepted) {
            errors.push(`${file.name} is not an accepted file type`);
            continue;
          }
        }

        validFiles.push(file);
      }

      if (errors.length > 0 && onError) {
        onError(errors[0]);
      }

      return validFiles;
    },
    [accept, maxSize, maxFiles, onError]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        onUpload(validFiles);
      }
    },
    [validateFiles, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      handleFiles(files);
    },
    [disabled, handleFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={handleInputChange}
      disabled={disabled}
      className="hidden"
    />
  );

  if (variant === 'button') {
    return (
      <div className={className}>
        {hiddenInput}
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={`
            inline-flex items-center gap-2
            px-4 py-2 rounded-lg
            text-sm font-medium
            border border-slate-200
            bg-white text-slate-700
            hover:bg-slate-50 hover:border-slate-300
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
          {buttonLabel}
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {hiddenInput}
      <motion.div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        animate={{
          borderColor: isDragging ? '#3b82f6' : '#e2e8f0',
          backgroundColor: isDragging ? '#eff6ff' : '#fafafa',
        }}
        className={`
          relative
          flex flex-col items-center justify-center
          min-h-[120px] p-6
          border-2 border-dashed rounded-xl
          cursor-pointer
          transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300 hover:bg-slate-50'}
        `}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-blue-50/80 rounded-xl"
            >
              <span className="text-blue-600 font-medium">Drop files here</span>
            </motion.div>
          )}
        </AnimatePresence>

        <svg
          className="w-8 h-8 text-slate-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm text-slate-600 text-center">{dropzoneLabel}</p>
        {(accept || maxSize) && (
          <p className="text-xs text-slate-400 mt-1">
            {accept && `Accepted: ${accept}`}
            {accept && maxSize && ' • '}
            {maxSize && `Max size: ${formatBytes(maxSize)}`}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default FileUpload;
