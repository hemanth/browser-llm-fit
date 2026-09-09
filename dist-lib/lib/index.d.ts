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
export { detectHardwareProfile, detectHardwareProfile as detectHardware, evaluateModelCompatibility, IN_BROWSER_MODELS, };
export type { HardwareProfile, HardwareSimulation, InBrowserModel, CompatibilityEvaluation };
