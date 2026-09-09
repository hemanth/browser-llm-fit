import type { HardwareProfile, HardwareSimulation } from '../types/hardware.js';
import type { CompatibilityEvaluation, InBrowserModel } from '../types/model.js';
export declare function evaluateModelCompatibility(model: InBrowserModel, hardware: HardwareProfile, simulation?: HardwareSimulation): CompatibilityEvaluation;
