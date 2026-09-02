import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink 
} from 'lucide-react';
import type { HardwareProfile, HardwareSimulation } from '../types/hardware';

interface HardwareDashboardProps {
  hardware: HardwareProfile | null;
  simulation: HardwareSimulation;
  loading: boolean;
  onOpenBenchmark: () => void;
}

export const HardwareDashboard: React.FC<HardwareDashboardProps> = ({
  hardware,
  simulation,
  loading,
  onOpenBenchmark,
}) => {
  const [showTechnical, setShowTechnical] = useState(false);

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-6 text-center">
        <div className="h-4 w-40 bg-[#171717] rounded mx-auto mb-2 animate-pulse"></div>
        <div className="h-3 w-64 bg-[#121212] rounded mx-auto animate-pulse"></div>
      </div>
    );
  }

  if (!hardware) return null;

  const isSim = simulation.isActive;
  const displayRamGB = isSim ? simulation.ramGB : (hardware.reportedRamGB || hardware.estimatedRamGB);
  const displayStorageBufferMB = isSim
    ? simulation.maxStorageBufferMB
    : hardware.webgpuLimits 
      ? Math.round(hardware.webgpuLimits.maxStorageBufferBindingSize / (1024 * 1024))
      : 128;
  const displayStorageAvailGB = isSim ? simulation.storageAvailableGB : (hardware.storageAvailableGB ?? 25);
  const displayDownlinkMbps = isSim ? simulation.downlinkMbps : (hardware.downlinkMbps ?? 50);

  return (
    <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl overflow-hidden">
      {/* Top Header Row */}
      <div className="p-5 border-b border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-sm font-medium tracking-[-0.28px] text-[#EDEDED]">
              {isSim ? 'Simulation Profile' : 'System Hardware Profile'}
            </h2>
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-[#171717] border border-[#262626] text-[11px] font-normal text-[#A1A1A1]">
              <span className={`w-2 h-2 rounded-full ${isSim ? 'bg-[#FF990A]' : hardware.hasWebGPU ? 'bg-[#398E4A]' : 'bg-[#E5484D]'}`}></span>
              <span>{isSim ? 'Custom Sandbox' : hardware.hasWebGPU ? 'Hardware Accelerated' : 'CPU Execution'}</span>
            </div>
          </div>
          <p className="text-xs font-normal text-[#707070] mt-1">
            {isSim
              ? 'Evaluating model compatibility against user-defined parameters.'
              : `${hardware.os} • ${hardware.browser} • ${hardware.cpuCores} Cores • ${hardware.webgpuDevice || hardware.webglRenderer}`}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenBenchmark}
            className="h-7 px-2.5 rounded-md text-xs font-normal bg-[#171717] hover:bg-[#262626] text-[#EDEDED] border border-[#333333] transition-colors flex items-center gap-1.5"
          >
            <span>Run GPU Test</span>
            <ExternalLink className="h-3 w-3 text-[#707070]" />
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Blocks */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#262626]">
        {/* GPU & Acceleration */}
        <div className="p-4 sm:p-5">
          <span className="text-[11px] font-normal text-[#707070] block">GPU & Backend</span>
          <div className="text-sm font-medium text-[#EDEDED] mt-1 truncate" title={isSim ? simulation.gpuBackend : hardware.webgpuDevice}>
            {isSim ? simulation.gpuBackend : (hardware.webgpuDevice || 'WebGL')}
          </div>
          <div className="flex items-center space-x-2 mt-2 text-[11px] text-[#A1A1A1]">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${(isSim ? simulation.gpuBackend === 'webgpu-f16' : hardware.hasShaderF16) ? 'bg-[#398E4A]' : 'bg-[#707070]'}`}></span>
              shader-f16
            </span>
            <span className="text-[#333333]">•</span>
            <span>{isSim ? 'Custom' : hardware.gpuTier}</span>
          </div>
        </div>

        {/* Memory */}
        <div className="p-4 sm:p-5">
          <span className="text-[11px] font-normal text-[#707070] block">System Memory (RAM)</span>
          <div className="text-sm font-medium text-[#EDEDED] mt-1 font-mono">
            {displayRamGB} GB
          </div>
          <div className="text-[11px] text-[#707070] mt-2">
            {isSim ? 'Configured memory' : hardware.reportedRamGB ? 'Reported by browser' : 'Estimated from device'}
          </div>
        </div>

        {/* GPU Storage Buffer Limit */}
        <div className="p-4 sm:p-5">
          <span className="text-[11px] font-normal text-[#707070] block">Max Storage Buffer</span>
          <div className="text-sm font-medium text-[#EDEDED] mt-1 font-mono">
            {displayStorageBufferMB} MB
          </div>
          <div className="text-[11px] text-[#707070] mt-2">
            {displayStorageBufferMB >= 1024 ? 'Fits 3B+ layer tensors' : 'Suited for < 1B models'}
          </div>
        </div>

        {/* Storage & Network */}
        <div className="p-4 sm:p-5">
          <span className="text-[11px] font-normal text-[#707070] block">Cache & Bandwidth</span>
          <div className="text-sm font-medium text-[#EDEDED] mt-1 font-mono">
            ~{displayStorageAvailGB} GB • {displayDownlinkMbps} Mbps
          </div>
          <div className="text-[11px] text-[#707070] mt-2 truncate">
            {hardware.hasChromeBuiltinAI ? 'Chrome Built-in AI active' : 'Standard Web Cache'}
          </div>
        </div>
      </div>

      {/* Technical Expandable Details */}
      <div className="border-t border-[#262626]">
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="w-full px-5 py-2.5 flex items-center justify-between text-xs font-normal text-[#707070] hover:text-[#EDEDED] transition-colors"
        >
          <span>Technical WebGPU and WebAssembly parameters</span>
          {showTechnical ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {showTechnical && (
          <div className="p-5 pt-0 border-t border-[#1F1F1F] bg-[#000000] text-xs font-mono grid grid-cols-1 md:grid-cols-3 gap-4 text-[#A1A1A1]">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#707070] font-sans font-medium">WebGPU Limits</span>
              <div>maxStorageBuffer: <span className="text-[#EDEDED]">{hardware.webgpuLimits ? `${(hardware.webgpuLimits.maxStorageBufferBindingSize / (1024 * 1024)).toFixed(0)} MB` : 'N/A'}</span></div>
              <div>maxBufferSize: <span className="text-[#EDEDED]">{hardware.webgpuLimits ? `${(hardware.webgpuLimits.maxBufferSize / (1024 * 1024)).toFixed(0)} MB` : 'N/A'}</span></div>
              <div>maxWorkgroupStorage: <span className="text-[#EDEDED]">{hardware.webgpuLimits?.maxComputeWorkgroupStorageSize ?? 'N/A'} B</span></div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#707070] font-sans font-medium">WebAssembly (WASM)</span>
              <div>WASM SIMD: <span className={hardware.hasWasmSimd ? 'text-[#EDEDED]' : 'text-[#707070]'}>{hardware.hasWasmSimd ? 'Supported' : 'Unsupported'}</span></div>
              <div>SharedArrayBuffer: <span className={hardware.hasWasmThreads ? 'text-[#EDEDED]' : 'text-[#707070]'}>{hardware.hasWasmThreads ? 'Enabled' : 'Unavailable'}</span></div>
              <div>Memory64: <span className="text-[#707070]">{hardware.hasWasmMemory64 ? 'Yes' : 'No'}</span></div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#707070] font-sans font-medium">Device Context</span>
              <div>Platform: <span className="text-[#EDEDED]">{hardware.platform}</span></div>
              <div>Heap Limit: <span className="text-[#EDEDED]">{hardware.jsHeapLimitMB ? `${hardware.jsHeapLimitMB} MB` : 'N/A'}</span></div>
              <div>Chrome AI: <span className="text-[#707070]">{hardware.chromeBuiltinAIStatus}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
