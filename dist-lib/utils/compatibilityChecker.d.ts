import type { HardwareProfile, HardwareSimulation } from '../types/hardware';
import type { CompatibilityEvaluation, InBrowserModel } from '../types/model';
export declare function evaluateModelCompatibility(model: InBrowserModel, hardware: HardwareProfile, simulation?: HardwareSimulation): CompatibilityEvaluation;
