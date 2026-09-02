export type ModelModality = 
  | 'LLM / Text' 
  | 'Embeddings' 
  | 'Audio / Speech' 
  | 'Vision & Multimodal' 
  | 'Image Generation' 
  | 'NLP & Classification';

export type ModelFramework = 
  | 'Transformers.js' 
  | 'WebLLM' 
  | 'Wllama' 
  | 'MediaPipe' 
  | 'TensorFlow.js' 
  | 'Chrome Built-in AI';

export type CompatibilityTier = 
  | 'smooth'      // Runs smoothly with full GPU acceleration
  | 'moderate'    // Runs okay, but high memory or moderate latency
  | 'tight'       // Near hardware limit, may stutter or slow down
  | 'incompatible'; // Cannot run (missing WebGPU, OOM risk, buffer size exceeded)

export interface CompatibilityCheck {
  passed: boolean;
  name: string;
  detail: string;
  severity: 'ok' | 'warning' | 'error';
}

export interface CompatibilityEvaluation {
  tier: CompatibilityTier;
  score: number; // 0 to 100
  headline: string;
  summary: string;
  checks: CompatibilityCheck[];
  estimatedSpeed: string; // e.g., "35-50 tokens/sec" or "< 50ms latency"
  estimatedDownloadTime: string; // e.g. "4.2s on your 100 Mbps connection"
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
  quantization: string; // e.g., "q4f16_1", "q4", "q8", "fp16", "fp32", "int8"
  paramCount: string; // e.g., "135M", "1.1B", "3B", "7B"
  paramValueMillion: number; // for numeric sorting
  downloadSizeMB: number;
  minRamGB: number;
  recommendedRamGB: number;
  minVramGB: number;
  recommendedVramGB: number;
  requiresWebGPU: boolean;
  requiresShaderF16: boolean;
  minStorageBufferMB: number; // minimum maxStorageBufferBindingSize needed (MB)
  contextWindow?: number; // for LLMs
  description: string;
  useCases: string[];
  hfUrl?: string;
  demoAvailable?: boolean;
  testModelId?: string; // id for live in-browser testing
  codeSnippet: {
    framework: string;
    lang: string;
    code: string;
  };
}
