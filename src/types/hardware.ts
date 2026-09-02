export interface WebGPULimits {
  maxStorageBufferBindingSize: number; // in bytes
  maxBufferSize: number; // in bytes
  maxComputeWorkgroupStorageSize: number;
  maxComputeInvocationsPerWorkgroup: number;
  maxComputeWorkgroupSizeX: number;
  maxComputeWorkgroupSizeY: number;
  maxComputeWorkgroupSizeZ: number;
}

export interface HardwareProfile {
  // Device & Platform
  platform: string;
  os: string;
  browser: string;
  userAgent: string;
  isMobile: boolean;

  // CPU
  cpuCores: number;
  cpuArchitecture: string;

  // Memory (RAM)
  reportedRamGB: number | null; // navigator.deviceMemory
  estimatedRamGB: number; // estimated if navigator.deviceMemory is null
  jsHeapLimitMB: number | null;

  // GPU & WebGPU
  hasWebGPU: boolean;
  webgpuVendor: string;
  webgpuArchitecture: string;
  webgpuDevice: string;
  webgpuDescription: string;
  hasShaderF16: boolean;
  hasSubgroups: boolean;
  webgpuLimits: WebGPULimits | null;
  webglRenderer: string;
  webglVendor: string;
  gpuTier: 'High-End' | 'Mid-Range' | 'Entry-Level' | 'Integrated' | 'Unknown';

  // WASM
  hasWasm: boolean;
  hasWasmSimd: boolean;
  hasWasmThreads: boolean;
  hasWasmMemory64: boolean;

  // Storage
  storageQuotaGB: number | null;
  storageUsageGB: number | null;
  storageAvailableGB: number | null;
  isStoragePersisted: boolean;

  // Chrome Built-in AI
  hasChromeBuiltinAI: boolean;
  chromeBuiltinAIStatus: string;

  // Network
  downlinkMbps: number | null;
  effectiveNetworkType: string | null;
  rttMs: number | null;

  // Detection timestamp
  timestamp: string;
}

export interface HardwareSimulation {
  isActive: boolean;
  presetName?: string;
  ramGB: number;
  cpuCores: number;
  gpuBackend: 'webgpu-f16' | 'webgpu-nof16' | 'webgl' | 'wasm-cpu';
  maxStorageBufferMB: number;
  storageAvailableGB: number;
  hasWasmSimd: boolean;
  downlinkMbps: number;
}
