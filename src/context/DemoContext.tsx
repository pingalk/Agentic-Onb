// src/context/DemoContext.tsx
import React, { createContext, useContext, useState } from 'react';

export interface GradientConfig {
  startPoint: number;    // 0-100, where gradient starts (white ends)
  endPoint: number;      // 0-100, where gradient ends (green fully applied)
  greenHue: number;      // 0-360, hue of the green
  greenSaturation: number; // 0-100, saturation
  greenLightness: number;  // 0-100, lightness
}

interface DemoContextType {
  isInChatView: boolean;
  setIsInChatView: (value: boolean) => void;
  isOnRayLandingPage: boolean;
  setIsOnRayLandingPage: (value: boolean) => void;
  bgHue: number;
  setBgHue: (value: number) => void;
  bgIntensity: number;
  setBgIntensity: (value: number) => void;
  gradientConfig: GradientConfig;
  setGradientConfig: (config: Partial<GradientConfig>) => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInChatView, setIsInChatView] = useState(false);
  const [isOnRayLandingPage, setIsOnRayLandingPage] = useState(false);

  // Initialize bgHue from localStorage
  const [bgHue, setBgHueState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bgHue');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Wrapper to save to localStorage when bgHue changes
  const setBgHue = (value: number) => {
    setBgHueState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bgHue', value.toString());
    }
  };

  // Initialize bgIntensity from localStorage (0-100, default 100)
  const [bgIntensity, setBgIntensityState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bgIntensity');
      return saved ? parseInt(saved, 10) : 100;
    }
    return 100;
  });

  // Wrapper to save to localStorage when bgIntensity changes
  const setBgIntensity = (value: number) => {
    setBgIntensityState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bgIntensity', value.toString());
    }
  };

  // Default gradient config matching #F1F7ED (HSL: 100, 33%, 95%)
  const defaultGradientConfig: GradientConfig = {
    startPoint: 0,
    endPoint: 100,
    greenHue: 100,
    greenSaturation: 33,
    greenLightness: 95
  };

  // Initialize gradientConfig from localStorage
  const [gradientConfig, setGradientConfigState] = useState<GradientConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gradientConfig');
      if (saved) {
        try {
          return { ...defaultGradientConfig, ...JSON.parse(saved) };
        } catch {
          return defaultGradientConfig;
        }
      }
    }
    return defaultGradientConfig;
  });

  // Wrapper to merge and save gradient config
  const setGradientConfig = (config: Partial<GradientConfig>) => {
    setGradientConfigState(prev => {
      const updated = { ...prev, ...config };
      if (typeof window !== 'undefined') {
        localStorage.setItem('gradientConfig', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const resetDemo = () => {
    setIsInChatView(false);
    setIsOnRayLandingPage(true);
  };

  return (
    <DemoContext.Provider value={{
      isInChatView,
      setIsInChatView,
      isOnRayLandingPage,
      setIsOnRayLandingPage,
      bgHue,
      setBgHue,
      bgIntensity,
      setBgIntensity,
      gradientConfig,
      setGradientConfig,
      resetDemo
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within a DemoProvider');
  return context;
};