import React from 'react';
import { RotateCcw } from 'lucide-react';
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
    <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-5 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1F1F1F]">
        <div>
          <h3 className="text-sm font-semibold tracking-[-0.28px] text-[#EDEDED]">
            Hardware Simulator
          </h3>
          <p className="text-xs font-normal text-[#707070] mt-0.5">
            Test model feasibility under simulated device constraints.
          </p>
        </div>

        <button
          onClick={onResetToAutoDetected}
          className="self-start sm:self-auto h-7 px-2.5 rounded-md text-xs font-normal text-[#A1A1A1] hover:text-[#EDEDED] bg-[#121212] hover:bg-[#171717] border border-[#262626] transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset to Detected</span>
        </button>
      </div>

      {/* Preset Chips */}
      <div className="mt-4">
        <span className="text-[11px] font-normal text-[#707070] block mb-2">
          Select device profile
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {HARDWARE_PRESETS.map((preset) => {
            const isSelected = simulation.presetName === preset.name;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`p-2.5 rounded-lg text-left border transition-colors flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#171717] border-[#EDEDED] text-[#EDEDED]'
                    : 'bg-[#000000] border-[#262626] hover:border-[#333333] text-[#A1A1A1] hover:text-[#EDEDED]'
                }`}
              >
                <div className="text-[10px] text-[#707070] uppercase font-mono">
                  {preset.badge}
                </div>
                <div className="text-xs font-medium text-[#EDEDED] mt-1 leading-tight line-clamp-1">
                  {preset.name}
                </div>
                <div className="text-[11px] font-mono text-[#707070] mt-2">
                  {preset.config.ramGB}GB • {preset.config.gpuBackend === 'wasm-cpu' ? 'CPU' : 'GPU'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Control Sliders */}
      <div className="mt-5 pt-4 border-t border-[#1F1F1F] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
        {/* RAM */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[#A1A1A1]">
            <span>System RAM</span>
            <span className="font-mono text-[#EDEDED]">{simulation.ramGB} GB</span>
          </div>
          <input
            type="range"
            min="2"
            max="64"
            step="2"
            value={simulation.ramGB}
            onChange={(e) => onUpdateSimulation({ ramGB: Number(e.target.value), presetName: 'Custom' })}
            className="w-full accent-[#EDEDED] bg-[#262626] h-1 rounded cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#707070] font-mono">
            <span>2GB</span>
            <span>16GB</span>
            <span>64GB</span>
          </div>
        </div>

        {/* GPU Backend */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[#A1A1A1]">
            <span>GPU Backend</span>
            <span className="font-mono text-[#EDEDED] text-[11px]">
              {simulation.gpuBackend === 'webgpu-f16' ? 'WebGPU f16' : simulation.gpuBackend === 'webgpu-nof16' ? 'WebGPU standard' : simulation.gpuBackend === 'webgl' ? 'WebGL' : 'CPU WASM'}
            </span>
          </div>
          <select
            value={simulation.gpuBackend}
            onChange={(e) => onUpdateSimulation({ gpuBackend: e.target.value as HardwareSimulation['gpuBackend'], presetName: 'Custom' })}
            className="w-full bg-[#121212] border border-[#262626] rounded-md px-2.5 py-1.5 text-xs text-[#EDEDED] focus:outline-none focus:border-[#4D4D4D]"
          >
            <option value="webgpu-f16">WebGPU + shader-f16</option>
            <option value="webgpu-nof16">WebGPU (no f16)</option>
            <option value="webgl">WebGL fallback</option>
            <option value="wasm-cpu">CPU WASM only</option>
          </select>
        </div>

        {/* Max Storage Buffer */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[#A1A1A1]">
            <span>Max Storage Buffer</span>
            <span className="font-mono text-[#EDEDED]">{simulation.maxStorageBufferMB} MB</span>
          </div>
          <input
            type="range"
            min="0"
            max="4096"
            step="128"
            value={simulation.maxStorageBufferMB}
            disabled={simulation.gpuBackend === 'wasm-cpu'}
            onChange={(e) => onUpdateSimulation({ maxStorageBufferMB: Number(e.target.value), presetName: 'Custom' })}
            className="w-full accent-[#EDEDED] bg-[#262626] h-1 rounded cursor-pointer disabled:opacity-40"
          />
          <div className="flex justify-between text-[10px] text-[#707070] font-mono">
            <span>128MB</span>
            <span>1024MB</span>
            <span>4096MB</span>
          </div>
        </div>

        {/* Storage Available */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[#A1A1A1]">
            <span>Browser Storage</span>
            <span className="font-mono text-[#EDEDED]">{simulation.storageAvailableGB} GB</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="5"
            value={simulation.storageAvailableGB}
            onChange={(e) => onUpdateSimulation({ storageAvailableGB: Number(e.target.value), presetName: 'Custom' })}
            className="w-full accent-[#EDEDED] bg-[#262626] h-1 rounded cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#707070] font-mono">
            <span>1GB</span>
            <span>50GB</span>
            <span>100GB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
