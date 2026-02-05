import React, { useState } from 'react';
import { motion } from 'motion/react';

export type DocumentType = 'pdf' | 'image' | 'embed';

export interface DocumentViewerProps {
  /** Document source URL */
  src: string;
  /** Document type */
  type?: DocumentType;
  /** Document title */
  title?: string;
  /** Number of pages (for display) */
  pages?: number;
  /** Current page (1-indexed) */
  currentPage?: number;
  /** Height of the viewer */
  height?: number | string;
  /** Additional CSS classes */
  className?: string;
  /** Called on page change */
  onPageChange?: (page: number) => void;
  /** Show download button */
  showDownload?: boolean;
  /** Download URL (if different from src) */
  downloadUrl?: string;
}

/**
 * PDF/Document preview component
 *
 * Embeds a document viewer with optional pagination controls.
 * Uses iframe for PDF rendering.
 *
 * @example
 * ```tsx
 * // PDF document
 * <DocumentViewer
 *   src="/invoice.pdf"
 *   type="pdf"
 *   title="Invoice #12345"
 *   pages={3}
 *   height={500}
 *   showDownload
 * />
 *
 * // Image as document
 * <DocumentViewer
 *   src="/receipt.png"
 *   type="image"
 *   title="Receipt"
 * />
 * ```
 */
export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  src,
  type = 'pdf',
  title,
  pages,
  currentPage = 1,
  height = 500,
  className = '',
  onPageChange,
  showDownload = true,
  downloadUrl,
}) => {
  const [page, setPage] = useState(currentPage);
  const [isLoading, setIsLoading] = useState(true);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && (!pages || newPage <= pages)) {
      setPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadUrl || src;
    link.download = title || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`
        border border-slate-200 rounded-lg overflow-hidden bg-white
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          {/* Document icon */}
          <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center">
            {type === 'pdf' ? (
              <span className="text-xs font-bold text-red-600">PDF</span>
            ) : (
              <svg
                className="w-4 h-4 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>

          <div>
            {title && (
              <p className="text-sm font-medium text-slate-700">{title}</p>
            )}
            {pages && (
              <p className="text-xs text-slate-500">{pages} page{pages !== 1 ? 's' : ''}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Page navigation */}
          {pages && pages > 1 && (
            <div className="flex items-center gap-1 mr-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="
                  p-1.5 rounded hover:bg-slate-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                "
                aria-label="Previous page"
              >
                <svg
                  className="w-4 h-4 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <span className="text-xs text-slate-600 min-w-[60px] text-center">
                {page} / {pages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pages}
                className="
                  p-1.5 rounded hover:bg-slate-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                "
                aria-label="Next page"
              >
                <svg
                  className="w-4 h-4 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Download button */}
          {showDownload && (
            <button
              onClick={handleDownload}
              className="
                flex items-center gap-1.5
                px-3 py-1.5 rounded-md
                text-xs font-medium text-slate-600
                hover:bg-slate-200 transition-colors
              "
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
          )}
        </div>
      </div>

      {/* Document content */}
      <div
        className="relative bg-slate-100"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <motion.div
              className="w-8 h-8 border-3 border-slate-300 border-t-blue-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}

        {/* Content based on type */}
        {type === 'pdf' ? (
          <iframe
            src={`${src}#page=${page}`}
            className="w-full h-full border-0"
            title={title || 'Document viewer'}
            onLoad={() => setIsLoading(false)}
          />
        ) : type === 'image' ? (
          <img
            src={src}
            alt={title || 'Document'}
            className="w-full h-full object-contain"
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <iframe
            src={src}
            className="w-full h-full border-0"
            title={title || 'Document viewer'}
            onLoad={() => setIsLoading(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
