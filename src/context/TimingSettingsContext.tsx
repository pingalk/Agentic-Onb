import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Full configuration type
export type TimingSettings = {
  // Chain of Thought
  animationVersion: 'v1' | 'v2' | 'v3' | 'v4';

  // Text Streaming
  streamingStyle: 'basic' | 'gradient' | 'typewriter' | 'glow';
  textStreamSpeed: number;
  streamingGlowIntensity: number;
  streamingTrailLength: number;
  streamingFalloff: number;

  // Skeleton Stroke
  skeletonStrokeAnimation: 'none' | 'edge-light' | 'conic-sweep' | 'prismatic' | 'spotlight' | 'orbit';
  skeletonSpeed: number;
  skeletonIntensity: number;
  skeletonLightCount: number;

  // Skeleton Fill
  skeletonFillAnimation: 'none' | 'shimmer' | 'pulse' | 'wave' | 'breathe';

  // Demo Timing
  thinkingDuration: number;
  cognitiveDelay: number;
  sequentialDelay: number;
};

// Default configuration
export const DEFAULT_SETTINGS: TimingSettings = {
  // Chain of Thought
  animationVersion: 'v4',

  // Text Streaming
  streamingStyle: 'glow',
  textStreamSpeed: 18,
  streamingGlowIntensity: 70,
  streamingTrailLength: 12,
  streamingFalloff: 1,

  // Skeleton Stroke
  skeletonStrokeAnimation: 'spotlight',
  skeletonSpeed: 1.65,
  skeletonIntensity: 70,
  skeletonLightCount: 2,

  // Skeleton Fill
  skeletonFillAnimation: 'none',

  // Demo Timing
  thinkingDuration: 15000,
  cognitiveDelay: 1300,
  sequentialDelay: 800,
};

// Presets
export const PRESETS: Record<string, Partial<TimingSettings>> = {
  minimal: {
    animationVersion: 'v3',
    streamingStyle: 'basic',
    skeletonStrokeAnimation: 'none',
    skeletonFillAnimation: 'shimmer',
  },
  elegant: {
    animationVersion: 'v4',
    streamingStyle: 'glow',
    skeletonStrokeAnimation: 'spotlight',
    skeletonLightCount: 2,
    skeletonFillAnimation: 'none',
  },
  vibrant: {
    animationVersion: 'v4',
    streamingStyle: 'gradient',
    streamingGlowIntensity: 90,
    skeletonStrokeAnimation: 'prismatic',
    skeletonIntensity: 85,
  },
  subtle: {
    animationVersion: 'v4',
    streamingStyle: 'glow',
    streamingGlowIntensity: 40,
    streamingFalloff: 0.5,
    skeletonStrokeAnimation: 'spotlight',
    skeletonIntensity: 40,
    skeletonLightCount: 1,
  },
  fast: {
    textStreamSpeed: 8,
    thinkingDuration: 5000,
    cognitiveDelay: 500,
    sequentialDelay: 300,
  },
  slow: {
    textStreamSpeed: 30,
    thinkingDuration: 20000,
    cognitiveDelay: 2000,
    sequentialDelay: 1200,
  },
};

interface TimingSettingsContextType {
  settings: TimingSettings;
  updateSettings: (updates: Partial<TimingSettings>) => void;
  applyPreset: (presetName: string) => void;
  resetToDefaults: () => void;
}

const TimingSettingsContext = createContext<TimingSettingsContextType | null>(null);

export const TimingSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<TimingSettings>(DEFAULT_SETTINGS);

  const updateSettings = useCallback((updates: Partial<TimingSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const applyPreset = useCallback((presetName: string) => {
    const preset = PRESETS[presetName];
    if (preset) {
      setSettings(prev => ({ ...prev, ...preset }));
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <TimingSettingsContext.Provider value={{ settings, updateSettings, applyPreset, resetToDefaults }}>
      {children}
    </TimingSettingsContext.Provider>
  );
};

export const useTimingSettings = () => {
  const context = useContext(TimingSettingsContext);
  if (!context) {
    throw new Error('useTimingSettings must be used within TimingSettingsProvider');
  }
  return context;
};

// Optional hook that returns defaults if not in provider (for gradual adoption)
export const useTimingSettingsOptional = (): TimingSettings => {
  const context = useContext(TimingSettingsContext);
  return context?.settings ?? DEFAULT_SETTINGS;
};
