import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFormStore, FormProvider } from './FormStore';
import { RayChatInterface } from './RayChatInterface';
import { CardShowcase } from './CardShowcase';
import { ArtifactRenderer } from './ArtifactRenderer';
import { ActionAccordion } from './ActionAccordion';
import { ActionWidgetVariant2 } from './ActionWidgetVariant2';
import { ViewModeToggle } from './ViewModeToggle';

const RayLayoutContent = ({ initialQuery, isEntering, onGoHome, skipInitialUserMessage, kycPanNumber }: { initialQuery?: string; isEntering?: boolean; onGoHome?: () => void; skipInitialUserMessage?: boolean; kycPanNumber?: string }) => {
  const flow = useFormStore();
  const { viewMode, isOpen, intent } = flow;

  // If the flow is open and mode is 'split', we show split view.
  // Otherwise we show full width chat.

  const isSplitActive = isOpen && viewMode === 'split';
  const isCardActive = isOpen && viewMode === 'card';

  return (
    <div className="flex h-full w-full overflow-hidden relative gap-6">

      {/* LEFT PANEL: CHAT STREAM */}
      <motion.div
        layout
        className="h-full relative z-10 transition-all duration-700 ease-[0.2,0,0,1]"
        initial={false}
        animate={{
          width: isSplitActive ? '55%' : '100%',
          opacity: isCardActive ? 0 : 1,
          pointerEvents: isCardActive ? 'none' : 'auto'
        }}
        style={{
            paddingRight: isSplitActive ? '0' : '0'
        }}
        transition={{
          duration: 0.7,
          ease: [0.2, 0, 0, 1] // Rauno Bezier
        }}
      >
         <RayChatInterface initialQuery={initialQuery} isSplit={isSplitActive} isEntering={isEntering} onGoHome={onGoHome} skipInitialUserMessage={skipInitialUserMessage} kycPanNumber={kycPanNumber} />
      </motion.div>

      {/* RIGHT PANEL: ARTIFACT CONTAINER (Split Mode) */}
      <AnimatePresence>
        {isSplitActive && (
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          >
             {intent === 'view_transaction' ? (
                 // PREVIEW COMPONENT VARIANT
                 <div className="h-full w-full bg-white rounded-l-2xl border-l border-t border-b border-gray-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
                    {/* Preview content handles its own header/chrome */}
                    <div className="flex-1 overflow-y-auto">
                        <ArtifactRenderer />
                    </div>
                 </div>
             ) : (
                 // ACTION SIDE PANE VARIANT
                 <div className="h-full w-full bg-blue-50/10 rounded-l-2xl border-l border-t border-b border-blue-200/50 shadow-[0_0_24px_rgba(48,94,255,0.06)] overflow-hidden flex flex-col">
                    {/* The Artifact Header (Visual Anchor) */}
                    <div className="h-14 border-b border-gray-100 flex items-center px-6 bg-white/50 backdrop-blur-sm shrink-0">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                           {intent === 'create_subscription' ? 'Subscription Draft' : 'Active Task'}
                        </span>
                    </div>

                    {/* The Form Content */}
                    <div className="flex-1 overflow-y-auto">
                        <ArtifactRenderer />
                    </div>
                 </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAY WIDGET (Overlay Mode) */}
      <AnimatePresence>
        {isOpen && viewMode === 'overlay' && (
           <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 z-40 w-full max-w-[560px] px-4 pointer-events-none">
                <div className="pointer-events-auto">
                    <ActionAccordion flow={flow} />
                </div>
           </div>
        )}
      </AnimatePresence>

      {/* CARD WIDGET (Variant 2) */}
      <AnimatePresence>
        {isOpen && viewMode === 'card' && (
           <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto">
                    <ActionWidgetVariant2 flow={flow} />
                </div>
           </div>
        )}
      </AnimatePresence>
      
      {/* THE TOGGLE SWITCH */}
      <ViewModeToggle />
    </div>
  );
};

export const RayLayout = ({ initialQuery, isEntering, onGoHome, skipInitialUserMessage, kycPanNumber }: { initialQuery?: string; isEntering?: boolean; onGoHome?: () => void; skipInitialUserMessage?: boolean; kycPanNumber?: string }) => {
  return (
    <FormProvider>
      <RayLayoutContent initialQuery={initialQuery} isEntering={isEntering} onGoHome={onGoHome} skipInitialUserMessage={skipInitialUserMessage} kycPanNumber={kycPanNumber} />
    </FormProvider>
  );
};
