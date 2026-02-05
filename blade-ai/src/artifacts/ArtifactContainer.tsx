import React from 'react';
import { motion } from 'motion/react';
import { cardEnter } from '../primitives/animations';

export type ArtifactType =
  | 'code'
  | 'table'
  | 'chart'
  | 'image'
  | 'document'
  | 'card'
  | 'form'
  | 'custom';

export interface ArtifactAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

export interface ArtifactContainerProps {
  /** Title for the artifact */
  title?: string;
  /** Artifact type for icon display */
  type?: ArtifactType;
  /** Action buttons */
  actions?: ArtifactAction[];
  /** Artifact content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Animate entry */
  animate?: boolean;
  /** Show border */
  bordered?: boolean;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const typeIcons: Record<ArtifactType, React.ReactNode> = {
  code: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  ),
  table: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  ),
  chart: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
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
  card: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  ),
  form: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
  ),
  custom: null,
};

const paddingMap: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

/**
 * Generic artifact wrapper
 *
 * Container for rich content artifacts with optional title, type icon,
 * and action buttons.
 *
 * @example
 * ```tsx
 * <ArtifactContainer
 *   title="Query Results"
 *   type="table"
 *   actions={[
 *     { id: 'copy', label: 'Copy', onClick: handleCopy },
 *     { id: 'export', label: 'Export', onClick: handleExport }
 *   ]}
 * >
 *   <DataTable data={results} />
 * </ArtifactContainer>
 * ```
 */
export const ArtifactContainer: React.FC<ArtifactContainerProps> = ({
  title,
  type = 'custom',
  actions = [],
  children,
  className = '',
  animate = true,
  bordered = true,
  padding = 'md',
}) => {
  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? { variants: cardEnter, initial: 'hidden', animate: 'visible' }
    : {};

  const icon = typeIcons[type];

  return (
    <Wrapper
      className={`
        rounded-xl overflow-hidden bg-white
        ${bordered ? 'border border-slate-200' : ''}
        ${className}
      `}
      {...wrapperProps}
    >
      {/* Header */}
      {(title || actions.length > 0) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            {icon && <span className="text-slate-400">{icon}</span>}
            {title && (
              <span className="text-sm font-medium text-slate-700">{title}</span>
            )}
          </div>

          {actions.length > 0 && (
            <div className="flex items-center gap-1">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className="
                    flex items-center gap-1.5
                    px-2.5 py-1.5 rounded-md
                    text-xs font-medium text-slate-600
                    hover:bg-slate-200 transition-colors
                  "
                  title={action.label}
                >
                  {action.icon}
                  <span className="hidden sm:inline">{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={paddingMap[padding]}>{children}</div>
    </Wrapper>
  );
};

export default ArtifactContainer;
