import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { useMagicColor } from '../../context/MagicColorContext';
import { RotateCcw, Palette, Sparkles } from 'lucide-react';
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

export const AvatarMenu = () => {
  const { resetDemo, bgHue, setBgHue, bgIntensity, setBgIntensity, gradientConfig, setGradientConfig, sparkRipplesConfig, setSparkRipplesConfig } = useDemo();

  // Compute the current green color from HSL
  const greenColor = `hsl(${gradientConfig.greenHue}, ${gradientConfig.greenSaturation}%, ${gradientConfig.greenLightness}%)`;
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

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
            <Palette size={14} className="text-slate-400" />
            <span className="text-sm">Gradient Controls</span>
            <div
              className="ml-auto w-4 h-4 rounded border border-slate-200"
              style={{ background: `linear-gradient(180deg, #FFFFFF 0%, ${greenColor} 100%)` }}
            />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-72 p-3">
            {/* Preview */}
            <div
              className="h-16 rounded-lg mb-3 border border-slate-200"
              style={{
                background: `linear-gradient(180deg, #FFFFFF ${gradientConfig.startPoint}%, ${greenColor} ${gradientConfig.endPoint}%)`
              }}
            />

            {/* Intensity */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-500">Intensity</span>
                <span className="text-xs text-slate-400">{bgIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bgIntensity}
                onChange={(e) => setBgIntensity(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200"
              />
            </div>

            {/* Start Point */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-500">Start Point</span>
                <span className="text-xs text-slate-400">{gradientConfig.startPoint}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gradientConfig.startPoint}
                onChange={(e) => setGradientConfig({ startPoint: Number(e.target.value) })}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200"
              />
            </div>

            {/* End Point */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-500">End Point</span>
                <span className="text-xs text-slate-400">{gradientConfig.endPoint}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gradientConfig.endPoint}
                onChange={(e) => setGradientConfig({ endPoint: Number(e.target.value) })}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200"
              />
            </div>

            <div className="border-t border-slate-100 pt-3 mt-3">
              <span className="text-xs text-slate-500 font-medium">Green Color</span>
            </div>

            {/* Hue */}
            <div className="mb-3 mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-500">Hue</span>
                <span className="text-xs text-slate-400">{gradientConfig.greenHue}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={gradientConfig.greenHue}
                onChange={(e) => setGradientConfig({ greenHue: Number(e.target.value) })}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right,
                    hsl(0, ${gradientConfig.greenSaturation}%, ${gradientConfig.greenLightness}%),
                    hsl(60, ${gradientConfig.greenSaturation}%, ${gradientConfig.greenLightness}%),
                    hsl(120, ${gradientConfig.greenSaturation}%, ${gradientConfig.greenLightness}%),
                    hsl(180, ${gradientConfig.greenSaturation}%, ${gradientConfig.greenLightness}%),
                    hsl(240, ${gradientConfig.greenSaturation}%, ${gradientConfig.greenLightness}%),
                    hsl(300, ${gradientConfig.greenSaturation}%, ${gradientConfig.greenLightness}%),
                    hsl(360, ${gradientConfig.greenSaturation}%, ${gradientConfig.greenLightness}%)
                  )`
                }}
              />
            </div>

            {/* Saturation */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-500">Saturation</span>
                <span className="text-xs text-slate-400">{gradientConfig.greenSaturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gradientConfig.greenSaturation}
                onChange={(e) => setGradientConfig({ greenSaturation: Number(e.target.value) })}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right,
                    hsl(${gradientConfig.greenHue}, 0%, ${gradientConfig.greenLightness}%),
                    hsl(${gradientConfig.greenHue}, 50%, ${gradientConfig.greenLightness}%),
                    hsl(${gradientConfig.greenHue}, 100%, ${gradientConfig.greenLightness}%)
                  )`
                }}
              />
            </div>

            {/* Lightness */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-500">Lightness</span>
                <span className="text-xs text-slate-400">{gradientConfig.greenLightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gradientConfig.greenLightness}
                onChange={(e) => setGradientConfig({ greenLightness: Number(e.target.value) })}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right,
                    hsl(${gradientConfig.greenHue}, ${gradientConfig.greenSaturation}%, 0%),
                    hsl(${gradientConfig.greenHue}, ${gradientConfig.greenSaturation}%, 50%),
                    hsl(${gradientConfig.greenHue}, ${gradientConfig.greenSaturation}%, 100%)
                  )`
                }}
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={() => setGradientConfig({
                startPoint: 0,
                endPoint: 100,
                greenHue: 100,
                greenSaturation: 33,
                greenLightness: 95
              })}
              className="w-full mt-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded transition-colors"
            >
              Reset to Default
            </button>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
            <Sparkles size={14} className="text-slate-400" />
            <span className="text-sm">SparkRipples</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-72 p-3">
            {/* Scale */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-500">Scale</span>
                <span className="text-xs text-slate-400">{sparkRipplesConfig.scale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.1"
                value={sparkRipplesConfig.scale}
                onChange={(e) => setSparkRipplesConfig({ scale: Number(e.target.value) })}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200"
              />
            </div>

            {/* Playback Rate */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-500">Speed</span>
                <span className="text-xs text-slate-400">{sparkRipplesConfig.playbackRate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={sparkRipplesConfig.playbackRate}
                onChange={(e) => setSparkRipplesConfig({ playbackRate: Number(e.target.value) })}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200"
              />
            </div>

            {/* Opacity */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-500">Opacity</span>
                <span className="text-xs text-slate-400">{sparkRipplesConfig.opacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sparkRipplesConfig.opacity}
                onChange={(e) => setSparkRipplesConfig({ opacity: Number(e.target.value) })}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200"
              />
            </div>

            {/* Vertical Offset */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-500">Vertical Offset</span>
                <span className="text-xs text-slate-400">{sparkRipplesConfig.offsetY}px</span>
              </div>
              <input
                type="range"
                min="-500"
                max="200"
                value={sparkRipplesConfig.offsetY}
                onChange={(e) => setSparkRipplesConfig({ offsetY: Number(e.target.value) })}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={() => setSparkRipplesConfig({
                scale: 2,
                playbackRate: 0.5,
                opacity: 100,
                offsetY: -150
              })}
              className="w-full mt-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded transition-colors"
            >
              Reset to Default
            </button>
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
