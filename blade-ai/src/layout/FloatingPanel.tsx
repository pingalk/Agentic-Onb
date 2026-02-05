import React from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { overlayFade } from '../primitives/animations';

export type PanelPosition = 'right' | 'left' | 'bottom' | 'center';
export type PanelSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface FloatingPanelProps {
  /** Panel visibility */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Panel position */
  position?: PanelPosition;
  /** Panel size */
  size?: PanelSize;
  /** Panel title */
  title?: string;
  /** Panel content */
  children: React.ReactNode;
  /** Show overlay backdrop */
  showOverlay?: boolean;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const sizeMap: Record<PanelPosition, Record<PanelSize, string>> = {
  right: {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[480px]',
    xl: 'w-[600px]',
    full: 'w-full',
  },
  left: {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[480px]',
    xl: 'w-[600px]',
    full: 'w-full',
  },
  bottom: {
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-96',
    xl: 'h-[500px]',
    full: 'h-full',
  },
  center: {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  },
};

const positionStyles: Record<PanelPosition, string> = {
  right: 'fixed top-0 right-0 h-full',
  left: 'fixed top-0 left-0 h-full',
  bottom: 'fixed bottom-0 left-0 right-0',
  center: 'fixed inset-0 flex items-center justify-center p-4',
};

const panelVariants: Record<PanelPosition, Variants> = {
  right: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
  },
  left: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
    exit: { x: '-100%', opacity: 0, transition: { duration: 0.2 } },
  },
  bottom: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.2 } },
  },
  center: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
    exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } },
  },
};

/**
 * Overlay panel
 *
 * Floating panel that slides in from edges or appears centered.
 *
 * @example
 * ```tsx
 * <FloatingPanel
 *   isOpen={showPanel}
 *   onClose={() => setShowPanel(false)}
 *   position="right"
 *   size="md"
 *   title="Transaction Details"
 * >
 *   <TransactionDetails data={transaction} />
 * </FloatingPanel>
 * ```
 */
export const FloatingPanel: React.FC<FloatingPanelProps> = ({
  isOpen,
  onClose,
  position = 'right',
  size = 'md',
  title,
  children,
  showOverlay = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
}) => {
  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  const variants = panelVariants[position];
  const sizeClass = sizeMap[position][size];
  const positionClass = positionStyles[position];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          {showOverlay && (
            <motion.div
              key="overlay"
              variants={overlayFade}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 z-40"
              onClick={handleOverlayClick}
            />
          )}

          {/* Panel */}
          <motion.div
            key="panel"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`
              z-50
              ${positionClass}
              ${position !== 'center' ? sizeClass : ''}
            `}
          >
            <div
              className={`
                ${position === 'center' ? `w-full ${sizeClass}` : 'h-full'}
                bg-white
                ${position === 'bottom' ? 'rounded-t-2xl' : ''}
                ${position === 'center' ? 'rounded-xl' : ''}
                shadow-xl
                flex flex-col
                overflow-hidden
                ${className}
              `}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  {title && (
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="
                        p-2 -m-2 rounded-lg
                        text-slate-400 hover:text-slate-600 hover:bg-slate-100
                        transition-colors
                      "
                      aria-label="Close"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-auto blade-ai-scrollbar">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FloatingPanel;
