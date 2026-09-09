import { detectHardwareProfile } from '../utils/hardwareDetector.js';
import { evaluateModelCompatibility } from '../utils/compatibilityChecker.js';
import { IN_BROWSER_MODELS } from '../data/modelsData.js';
import type { HardwareProfile, HardwareSimulation } from '../types/hardware.js';
import type { InBrowserModel, CompatibilityEvaluation } from '../types/model.js';

export interface FitOptions {
  ram?: number;
  vram?: number;
  cpuCores?: number;
  gpu?: 'webgpu-f16' | 'webgpu-nof16' | 'webgl' | 'wasm-cpu';
}

export interface ModelFitResult {
  fits: boolean;
  tier: CompatibilityEvaluation['tier'];
  score: number;
  headline: string;
  summary: string;
  speed: string;
  checks: CompatibilityEvaluation['checks'];
  hardware: HardwareProfile;
  model: InBrowserModel;
}

export interface FullFitReport {
  hardware: HardwareProfile;
  models: {
    model: InBrowserModel;
    evaluation: CompatibilityEvaluation;
  }[];
}

/**
 * Check if an AI model fits the browser's hardware constraints, or probe all models.
 *
 * @example
 * ```ts
 * import fit from 'browser-llm-fit';
 *
 * const res = await fit('SmolLM2-135M');
 * if (res.fits) {
 *   console.log('Fits smoothly at', res.speed);
 * }
 * ```
 */
export default function fit(modelNameOrId: string, options?: FitOptions): Promise<ModelFitResult>;
export default function fit(modelNameOrId?: undefined, options?: FitOptions): Promise<FullFitReport>;
export default function fit(modelNameOrId: string | undefined, options?: FitOptions): Promise<ModelFitResult | FullFitReport>;
export default async function fit(
  modelNameOrId?: string,
  options?: FitOptions
): Promise<ModelFitResult | FullFitReport> {
  for (const key of ['ram', 'vram', 'cpuCores'] as const) {
    const value = options?.[key];
    if (value !== undefined && (!Number.isFinite(value) || value <= 0 || (key === 'cpuCores' && !Number.isInteger(value)))) {
      throw new TypeError(`[browser-llm-fit] ${key} must be a positive ${key === 'cpuCores' ? 'integer' : 'number'}.`);
    }
  }
  if (options?.gpu !== undefined && !['webgpu-f16', 'webgpu-nof16', 'webgl', 'wasm-cpu'].includes(options.gpu)) {
    throw new TypeError('[browser-llm-fit] Unsupported GPU backend.');
  }
  if (modelNameOrId !== undefined && !modelNameOrId.trim()) {
    throw new TypeError('[browser-llm-fit] Model name must not be empty.');
  }
  const hardware = await detectHardwareProfile();

  const defaultBackend: 'webgpu-f16' | 'webgpu-nof16' | 'wasm-cpu' = hardware.hasWebGPU
    ? (hardware.hasShaderF16 ? 'webgpu-f16' : 'webgpu-nof16')
    : 'wasm-cpu';

  const sim: HardwareSimulation = {
    isActive: options !== undefined && Object.values(options).some(value => value !== undefined),
    ramGB: options?.ram ?? hardware.reportedRamGB ?? hardware.estimatedRamGB,
    vramGB: options?.vram,
    cpuCores: options?.cpuCores ?? hardware.cpuCores,
    gpuBackend: options?.gpu ?? defaultBackend,
    maxStorageBufferMB: hardware.webgpuLimits
      ? Math.floor(hardware.webgpuLimits.maxStorageBufferBindingSize / (1024 * 1024))
      : 128,
    storageAvailableGB: hardware.storageAvailableGB ?? 25,
    hasWasmSimd: hardware.hasWasmSimd,
    downlinkMbps: hardware.downlinkMbps ?? 50,
  };

  // If no model is specified, return full hardware report + all models evaluated
  if (!modelNameOrId) {
    const evaluated = IN_BROWSER_MODELS.map((m) => ({
      model: m,
      evaluation: evaluateModelCompatibility(m, hardware, sim),
    })).sort((a, b) => b.evaluation.score - a.evaluation.score);

    return {
      hardware,
      models: evaluated,
    };
  }

  // Find model by ID, name, or repo substring (case-insensitive)
  const q = modelNameOrId.trim().toLowerCase();
  const found = IN_BROWSER_MODELS.find(
    (m) =>
      m.id.toLowerCase() === q ||
      m.name.toLowerCase().includes(q) ||
      (m.hfUrl && m.hfUrl.toLowerCase().includes(q))
  );

  if (!found) {
    throw new Error(
      `[browser-llm-fit] Unknown model "${modelNameOrId}". Call fit() without arguments to inspect supported models.`
    );
  }

  const evaluation = evaluateModelCompatibility(found, hardware, sim);

  return {
    fits: evaluation.tier !== 'incompatible',
    tier: evaluation.tier,
    score: evaluation.score,
    headline: evaluation.headline,
    summary: evaluation.summary,
    speed: evaluation.estimatedSpeed,
    checks: evaluation.checks,
    hardware,
    model: found,
  };
}

export {
  detectHardwareProfile,
  detectHardwareProfile as detectHardware,
  evaluateModelCompatibility,
  IN_BROWSER_MODELS,
};

export type { HardwareProfile, HardwareSimulation, InBrowserModel, CompatibilityEvaluation };
