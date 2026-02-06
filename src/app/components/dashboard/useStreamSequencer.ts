import { useState, useEffect, useCallback, useRef } from 'react';
import { useTimingSettingsOptional } from '@/context/TimingSettingsContext';

interface StreamSequencerProps {
    hasDataAsset: boolean;
    hasInsight: boolean;
    hasSuggestions: boolean;
    thinkingDuration?: number;  // 0 = skip thinking, 2000 = 2s, 7000 = 7s
    onStreamComplete?: () => void;  // Called when phase 5 is reached
}

// Fallback delay for backward compatibility with components that don't use new callbacks
const FALLBACK_DELAY = 500;

export const useStreamSequencer = ({
    hasDataAsset,
    hasInsight,
    hasSuggestions,
    thinkingDuration = 0,
    onStreamComplete
}: StreamSequencerProps) => {
    const timing = useTimingSettingsOptional();

    // Phase 0: Thinking (if thinkingDuration > 0)
    // Phase 1: Narrative (headline + subtext streaming)
    // Phase 2: Data Asset (table/cards appear)
    // Phase 3: Insight (resolution section)
    // Phase 4: Supporting Actions (footer buttons)
    // Phase 5: Suggestions (complete)
    // If skipStreaming is true, start at phase 5 (all content visible immediately)
    const [phase, setPhase] = useState(timing.skipStreaming ? 5 : (thinkingDuration > 0 ? 0 : 1));

    // Track whether event-driven callbacks were called (to prevent double-advance)
    const dataAssetCallbackCalled = useRef(false);
    const insightCallbackCalled = useRef(false);
    const footerCallbackCalled = useRef(false);

    // Use ref to avoid stale closure issues with onStreamComplete
    const onStreamCompleteRef = useRef(onStreamComplete);
    onStreamCompleteRef.current = onStreamComplete;

    // Reset callback tracking when phase changes
    useEffect(() => {
        if (phase === 2) dataAssetCallbackCalled.current = false;
        if (phase === 3) insightCallbackCalled.current = false;
        if (phase === 4) footerCallbackCalled.current = false;
    }, [phase]);

    // Phase 0 -> Phase 1 transition (thinking -> narrative)
    // This is the ONLY intentional timeout for thinking animation
    useEffect(() => {
        if (phase === 0 && thinkingDuration > 0) {
            const timer = setTimeout(() => setPhase(1), thinkingDuration);
            return () => clearTimeout(timer);
        }
    }, [phase, thinkingDuration]);

    // EVENT-DRIVEN: Phase 1 -> Phase 2 (narrative complete -> data asset)
    const onNarrativeComplete = useCallback(() => {
        if (hasDataAsset) {
            setPhase(2);
        } else if (hasInsight) {
            setPhase(3);
        } else {
            setPhase(4);
        }
    }, [hasDataAsset, hasInsight]);

    // EVENT-DRIVEN: Phase 2 -> Phase 3 (data asset animation complete -> insight)
    const onDataAssetComplete = useCallback(() => {
        if (dataAssetCallbackCalled.current) return;
        dataAssetCallbackCalled.current = true;
        if (hasInsight) {
            setPhase(3);
        } else {
            setPhase(4);
        }
    }, [hasInsight]);

    // EVENT-DRIVEN: Phase 3 -> Phase 4 (insight animation complete -> footer)
    const onInsightComplete = useCallback(() => {
        if (insightCallbackCalled.current) return;
        insightCallbackCalled.current = true;
        setPhase(4);
    }, []);

    // EVENT-DRIVEN: Phase 4 -> Phase 5 (footer animation complete -> suggestions)
    const onFooterComplete = useCallback(() => {
        if (footerCallbackCalled.current) return;
        footerCallbackCalled.current = true;
        setPhase(5);
    }, []);

    // Skip data asset phase if none exists
    useEffect(() => {
        if (phase === 2 && !hasDataAsset) {
            if (hasInsight) {
                setPhase(3);
            } else {
                setPhase(4);
            }
        }
    }, [phase, hasDataAsset, hasInsight]);

    // Skip insight phase if none exists
    useEffect(() => {
        if (phase === 3 && !hasInsight) {
            setPhase(4);
        }
    }, [phase, hasInsight]);

    // FALLBACK: Phase 2 -> Phase 3 (if callback not called within delay)
    // For backward compatibility with components that don't use onDataAssetComplete
    useEffect(() => {
        if (phase === 2 && hasDataAsset) {
            const timer = setTimeout(() => {
                if (!dataAssetCallbackCalled.current) {
                    dataAssetCallbackCalled.current = true;
                    if (hasInsight) {
                        setPhase(3);
                    } else {
                        setPhase(4);
                    }
                }
            }, FALLBACK_DELAY);
            return () => clearTimeout(timer);
        }
    }, [phase, hasDataAsset, hasInsight]);

    // FALLBACK: Phase 3 -> Phase 4 (if callback not called within delay)
    useEffect(() => {
        if (phase === 3 && hasInsight) {
            const timer = setTimeout(() => {
                if (!insightCallbackCalled.current) {
                    insightCallbackCalled.current = true;
                    setPhase(4);
                }
            }, FALLBACK_DELAY);
            return () => clearTimeout(timer);
        }
    }, [phase, hasInsight]);

    // FALLBACK: Phase 4 -> Phase 5 (if callback not called within delay)
    useEffect(() => {
        if (phase === 4) {
            const timer = setTimeout(() => {
                if (!footerCallbackCalled.current) {
                    footerCallbackCalled.current = true;
                    setPhase(5);
                }
            }, FALLBACK_DELAY);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    // Call onStreamComplete when phase 5 is reached
    useEffect(() => {
        if (phase === 5) {
            onStreamCompleteRef.current?.();
        }
    }, [phase]);

    return {
        phase,
        onNarrativeComplete,
        onDataAssetComplete,
        onInsightComplete,
        onFooterComplete
    };
};
