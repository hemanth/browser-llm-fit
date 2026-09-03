import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsFilePath = path.resolve(__dirname, '../src/data/modelsData.ts');

const newModels = [
  // --- Additional LLMs ---
  {
    id: 'deepseek-r1-distill-qwen-7b',
    name: 'DeepSeek R1 Distill Qwen 7B',
    developer: 'DeepSeek',
    family: 'DeepSeek-R1',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '7.6B',
    paramValueMillion: 7610,
    downloadSizeMB: 4600,
    minRamGB: 16,
    recommendedRamGB: 32,
    minVramGB: 5.5,
    recommendedVramGB: 8,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 2048,
    contextWindow: 32768,
    description: 'High-capability distilled reasoning model trained on DeepSeek R1 reasoning traces. Runs chain-of-thought in-browser on high-end GPUs.',
    useCases: ['Deep step-by-step reasoning', 'Math and algorithmic puzzle solving', 'Complex code synthesis'],
    hfUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
    demoAvailable: false,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from '@mlc-ai/web-llm';

const engine = await webllm.CreateMLCEngine(
  'DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC'
);
const reply = await engine.chat.completions.create({
  messages: [{ role: 'user', content: 'Solve 2x + 5 = 17 step by step.' }]
});
console.log(reply.choices[0].message.content);`
    }
  },
  {
    id: 'deepseek-r1-distill-llama-8b',
    name: 'DeepSeek R1 Distill Llama 8B',
    developer: 'DeepSeek',
    family: 'DeepSeek-R1',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '8.0B',
    paramValueMillion: 8030,
    downloadSizeMB: 4920,
    minRamGB: 16,
    recommendedRamGB: 32,
    minVramGB: 6.0,
    recommendedVramGB: 8,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 2048,
    contextWindow: 32768,
    description: 'Llama 3.1 8B fine-tuned on DeepSeek R1 reasoning trajectories for rigorous analytical problem solving directly inside WebGPU.',
    useCases: ['Rigorous reasoning', 'Logic & puzzle breakdown', 'Long-form analytical reasoning'],
    hfUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-8B',
    demoAvailable: false,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from '@mlc-ai/web-llm';

const engine = await webllm.CreateMLCEngine(
  'DeepSeek-R1-Distill-Llama-8B-q4f16_1-MLC'
);
const reply = await engine.chat.completions.create({
  messages: [{ role: 'user', content: 'Explain Godel incompleteness theorems.' }]
});`
    }
  },
  {
    id: 'qwen2.5-0.5b-instruct',
    name: 'Qwen 2.5 0.5B Instruct',
    developer: 'Alibaba Cloud',
    family: 'Qwen',
    modality: 'LLM / Text',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q4f16',
    paramCount: '490M',
    paramValueMillion: 490,
    downloadSizeMB: 330,
    minRamGB: 2,
    recommendedRamGB: 4,
    minVramGB: 0.8,
    recommendedVramGB: 1.5,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 256,
    contextWindow: 8192,
    description: 'Extremely lightweight multilingual model from the Qwen 2.5 family. Great balance of quality and sub-350MB bundle size for instant page load.',
    useCases: ['Multilingual chat', 'Fast inline auto-completion', 'Client-side summarization'],
    hfUrl: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct',
    demoAvailable: true,
    testModelId: 'onnx-community/Qwen2.5-0.5B-Instruct',
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const generator = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {
  device: 'webgpu',
  dtype: 'q4f16'
});
const result = await generator('Summarize WebGPU benefits:');`
    }
  },
  {
    id: 'qwen2.5-7b-instruct',
    name: 'Qwen 2.5 7B Instruct',
    developer: 'Alibaba Cloud',
    family: 'Qwen',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '7.6B',
    paramValueMillion: 7610,
    downloadSizeMB: 4400,
    minRamGB: 16,
    recommendedRamGB: 32,
    minVramGB: 5.5,
    recommendedVramGB: 8,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 2048,
    contextWindow: 32768,
    description: 'Flagship open-weights model excelling at mathematics, structured coding, and 29+ natural languages in WebGPU.',
    useCases: ['Complex coding assistance', 'High-accuracy multilingual translation', 'In-depth research'],
    hfUrl: 'https://huggingface.co/Qwen/Qwen2.5-7B-Instruct',
    demoAvailable: false,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from '@mlc-ai/web-llm';

const engine = await webllm.CreateMLCEngine('Qwen2.5-7B-Instruct-q4f16_1-MLC');
const reply = await engine.chat.completions.create({
  messages: [{ role: 'user', content: 'Generate a TypeScript state machine.' }]
});`
    }
  },
  {
    id: 'gemma-2-2b-it',
    name: 'Gemma 2 2B Instruct',
    developer: 'Google',
    family: 'Gemma',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '2.6B',
    paramValueMillion: 2610,
    downloadSizeMB: 1650,
    minRamGB: 6,
    recommendedRamGB: 8,
    minVramGB: 2.2,
    recommendedVramGB: 4,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 1024,
    contextWindow: 8192,
    description: "Google's ultra-efficient Gemma 2 architecture with interleaved local and global attention. Outstanding benchmark scores per parameter.",
    useCases: ['High-accuracy edge text processing', 'In-browser assistant', 'JSON schema extraction'],
    hfUrl: 'https://huggingface.co/google/gemma-2-2b-it',
    demoAvailable: false,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from '@mlc-ai/web-llm';

const engine = await webllm.CreateMLCEngine('gemma-2-2b-it-q4f16_1-MLC');
const reply = await engine.chat.completions.create({
  messages: [{ role: 'user', content: 'Explain diffusion models in simple terms.' }]
});`
    }
  },
  {
    id: 'gemma-2-9b-it',
    name: 'Gemma 2 9B Instruct',
    developer: 'Google',
    family: 'Gemma',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '9.2B',
    paramValueMillion: 9240,
    downloadSizeMB: 5600,
    minRamGB: 16,
    recommendedRamGB: 32,
    minVramGB: 7.0,
    recommendedVramGB: 12,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 2048,
    contextWindow: 8192,
    description: "Google's 9B parameter model trained on 8T tokens. Competes with models twice its size for complex reasoning and knowledge benchmarks.",
    useCases: ['In-depth writing and critique', 'Technical document analysis', 'Advanced agentic planning'],
    hfUrl: 'https://huggingface.co/google/gemma-2-9b-it',
    demoAvailable: false,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from '@mlc-ai/web-llm';

const engine = await webllm.CreateMLCEngine('gemma-2-9b-it-q4f16_1-MLC');`
    }
  },
  {
    id: 'phi-3.5-mini-instruct',
    name: 'Phi-3.5 Mini Instruct',
    developer: 'Microsoft',
    family: 'Phi',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '3.8B',
    paramValueMillion: 3820,
    downloadSizeMB: 2200,
    minRamGB: 8,
    recommendedRamGB: 16,
    minVramGB: 2.8,
    recommendedVramGB: 5,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 1024,
    contextWindow: 128000,
    description: 'Trained on high-quality synthetic textbook data with a 128k context window. Exceptional reasoning and math performance in browser WebGPU.',
    useCases: ['Long-context document summarization', 'Code review', 'Multi-turn reasoning'],
    hfUrl: 'https://huggingface.co/microsoft/Phi-3.5-mini-instruct',
    demoAvailable: false,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from '@mlc-ai/web-llm';

const engine = await webllm.CreateMLCEngine('Phi-3.5-mini-instruct-q4f16_1-MLC');`
    }
  },
  {
    id: 'danube3-4b-chat',
    name: 'H2O Danube 3 4B Chat',
    developer: 'H2O.ai',
    family: 'Danube',
    modality: 'LLM / Text',
    framework: 'Wllama',
    format: 'GGUF',
    quantization: 'Q4_K_M',
    paramCount: '4.0B',
    paramValueMillion: 4000,
    downloadSizeMB: 2350,
    minRamGB: 6,
    recommendedRamGB: 12,
    minVramGB: 0,
    recommendedVramGB: 0,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 0,
    contextWindow: 8192,
    description: 'Compact conversational model run via llama.cpp WebAssembly with multi-threading. Does not require a discrete GPU.',
    useCases: ['CPU-only devices', 'Chromebook offline assistant', 'Enterprise private chat'],
    hfUrl: 'https://huggingface.co/h2oai/h2o-danube3-4b-chat',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Wllama',
      lang: 'javascript',
      code: `import { Wllama } from '@wllama/wllama';

const wllama = new Wllama({ 'single-thread': false });
await wllama.loadModelFromUrl('https://huggingface.co/.../danube3-4b.gguf');
const output = await wllama.createCompletion('User: Hello! Assistant:');`
    }
  },

  // --- Additional Audio & Speech ---
  {
    id: 'whisper-small',
    name: 'Whisper Small',
    developer: 'OpenAI',
    family: 'Whisper',
    modality: 'Audio / Speech',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8 / fp16',
    paramCount: '244M',
    paramValueMillion: 244,
    downloadSizeMB: 480,
    minRamGB: 3,
    recommendedRamGB: 6,
    minVramGB: 1.2,
    recommendedVramGB: 2.5,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 256,
    description: 'Higher accuracy speech transcription and translation model. Ideal for podcast transcripts, meetings, and video subtitle generation.',
    useCases: ['Multilingual video transcription', 'Voice note transcription', 'Meeting minutes generator'],
    hfUrl: 'https://huggingface.co/openai/whisper-small',
    demoAvailable: true,
    testModelId: 'onnx-community/whisper-small',
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-small', {
  device: 'webgpu'
});
const result = await transcriber(audioFloat32Array);`
    }
  },
  {
    id: 'whisper-medium',
    name: 'Whisper Medium',
    developer: 'OpenAI',
    family: 'Whisper',
    modality: 'Audio / Speech',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q4f16',
    paramCount: '769M',
    paramValueMillion: 769,
    downloadSizeMB: 890,
    minRamGB: 6,
    recommendedRamGB: 10,
    minVramGB: 2.5,
    recommendedVramGB: 4.5,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 1024,
    description: 'Near human-level accuracy for complex audio with heavy accents or background noise. Powered by WebGPU fp16 acceleration.',
    useCases: ['High-fidelity medical/legal transcription', 'Accent-heavy audio translation', 'Professional subtitling'],
    hfUrl: 'https://huggingface.co/openai/whisper-medium',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-medium', {
  device: 'webgpu',
  dtype: 'q4f16'
});`
    }
  },
  {
    id: 'musicgen-small',
    name: 'MusicGen Small',
    developer: 'Meta',
    family: 'MusicGen',
    modality: 'Audio / Speech',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8 / fp32',
    paramCount: '300M',
    paramValueMillion: 300,
    downloadSizeMB: 620,
    minRamGB: 4,
    recommendedRamGB: 8,
    minVramGB: 1.5,
    recommendedVramGB: 3,
    requiresWebGPU: true,
    requiresShaderF16: false,
    minStorageBufferMB: 512,
    description: 'Generates original audio and music from natural language text prompts directly inside the browser using WebGPU and Web Audio API.',
    useCases: ['Background music generator', 'Game audio soundscaping', 'Podcast intro creation'],
    hfUrl: 'https://huggingface.co/facebook/musicgen-small',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const synthesizer = await pipeline('text-to-audio', 'Xenova/musicgen-small', {
  device: 'webgpu'
});
const audio = await synthesizer('An 80s synthwave dance track with punchy drums');`
    }
  },
  {
    id: 'silero-vad',
    name: 'Silero VAD (Voice Activity Detector)',
    developer: 'Silero',
    family: 'Silero',
    modality: 'Audio / Speech',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'fp32',
    paramCount: '1.5M',
    paramValueMillion: 1.5,
    downloadSizeMB: 2,
    minRamGB: 0.5,
    recommendedRamGB: 1,
    minVramGB: 0,
    recommendedVramGB: 0,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 32,
    description: 'Sub-2MB voice activity detector that processes 30ms audio chunks in less than 1ms. Ideal for live microphone silence trimming before LLM prompts.',
    useCases: ['Voice assistant trigger', 'Push-to-talk automation', 'Speech boundary detection'],
    hfUrl: 'https://huggingface.co/onnx-community/silero-vad',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { AutoModel, AutoProcessor } from '@huggingface/transformers';

const model = await AutoModel.from_pretrained('onnx-community/silero-vad');
// Run inference on 512-sample PCM chunks in <1ms`
    }
  },

  // --- Additional Vision & Multimodal ---
  {
    id: 'llava-onevision-0.5b',
    name: 'LLaVA OneVision Qwen2 0.5B',
    developer: 'LLaVA Team',
    family: 'LLaVA',
    modality: 'Vision & Multimodal',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q4f16',
    paramCount: '800M',
    paramValueMillion: 800,
    downloadSizeMB: 650,
    minRamGB: 4,
    recommendedRamGB: 8,
    minVramGB: 1.8,
    recommendedVramGB: 3.5,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 512,
    description: 'Compact multimodal visual assistant able to inspect images, charts, and diagrams directly in the browser tab with zero server roundtrips.',
    useCases: ['Visual chart extraction', 'Webcam object recognition', 'Receipt reading'],
    hfUrl: 'https://huggingface.co/llava-hf/llava-onevision-qwen2-0.5b-ov-hf',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const vlm = await pipeline('image-text-to-text', 'onnx-community/llava-onevision-qwen2-0.5b-ov-hf', {
  device: 'webgpu',
  dtype: 'q4f16'
});
const answer = await vlm({ image: 'https://...', prompt: 'What is shown in this chart?' });`
    }
  },
  {
    id: 'depth-anything-v2-small',
    name: 'Depth Anything V2 Small',
    developer: 'TikTok / ByteDance',
    family: 'DepthAnything',
    modality: 'Vision & Multimodal',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'fp16',
    paramCount: '24.8M',
    paramValueMillion: 24.8,
    downloadSizeMB: 52,
    minRamGB: 1.5,
    recommendedRamGB: 3,
    minVramGB: 0.5,
    recommendedVramGB: 1.0,
    requiresWebGPU: true,
    requiresShaderF16: false,
    minStorageBufferMB: 128,
    description: 'Monocular depth estimation that transforms standard 2D photos into high-fidelity 3D depth maps in real-time at 30+ FPS.',
    useCases: ['3D photo effects & parallax', 'WebAR spatial depth', 'Robotics obstacle mapping'],
    hfUrl: 'https://huggingface.co/onnx-community/depth-anything-v2-small',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const depth = await pipeline('depth-estimation', 'onnx-community/depth-anything-v2-small', {
  device: 'webgpu'
});
const output = await depth('https://example.com/room.jpg');`
    }
  },
  {
    id: 'rmbg-2.0',
    name: 'Bria RMBG 2.0 (Background Remover)',
    developer: 'Bria AI',
    family: 'RMBG',
    modality: 'Vision & Multimodal',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'fp16',
    paramCount: '44M',
    paramValueMillion: 44,
    downloadSizeMB: 90,
    minRamGB: 2,
    recommendedRamGB: 4,
    minVramGB: 0.6,
    recommendedVramGB: 1.5,
    requiresWebGPU: true,
    requiresShaderF16: false,
    minStorageBufferMB: 256,
    description: 'State-of-the-art background removal model in 90MB. Strips backgrounds from portraits and ecommerce products entirely inside the browser.',
    useCases: ['E-commerce product cutout', 'Profile picture background removal', 'Design tools'],
    hfUrl: 'https://huggingface.co/briaai/RMBG-2.0',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const segmenter = await pipeline('image-segmentation', 'briaai/RMBG-2.0', {
  device: 'webgpu'
});
const cutout = await segmenter('https://example.com/product.jpg');`
    }
  },
  {
    id: 'mobile-sam',
    name: 'MobileSAM (Segment Anything)',
    developer: 'Chaoning Zhang et al.',
    family: 'SAM',
    modality: 'Vision & Multimodal',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8 / fp32',
    paramCount: '9.8M',
    paramValueMillion: 9.8,
    downloadSizeMB: 40,
    minRamGB: 1.5,
    recommendedRamGB: 3,
    minVramGB: 0.4,
    recommendedVramGB: 1.0,
    requiresWebGPU: true,
    requiresShaderF16: false,
    minStorageBufferMB: 128,
    description: 'Lightweight adaptation of Meta Segment Anything Model. Computes image embeddings and allows click-to-segment masks in milliseconds.',
    useCases: ['Interactive image masking', 'Smart canvas selection', 'Video rotoscoping'],
    hfUrl: 'https://huggingface.co/Xenova/mobile-sam',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { SamModel, AutoProcessor } from '@huggingface/transformers';

const model = await SamModel.from_pretrained('Xenova/mobile-sam', { device: 'webgpu' });`
    }
  },

  // --- Additional Embeddings ---
  {
    id: 'nomic-embed-text-v1.5',
    name: 'Nomic Embed Text v1.5',
    developer: 'Nomic AI',
    family: 'Nomic',
    modality: 'Embeddings',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8 / fp32',
    paramCount: '137M',
    paramValueMillion: 137,
    downloadSizeMB: 280,
    minRamGB: 2,
    recommendedRamGB: 4,
    minVramGB: 0.5,
    recommendedVramGB: 1.0,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 128,
    description: '8192-token context embedding model with Matryoshka dimension truncation (can output 64 to 768 dimensions without retraining).',
    useCases: ['Long-form document retrieval', 'Local browser vector database', 'RAG search'],
    hfUrl: 'https://huggingface.co/nomic-ai/nomic-embed-text-v1.5',
    demoAvailable: true,
    testModelId: 'nomic-ai/nomic-embed-text-v1.5',
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const extractor = await pipeline('feature-extraction', 'nomic-ai/nomic-embed-text-v1.5');
const output = await extractor('search_document: WebGPU on-device embeddings', {
  pooling: 'mean',
  normalize: true
});`
    }
  },
  {
    id: 'modernbert-base',
    name: 'ModernBERT Base',
    developer: 'Answer.AI & LightOn',
    family: 'ModernBERT',
    modality: 'Embeddings',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8 / fp16',
    paramCount: '149M',
    paramValueMillion: 149,
    downloadSizeMB: 310,
    minRamGB: 2.5,
    recommendedRamGB: 5,
    minVramGB: 0.8,
    recommendedVramGB: 1.5,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 256,
    description: 'Modernized encoder architecture with rotary embeddings (RoPE), unpadding, and native 8192 context length. SOTA encoder for search.',
    useCases: ['Semantic search', 'Document classification', 'Vector embeddings'],
    hfUrl: 'https://huggingface.co/onnx-community/ModernBERT-base',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const pipe = await pipeline('feature-extraction', 'onnx-community/ModernBERT-base');`
    }
  },
  {
    id: 'mxbai-embed-large-v1',
    name: 'mxbai-embed-large-v1',
    developer: 'Mixedbread AI',
    family: 'mxbai',
    modality: 'Embeddings',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8 / fp32',
    paramCount: '335M',
    paramValueMillion: 335,
    downloadSizeMB: 670,
    minRamGB: 3.5,
    recommendedRamGB: 6,
    minVramGB: 1.0,
    recommendedVramGB: 2.0,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 512,
    description: 'Top-ranking 1024-dimension embedding model on the MTEB leaderboard. Provides retrieval quality on par with proprietary hosted embedding APIs.',
    useCases: ['High-precision enterprise search', 'RAG pipelines in-browser', 'Legal & medical discovery'],
    hfUrl: 'https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const embedder = await pipeline('feature-extraction', 'mixedbread-ai/mxbai-embed-large-v1');`
    }
  },
  {
    id: 'snowflake-arctic-embed-m',
    name: 'Snowflake Arctic Embed M',
    developer: 'Snowflake',
    family: 'Arctic',
    modality: 'Embeddings',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8 / fp32',
    paramCount: '110M',
    paramValueMillion: 110,
    downloadSizeMB: 220,
    minRamGB: 1.5,
    recommendedRamGB: 3,
    minVramGB: 0.4,
    recommendedVramGB: 0.8,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 128,
    description: 'High-efficiency embedding model built by Snowflake specifically for fast corporate document retrieval and hybrid search.',
    useCases: ['Enterprise knowledge search', 'Local code search', 'E-commerce recommendations'],
    hfUrl: 'https://huggingface.co/Snowflake/snowflake-arctic-embed-m',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const extractor = await pipeline('feature-extraction', 'Snowflake/snowflake-arctic-embed-m');`
    }
  },

  // --- Additional Image Generation ---
  {
    id: 'sd-turbo',
    name: 'SD-Turbo (Single-Step Diffusion)',
    developer: 'Stability AI',
    family: 'Stable Diffusion',
    modality: 'Image Generation',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'fp16',
    paramCount: '1.0B',
    paramValueMillion: 1000,
    downloadSizeMB: 2100,
    minRamGB: 8,
    recommendedRamGB: 16,
    minVramGB: 4.5,
    recommendedVramGB: 8.0,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 1024,
    description: 'Adversarial diffusion distillation model generating 512x512 images in a single step with zero server latency on high-end WebGPU.',
    useCases: ['Real-time canvas drawing prompt', 'Avatar generation', 'Instant AI sketches'],
    hfUrl: 'https://huggingface.co/stabilityai/sd-turbo',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `// Experimental WebGPU single-step diffusion pipeline
import { AutoModelForImageGeneration } from '@huggingface/transformers';`
    }
  }
];

// Read existing modelsData.ts
let content = fs.readFileSync(modelsFilePath, 'utf8');

// Check which models are not already in content
const toAdd = newModels.filter(m => !content.includes(`id: '${m.id}'`));

if (toAdd.length === 0) {
  console.log('All models already present.');
  process.exit(0);
}

console.log(`Adding ${toAdd.length} new models to modelsData.ts...`);

// Format toAdd as TS code
const codeToAdd = toAdd.map(m => {
  return `  ${JSON.stringify(m, null, 2).replace(/"([^"]+)":/g, '$1:')},`;
}).join('\n');

// Find insertion point before final closing `];`
const lastClosingBracket = content.lastIndexOf('];');
if (lastClosingBracket === -1) {
  throw new Error('Could not find closing bracket in modelsData.ts');
}

const updatedContent = content.slice(0, lastClosingBracket) + '\n  // ==================== AUTOMATED & REGISTRY EXPANSIONS ====================\n' + codeToAdd + '\n' + content.slice(lastClosingBracket);

fs.writeFileSync(modelsFilePath, updatedContent, 'utf8');
console.log(`✓ Successfully appended ${toAdd.length} models to modelsData.ts`);
