import type { HardwareProfile, HardwareSimulation } from '../types/hardware.js';
import type { CompatibilityCheck, CompatibilityEvaluation, CompatibilityTier, InBrowserModel } from '../types/model.js';

export function evaluateModelCompatibility(
  model: InBrowserModel,
  hardware: HardwareProfile,
  simulation?: HardwareSimulation
): CompatibilityEvaluation {
  // Use simulated hardware values if simulation is active
  const isSim = simulation && simulation.isActive;

  const effectiveRamGB = isSim ? simulation.ramGB : (hardware.reportedRamGB || hardware.estimatedRamGB);
  const effectiveGpuBackend = isSim 
    ? simulation.gpuBackend 
    : hardware.hasWebGPU 
      ? (hardware.hasShaderF16 ? 'webgpu-f16' : 'webgpu-nof16') 
      : 'wasm-cpu';
      
  const effectiveHasWebGPU = effectiveGpuBackend.startsWith('webgpu');
  const effectiveHasShaderF16 = effectiveGpuBackend === 'webgpu-f16';
  
  const effectiveMaxStorageBufferMB = isSim
    ? simulation.maxStorageBufferMB
    : hardware.webgpuLimits 
      ? Math.round(hardware.webgpuLimits.maxStorageBufferBindingSize / (1024 * 1024))
      : 128;

  const effectiveStorageAvailGB = isSim 
    ? simulation.storageAvailableGB 
    : hardware.storageAvailableGB;

  const effectiveDownlinkMbps = isSim 
    ? simulation.downlinkMbps 
    : (hardware.downlinkMbps ?? 50);

  const checks: CompatibilityCheck[] = [];
  let score = 100;
  let hardBlock = false;

  // 1. Chrome Built-in AI check
  if (model.framework === 'Chrome Built-in AI') {
    if (hardware.hasChromeBuiltinAI) {
      checks.push({
        name: 'Chrome Built-in AI (Prompt API)',
        passed: true,
        detail: `Native Gemini Nano active (${hardware.chromeBuiltinAIStatus})`,
        severity: 'ok'
      });
      return {
        tier: 'smooth',
        score: 98,
        headline: 'Native Instant Execution',
        summary: 'Built directly into Chrome. Zero download required; runs natively with high optimization.',
        checks,
        estimatedSpeed: '40 - 65 tokens/sec',
        estimatedDownloadTime: '0s (Pre-installed in browser)',
        recommendedBackend: 'Native Chrome'
      };
    } else {
      checks.push({
        name: 'Chrome Built-in AI API',
        passed: false,
        detail: 'window.ai.languageModel not available or Gemini Nano not downloaded in this browser build.',
        severity: 'error'
      });
      return {
        tier: 'incompatible',
        score: 15,
        headline: 'Chrome AI Unavailable',
        summary: 'Requires Chrome 128+ with Built-in AI enabled via chrome://flags/#optimization-guide-on-device-model.',
        checks,
        estimatedSpeed: 'N/A',
        estimatedDownloadTime: 'N/A',
        recommendedBackend: 'Native Chrome'
      };
    }
  }

  // 2. WebGPU Requirement Check
  if (model.requiresWebGPU) {
    if (!effectiveHasWebGPU) {
      checks.push({
        name: 'WebGPU Engine',
        passed: false,
        detail: 'Model strictly requires WebGPU for shader acceleration. Your current configuration has only CPU/WebGL.',
        severity: 'error'
      });
      score -= 50;
      hardBlock = true;
    } else {
      checks.push({
        name: 'WebGPU Engine',
        passed: true,
        detail: `WebGPU active on ${isSim ? 'Simulated Adapter' : hardware.webgpuDevice}`,
        severity: 'ok'
      });
    }
  } else {
    checks.push({
      name: 'Runtime Engine',
      passed: true,
      detail: effectiveHasWebGPU ? 'WebGPU accelerated (WASM CPU fallback also supported)' : 'Running on CPU via WebAssembly (SIMD)',
      severity: 'ok'
    });
  }

  if (!effectiveHasWebGPU && model.framework !== 'TensorFlow.js') {
    const hasSimd = isSim ? simulation.hasWasmSimd : hardware.hasWasmSimd;
    const requiresSimd = model.framework === 'Transformers.js';
    const hasRuntime = hardware.hasWasm && (!requiresSimd || hasSimd);
    checks.push({
      name: requiresSimd ? 'WASM SIMD Runtime' : 'WASM Runtime', passed: hasRuntime,
      detail: hasRuntime ? 'Required WebAssembly features are available.' : `This CPU backend requires WebAssembly${requiresSimd ? ' with SIMD support' : ''}.`,
      severity: hasRuntime ? 'ok' : 'error',
    });
    if (!hasRuntime) { hardBlock = true; score -= 50; }
  }

  if (effectiveHasWebGPU && model.minVramGB > 0) {
    const suppliedVram = isSim ? simulation.vramGB : undefined;
    if (suppliedVram !== undefined) {
      const sufficient = suppliedVram >= model.minVramGB;
      checks.push({ name: 'GPU Memory Budget', passed: sufficient,
        detail: `Supplied budget: ${suppliedVram}GB; minimum: ${model.minVramGB}GB.`,
        severity: sufficient ? 'ok' : 'error' });
      if (!sufficient) { hardBlock = true; score -= 40; }
    } else {
      checks.push({ name: 'GPU Memory Budget', passed: false, severity: 'warning',
        detail: `Requires at least ${model.minVramGB}GB GPU memory. Free VRAM cannot be measured here; buffer limits do not establish total memory capacity.` });
      score -= 15;
    }
  }

  // 3. Shader F16 Support Check
  if (model.requiresShaderF16) {
    if (!effectiveHasShaderF16) {
      checks.push({
        name: '16-bit Float Shaders (shader-f16)',
        passed: false,
        detail: 'GPU missing "shader-f16" feature. Models compiled with fp16/q4f16 require this WebGPU extension.',
        severity: 'error'
      });
      score -= 40;
      hardBlock = true;
    } else {
      checks.push({
        name: '16-bit Float Shaders (shader-f16)',
        passed: true,
        detail: 'Full half-precision FP16 shader support detected',
        severity: 'ok'
      });
    }
  }

  // 4. Max Storage Buffer Size Check
  if (model.minStorageBufferMB > 0) {
    if (effectiveHasWebGPU && effectiveMaxStorageBufferMB < model.minStorageBufferMB) {
      checks.push({
        name: 'WebGPU Buffer Binding Limit',
        passed: false,
        detail: `Layer tensor needs ${model.minStorageBufferMB}MB buffer, but browser limit is ${effectiveMaxStorageBufferMB}MB.`,
        severity: 'error'
      });
      score -= 35;
      hardBlock = true;
    } else if (effectiveHasWebGPU) {
      checks.push({
        name: 'WebGPU Buffer Binding Limit',
        passed: true,
        detail: `Max buffer limit (${effectiveMaxStorageBufferMB}MB) accommodates model layer requirements (${model.minStorageBufferMB}MB).`,
        severity: 'ok'
      });
    }
  }

  // 5. System Memory (RAM) Check
  if (effectiveRamGB < model.minRamGB) {
    checks.push({
      name: 'System Memory (RAM)',
      passed: false,
      detail: `Insufficient RAM: Needs at least ${model.minRamGB}GB RAM, but device has ~${effectiveRamGB}GB. High risk of browser tab crash.`,
      severity: 'error'
    });
    score -= 40;
    hardBlock = true;
  } else if (effectiveRamGB < model.recommendedRamGB) {
    checks.push({
      name: 'System Memory (RAM)',
      passed: true,
      detail: `Meets minimum ${model.minRamGB}GB RAM (has ${effectiveRamGB}GB), but ${model.recommendedRamGB}GB recommended for heavy loads.`,
      severity: 'warning'
    });
    score -= 15;
  } else {
    checks.push({
      name: 'System Memory (RAM)',
      passed: true,
      detail: `Comfortable memory headroom (${effectiveRamGB}GB available vs ${model.recommendedRamGB}GB recommended).`,
      severity: 'ok'
    });
  }

  if (!isSim && hardware.reportedRamGB === null) {
    checks.push({ name: 'RAM Estimate', passed: false, severity: 'warning',
      detail: `RAM is estimated at ${effectiveRamGB}GB, not measured. Confirm the device memory or use the simulator.` });
    score -= 5;
  }

  // 6. Browser Storage Space Quota Check
  const downloadSizeGB = model.downloadSizeMB / 1024;
  if (effectiveStorageAvailGB === null) {
    checks.push({ name: 'Browser Cache Storage', passed: false, severity: 'warning',
      detail: 'Available browser storage could not be detected. Check space before downloading.' });
    score -= 5;
  } else if (effectiveStorageAvailGB < downloadSizeGB) {
    checks.push({
      name: 'Browser Cache Storage',
      passed: false,
      detail: `Model requires ${(downloadSizeGB).toFixed(2)}GB storage, but only ${effectiveStorageAvailGB}GB available.`,
      severity: 'error'
    });
    score -= 30;
    hardBlock = true;
  } else {
    checks.push({
      name: 'Browser Cache Storage',
      passed: true,
      detail: `${(downloadSizeGB).toFixed(2)}GB model fits easily within ${effectiveStorageAvailGB}GB browser storage.`,
      severity: 'ok'
    });
  }

  // 7. Calculate Estimated Download Time
  const downloadSeconds = Math.max(1, Math.round((model.downloadSizeMB * 8) / effectiveDownlinkMbps));
  let downloadTimeStr = '';
  if (model.downloadSizeMB === 0) {
    downloadTimeStr = 'Instant (Pre-cached)';
  } else if (effectiveDownlinkMbps <= 0) {
    downloadTimeStr = 'Unavailable (offline or unknown connection speed)';
  } else if (downloadSeconds < 60) {
    downloadTimeStr = `~${downloadSeconds}s on ${effectiveDownlinkMbps} Mbps`;
  } else {
    const mins = (downloadSeconds / 60).toFixed(1);
    downloadTimeStr = `~${mins} min on ${effectiveDownlinkMbps} Mbps`;
  }

  // 8. Estimate Speed & Throughput
  let estimatedSpeed = '';
  if (model.modality === 'LLM / Text') {
    if (hardBlock) {
      estimatedSpeed = 'Unrunnable';
    } else if (effectiveHasWebGPU && effectiveHasShaderF16) {
      if (model.paramValueMillion <= 360) {
        estimatedSpeed = '60 - 100+ tokens/sec';
      } else if (model.paramValueMillion <= 1500) {
        estimatedSpeed = '35 - 55 tokens/sec';
      } else if (model.paramValueMillion <= 3500) {
        estimatedSpeed = '20 - 38 tokens/sec';
      } else {
        estimatedSpeed = '10 - 22 tokens/sec';
      }
    } else if (effectiveHasWebGPU) {
      estimatedSpeed = '12 - 25 tokens/sec';
    } else {
      // WASM CPU
      if (model.paramValueMillion <= 360) {
        estimatedSpeed = '15 - 30 tokens/sec (CPU)';
      } else if (model.paramValueMillion <= 1200) {
        estimatedSpeed = '5 - 12 tokens/sec (CPU)';
      } else {
        estimatedSpeed = '< 4 tokens/sec (CPU slow)';
      }
    }
  } else if (model.modality === 'Embeddings') {
    estimatedSpeed = effectiveHasWebGPU ? '< 15ms per query' : '< 45ms per query (CPU)';
  } else if (model.modality === 'Audio / Speech') {
    estimatedSpeed = effectiveHasWebGPU ? '5x - 10x real-time speed' : '1.5x - 2.5x real-time speed';
  } else if (model.modality === 'Vision & Multimodal') {
    estimatedSpeed = effectiveHasWebGPU ? '~200 - 450ms per image' : '~1.2 - 2.5s per image (CPU)';
  } else if (model.modality === 'Image Generation') {
    estimatedSpeed = effectiveHasWebGPU ? '1.5 - 3.5s per 512x512 image' : '30s+ per image';
  } else {
    estimatedSpeed = '< 20ms per item';
  }

  // Determine tier & headline
  let tier: CompatibilityTier = 'smooth';
  let headline = 'Runs Smoothly';
  let summary = 'Hardware fully meets and exceeds all compute, shader, and memory requirements.';

  if (hardBlock || score <= 40) {
    tier = 'incompatible';
    headline = 'Cannot Run';
    summary = 'Crucial hardware requirements (WebGPU, memory, or storage limits) are missing.';
  } else if (score < 75) {
    tier = 'tight';
    headline = 'Borderline / Tight Fit';
    summary = 'Will run, but memory or buffer constraints may cause throttling or tab lag under load.';
  } else if (score < 90) {
    tier = 'moderate';
    headline = 'Moderate Performance';
    summary = 'No confirmed blocker, but memory headroom or runtime capacity needs verification.';
  }

  if (hardBlock) estimatedSpeed = 'Unrunnable';
  else estimatedSpeed = `Estimate: ${estimatedSpeed}`;

  const recommendedBackend = effectiveHasWebGPU 
    ? (effectiveHasShaderF16 ? 'WebGPU (f16)' : 'WebGPU (fp32)')
    : 'WASM (SIMD)';

  return {
    tier,
    score: Math.max(5, Math.min(100, score)),
    headline,
    summary,
    checks,
    estimatedSpeed,
    estimatedDownloadTime: downloadTimeStr,
    recommendedBackend
  };
}
