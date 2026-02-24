import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { useMagicColor } from '../../context/MagicColorContext';
import { RotateCcw } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';

export const DemoControls = () => {
  const { resetDemo, isOnRayLandingPage } = useDemo();
  const { magicColor, setMagicColor, config } = useMagicColor();

  // Only show on Ray landing page
  if (!isOnRayLandingPage) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-full flex gap-2 items-center z-[100] shadow-2xl border border-white/10 ring-1 ring-black/20">
      {/* Theme Toggle */}
      <button
        onClick={() => setMagicColor(magicColor === 'blue' ? 'green' : 'blue')}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <div
          className="w-3 h-3 rounded-full transition-colors duration-300"
          style={{ backgroundColor: config.primary }}
        />
        <span className="text-xs font-medium text-white">
          {magicColor === 'blue' ? 'Blue' : 'Green'}
        </span>
      </button>

      {/* Reset Button */}
      <button
        onClick={resetDemo}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-red-600/80 hover:bg-red-600 transition-colors"
      >
        <RotateCcw size={12} />
        <span className="text-xs font-medium">Reset</span>
      </button>

      {/* Settings */}
      <SettingsPanel />
    </div>
  );
};
