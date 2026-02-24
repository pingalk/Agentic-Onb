// src/context/DemoContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface DemoContextType {
  isInChatView: boolean;
  setIsInChatView: (value: boolean) => void;
  isOnRayLandingPage: boolean;
  setIsOnRayLandingPage: (value: boolean) => void;
  bgHue: number;
  setBgHue: (value: number) => void;
  bgIntensity: number;
  setBgIntensity: (value: number) => void;
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