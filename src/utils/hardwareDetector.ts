import type { HardwareProfile, WebGPULimits } from '../types/hardware';

// Test WASM SIMD support using minimal byte sequence
function checkWasmSimd(): boolean {
  try {
    return WebAssembly.validate(
      new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10,
        10, 1, 8, 0, 125, 0, 0, 0, 0, 11
      ])
    );
  } catch {
    return false;
  }
}

// Test WASM Threads
function checkWasmThreads(): boolean {
  try {
    return typeof SharedArrayBuffer !== 'undefined';
  } catch {
    return false;
  }
}

// Test WASM Memory64
function checkWasmMemory64(): boolean {
  try {
    // Memory64 byte sequence validation
    return WebAssembly.validate(
      new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 5, 3, 1, 4, 1])
    );
  } catch {
    return false;
  }
}

// Get WebGL unmasked renderer information
function getWebGLInfo(): { vendor: string; renderer: string } {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return { vendor: 'Unavailable', renderer: 'Unavailable' };

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) {
      return {
        vendor: gl.getParameter(gl.VENDOR) || 'Generic',
        renderer: gl.getParameter(gl.RENDERER) || 'Generic'
      };
    }

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown';
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown';
    return { vendor, renderer };
  } catch {
    return { vendor: 'Error detecting', renderer: 'Error detecting' };
  }
}

// Heuristic GPU Tier evaluation
function evaluateGpuTier(renderer: string, hasWebGPU: boolean, hasShaderF16: boolean): 'High-End' | 'Mid-Range' | 'Entry-Level' | 'Integrated' | 'Unknown' {
  const lower = renderer.toLowerCase();
  if (lower.includes('apple') && (lower.includes('m3') || lower.includes('m4') || lower.includes('max') || lower.includes('pro'))) {
    return 'High-End';
  }
  if (lower.includes('rtx 40') || lower.includes('rtx 30') || lower.includes('radeon rx 7') || lower.includes('radeon rx 6')) {
    return 'High-End';
  }
  if (lower.includes('apple m1') || lower.includes('apple m2') || lower.includes('rtx 20') || lower.includes('gtx 1660')) {
    return 'Mid-Range';
  }
  if (lower.includes('iris') || lower.includes('intel uhd') || lower.includes('radeon graphics') || lower.includes('mali') || lower.includes('adreno')) {
    return 'Integrated';
  }
  if (hasWebGPU && hasShaderF16) {
    return 'Mid-Range';
  }
  if (hasWebGPU) {
    return 'Entry-Level';
  }
  return 'Unknown';
}

// Parse OS and Browser from navigator
function getPlatformInfo() {
  const ua = navigator.userAgent;
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // OS
  if (ua.includes('Mac OS X') || ua.includes('Macintosh')) {
    os = 'macOS';
    if (navigator.maxTouchPoints > 1 && !ua.includes('iPhone')) {
      os = 'iPadOS / macOS Touch';
    }
  } else if (ua.includes('Windows')) {
    os = 'Windows';
  } else if (ua.includes('Android')) {
    os = 'Android';
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
  }

  // Browser
  if (ua.includes('Edg/')) {
    browser = 'Microsoft Edge';
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browser = 'Google Chrome / Chromium';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    browser = 'Apple Safari';
  } else if (ua.includes('Firefox/')) {
    browser = 'Mozilla Firefox';
  } else if (ua.includes('Brave/')) {
    browser = 'Brave Browser';
  }

  return { os, browser, isMobile };
}

