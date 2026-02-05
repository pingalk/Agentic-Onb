import React from 'react';
import { Settings, RotateCcw, Zap, Sparkles, Timer, Layers } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { useTimingSettings, PRESETS, TimingSettings } from '../../context/TimingSettingsContext';

// Slider component
const Slider = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = ''
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-mono">{value}{unit}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
    />
  </div>
);

// Select component
const Select = <T extends string>({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-slate-400">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-white outline-none focus:border-emerald-500"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// Section header
const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
      <Icon size={12} />
      <span>{title}</span>
    </div>
    <div className="space-y-3 pl-4">
      {children}
    </div>
  </div>
);

export const SettingsPanel = () => {
  const { settings, updateSettings, applyPreset, resetToDefaults } = useTimingSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
        <Settings size={14} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 max-h-[70vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border-slate-700"
        align="center"
        side="top"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Animation Settings</span>
          <button
            onClick={resetToDefaults}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw size={10} />
            Reset
          </button>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-slate-700" />

        {/* Presets */}
        <div className="px-2 py-2">
          <span className="text-xs text-slate-400 mb-2 block">Quick Presets</span>
          <div className="flex flex-wrap gap-1">
            {Object.keys(PRESETS).map(preset => (
              <button
                key={preset}
                onClick={() => applyPreset(preset)}
                className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-emerald-600 rounded transition-colors capitalize"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator className="bg-slate-700" />

        {/* Text Streaming */}
        <div className="px-2 py-3 space-y-4">
          <Section icon={Sparkles} title="Text Streaming">
            <Select
              label="Style"
              value={settings.streamingStyle}
              onChange={(v) => updateSettings({ streamingStyle: v })}
              options={[
                { value: 'basic', label: 'Basic' },
                { value: 'typewriter', label: 'Typewriter' },
                { value: 'glow', label: 'Glow (Emerald)' },
                { value: 'gradient', label: 'Gradient' },
              ]}
            />
            <Slider
              label="Speed"
              value={settings.textStreamSpeed}
              onChange={(v) => updateSettings({ textStreamSpeed: v })}
              min={5}
              max={50}
              unit="ms"
            />
            {(settings.streamingStyle === 'glow' || settings.streamingStyle === 'gradient') && (
              <>
                <Slider
                  label="Glow Intensity"
                  value={settings.streamingGlowIntensity}
                  onChange={(v) => updateSettings({ streamingGlowIntensity: v })}
                  min={0}
                  max={100}
                  unit="%"
                />
                <Slider
                  label="Trail Length"
                  value={settings.streamingTrailLength}
                  onChange={(v) => updateSettings({ streamingTrailLength: v })}
                  min={1}
                  max={30}
                  unit=" chars"
                />
                <Slider
                  label="Falloff"
                  value={settings.streamingFalloff}
                  onChange={(v) => updateSettings({ streamingFalloff: v })}
                  min={0.3}
                  max={3}
                  step={0.1}
                />
              </>
            )}
          </Section>

          <DropdownMenuSeparator className="bg-slate-700" />

          {/* Skeleton Animations */}
          <Section icon={Layers} title="Card Loading">
            <Select
              label="Border Animation"
              value={settings.skeletonStrokeAnimation}
              onChange={(v) => updateSettings({ skeletonStrokeAnimation: v })}
              options={[
                { value: 'none', label: 'None' },
                { value: 'spotlight', label: 'Spotlight' },
                { value: 'edge-light', label: 'Edge Light' },
                { value: 'conic-sweep', label: 'Conic Sweep' },
                { value: 'prismatic', label: 'Prismatic' },
                { value: 'orbit', label: 'Orbit' },
              ]}
            />
            {settings.skeletonStrokeAnimation !== 'none' && (
              <>
                <Slider
                  label="Speed"
                  value={settings.skeletonSpeed}
                  onChange={(v) => updateSettings({ skeletonSpeed: v })}
                  min={0.5}
                  max={5}
                  step={0.1}
                  unit="s"
                />
                <Slider
                  label="Intensity"
                  value={settings.skeletonIntensity}
                  onChange={(v) => updateSettings({ skeletonIntensity: v })}
                  min={0}
                  max={100}
                  unit="%"
                />
                <Slider
                  label="Light Count"
                  value={settings.skeletonLightCount}
                  onChange={(v) => updateSettings({ skeletonLightCount: v })}
                  min={1}
                  max={4}
                />
              </>
            )}
            <Select
              label="Fill Animation"
              value={settings.skeletonFillAnimation}
              onChange={(v) => updateSettings({ skeletonFillAnimation: v })}
              options={[
                { value: 'none', label: 'None' },
                { value: 'shimmer', label: 'Shimmer' },
                { value: 'pulse', label: 'Pulse' },
                { value: 'wave', label: 'Wave' },
                { value: 'breathe', label: 'Breathe' },
              ]}
            />
          </Section>

          <DropdownMenuSeparator className="bg-slate-700" />

          {/* Timing */}
          <Section icon={Timer} title="Demo Timing">
            <Slider
              label="Thinking Duration"
              value={settings.thinkingDuration / 1000}
              onChange={(v) => updateSettings({ thinkingDuration: v * 1000 })}
              min={0}
              max={30}
              step={1}
              unit="s"
            />
            <Slider
              label="Cognitive Delay"
              value={settings.cognitiveDelay}
              onChange={(v) => updateSettings({ cognitiveDelay: v })}
              min={0}
              max={3000}
              step={100}
              unit="ms"
            />
            <Slider
              label="Sequential Delay"
              value={settings.sequentialDelay}
              onChange={(v) => updateSettings({ sequentialDelay: v })}
              min={0}
              max={2000}
              step={100}
              unit="ms"
            />
          </Section>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsPanel;
