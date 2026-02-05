import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface CodeBlockProps {
  /** Code content */
  code: string;
  /** Programming language */
  language?: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Called when copy button clicked */
  onCopy?: () => void;
  /** Title/filename */
  title?: string;
  /** Maximum height before scrolling */
  maxHeight?: number | string;
  /** Additional CSS classes */
  className?: string;
  /** Highlight specific lines (1-indexed) */
  highlightLines?: number[];
}

/**
 * Syntax highlighted code block
 *
 * Displays code with optional line numbers, copy button, and line highlighting.
 * Note: Actual syntax highlighting requires a library like Prism or highlight.js
 * to be integrated by the consumer.
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   code={`function hello() {
 *   console.log("Hello, World!");
 * }`}
 *   language="javascript"
 *   showLineNumbers
 *   onCopy={() => toast.success('Copied!')}
 * />
 * ```
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  showLineNumbers = true,
  onCopy,
  title,
  maxHeight = 400,
  className = '',
  highlightLines = [],
}) => {
  const [copied, setCopied] = useState(false);

  const lines = code.split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      className={`
        rounded-lg overflow-hidden
        bg-[#1e293b] text-slate-200
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-slate-700">
        <div className="flex items-center gap-2">
          {/* Language badge */}
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            {language}
          </span>
          {title && (
            <>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{title}</span>
            </>
          )}
        </div>

        {/* Copy button */}
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            flex items-center gap-1.5
            px-2 py-1 rounded
            text-xs text-slate-400
            hover:text-slate-200 hover:bg-slate-700
            transition-colors
          "
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Code content */}
      <div
        className="overflow-auto blade-ai-scrollbar"
        style={{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }}
      >
        <pre className="p-4 text-[13px] leading-6 font-mono">
          <code className="blade-ai-code">
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const isHighlighted = highlightLines.includes(lineNumber);

              return (
                <div
                  key={index}
                  className={`
                    flex
                    ${isHighlighted ? 'bg-blue-500/10 -mx-4 px-4' : ''}
                  `}
                >
                  {showLineNumbers && (
                    <span
                      className={`
                        inline-block w-8 mr-4 text-right select-none shrink-0
                        ${isHighlighted ? 'text-blue-400' : 'text-slate-600'}
                      `}
                    >
                      {lineNumber}
                    </span>
                  )}
                  <span className="flex-1 whitespace-pre-wrap break-all">
                    {line || ' '}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
