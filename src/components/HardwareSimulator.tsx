import React from 'react';
import { Sliders, RotateCcw, Check } from 'lucide-react';
import type { HardwareSimulation } from '../types/hardware';
import { HARDWARE_PRESETS, type HardwarePreset } from '../data/presetsData';

interface HardwareSimulatorProps {
  simulation: HardwareSimulation;
  onUpdateSimulation: (updated: Partial<HardwareSimulation>) => void;
  onSelectPreset: (preset: HardwarePreset) => void;
  onResetToAutoDetected: () => void;
}

export const HardwareSimulator: React.FC<HardwareSimulatorProps> = ({
  simulation,
  onUpdateSimulation,
  onSelectPreset,
  onResetToAutoDetected,
}) => {
  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Hardware Simulator & Configuration Sandbox
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                Interactive
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Test how models perform across different GPUs, RAM tiers, and device constraints without leaving this browser tab.
            </p>
          </div>
        </div>

        <button
          onClick={onResetToAutoDetected}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to Auto-Detected Hardware
        </button>
      </div>

      {/* Preset Device Chips */}
      <div className="mt-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Quick Device Presets
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {HARDWARE_PRESETS.map((preset) => {
            const isSelected = simulation.presetName === preset.name;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {preset.badge}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-amber-400" />}
                  </div>
                  <div className="text-xs font-bold text-white mt-1 leading-tight line-clamp-1">
                    {preset.name}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-2">
                  {preset.config.ramGB}GB RAM • {preset.config.gpuBackend === 'wasm-cpu' ? 'CPU Only' : 'WebGPU'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Granular Sliders */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* RAM Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">System RAM (Memory)</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{simulation.ramGB} GB</span>
          </div>
          <input
            type="range"
            min="2"
            max="64"
            step="2"
            value={simulation.ramGB}
            onChange={(e) => onUpdateSimulation({ ramGB: Number(e.target.value), presetName: 'Custom Hardware' })}
            className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>2GB (Mobile)</span>
            <span>16GB</span>
            <span>64GB (Pro Workstation)</span>
          </div>
        </div>

        {/* GPU Backend Selector */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">GPU Acceleration Tier</span>
            <span className="font-mono font-bold text-amber-400 text-xs">
              {simulation.gpuBackend === 'webgpu-f16'
                ? 'WebGPU (shader-f16)'
                : simulation.gpuBackend === 'webgpu-nof16'
                ? 'WebGPU (standard)'
                : simulation.gpuBackend === 'webgl'
                ? 'WebGL'
                : 'CPU WASM'}
            </span>
          </div>
          <select
            value={simulation.gpuBackend}
            onChange={(e) => onUpdateSimulation({ gpuBackend: e.target.value as HardwareSimulation['gpuBackend'], presetName: 'Custom Hardware' })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="webgpu-f16">WebGPU + shader-f16 (Apple Silicon, RTX 30/40, Modern Intel)</option>
            <option value="webgpu-nof16">WebGPU without f16 (Basic WebGPU)</option>
            <option value="webgl">WebGL Fallback (No WebGPU compute)</option>
            <option value="wasm-cpu">CPU WASM Only (No GPU acceleration)</option>
          </select>
          <div className="text-[10px] text-slate-400">
            {simulation.gpuBackend === 'webgpu-f16' ? '✓ Can run quantized fp16 models at max speed' : '⚠️ Models requiring shader-f16 will be disabled'}
          </div>
        </div>

        {/* Max Storage Buffer Size Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">Max Storage Buffer Limit</span>
            <span className="font-mono font-bold text-amber-400 text-sm">
              {simulation.maxStorageBufferMB === 0 ? '0 (CPU)' : `${simulation.maxStorageBufferMB} MB`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="4096"
            step="128"
            value={simulation.maxStorageBufferMB}
            disabled={simulation.gpuBackend === 'wasm-cpu'}
            onChange={(e) => onUpdateSimulation({ maxStorageBufferMB: Number(e.target.value), presetName: 'Custom Hardware' })}
            className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer disabled:opacity-40"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>128MB</span>
            <span>1024MB (1GB)</span>
            <span>4096MB (4GB)</span>
          </div>
        </div>

        {/* Storage Available Quota Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">Browser Storage Space</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{simulation.storageAvailableGB} GB</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="5"
            value={simulation.storageAvailableGB}
            onChange={(e) => onUpdateSimulation({ storageAvailableGB: Number(e.target.value), presetName: 'Custom Hardware' })}
            className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>1GB</span>
            <span>50GB</span>
            <span>100GB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
