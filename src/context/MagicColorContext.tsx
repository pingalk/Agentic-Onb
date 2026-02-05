import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MagicColorType = 'blue' | 'green';

export interface MagicColorConfig {
  primary: string;
  gradient: string;
  gradientLight: string;
  hueRotate: string;
  streamingColor: string;
  bubbleColor: string;
}

const magicColorConfigs: Record<MagicColorType, MagicColorConfig> = {
  blue: {
    primary: '#2563EB',
    gradient: 'rgba(37, 99, 235, 1)',
    gradientLight: 'rgba(37, 99, 235, 0.5)',
    hueRotate: '0deg',
    streamingColor: '#2563EB',
    bubbleColor: '#EFF6FF',
  },
  green: {
    primary: '#009E5C',
    gradient: 'rgba(0, 158, 92, 1)',
    gradientLight: 'rgba(0, 158, 92, 0.5)',
    hueRotate: '-80deg',
    streamingColor: '#009E5C',
    bubbleColor: '#ECFDF5',
  },
};

interface MagicColorContextValue {
  magicColor: MagicColorType;
  setMagicColor: (color: MagicColorType) => void;
  config: MagicColorConfig;
}

const MagicColorContext = createContext<MagicColorContextValue | undefined>(undefined);

export const MagicColorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [magicColor, setMagicColor] = useState<MagicColorType>('green');

  const value: MagicColorContextValue = {
    magicColor,
    setMagicColor,
    config: magicColorConfigs[magicColor],
  };

  return (
    <MagicColorContext.Provider value={value}>
      {children}
    </MagicColorContext.Provider>
  );
};

export const useMagicColor = (): MagicColorContextValue => {
  const context = useContext(MagicColorContext);
  if (!context) {
    throw new Error('useMagicColor must be used within a MagicColorProvider');
  }
  return context;
};
