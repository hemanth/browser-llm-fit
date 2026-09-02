import type { HardwareSimulation } from '../types/hardware';

export interface HardwarePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  config: Omit<HardwareSimulation, 'isActive'>;
}

export const HARDWARE_PRESETS: HardwarePreset[] = [
  {
    id: 'macbook-pro-m3-max',
    name: 'MacBook Pro (M3/M4 Max)',
    badge: 'Ultra High-End',
    description: '36GB Unified Memory, Apple Silicon WebGPU with shader-f16, up to 4GB buffer binding.',
    config: {
      presetName: 'MacBook Pro (M3/M4 Max)',
      ramGB: 36,
      cpuCores: 16,
      gpuBackend: 'webgpu-f16',
      maxStorageBufferMB: 4096,
      storageAvailableGB: 120,
      hasWasmSimd: true,
      downlinkMbps: 250,
    }
  },
  {
    id: 'gaming-pc-rtx-4080',
    name: 'Gaming Desktop (RTX 4080 / 4090)',
    badge: 'Desktop Dedicated GPU',
    description: '32GB System RAM, 16GB Dedicated VRAM, full WebGPU & shader-f16 compute acceleration.',
    config: {
      presetName: 'Gaming Desktop (RTX 4080 / 4090)',
      ramGB: 32,
      cpuCores: 24,
      gpuBackend: 'webgpu-f16',
      maxStorageBufferMB: 4096,
      storageAvailableGB: 80,
      hasWasmSimd: true,
      downlinkMbps: 500,
    }
  },
  {
    id: 'macbook-air-m2',
    name: 'MacBook Air (M1/M2/M3 - 8GB)',
    badge: 'Popular Ultrabook',
    description: '8GB Unified RAM, efficient Apple Silicon WebGPU with f16 support. Runs up to 3B models.',
    config: {
      presetName: 'MacBook Air (M1/M2/M3 - 8GB)',
      ramGB: 8,
      cpuCores: 8,
      gpuBackend: 'webgpu-f16',
      maxStorageBufferMB: 2048,
      storageAvailableGB: 45,
      hasWasmSimd: true,
      downlinkMbps: 100,
    }
  },
  {
    id: 'mid-range-laptop',
    name: 'Modern Laptop (Intel Core Ultra / Iris Xe)',
    badge: 'Integrated GPU',
    description: '16GB System RAM, Integrated Intel/AMD GPU with standard WebGPU support (1GB buffer).',
    config: {
      presetName: 'Modern Laptop (Intel Core Ultra / Iris Xe)',
      ramGB: 16,
      cpuCores: 12,
      gpuBackend: 'webgpu-f16',
      maxStorageBufferMB: 1024,
      storageAvailableGB: 30,
      hasWasmSimd: true,
      downlinkMbps: 80,
    }
  },
  {
    id: 'flagship-mobile',
    name: 'Flagship Phone (iPhone 15/16 Pro or S24)',
    badge: 'Mobile Flagship',
    description: '8GB RAM, Mobile WebGPU with shader-f16, thermal throttling limits.',
    config: {
      presetName: 'Flagship Phone (iPhone 15/16 Pro or S24)',
      ramGB: 8,
      cpuCores: 8,
      gpuBackend: 'webgpu-f16',
      maxStorageBufferMB: 512,
      storageAvailableGB: 20,
      hasWasmSimd: true,
      downlinkMbps: 60,
    }
  },
  {
    id: 'budget-mobile',
    name: 'Budget Phone / Tablet (Mali / Adreno)',
    badge: 'Mobile Budget',
    description: '4GB RAM, WebGL fallback or basic WebGPU without f16, tighter memory headroom.',
    config: {
      presetName: 'Budget Phone / Tablet (Mali / Adreno)',
      ramGB: 4,
      cpuCores: 6,
      gpuBackend: 'webgpu-nof16',
      maxStorageBufferMB: 256,
      storageAvailableGB: 8,
      hasWasmSimd: true,
      downlinkMbps: 25,
    }
  },
  {
    id: 'legacy-chromebook',
    name: 'Legacy Chromebook / Thin Client',
    badge: 'CPU WASM Only',
    description: '4GB RAM, No WebGPU, runs exclusively on WebAssembly (WASM SIMD) on CPU.',
    config: {
      presetName: 'Legacy Chromebook / Thin Client',
      ramGB: 4,
      cpuCores: 4,
      gpuBackend: 'wasm-cpu',
      maxStorageBufferMB: 0,
      storageAvailableGB: 5,
      hasWasmSimd: true,
      downlinkMbps: 20,
    }
  }
];
