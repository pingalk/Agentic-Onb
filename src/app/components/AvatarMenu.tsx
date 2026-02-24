import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { useMagicColor } from '../../context/MagicColorContext';
import { RotateCcw, Settings } from 'lucide-react';
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
  const { resetDemo, bgHue, setBgHue, bgIntensity, setBgIntensity } = useDemo();
  const { magicColor, setMagicColor, config } = useMagicColor();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-medium uppercase cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-slate-300 transition-all bg-slate-900"
        >
          R
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end" sideOffset={8}>
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

        <DropdownMenuLabel className="text-xs text-slate-500">Background Hue</DropdownMenuLabel>
        <div className="px-2 py-2">
          <input
            type="range"
            min="0"
            max="360"
            value={bgHue}
            onChange={(e) => setBgHue(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right,
                hsl(0, 70%, 70%),
                hsl(60, 70%, 70%),
                hsl(120, 70%, 70%),
                hsl(180, 70%, 70%),
                hsl(240, 70%, 70%),
                hsl(300, 70%, 70%),
                hsl(360, 70%, 70%)
              )`
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-400">{bgHue}°</span>
            <button
              onClick={() => setBgHue(0)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Reset
            </button>
          </div>
        </div>

        <DropdownMenuLabel className="text-xs text-slate-500">Background Intensity</DropdownMenuLabel>
        <div className="px-2 py-2">
          <input
            type="range"
            min="0"
            max="100"
            value={bgIntensity}
            onChange={(e) => setBgIntensity(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right,
                rgba(0, 158, 92, 0),
                rgba(0, 158, 92, 0.5),
                rgba(0, 158, 92, 1)
              )`
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-400">{bgIntensity}%</span>
            <button
              onClick={() => setBgIntensity(100)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Reset
            </button>
          </div>
        </div>

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
