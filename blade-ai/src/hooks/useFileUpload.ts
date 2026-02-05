import { useState, useCallback, useRef } from 'react';

export interface UploadedFile {
  /** Unique file ID */
  id: string;
  /** Original file object */
  file: File;
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** Upload progress (0-100) */
  progress: number;
  /** Upload status */
  status: 'pending' | 'uploading' | 'complete' | 'error';
  /** Error message if failed */
  error?: string;
  /** Preview URL for images */
  previewUrl?: string;
  /** Server response after upload */
  response?: unknown;
}

export interface UseFileUploadOptions {
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Accepted file types (MIME types or extensions) */
  accept?: string[];
  /** Maximum number of files */
  maxFiles?: number;
  /** Custom upload function */
  uploadFn?: (file: File, onProgress: (progress: number) => void) => Promise<unknown>;
  /** Callback when file is added */
  onFileAdded?: (file: UploadedFile) => void;
  /** Callback when upload completes */
  onUploadComplete?: (file: UploadedFile) => void;
  /** Callback when upload fails */
  onUploadError?: (file: UploadedFile, error: Error) => void;
}

export interface UseFileUploadReturn {
  /** List of uploaded files */
  files: UploadedFile[];
  /** Whether any file is currently uploading */
  isUploading: boolean;
  /** Overall upload progress (0-100) */
  overallProgress: number;
  /** Add files to upload queue */
  addFiles: (files: FileList | File[]) => void;
  /** Upload a specific file */
  uploadFile: (fileId: string) => Promise<void>;
  /** Upload all pending files */
  uploadAll: () => Promise<void>;
  /** Remove a file from the list */
  removeFile: (fileId: string) => void;
  /** Clear all files */
  clearFiles: () => void;
  /** Reset state */
  reset: () => void;
  /** Validate a file against options */
  validateFile: (file: File) => { valid: boolean; error?: string };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Hook for managing file uploads with progress tracking
 *
 * @example
 * ```tsx
 * const { files, addFiles, uploadAll, isUploading } = useFileUpload({
 *   maxSize: 10 * 1024 * 1024, // 10MB
 *   accept: ['image/*', 'application/pdf'],
 *   maxFiles: 5,
 *   uploadFn: async (file, onProgress) => {
 *     // Your upload logic
 *     return await uploadToServer(file, onProgress);
 *   }
 * });
 *
 * return (
 *   <div>
 *     <input
 *       type="file"
 *       multiple
 *       onChange={(e) => addFiles(e.target.files)}
 *     />
 *     {files.map(f => (
 *       <div key={f.id}>
 *         {f.name} - {f.progress}%
 *       </div>
 *     ))}
 *     <button onClick={uploadAll} disabled={isUploading}>
 *       Upload All
 *     </button>
 *   </div>
 * );
 * ```
 */
export function useFileUpload(
  options: UseFileUploadOptions = {}
): UseFileUploadReturn {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    accept = [],
    maxFiles = 10,
    uploadFn,
    onFileAdded,
    onUploadComplete,
    onUploadError,
  } = options;

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const uploadingRef = useRef<Set<string>>(new Set());

  const isUploading = files.some((f) => f.status === 'uploading');

  const overallProgress = files.length > 0
    ? Math.round(files.reduce((sum, f) => sum + f.progress, 0) / files.length)
    : 0;

  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Check file size
      if (file.size > maxSize) {
        return {
          valid: false,
          error: `File too large. Maximum size is ${formatBytes(maxSize)}`,
        };
      }

      // Check file type if accept list is provided
      if (accept.length > 0) {
        const fileType = file.type;
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

        const isAccepted = accept.some((accepted) => {
          if (accepted.includes('*')) {
            // Handle wildcard MIME types like 'image/*'
            const [type] = accepted.split('/');
            return fileType.startsWith(type + '/');
          }
          if (accepted.startsWith('.')) {
            // Handle file extensions
            return fileExtension === accepted.toLowerCase();
          }
          // Handle exact MIME type
          return fileType === accepted;
        });

        if (!isAccepted) {
          return {
            valid: false,
            error: `File type not accepted. Allowed: ${accept.join(', ')}`,
          };
        }
      }

      return { valid: true };
    },
    [maxSize, accept]
  );

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const newFiles: UploadedFile[] = [];
      const filesArray = Array.from(fileList);

      // Check max files limit
      const availableSlots = maxFiles - files.length;
      const filesToAdd = filesArray.slice(0, availableSlots);

      for (const file of filesToAdd) {
        const validation = validateFile(file);

        const uploadedFile: UploadedFile = {
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          status: validation.valid ? 'pending' : 'error',
          error: validation.error,
          previewUrl: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined,
        };

        newFiles.push(uploadedFile);
        onFileAdded?.(uploadedFile);
      }

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files.length, maxFiles, validateFile, onFileAdded]
  );

  const updateFile = useCallback(
    (fileId: string, updates: Partial<UploadedFile>) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, ...updates } : f))
      );
    },
    []
  );

  const uploadFile = useCallback(
    async (fileId: string): Promise<void> => {
      const file = files.find((f) => f.id === fileId);
      if (!file || file.status !== 'pending' || uploadingRef.current.has(fileId)) {
        return;
      }

      uploadingRef.current.add(fileId);
      updateFile(fileId, { status: 'uploading', progress: 0 });

      try {
        if (uploadFn) {
          const response = await uploadFn(file.file, (progress) => {
            updateFile(fileId, { progress });
          });
          updateFile(fileId, {
            status: 'complete',
            progress: 100,
            response,
          });
          const updatedFile = { ...file, status: 'complete' as const, progress: 100, response };
          onUploadComplete?.(updatedFile);
        } else {
          // Simulate upload if no uploadFn provided
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            updateFile(fileId, { progress });
          }
          updateFile(fileId, { status: 'complete', progress: 100 });
          onUploadComplete?.({ ...file, status: 'complete', progress: 100 });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        updateFile(fileId, { status: 'error', error: errorMessage });
        onUploadError?.({ ...file, status: 'error', error: errorMessage }, error as Error);
      } finally {
        uploadingRef.current.delete(fileId);
      }
    },
    [files, uploadFn, updateFile, onUploadComplete, onUploadError]
  );

  const uploadAll = useCallback(async (): Promise<void> => {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    await Promise.all(pendingFiles.map((f) => uploadFile(f.id)));
  }, [files, uploadFile]);

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (file?.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach((file) => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    setFiles([]);
  }, [files]);

  const reset = useCallback(() => {
    clearFiles();
    uploadingRef.current.clear();
  }, [clearFiles]);

  return {
    files,
    isUploading,
    overallProgress,
    addFiles,
    uploadFile,
    uploadAll,
    removeFile,
    clearFiles,
    reset,
    validateFile,
  };
}

export default useFileUpload;
