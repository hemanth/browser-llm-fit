export type ModelModality = 'LLM / Text' | 'Embeddings' | 'Audio / Speech' | 'Vision & Multimodal' | 'Image Generation' | 'NLP & Classification';
export type ModelFramework = 'Transformers.js' | 'WebLLM' | 'Wllama' | 'MediaPipe' | 'TensorFlow.js' | 'Chrome Built-in AI';
export type CompatibilityTier = 'smooth' | 'moderate' | 'tight' | 'incompatible';
export interface CompatibilityCheck {
    passed: boolean;
    name: string;
    detail: string;
    severity: 'ok' | 'warning' | 'error';
}
export interface CompatibilityEvaluation {
    tier: CompatibilityTier;
    score: number;
    headline: string;
    summary: string;
    checks: CompatibilityCheck[];
    estimatedSpeed: string;
    estimatedDownloadTime: string;
    recommendedBackend: 'WebGPU (f16)' | 'WebGPU (fp32)' | 'WASM (SIMD)' | 'WebGL' | 'Native Chrome';
}
export interface InBrowserModel {
    id: string;
    name: string;
    developer: string;
    family: string;
    modality: ModelModality;
    framework: ModelFramework;
    format: 'ONNX' | 'WebGPU WGSL / MLC' | 'GGUF' | 'TFJS' | 'Native Chrome';
    quantization: string;
    paramCount: string;
    paramValueMillion: number;
    downloadSizeMB: number;
    minRamGB: number;
    recommendedRamGB: number;
    minVramGB: number;
    recommendedVramGB: number;
    requiresWebGPU: boolean;
    requiresShaderF16: boolean;
    minStorageBufferMB: number;
    contextWindow?: number;
    description: string;
    useCases: string[];
    hfUrl?: string;
    demoAvailable?: boolean;
    testModelId?: string;
    codeSnippet: {
        framework: string;
        lang: string;
        code: string;
    };
}
