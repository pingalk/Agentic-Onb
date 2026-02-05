import React from 'react';
import { PERSONAS } from '../../data/demoConfig';
import { useDemo } from '../../context/DemoContext';
import { useMagicColor } from '../../context/MagicColorContext';
import { RotateCcw, ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { SettingsPanel } from './SettingsPanel';

export const DemoControls = () => {
  const { currentPersonaId, setPersona, resetDemo, isOnRayLandingPage, currentPersona } = useDemo();
  const { magicColor, setMagicColor, config } = useMagicColor();

  // Only show on Ray landing page
  if (!isOnRayLandingPage) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-full flex gap-2 items-center z-[100] shadow-2xl border border-white/10 ring-1 ring-black/20">

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Story
          </span>
          <span className="text-xs font-medium text-white max-w-[200px] truncate">
            {currentPersona.name}
          </span>
          <ChevronDown size={14} className="text-slate-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="center" side="top">
          <DropdownMenuLabel>User Stories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.values(PERSONAS).map((p) => (
            <DropdownMenuItem
              key={p.id}
              onClick={() => setPersona(p.id)}
              className="flex items-start justify-between cursor-pointer py-2.5"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-medium truncate">{p.name}</span>
                <span className="text-xs text-slate-500 line-clamp-2">{p.subtitle}</span>
              </div>
              {currentPersonaId === p.id && <Check size={14} className="text-blue-600 shrink-0 ml-2 mt-0.5" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-4 w-px bg-white/20" />

      {/* Magic Color Toggle */}
      <button
        onClick={() => setMagicColor(magicColor === 'blue' ? 'green' : 'blue')}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        title={`Switch to ${magicColor === 'blue' ? 'Green' : 'Blue'} theme`}
      >
        <div
          className="w-3 h-3 rounded-full transition-colors duration-300"
          style={{ backgroundColor: config.primary }}
        />
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
          {magicColor === 'blue' ? 'Corp' : 'Rzp'}
        </span>
      </button>

      <div className="h-4 w-px bg-white/20" />

      <SettingsPanel />

      <div className="h-4 w-px bg-white/20" />

      <button
        onClick={resetDemo}
        className="p-2 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
        title="Reset Flow"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
};
