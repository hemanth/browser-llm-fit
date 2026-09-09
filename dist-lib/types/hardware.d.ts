export interface WebGPULimits {
    maxStorageBufferBindingSize: number;
    maxBufferSize: number;
    maxComputeWorkgroupStorageSize: number;
    maxComputeInvocationsPerWorkgroup: number;
    maxComputeWorkgroupSizeX: number;
    maxComputeWorkgroupSizeY: number;
    maxComputeWorkgroupSizeZ: number;
}
export interface HardwareProfile {
    platform: string;
    os: string;
    browser: string;
    userAgent: string;
    isMobile: boolean;
    cpuCores: number;
    cpuArchitecture: string;
    reportedRamGB: number | null;
    estimatedRamGB: number;
    jsHeapLimitMB: number | null;
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
    isUnifiedMemory: boolean;
    effectiveGpuVramGB: number;
    hasWasm: boolean;
    hasWasmSimd: boolean;
    hasWasmThreads: boolean;
    hasWasmMemory64: boolean;
    storageQuotaGB: number | null;
    storageUsageGB: number | null;
    storageAvailableGB: number | null;
    isStoragePersisted: boolean;
    hasChromeBuiltinAI: boolean;
    chromeBuiltinAIStatus: string;
    downlinkMbps: number | null;
    effectiveNetworkType: string | null;
    rttMs: number | null;
    timestamp: string;
}
export interface HardwareSimulation {
    isActive: boolean;
    presetName?: string;
    ramGB: number;
    cpuCores: number;
    gpuBackend: 'webgpu-f16' | 'webgpu-nof16' | 'webgl' | 'wasm-cpu';
    maxStorageBufferMB: number;
    vramGB?: number;
    storageAvailableGB: number;
    hasWasmSimd: boolean;
    downlinkMbps: number;
}
