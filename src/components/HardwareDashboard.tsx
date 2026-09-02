import React, { useState } from 'react';
import { 
  MemoryStick, 
  HardDrive, 
  Wifi, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Monitor, 
  Info 
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (loading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded-full mx-auto mb-4"></div>
        <div className="h-4 w-72 bg-slate-800/60 rounded-full mx-auto"></div>
      </div>
    );
  }

  if (!hardware) {
    return null;
  }

  // Active configuration values (simulated vs live)
  const isSim = simulation.isActive;
  const displayRamGB = isSim ? simulation.ramGB : (hardware.reportedRamGB || hardware.estimatedRamGB);
  const displayGpuBackend = isSim 
    ? (simulation.gpuBackend === 'webgpu-f16' ? 'WebGPU (shader-f16)' : simulation.gpuBackend === 'webgpu-nof16' ? 'WebGPU (standard)' : simulation.gpuBackend === 'webgl' ? 'WebGL Only' : 'CPU WASM Only')
    : hardware.hasWebGPU ? `WebGPU (${hardware.hasShaderF16 ? 'shader-f16 enabled' : 'standard fp32'})` : 'No WebGPU (CPU Fallback)';

  const displayStorageBufferMB = isSim
    ? simulation.maxStorageBufferMB
    : hardware.webgpuLimits 
      ? Math.round(hardware.webgpuLimits.maxStorageBufferBindingSize / (1024 * 1024))
      : 128;

  const displayStorageAvailGB = isSim ? simulation.storageAvailableGB : (hardware.storageAvailableGB ?? 25);
  const displayDownlinkMbps = isSim ? simulation.downlinkMbps : (hardware.downlinkMbps ?? 50);

  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 rounded-2xl shadow-2xl p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

      {/* Header with device badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Monitor className="h-5 w-5 text-cyan-400" />
              {isSim ? 'Active Simulation Profile' : 'Detected Device Hardware'}
            </h2>
            {isSim ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Simulation Sandbox
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Live Hardware
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isSim
              ? 'Using custom hardware parameters. Models below are filtered and scored against this simulated machine.'
              : `${hardware.os} • ${hardware.browser} • ${hardware.cpuCores} CPU Cores • ${hardware.webgpuDevice || hardware.webglRenderer}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBenchmark}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-900 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            Live GPU Allocation Test
          </button>
        </div>
      </div>

      {/* Hardware Spec Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {/* GPU & WebGPU Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-cyan-400" />
              GPU & Acceleration
            </span>
            {(isSim ? simulation.gpuBackend.startsWith('webgpu') : hardware.hasWebGPU) ? (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                WebGPU Ready
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                CPU WASM
              </span>
            )}
          </div>
          <div className="text-sm font-bold text-white truncate" title={isSim ? displayGpuBackend : (hardware.webgpuDevice || hardware.webglRenderer)}>
            {isSim ? displayGpuBackend : (hardware.webgpuDevice || hardware.webglRenderer)}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Tier: {isSim ? 'Custom' : hardware.gpuTier}
            </span>
            {(isSim ? simulation.gpuBackend === 'webgpu-f16' : hardware.hasShaderF16) ? (
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
                <CheckCircle2 className="h-2.5 w-2.5" /> shader-f16
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                <AlertTriangle className="h-2.5 w-2.5" /> No f16
              </span>
            )}
          </div>
        </div>

        {/* Memory (RAM) Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MemoryStick className="h-4 w-4 text-indigo-400" />
              System RAM
            </span>
            <span className="text-xs font-mono font-bold text-indigo-400">
              {displayRamGB} GB
            </span>
          </div>
          <div className="text-sm font-bold text-white">
            {displayRamGB >= 16 ? 'High Capacity' : displayRamGB >= 8 ? 'Standard Headroom' : 'Constrained / Mobile'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {isSim 
              ? 'Configured system memory' 
              : hardware.reportedRamGB 
                ? `Reported via navigator.deviceMemory (${hardware.reportedRamGB}GB)` 
                : `Estimated ~${hardware.estimatedRamGB}GB (platform & cores)`}
          </p>
          {hardware.jsHeapLimitMB && !isSim && (
            <div className="text-[10px] text-slate-500 mt-1 font-mono">
              V8 JS Heap Limit: ~{hardware.jsHeapLimitMB} MB
            </div>
          )}
        </div>

        {/* Storage Buffer Binding Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <HardDrive className="h-4 w-4 text-emerald-400" />
              GPU Storage Buffer
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {displayStorageBufferMB} MB
            </span>
          </div>
          <div className="text-sm font-bold text-white">
            {displayStorageBufferMB >= 2048 ? 'Up to 7B Models' : displayStorageBufferMB >= 1024 ? 'Up to 3B Models' : 'Small Models & Embeddings'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Max single layer tensor binding limit in WebGPU memory
          </p>
        </div>

        {/* Web Storage Quota & Network Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wifi className="h-4 w-4 text-purple-400" />
              Storage & Network
            </span>
            <span className="text-xs font-mono font-bold text-purple-400">
              {displayDownlinkMbps} Mbps
            </span>
          </div>
          <div className="text-sm font-bold text-white">
            ~{displayStorageAvailGB} GB Free Cache
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Browser storage available to persist downloaded model weights
          </p>
        </div>
      </div>

      {/* Chrome Built-in AI Banner (if available or partially available) */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/30 border border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-white">Chrome Built-in AI (Prompt API / Gemini Nano): </span>
            <span className={hardware.hasChromeBuiltinAI ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
              {hardware.hasChromeBuiltinAI ? hardware.chromeBuiltinAIStatus : 'Not detected on this browser (Chrome 128+ with flags required)'}
            </span>
          </div>
        </div>
        {hardware.hasChromeBuiltinAI && (
          <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-semibold border border-blue-700 shrink-0">
            Zero-Download Instant Chat Available
          </span>
        )}
      </div>

      {/* Advanced Hardware Limits & Details Toggle */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-col">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-all font-medium py-1"
        >
          <span className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-cyan-400" />
            {showAdvanced ? 'Hide Technical WebGPU Limits & WASM Capabilities' : 'Show Detailed WebGPU Limits & WASM Engine Specs'}
          </span>
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <span className="text-slate-500 block mb-1 uppercase text-[10px] tracking-wider font-semibold">WebGPU Limits</span>
              <div className="text-slate-300 space-y-1">
                <div>maxStorageBufferBindingSize: <span className="text-cyan-400">{hardware.webgpuLimits ? `${(hardware.webgpuLimits.maxStorageBufferBindingSize / (1024 * 1024)).toFixed(0)} MB` : 'N/A'}</span></div>
                <div>maxBufferSize: <span className="text-cyan-400">{hardware.webgpuLimits ? `${(hardware.webgpuLimits.maxBufferSize / (1024 * 1024)).toFixed(0)} MB` : 'N/A'}</span></div>
                <div>maxComputeWorkgroupStorage: <span className="text-cyan-400">{hardware.webgpuLimits ? `${hardware.webgpuLimits.maxComputeWorkgroupStorageSize} bytes` : 'N/A'}</span></div>
                <div>maxComputeInvocations: <span className="text-cyan-400">{hardware.webgpuLimits?.maxComputeInvocationsPerWorkgroup ?? 'N/A'}</span></div>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-1 uppercase text-[10px] tracking-wider font-semibold">WASM & Features</span>
              <div className="text-slate-300 space-y-1">
                <div>WASM SIMD: <span className={hardware.hasWasmSimd ? 'text-emerald-400' : 'text-rose-400'}>{hardware.hasWasmSimd ? '✓ Supported' : '✗ Unsupported'}</span></div>
                <div>WASM Threads (SharedArrayBuffer): <span className={hardware.hasWasmThreads ? 'text-emerald-400' : 'text-amber-400'}>{hardware.hasWasmThreads ? '✓ Supported' : '✗ Unavailable'}</span></div>
                <div>WASM Memory64: <span className={hardware.hasWasmMemory64 ? 'text-emerald-400' : 'text-slate-400'}>{hardware.hasWasmMemory64 ? '✓ Supported' : '✗ No'}</span></div>
                <div>WebGPU Subgroups: <span className={hardware.hasSubgroups ? 'text-emerald-400' : 'text-slate-400'}>{hardware.hasSubgroups ? '✓ Supported' : '✗ No'}</span></div>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-1 uppercase text-[10px] tracking-wider font-semibold">Browser & System Context</span>
              <div className="text-slate-300 space-y-1">
                <div>Platform: <span className="text-slate-300">{hardware.platform} ({hardware.cpuArchitecture})</span></div>
                <div>WebGL Renderer: <span className="text-slate-400 truncate block" title={hardware.webglRenderer}>{hardware.webglRenderer}</span></div>
                <div>Storage Persisted: <span className={hardware.isStoragePersisted ? 'text-emerald-400' : 'text-slate-400'}>{hardware.isStoragePersisted ? 'Yes' : 'No'}</span></div>
                <div>Network RTT: <span className="text-cyan-400">{hardware.rttMs ? `${hardware.rttMs} ms` : 'N/A'}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
