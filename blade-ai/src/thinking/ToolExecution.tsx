import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type ToolStatus = 'pending' | 'running' | 'success' | 'error';

export interface ToolExecutionProps {
  /** Tool/function name */
  tool: string;
  /** Input parameters (JSON or string) */
  input?: string | object;
  /** Output result (JSON or string) */
  output?: string | object;
  /** Execution status */
  status?: ToolStatus;
  /** Duration in milliseconds */
  duration?: number;
  /** Error message if status is error */
  error?: string;
  /** Collapsible input/output */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const statusConfig: Record<
  ToolStatus,
  { icon: React.ReactNode; label: string; color: string }
> = {
  pending: {
    icon: (
      <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-dashed" />
    ),
    label: 'Pending',
    color: 'text-slate-400',
  },
  running: {
    icon: (
      <motion.div
        className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    ),
    label: 'Running',
    color: 'text-blue-600',
  },
  success: {
    icon: (
      <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    label: 'Success',
    color: 'text-emerald-600',
  },
  error: {
    icon: (
      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    label: 'Error',
    color: 'text-red-600',
  },
};

/**
 * Tool/function call visualization
 *
 * Shows a tool execution with input, output, and status.
 * Useful for displaying AI tool calls in the conversation.
 *
 * @example
 * ```tsx
 * // Running tool
 * <ToolExecution
 *   tool="searchDatabase"
 *   input={{ query: 'user transactions', limit: 10 }}
 *   status="running"
 * />
 *
 * // Completed with output
 * <ToolExecution
 *   tool="calculateTax"
 *   input={{ amount: 1000, rate: 0.08 }}
 *   output={{ tax: 80, total: 1080 }}
 *   status="success"
 *   duration={150}
 *   collapsible
 * />
 *
 * // Error state
 * <ToolExecution
 *   tool="fetchAPI"
 *   input={{ url: 'https://api.example.com' }}
 *   status="error"
 *   error="Connection timeout"
 * />
 * ```
 */
export const ToolExecution: React.FC<ToolExecutionProps> = ({
  tool,
  input,
  output,
  status = 'pending',
  duration,
  error,
  collapsible = false,
  defaultCollapsed = true,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed);

  const config = statusConfig[status];

  const formatValue = (value: string | object | undefined): string => {
    if (value === undefined) return '';
    if (typeof value === 'string') return value;
    return JSON.stringify(value, null, 2);
  };

  const inputStr = formatValue(input);
  const outputStr = formatValue(output);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        border border-slate-200 rounded-lg overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center gap-3 px-4 py-3
          bg-slate-50
          ${collapsible ? 'cursor-pointer hover:bg-slate-100' : ''}
        `}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        {/* Status icon */}
        <div className="shrink-0">{config.icon}</div>

        {/* Tool name */}
        <div className="flex-1 min-w-0">
          <span className="font-mono text-sm font-medium text-slate-700">{tool}</span>
          {duration && status === 'success' && (
            <span className="text-xs text-slate-400 ml-2">({duration}ms)</span>
          )}
        </div>

        {/* Status badge */}
        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>

        {/* Expand toggle */}
        {collapsible && (input || output) && (
          <motion.svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        )}
      </div>

      {/* Content */}
      <AnimatePresence>
        {(!collapsible || isExpanded) && (input || output || error) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-200"
          >
            <div className="p-4 space-y-3">
              {/* Input */}
              {inputStr && (
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Input
                  </span>
                  <pre className="mt-1 p-3 bg-slate-800 text-slate-200 rounded-md text-xs font-mono overflow-x-auto">
                    {inputStr}
                  </pre>
                </div>
              )}

              {/* Output */}
              {outputStr && status === 'success' && (
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Output
                  </span>
                  <pre className="mt-1 p-3 bg-slate-800 text-emerald-300 rounded-md text-xs font-mono overflow-x-auto">
                    {outputStr}
                  </pre>
                </div>
              )}

              {/* Error */}
              {error && status === 'error' && (
                <div>
                  <span className="text-xs font-medium text-red-500 uppercase tracking-wide">
                    Error
                  </span>
                  <pre className="mt-1 p-3 bg-red-50 text-red-700 rounded-md text-xs font-mono">
                    {error}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ToolExecution;
