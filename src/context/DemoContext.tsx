// src/context/DemoContext.tsx
import React, { createContext, useContext, useState } from 'react';

export interface GradientConfig {
  startPoint: number;    // 0-100, where gradient starts (white ends)
  endPoint: number;      // 0-100, where gradient ends (green fully applied)
  greenHue: number;      // 0-360, hue of the green
  greenSaturation: number; // 0-100, saturation
  greenLightness: number;  // 0-100, lightness
}

export interface SparkRipplesConfig {
  scale: number;         // 0.5-3, scale of the animation
  playbackRate: number;  // 0.1-2, speed of the animation
  opacity: number;       // 0-100, opacity
  offsetY: number;       // -500 to 500, vertical offset
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
  sparkRipplesConfig: SparkRipplesConfig;
  setSparkRipplesConfig: (config: Partial<SparkRipplesConfig>) => void;
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

  // Default SparkRipples config
  const defaultSparkRipplesConfig: SparkRipplesConfig = {
    scale: 2,
    playbackRate: 0.5,
    opacity: 100,
    offsetY: -150
  };

  // Initialize sparkRipplesConfig from localStorage
  const [sparkRipplesConfig, setSparkRipplesConfigState] = useState<SparkRipplesConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sparkRipplesConfig');
      if (saved) {
        try {
          return { ...defaultSparkRipplesConfig, ...JSON.parse(saved) };
        } catch {
          return defaultSparkRipplesConfig;
        }
      }
    }
    return defaultSparkRipplesConfig;
  });

  // Wrapper to merge and save SparkRipples config
  const setSparkRipplesConfig = (config: Partial<SparkRipplesConfig>) => {
    setSparkRipplesConfigState(prev => {
      const updated = { ...prev, ...config };
      if (typeof window !== 'undefined') {
        localStorage.setItem('sparkRipplesConfig', JSON.stringify(updated));
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
      sparkRipplesConfig,
      setSparkRipplesConfig,
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