export async function detectHardwareProfile(): Promise<HardwareProfile> {
  const { os, browser, isMobile } = getPlatformInfo();
  const webgl = getWebGLInfo();

  // CPU
  const cpuCores = navigator.hardwareConcurrency || 4;
  let cpuArch = 'x86_64';
  if (webgl.renderer.toLowerCase().includes('apple') || os === 'iOS' || os === 'Android' || navigator.platform.includes('ARM')) {
    cpuArch = 'ARM64';
  }

  // Memory (RAM)
  const navMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? null;
  let estimatedRamGB = navMemory || 8;
  if (!navMemory) {
    // Estimations for Safari / Firefox
    if (isMobile) {
      estimatedRamGB = 4;
    } else if (webgl.renderer.toLowerCase().includes('apple')) {
      estimatedRamGB = 16;
    } else {
      estimatedRamGB = cpuCores >= 8 ? 16 : 8;
    }
  }

  // Heap limit
  const perfMemory = (performance as unknown as { memory?: { jsHeapSizeLimit: number } }).memory;
  const jsHeapLimitMB = perfMemory ? Math.round(perfMemory.jsHeapSizeLimit / (1024 * 1024)) : null;

  // WebGPU detection
  let hasWebGPU = false;
  let webgpuVendor = 'Not supported';
  let webgpuArchitecture = '';
  let webgpuDevice = '';
  let webgpuDescription = '';
  let hasShaderF16 = false;
  let hasSubgroups = false;
  let webgpuLimits: WebGPULimits | null = null;

  if ('gpu' in navigator && navigator.gpu) {
    try {
      const adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance'
      });

      if (adapter) {
        hasWebGPU = true;
        
        // Features
        hasShaderF16 = adapter.features.has('shader-f16');
        hasSubgroups = adapter.features.has('subgroups') || adapter.features.has('subgroups-f16');

        // Limits
        const limits = adapter.limits;
        webgpuLimits = {
          maxStorageBufferBindingSize: limits.maxStorageBufferBindingSize,
          maxBufferSize: limits.maxBufferSize,
          maxComputeWorkgroupStorageSize: limits.maxComputeWorkgroupStorageSize,
          maxComputeInvocationsPerWorkgroup: limits.maxComputeInvocationsPerWorkgroup,
          maxComputeWorkgroupSizeX: limits.maxComputeWorkgroupSizeX,
          maxComputeWorkgroupSizeY: limits.maxComputeWorkgroupSizeY,
          maxComputeWorkgroupSizeZ: limits.maxComputeWorkgroupSizeZ,
        };

        // Adapter info
        if ('requestAdapterInfo' in adapter && typeof (adapter as unknown as { requestAdapterInfo: () => Promise<Record<string, string>> }).requestAdapterInfo === 'function') {
          try {
            const info = await (adapter as unknown as { requestAdapterInfo: () => Promise<Record<string, string>> }).requestAdapterInfo();
            webgpuVendor = info.vendor || '';
            webgpuArchitecture = info.architecture || '';
            webgpuDevice = info.device || '';
            webgpuDescription = info.description || '';
          } catch {
            // fallback
          }
        }
        
        // Newer Chrome has adapter.info synchronously
        if ('info' in adapter && adapter.info) {
          const info = adapter.info as unknown as Record<string, string>;
          webgpuVendor = info.vendor || webgpuVendor;
          webgpuArchitecture = info.architecture || webgpuArchitecture;
          webgpuDevice = info.device || webgpuDevice;
          webgpuDescription = info.description || webgpuDescription;
        }

        if (!webgpuVendor || webgpuVendor === '') {
          webgpuVendor = webgl.vendor;
        }
        if (!webgpuDevice || webgpuDevice === '') {
          webgpuDevice = webgl.renderer;
        }
      }
    } catch {
      hasWebGPU = false;
    }
  }

  // Storage estimate
  let storageQuotaGB: number | null = null;
  let storageUsageGB: number | null = null;
  let storageAvailableGB: number | null = null;
  let isStoragePersisted = false;

  if (navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      if (estimate.quota) {
        storageQuotaGB = Math.round((estimate.quota / (1024 * 1024 * 1024)) * 10) / 10;
      }
      if (estimate.usage !== undefined) {
        storageUsageGB = Math.round((estimate.usage / (1024 * 1024 * 1024)) * 10) / 10;
      }
      if (storageQuotaGB !== null && storageUsageGB !== null) {
        storageAvailableGB = Math.round((storageQuotaGB - storageUsageGB) * 10) / 10;
      }
    } catch {
      // Storage estimation failure
    }
  }

  if (navigator.storage && navigator.storage.persisted) {
    try {
      isStoragePersisted = await navigator.storage.persisted();
    } catch {
      isStoragePersisted = false;
    }
  }

  // Chrome Built-in AI check
  let hasChromeBuiltinAI = false;
  let chromeBuiltinAIStatus = 'Unavailable';
  const win = window as unknown as { ai?: { languageModel?: { capabilities: () => Promise<{ available: string }> } } };
  if (win.ai && win.ai.languageModel) {
    try {
      const caps = await win.ai.languageModel.capabilities();
      if (caps && caps.available !== 'no') {
        hasChromeBuiltinAI = true;
        chromeBuiltinAIStatus = caps.available === 'readily' ? 'Ready (Gemini Nano preloaded)' : 'Available after download';
      } else {
        chromeBuiltinAIStatus = 'Disabled / Model not installed';
      }
    } catch {
      chromeBuiltinAIStatus = 'Prompt API detected (flag required)';
    }
  }

  // Network connection
  const conn = (navigator as unknown as { connection?: { downlink?: number; effectiveType?: string; rtt?: number } }).connection;
  const downlinkMbps = conn?.downlink ?? null;
  const effectiveNetworkType = conn?.effectiveType ?? null;
  const rttMs = conn?.rtt ?? null;

  const gpuTier = evaluateGpuTier(webgpuDevice || webgl.renderer, hasWebGPU, hasShaderF16);

  const isUnified = webgl.renderer.toLowerCase().includes('apple') || (os === 'macOS' && cpuArch === 'ARM64') || os === 'iOS';
  const effectiveGpuVramGB = isUnified
    ? Math.round(estimatedRamGB * 0.75 * 10) / 10
    : webgpuLimits
      ? Math.max(2, Math.round((webgpuLimits.maxStorageBufferBindingSize / (1024 * 1024 * 1024)) * 3 * 10) / 10)
      : 2;

  return {
    platform: navigator.platform || os,
    os,
    browser,
    userAgent: navigator.userAgent,
    isMobile,
    cpuCores,
    cpuArchitecture: cpuArch,
    reportedRamGB: navMemory,
    estimatedRamGB,
    jsHeapLimitMB,
    hasWebGPU,
    webgpuVendor: webgpuVendor || 'Generic WebGPU',
    webgpuArchitecture,
    webgpuDevice: webgpuDevice || webgl.renderer,
    webgpuDescription,
    hasShaderF16,
    hasSubgroups,
    webgpuLimits,
    webglRenderer: webgl.renderer,
    webglVendor: webgl.vendor,
    gpuTier,
    isUnifiedMemory: isUnified,
    effectiveGpuVramGB,
    hasWasm: typeof WebAssembly === 'object',
    hasWasmSimd: checkWasmSimd(),
    hasWasmThreads: checkWasmThreads(),
    hasWasmMemory64: checkWasmMemory64(),
    storageQuotaGB,
    storageUsageGB,
    storageAvailableGB: storageAvailableGB ?? 25,
    isStoragePersisted,
    hasChromeBuiltinAI,
    chromeBuiltinAIStatus,
    downlinkMbps,
    effectiveNetworkType,
    rttMs,
    timestamp: new Date().toLocaleTimeString(),
  };
}
