import React from 'react';
import { PERSONAS } from '../../data/demoConfig';
import { useDemo } from '../../context/DemoContext';
import { useMagicColor } from '../../context/MagicColorContext';
import { RotateCcw, Check, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './ui/dropdown-menu';
import { SettingsPanelContent } from './SettingsPanel';

export const AvatarMenu = () => {
  const { currentPersonaId, setPersona, resetDemo, currentPersona } = useDemo();
  const { magicColor, setMagicColor, config } = useMagicColor();

  const isNegative = currentPersona.theme === 'negative';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-medium uppercase cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-slate-300 transition-all ${isNegative ? 'bg-red-900' : 'bg-slate-900'}`}
        >
          {currentPersona.name.charAt(0)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end" sideOffset={8}>
        <DropdownMenuLabel className="text-xs text-slate-500">User Stories</DropdownMenuLabel>
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

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-slate-500">Theme</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setMagicColor(magicColor === 'blue' ? 'green' : 'blue')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div
            className="w-3 h-3 rounded-full transition-colors duration-300"
            style={{ backgroundColor: config.primary }}
          />
          <span className="text-sm">
            {magicColor === 'blue' ? 'Corporate Blue' : 'Razorpay Green'}
          </span>
          <span className="ml-auto text-xs text-slate-400">
            Switch to {magicColor === 'blue' ? 'Green' : 'Blue'}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
            <Settings size={14} className="text-slate-400" />
            <span className="text-sm">Animation Settings</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-80 max-h-[70vh] overflow-y-auto">
            <SettingsPanelContent />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={resetDemo}
          className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
        >
          <RotateCcw size={14} />
          <span className="text-sm">Reset Demo</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
