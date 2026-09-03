import type { InBrowserModel } from '../types/model';

export const IN_BROWSER_MODELS: InBrowserModel[] = [
  // ==================== LLMs / TEXT GENERATION ====================
  {
    id: 'smollm2-135m-instruct',
    name: 'SmolLM2 135M Instruct',
    developer: 'Hugging Face',
    family: 'SmolLM',
    modality: 'LLM / Text',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q4f16',
    paramCount: '135M',
    paramValueMillion: 135,
    downloadSizeMB: 92,
    minRamGB: 1.5,
    recommendedRamGB: 3,
    minVramGB: 0.5,
    recommendedVramGB: 1,
    requiresWebGPU: false, // can run on WASM fallback!
    requiresShaderF16: false,
    minStorageBufferMB: 128,
    contextWindow: 2048,
    description: 'Ultra-compact language model designed specifically for edge and in-browser devices. Runs smoothly even on low-tier smartphones and WASM CPU.',
    useCases: ['Instruction following', 'On-device text completion', 'Proofreading', 'IoT / Low-spec web apps'],
    hfUrl: 'https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct',
    demoAvailable: true,
    testModelId: 'onnx-community/SmolLM2-135M-Instruct',
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

// Initialize pipeline with WebGPU (falls back to WASM)
const generator = await pipeline(
  'text-generation',
  'onnx-community/SmolLM2-135M-Instruct',
  { device: 'webgpu', dtype: 'q4f16' }
);

const output = await generator('Explain quantum computing simply:', {
  max_new_tokens: 64,
  temperature: 0.7,
});
console.log(output[0].generated_text);`
    }
  },
  {
    id: 'smollm2-360m-instruct',
    name: 'SmolLM2 360M Instruct',
    developer: 'Hugging Face',
    family: 'SmolLM',
    modality: 'LLM / Text',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q4f16',
    paramCount: '360M',
    paramValueMillion: 360,
    downloadSizeMB: 240,
    minRamGB: 2,
    recommendedRamGB: 4,
    minVramGB: 0.8,
    recommendedVramGB: 1.5,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 256,
    contextWindow: 4096,
    description: 'Balanced small language model offering strong reasoning and coherence while keeping memory consumption well under 1GB.',
    useCases: ['Chatbots', 'Summarization', 'Structured extraction', 'Form autofill'],
    hfUrl: 'https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const generator = await pipeline(
  'text-generation',
  'onnx-community/SmolLM2-360M-Instruct',
  { device: 'webgpu', dtype: 'q4f16' }
);

const res = await generator('Summarize this meeting note: ...', { max_new_tokens: 128 });
console.log(res);`
    }
  },
  {
    id: 'smollm2-1.7b-instruct',
    name: 'SmolLM2 1.7B Instruct',
    developer: 'Hugging Face',
    family: 'SmolLM',
    modality: 'LLM / Text',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q4f16',
    paramCount: '1.7B',
    paramValueMillion: 1700,
    downloadSizeMB: 980,
    minRamGB: 4,
    recommendedRamGB: 8,
    minVramGB: 1.8,
    recommendedVramGB: 3,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 512,
    contextWindow: 8192,
    description: 'Premier edge model trained on 11 trillion tokens. Delivers impressive reasoning, coding, and roleplay directly in browser tabs via WebGPU.',
    useCases: ['Code assistance', 'Creative writing', 'Complex Q&A', 'Local agent workflows'],
    hfUrl: 'https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const pipe = await pipeline(
  'text-generation',
  'onnx-community/SmolLM2-1.7B-Instruct',
  { device: 'webgpu', dtype: 'q4f16' }
);

const response = await pipe([
  { role: 'system', content: 'You are a helpful coding assistant.' },
  { role: 'user', content: 'Write a TypeScript debounce function.' }
], { max_new_tokens: 256 });
console.log(response[0].generated_text);`
    }
  },
  {
    id: 'llama-3.2-1b-instruct',
    name: 'Llama 3.2 1B Instruct',
    developer: 'Meta',
    family: 'Llama 3',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '1.2B',
    paramValueMillion: 1200,
    downloadSizeMB: 760,
    minRamGB: 4,
    recommendedRamGB: 8,
    minVramGB: 1.5,
    recommendedVramGB: 2.5,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 512,
    contextWindow: 8192,
    description: "Meta's official lightweight Llama 3.2 model. Highly optimized for on-device multilingual chat, knowledge retrieval, and tool usage.",
    useCases: ['Multilingual chat', 'Agentic tool use', 'Summarization', 'Personal assistants'],
    hfUrl: 'https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct',
    demoAvailable: true,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("Llama-3.2-1B-Instruct-q4f16_1-MLC", {
  initProgressCallback: (report) => console.log(report.text)
});

const reply = await engine.chat.completions.create({
  messages: [{ role: "user", content: "What is WebGPU in 2 sentences?" }]
});
console.log(reply.choices[0].message.content);`
    }
  },
  {
    id: 'llama-3.2-3b-instruct',
    name: 'Llama 3.2 3B Instruct',
    developer: 'Meta',
    family: 'Llama 3',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '3.2B',
    paramValueMillion: 3200,
    downloadSizeMB: 1950,
    minRamGB: 8,
    recommendedRamGB: 16,
    minVramGB: 3.2,
    recommendedVramGB: 5,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 1024,
    contextWindow: 8192,
    description: 'High-capability 3B model from Meta. Outstanding performance on benchmarks, competing with larger previous generation models in-browser.',
    useCases: ['Advanced reasoning', 'Code generation', 'Deep text synthesis', 'Interactive storytelling'],
    hfUrl: 'https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct',
    demoAvailable: true,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("Llama-3.2-3B-Instruct-q4f16_1-MLC");
const reply = await engine.chat.completions.create({
  messages: [{ role: "user", content: "Write a high performance quicksort algorithm." }]
});
console.log(reply.choices[0].message.content);`
    }
  },
  {
    id: 'qwen-2.5-0.5b-instruct',
    name: 'Qwen 2.5 0.5B Instruct',
    developer: 'Alibaba Cloud',
    family: 'Qwen 2.5',
    modality: 'LLM / Text',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q4f16',
    paramCount: '0.5B',
    paramValueMillion: 490,
    downloadSizeMB: 360,
    minRamGB: 2,
    recommendedRamGB: 4,
    minVramGB: 0.9,
    recommendedVramGB: 1.8,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 256,
    contextWindow: 4096,
    description: 'Exceptional sub-billion model supporting 29+ languages and strong math/coding capabilities. High token-generation speeds in-browser.',
    useCases: ['Multilingual translation', 'Fast auto-complete', 'Grammar correction', 'Embedded browser extensions'],
    hfUrl: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const pipe = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {
  device: 'webgpu',
  dtype: 'q4f16'
});

const out = await pipe('Translate to French and Japanese: "Artificial intelligence is advancing quickly."');
console.log(out[0].generated_text);`
    }
  },
  {
    id: 'qwen-2.5-1.5b-instruct',
    name: 'Qwen 2.5 1.5B Instruct',
    developer: 'Alibaba Cloud',
    family: 'Qwen 2.5',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '1.5B',
    paramValueMillion: 1540,
    downloadSizeMB: 1050,
    minRamGB: 4,
    recommendedRamGB: 8,
    minVramGB: 1.9,
    recommendedVramGB: 3,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 512,
    contextWindow: 8192,
    description: 'Top-tier 1.5B model beating many 3B models across coding and STEM tasks. Highly responsive on modern laptops and tablets.',
    useCases: ['Coding help', 'Technical documentation', 'Mathematical reasoning', 'Data extraction'],
    hfUrl: 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct',
    demoAvailable: true,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("Qwen2.5-1.5B-Instruct-q4f16_1-MLC");
const res = await engine.chat.completions.create({
  messages: [{ role: "user", content: "Solve: If a train travels at 90 km/h for 2.5 hours..." }]
});
console.log(res.choices[0].message.content);`
    }
  },
  {
    id: 'qwen-2.5-3b-instruct',
    name: 'Qwen 2.5 3B Instruct',
    developer: 'Alibaba Cloud',
    family: 'Qwen 2.5',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '3.1B',
    paramValueMillion: 3100,
    downloadSizeMB: 2150,
    minRamGB: 8,
    recommendedRamGB: 16,
    minVramGB: 3.5,
    recommendedVramGB: 5.5,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 1024,
    contextWindow: 8192,
    description: 'Benchmark leader in the 3B weight class. Strong instruction following and tool usage capabilities for local web apps.',
    useCases: ['Full conversational assistant', 'Long-form writing', 'Complex logic puzzles'],
    hfUrl: 'https://huggingface.co/Qwen/Qwen2.5-3B-Instruct',
    demoAvailable: true,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("Qwen2.5-3B-Instruct-q4f16_1-MLC");
const out = await engine.chat.completions.create({
  messages: [{ role: "user", content: "Write a complete SQL schema for an e-commerce platform." }]
});
console.log(out.choices[0].message.content);`
    }
  },
  {
    id: 'qwen-2.5-7b-instruct',
    name: 'Qwen 2.5 7B Instruct',
    developer: 'Alibaba Cloud',
    family: 'Qwen 2.5',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '7.6B',
    paramValueMillion: 7600,
    downloadSizeMB: 4800,
    minRamGB: 16,
    recommendedRamGB: 24,
    minVramGB: 6.5,
    recommendedVramGB: 10,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 2048,
    contextWindow: 8192,
    description: 'Powerhouse 7B model. Requires a dedicated GPU (e.g. RTX 3070+, Apple M1/M2/M3 Pro/Max 16GB+) with large storage buffer limits.',
    useCases: ['Heavy reasoning', 'End-to-end coding', 'Complex multi-step workflows'],
    hfUrl: 'https://huggingface.co/Qwen/Qwen2.5-7B-Instruct',
    demoAvailable: false,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from "@mlc-ai/web-llm";

// Requires high VRAM GPU (>= 8GB) and maxStorageBufferBindingSize >= 2GB
const engine = await webllm.CreateMLCEngine("Qwen2.5-7B-Instruct-q4f16_1-MLC");
const stream = await engine.chat.completions.create({
  stream: true,
  messages: [{ role: "user", content: "Design an entire distributed queue architecture." }]
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}`
    }
  },
  {
    id: 'deepseek-r1-distill-qwen-1.5b',
    name: 'DeepSeek R1 Distill Qwen 1.5B',
    developer: 'DeepSeek / MLC AI',
    family: 'DeepSeek R1',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '1.5B',
    paramValueMillion: 1500,
    downloadSizeMB: 1100,
    minRamGB: 4,
    recommendedRamGB: 8,
    minVramGB: 2.1,
    recommendedVramGB: 3.5,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 512,
    contextWindow: 8192,
    description: 'Distilled reasoning model trained with reinforcement learning traces. Outputs <think> step-by-step reasoning tokens directly in your browser tab.',
    useCases: ['Chain-of-thought reasoning', 'Math proofs', 'Logical deduction', 'Algorithm design'],
    hfUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
    demoAvailable: true,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC");
const reply = await engine.chat.completions.create({
  messages: [{ role: "user", content: "How many r's are in the word strawberry? Think step by step." }]
});
console.log(reply.choices[0].message.content);`
    }
  },
  {
    id: 'deepseek-r1-distill-qwen-7b',
    name: 'DeepSeek R1 Distill Qwen 7B',
    developer: 'DeepSeek / MLC AI',
    family: 'DeepSeek R1',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '7.6B',
    paramValueMillion: 7600,
    downloadSizeMB: 4900,
    minRamGB: 16,
    recommendedRamGB: 32,
    minVramGB: 6.8,
    recommendedVramGB: 10,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 2048,
    contextWindow: 8192,
    description: 'Heavyweight reasoning distillation model. Outperforms OpenAI o1-mini on competitive math and coding benchmarks, running locally via WebGPU.',
    useCases: ['Deep scientific reasoning', 'Olympiad math', 'Full stack code synthesis'],
    hfUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
    demoAvailable: false,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC");
const reply = await engine.chat.completions.create({
  messages: [{ role: "user", content: "Solve this Putnam math problem: ..." }]
});
console.log(reply.choices[0].message.content);`
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
    paramValueMillion: 2600,
    downloadSizeMB: 1780,
    minRamGB: 6,
    recommendedRamGB: 12,
    minVramGB: 2.8,
    recommendedVramGB: 4.5,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 1024,
    contextWindow: 8192,
    description: "Google's high-efficiency open model built with knowledge distillation. Offers remarkable conversational nuance and factual alignment.",
    useCases: ['Creative writing', 'Factual QA', 'Educational tutoring', 'Client-side chat'],
    hfUrl: 'https://huggingface.co/google/gemma-2-2b-it',
    demoAvailable: true,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("gemma-2-2b-it-q4f16_1-MLC");
const res = await engine.chat.completions.create({
  messages: [{ role: "user", content: "Teach me how gradient descent works like I am five." }]
});
console.log(res.choices[0].message.content);`
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
    paramValueMillion: 3800,
    downloadSizeMB: 2350,
    minRamGB: 8,
    recommendedRamGB: 16,
    minVramGB: 3.8,
    recommendedVramGB: 6,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 1024,
    contextWindow: 16384,
    description: "Microsoft's state-of-the-art small model with 128k context support. Unmatched reasoning density for its parameter count.",
    useCases: ['Long document analysis', 'Code refactoring', 'Logic synthesis'],
    hfUrl: 'https://huggingface.co/microsoft/Phi-3.5-mini-instruct',
    demoAvailable: true,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("Phi-3.5-mini-instruct-q4f16_1-MLC");
const out = await engine.chat.completions.create({
  messages: [{ role: "user", content: "Analyze this code for potential memory leaks..." }]
});
console.log(out.choices[0].message.content);`
    }
  },
  {
    id: 'tinyllama-1.1b-chat',
    name: 'TinyLlama 1.1B Chat (WASM GGUF)',
    developer: 'TinyLlama Team',
    family: 'TinyLlama',
    modality: 'LLM / Text',
    framework: 'Wllama',
    format: 'GGUF',
    quantization: 'Q4_K_M',
    paramCount: '1.1B',
    paramValueMillion: 1100,
    downloadSizeMB: 669,
    minRamGB: 2.5,
    recommendedRamGB: 4,
    minVramGB: 0, // pure CPU WASM!
    recommendedVramGB: 0,
    requiresWebGPU: false, // Pure CPU llama.cpp compiled to WASM SIMD!
    requiresShaderF16: false,
    minStorageBufferMB: 0,
    contextWindow: 2048,
    description: 'Runs on CPU via llama.cpp compiled to WebAssembly (WASM + SIMD). Does not require WebGPU or dedicated graphics cards at all.',
    useCases: ['Pure CPU environments', 'Chromebooks', 'Older PCs', 'Firefox / Safari without WebGPU'],
    hfUrl: 'https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Wllama (llama.cpp WASM)',
      lang: 'javascript',
      code: `import { Wllama } from '@wllama/wllama';

const wllama = new Wllama({
  'single-thread/wllama.wasm': '/wllama.wasm'
});

await wllama.loadModelFromUrl('https://huggingface.co/.../tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf');
const output = await wllama.createCompletion('Hello, what can you do?', {
  nPredict: 50,
});
console.log(output);`
    }
  },
  {
    id: 'chrome-builtin-gemini-nano',
    name: 'Chrome Built-in Gemini Nano',
    developer: 'Google',
    family: 'Gemini',
    modality: 'LLM / Text',
    framework: 'Chrome Built-in AI',
    format: 'Native Chrome',
    quantization: 'Native System',
    paramCount: '1.8B ~ 3B',
    paramValueMillion: 2000,
    downloadSizeMB: 0, // Handled automatically in background by Chrome OS/browser
    minRamGB: 4,
    recommendedRamGB: 8,
    minVramGB: 1,
    recommendedVramGB: 2,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 0,
    contextWindow: 4096,
    description: "Chrome's native on-device Gemini Nano accessible via window.ai.languageModel. Zero website bundle download; model is pre-installed in the browser.",
    useCases: ['Native zero-bundle chat', 'Writing assistance', 'Instant browser summarization'],
    demoAvailable: true,
    codeSnippet: {
      framework: 'Chrome Prompt API',
      lang: 'javascript',
      code: `// Built-in Chrome Prompt API (Chrome 128+)
if ('ai' in window && 'languageModel' in window.ai) {
  const capabilities = await window.ai.languageModel.capabilities();
  if (capabilities.available !== 'no') {
    const session = await window.ai.languageModel.create();
    const result = await session.prompt("Write a haiku about WebGPU.");
    console.log(result);
  }
}`
    }
  },

  // ==================== EMBEDDINGS & VECTOR SEARCH ====================
  {
    id: 'all-minilm-l6-v2',
    name: 'all-MiniLM-L6-v2',
    developer: 'Sentence Transformers',
    family: 'MiniLM',
    modality: 'Embeddings',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'fp32 / q8',
    paramCount: '22M',
    paramValueMillion: 22,
    downloadSizeMB: 23,
    minRamGB: 1,
    recommendedRamGB: 2,
    minVramGB: 0.1,
    recommendedVramGB: 0.5,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 64,
    description: 'The golden standard lightweight embedding model. 384 dimensions, blazing fast (under 15ms per sentence in browser). Compatible with almost every device.',
    useCases: ['Semantic search in IndexedDB', 'In-browser vector database', 'Duplicate detection', 'RAG pipelines'],
    hfUrl: 'https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2',
    demoAvailable: true,
    testModelId: 'Xenova/all-MiniLM-L6-v2',
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
  device: 'webgpu' // or 'wasm'
});

const output = await extractor('Semantic search on the client side', {
  pooling: 'mean',
  normalize: true
});
console.log('Embedding vector (384d):', output.data);`
    }
  },
  {
    id: 'bge-small-en-v1.5',
    name: 'BGE Small EN v1.5',
    developer: 'BAAI',
    family: 'BGE',
    modality: 'Embeddings',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8',
    paramCount: '33M',
    paramValueMillion: 33,
    downloadSizeMB: 67,
    minRamGB: 1,
    recommendedRamGB: 2,
    minVramGB: 0.2,
    recommendedVramGB: 0.5,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 64,
    description: 'Top-ranking embedding model on MTEB benchmarks in the small weight class. Ideal for client-side local RAG knowledge bases.',
    useCases: ['Local RAG retrieval', 'Recommendation engines', 'Clustering user documents'],
    hfUrl: 'https://huggingface.co/BAAI/bge-small-en-v1.5',
    demoAvailable: true,
    testModelId: 'Xenova/bge-small-en-v1.5',
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const pipe = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');
const embeddings = await pipe(['Document 1 text...', 'Document 2 text...'], {
  pooling: 'cls',
  normalize: true
});
console.log(embeddings);`
    }
  },
  {
    id: 'nomic-embed-text-v1.5',
    name: 'Nomic Embed Text v1.5',
    developer: 'Nomic AI',
    family: 'Nomic',
    modality: 'Embeddings',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8',
    paramCount: '137M',
    paramValueMillion: 137,
    downloadSizeMB: 274,
    minRamGB: 2,
    recommendedRamGB: 4,
    minVramGB: 0.6,
    recommendedVramGB: 1.2,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 128,
    description: '8192-token context length embedding model with Matryoshka dimensionality reduction (truncate embeddings to 128d, 256d, or 768d).',
    useCases: ['Long document embeddings', 'Flexible dimension vector search', 'Code search'],
    hfUrl: 'https://huggingface.co/nomic-ai/nomic-embed-text-v1.5',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const extractor = await pipeline('feature-extraction', 'nomic-ai/nomic-embed-text-v1.5', {
  device: 'webgpu'
});
const res = await extractor('search_query: What is WebGPU?');
console.log(res);`
    }
  },
  {
    id: 'multilingual-e5-small',
    name: 'Multilingual E5 Small',
    developer: 'Microsoft',
    family: 'E5',
    modality: 'Embeddings',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8',
    paramCount: '118M',
    paramValueMillion: 118,
    downloadSizeMB: 120,
    minRamGB: 1.5,
    recommendedRamGB: 3,
    minVramGB: 0.4,
    recommendedVramGB: 1,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 128,
    description: 'High performance multilingual embeddings across 100+ languages. Perfect for internationalized client apps.',
    useCases: ['Cross-lingual search', 'Multilingual document ranking', 'Language clustering'],
    hfUrl: 'https://huggingface.co/intfloat/multilingual-e5-small',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const pipe = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small');
const vector = await pipe('query: comment marche l intelligence artificielle?', {
  pooling: 'mean',
  normalize: true
});`
    }
  },

  // ==================== AUDIO & SPEECH ====================
  {
    id: 'whisper-tiny-en',
    name: 'Whisper Tiny (English)',
    developer: 'OpenAI',
    family: 'Whisper',
    modality: 'Audio / Speech',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8 / fp32',
    paramCount: '39M',
    paramValueMillion: 39,
    downloadSizeMB: 75,
    minRamGB: 1.5,
    recommendedRamGB: 3,
    minVramGB: 0.3,
    recommendedVramGB: 0.8,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 128,
    description: 'Ultra-fast speech-to-text in the browser. Transcribes audio chunks in real-time even on low-end laptops and mobile phones.',
    useCases: ['Voice commands', 'Meeting live captions', 'Voice notes transcription', 'Accessibility'],
    hfUrl: 'https://huggingface.co/openai/whisper-tiny.en',
    demoAvailable: true,
    testModelId: 'Xenova/whisper-tiny.en',
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-tiny.en', {
  device: 'webgpu'
});

// Pass AudioBuffer or Float32Array from microphone
const result = await transcriber(audioData);
console.log('Transcription:', result.text);`
    }
  },
  {
    id: 'whisper-base-en',
    name: 'Whisper Base (English)',
    developer: 'OpenAI',
    family: 'Whisper',
    modality: 'Audio / Speech',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8',
    paramCount: '74M',
    paramValueMillion: 74,
    downloadSizeMB: 145,
    minRamGB: 2,
    recommendedRamGB: 4,
    minVramGB: 0.5,
    recommendedVramGB: 1.2,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 256,
    description: 'Significantly higher accuracy than Tiny with only ~145MB download. Excellent balance of speed and recognition precision.',
    useCases: ['Dictation software', 'Podcasts transcription', 'Voice search'],
    hfUrl: 'https://huggingface.co/openai/whisper-base.en',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-base.en', {
  device: 'webgpu'
});
const out = await transcriber(audioUrl);
console.log(out.text);`
    }
  },
  {
    id: 'whisper-small-en',
    name: 'Whisper Small (English)',
    developer: 'OpenAI',
    family: 'Whisper',
    modality: 'Audio / Speech',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8',
    paramCount: '244M',
    paramValueMillion: 244,
    downloadSizeMB: 480,
    minRamGB: 4,
    recommendedRamGB: 8,
    minVramGB: 1.2,
    recommendedVramGB: 2.5,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 512,
    description: 'Professional grade speech recognition with low word-error-rate (WER). Requires WebGPU acceleration for fast real-time transcription.',
    useCases: ['High-accuracy legal/medical dictation', 'Subtitling video editor'],
    hfUrl: 'https://huggingface.co/openai/whisper-small.en',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-small.en', {
  device: 'webgpu',
  dtype: 'fp16'
});
const res = await transcriber(audioData);
console.log(res.text);`
    }
  },
  {
    id: 'kokoro-82m-tts',
    name: 'Kokoro 82M Text-to-Speech',
    developer: 'Hexgrad / ONNX Community',
    family: 'Kokoro',
    modality: 'Audio / Speech',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'fp32 / q8',
    paramCount: '82M',
    paramValueMillion: 82,
    downloadSizeMB: 88,
    minRamGB: 2,
    recommendedRamGB: 4,
    minVramGB: 0.4,
    recommendedVramGB: 1,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 128,
    description: 'Viral open-source text-to-speech model generating natural, human-like voice audio directly in browser memory without server APIs.',
    useCases: ['Client-side audio narration', 'Screen readers', 'Voice agents', 'E-book readers'],
    hfUrl: 'https://huggingface.co/hexgrad/Kokoro-82M',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { KokoroTTS } from 'kokoro-js';

const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M', {
  device: 'webgpu'
});
const audio = await tts.generate('Hello from your local browser! No server required.');
const audioUrl = URL.createObjectURL(audio.toBlob());
new Audio(audioUrl).play();`
    }
  },

  // ==================== VISION & MULTIMODAL ====================
  {
    id: 'moondream-2-vision-llm',
    name: 'Moondream 2 (Vision LLM)',
    developer: 'vikhyatk',
    family: 'Moondream',
    modality: 'Vision & Multimodal',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q4f16',
    paramCount: '1.8B',
    paramValueMillion: 1860,
    downloadSizeMB: 1200,
    minRamGB: 6,
    recommendedRamGB: 12,
    minVramGB: 2.2,
    recommendedVramGB: 4,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 512,
    description: 'Small, nimble vision-language model. Ask questions about images, extract structured data, count objects, and inspect diagrams directly in the browser.',
    useCases: ['Visual question answering', 'Receipt & invoice extraction', 'Object identification', 'Accessibility image captions'],
    hfUrl: 'https://huggingface.co/vikhyatk/moondream2',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { AutoProcessor, MultiModalForCausalLM, RawImage } from '@huggingface/transformers';

const model = await MultiModalForCausalLM.from_pretrained('onnx-community/moondream2', {
  device: 'webgpu',
  dtype: 'q4f16'
});
const processor = await AutoProcessor.from_pretrained('onnx-community/moondream2');

const image = await RawImage.fromURL('https://example.com/photo.jpg');
const prompt = "<image>\\nDescribe what the person in the photo is holding.";
const inputs = await processor(prompt, image);
const outputs = await model.generate({ ...inputs, max_new_tokens: 64 });`
    }
  },
  {
    id: 'florence-2-base',
    name: 'Florence-2 Base',
    developer: 'Microsoft',
    family: 'Florence',
    modality: 'Vision & Multimodal',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8 / fp16',
    paramCount: '232M',
    paramValueMillion: 232,
    downloadSizeMB: 460,
    minRamGB: 3,
    recommendedRamGB: 6,
    minVramGB: 1.1,
    recommendedVramGB: 2.2,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 256,
    description: 'Unified vision foundation model by Microsoft. Performs captioning, object detection, bounding box grounding, and OCR all in one model.',
    useCases: ['Visual object detection', 'Dense image captioning', 'Referring expression segmentation', 'Document OCR'],
    hfUrl: 'https://huggingface.co/microsoft/Florence-2-base',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { AutoProcessor, AutoModelForCausalLM, RawImage } from '@huggingface/transformers';

const model = await AutoModelForCausalLM.from_pretrained('onnx-community/Florence-2-base-ft', {
  device: 'webgpu',
  dtype: 'fp16'
});
const processor = await AutoProcessor.from_pretrained('onnx-community/Florence-2-base-ft');
// Run tasks like '<OD>' (Object Detection) or '<CAPTION>'`
    }
  },
  {
    id: 'depth-anything-v2-small',
    name: 'Depth Anything V2 Small',
    developer: 'Depth Anything Team',
    family: 'Depth Anything',
    modality: 'Vision & Multimodal',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'fp16 / fp32',
    paramCount: '24M',
    paramValueMillion: 24,
    downloadSizeMB: 98,
    minRamGB: 1.5,
    recommendedRamGB: 3,
    minVramGB: 0.3,
    recommendedVramGB: 0.8,
    requiresWebGPU: true,
    requiresShaderF16: false,
    minStorageBufferMB: 128,
    description: 'Monocular depth estimation that turns standard 2D photos into high-definition 3D depth maps in 30 milliseconds in your browser.',
    useCases: ['3D photo effects', 'AR / WebXR', 'Background blur / bokeh', 'Robotics vision'],
    hfUrl: 'https://huggingface.co/depth-anything/Depth-Anything-V2-Small',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const depthEstimator = await pipeline('depth-estimation', 'onnx-community/Depth-Anything-V2-Small', {
  device: 'webgpu'
});

const result = await depthEstimator('https://example.com/room.jpg');
// result.depth is a raw grayscale canvas with precise z-depth values`
    }
  },
  {
    id: 'clip-vit-base-patch32',
    name: 'CLIP ViT-B/32 (Zero-Shot Vision)',
    developer: 'OpenAI',
    family: 'CLIP',
    modality: 'Vision & Multimodal',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8',
    paramCount: '87M',
    paramValueMillion: 87,
    downloadSizeMB: 160,
    minRamGB: 2,
    recommendedRamGB: 4,
    minVramGB: 0.4,
    recommendedVramGB: 1,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 128,
    description: 'Connects images and text into shared vector space. Enables instant zero-shot image search and visual categorization locally.',
    useCases: ['Photo gallery semantic search', 'Zero-shot classification', 'Visual similarity'],
    hfUrl: 'https://huggingface.co/openai/clip-vit-base-patch32',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const classifier = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32');
const output = await classifier('https://example.com/photo.jpg', ['dog', 'cat', 'car', 'tree']);
console.log(output);`
    }
  },
  {
    id: 'mobilenet-v4-small',
    name: 'MobileNetV4 Small',
    developer: 'Google',
    family: 'MobileNet',
    modality: 'Vision & Multimodal',
    framework: 'TensorFlow.js',
    format: 'TFJS',
    quantization: 'int8',
    paramCount: '4M',
    paramValueMillion: 4,
    downloadSizeMB: 14,
    minRamGB: 0.5,
    recommendedRamGB: 1,
    minVramGB: 0.05,
    recommendedVramGB: 0.2,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 32,
    description: 'Ultra-lightweight real-time image classifier. Runs at 60 FPS even on low-cost mobile phones and smart displays.',
    useCases: ['Real-time webcam classification', 'Smart web cameras', 'Edge sensor processing'],
    hfUrl: 'https://huggingface.co/google/mobilenet_v4_small',
    demoAvailable: true,
    codeSnippet: {
      framework: 'TensorFlow.js',
      lang: 'javascript',
      code: `import * as tf from '@tensorflow/tfjs';

// Works with WebGL, WebGPU, or CPU WASM
await tf.setBackend('webgl');
const model = await tf.loadGraphModel('https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v4_small/model.json');
const tensor = tf.browser.fromPixels(videoElement).expandDims(0);
const predictions = await model.predict(tensor);`
    }
  },
  {
    id: 'yolov11n-detection',
    name: 'YOLOv11 Nano (Object Detection)',
    developer: 'Ultralytics',
    family: 'YOLO',
    modality: 'Vision & Multimodal',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'fp16 / fp32',
    paramCount: '2.6M',
    paramValueMillion: 2.6,
    downloadSizeMB: 11,
    minRamGB: 1,
    recommendedRamGB: 2,
    minVramGB: 0.1,
    recommendedVramGB: 0.4,
    requiresWebGPU: true,
    requiresShaderF16: false,
    minStorageBufferMB: 64,
    description: 'Real-time multi-class object detector detecting people, cars, phones, and 80 COCO classes at 60+ FPS via WebGPU.',
    useCases: ['Webcam object tracking', 'Security camera monitors', 'Augmented reality'],
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const detector = await pipeline('object-detection', 'onnx-community/yolov11n-ONNX', {
  device: 'webgpu'
});
const results = await detector(videoElement);
console.log(results); // [{ box: { xmin, ymin, xmax, ymax }, label: 'person', score: 0.94 }]`
    }
  },

  // ==================== IMAGE GENERATION / DIFFUSION ====================
  {
    id: 'lcm-dreamshaper-v7',
    name: 'LCM Dreamshaper v7 (Diffusion)',
    developer: 'SimianLUO / LCM Team',
    family: 'Latent Consistency',
    modality: 'Image Generation',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'fp16',
    paramCount: '1.2B',
    paramValueMillion: 1200,
    downloadSizeMB: 1850,
    minRamGB: 8,
    recommendedRamGB: 16,
    minVramGB: 4,
    recommendedVramGB: 8,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 1024,
    description: 'High-speed image synthesis generating 512x512 images in only 4 inference steps (~1-3 seconds on WebGPU).',
    useCases: ['Real-time AI drawing canvas', 'In-browser image generation', 'Game asset generator'],
    demoAvailable: false,
    codeSnippet: {
      framework: 'WebStableDiffusion',
      lang: 'javascript',
      code: `// WebStableDiffusion WebGPU Pipeline
const pipeline = await createSDPipeline("LCM-Dreamshaper-v7-fp16");
const imageCanvas = await pipeline.generate({
  prompt: "A cinematic cybernetic garden in Tokyo, 8k render",
  numInferenceSteps: 4,
  guidanceScale: 2.0
});`
    }
  },
  {
    id: 'sd-turbo-onnx',
    name: 'SD-Turbo ONNX WebGPU',
    developer: 'Stability AI',
    family: 'Stable Diffusion',
    modality: 'Image Generation',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'fp16',
    paramCount: '1.4B',
    paramValueMillion: 1400,
    downloadSizeMB: 2300,
    minRamGB: 8,
    recommendedRamGB: 16,
    minVramGB: 4.5,
    recommendedVramGB: 8,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 1024,
    description: '1-step adversarial diffusion model. Generates full photographic images in a single forward pass over WebGPU.',
    useCases: ['Interactive live canvas', 'Rapid prototyping', 'Photorealistic text-to-image'],
    demoAvailable: false,
    codeSnippet: {
      framework: 'ONNX Runtime Web',
      lang: 'javascript',
      code: `// ONNX Runtime Web WebGPU execution provider
import * as ort from 'onnxruntime-web/webgpu';
// Loads UNet, VAE, and TextEncoder directly into WebGPU memory
const session = await ort.InferenceSession.create('sd_turbo_unet_fp16.onnx', {
  executionProviders: ['webgpu']
});`
    }
  },

  // ==================== NLP & CLASSIFICATION ====================
  {
    id: 'distilbert-sst2',
    name: 'DistilBERT SST-2 (Sentiment Analysis)',
    developer: 'Hugging Face',
    family: 'DistilBERT',
    modality: 'NLP & Classification',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8',
    paramCount: '66M',
    paramValueMillion: 66,
    downloadSizeMB: 67,
    minRamGB: 1,
    recommendedRamGB: 2,
    minVramGB: 0.1,
    recommendedVramGB: 0.4,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 64,
    description: 'Fast sentiment analysis classifying text into Positive / Negative with confidence score in < 10 milliseconds.',
    useCases: ['Review sentiment analysis', 'Customer support triage', 'Social media monitoring', 'Live comment filtering'],
    hfUrl: 'https://huggingface.co/distilbert/distilbert-base-uncased-finetuned-sst-2-english',
    demoAvailable: true,
    testModelId: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
const output = await classifier('I absolutely love using on-device machine learning in the browser!');
console.log(output); // [{ label: 'POSITIVE', score: 0.9998 }]`
    }
  },
  {
    id: 'trocr-small-printed',
    name: 'TrOCR Small Printed (OCR)',
    developer: 'Microsoft',
    family: 'TrOCR',
    modality: 'NLP & Classification',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8',
    paramCount: '62M',
    paramValueMillion: 62,
    downloadSizeMB: 130,
    minRamGB: 1.5,
    recommendedRamGB: 3,
    minVramGB: 0.3,
    recommendedVramGB: 0.8,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 128,
    description: 'Transformer-based Optical Character Recognition. Extracts typed and printed text from photos, scans, and documents with high fidelity.',
    useCases: ['Business card scanning', 'Receipt digitizer', 'Document archiving'],
    hfUrl: 'https://huggingface.co/microsoft/trocr-small-printed',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const ocr = await pipeline('image-to-text', 'Xenova/trocr-small-printed');
const text = await ocr('https://example.com/receipt-snippet.png');
console.log('Recognized text:', text[0].generated_text);`
    }
  },
  {
    id: 'bart-large-mnli',
    name: 'BART Large MNLI (Zero-Shot Classification)',
    developer: 'Facebook / Meta',
    family: 'BART',
    modality: 'NLP & Classification',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8',
    paramCount: '407M',
    paramValueMillion: 407,
    downloadSizeMB: 420,
    minRamGB: 3,
    recommendedRamGB: 6,
    minVramGB: 0.9,
    recommendedVramGB: 2,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 256,
    description: 'Classify any arbitrary text into custom label categories without training. Outstanding zero-shot accuracy.',
    useCases: ['Email classification', 'Topic labeling', 'Content moderation', 'Lead categorization'],
    hfUrl: 'https://huggingface.co/facebook/bart-large-mnli',
    demoAvailable: true,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const classifier = await pipeline('zero-shot-classification', 'Xenova/bart-large-mnli');
const res = await classifier('Apple unveiled the new M4 chips with neural accelerators.', [
  'technology', 'sports', 'finance', 'healthcare'
]);
console.log(res);`
    }
  },

  // ==================== ADDITIONAL RUNTIME EXPANSIONS ====================
  {
    id: 'qwen-2.5-coder-1.5b-instruct',
    name: 'Qwen 2.5 Coder 1.5B Instruct',
    developer: 'Alibaba Cloud',
    family: 'Qwen 2.5 Coder',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '1.5B',
    paramValueMillion: 1540,
    downloadSizeMB: 1050,
    minRamGB: 4,
    recommendedRamGB: 8,
    minVramGB: 2,
    recommendedVramGB: 3,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 512,
    contextWindow: 8192,
    description: 'Specialized code generation model trained on 5.5 trillion tokens of source code. Delivers fast client-side code autocomplete and refactoring in browser IDEs.',
    useCases: ['In-browser code completion', 'Bug fixing', 'SQL query generation', 'Unit test writing'],
    hfUrl: 'https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct',
    demoAvailable: true,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC");
const res = await engine.chat.completions.create({
  messages: [{ role: "user", content: "Write a high-performance LRU cache class in TypeScript." }]
});
console.log(res.choices[0].message.content);`
    }
  },
  {
    id: 'qwen-2.5-coder-7b-instruct',
    name: 'Qwen 2.5 Coder 7B Instruct',
    developer: 'Alibaba Cloud',
    family: 'Qwen 2.5 Coder',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '7.6B',
    paramValueMillion: 7600,
    downloadSizeMB: 4850,
    minRamGB: 16,
    recommendedRamGB: 24,
    minVramGB: 6.5,
    recommendedVramGB: 10,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 2048,
    contextWindow: 8192,
    description: 'Flagship open code model competing with larger proprietary models. Capable of end-to-end software architecture synthesis directly in browser memory.',
    useCases: ['Full-stack code generation', 'Multi-file refactoring', 'Algorithm implementation'],
    hfUrl: 'https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct',
    demoAvailable: false,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC");
const res = await engine.chat.completions.create({
  messages: [{ role: "user", content: "Refactor this React hook to support Web Workers..." }]
});`
    }
  },
  {
    id: 'llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B Instruct',
    developer: 'Meta',
    family: 'Llama 3.1',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '8.0B',
    paramValueMillion: 8030,
    downloadSizeMB: 4950,
    minRamGB: 16,
    recommendedRamGB: 32,
    minVramGB: 6.8,
    recommendedVramGB: 10,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 2048,
    contextWindow: 8192,
    description: "Meta's flagship 8B foundation model. Offers exceptional instruction following, general knowledge, and reasoning for high-end Apple Silicon and desktop GPUs.",
    useCases: ['Comprehensive enterprise assistants', 'Complex logic puzzles', 'Deep analytical synthesis'],
    hfUrl: 'https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct',
    demoAvailable: false,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("Llama-3.1-8B-Instruct-q4f16_1-MLC");
const res = await engine.chat.completions.create({
  messages: [{ role: "user", content: "Explain how memory allocation works in modern WebAssembly runtimes." }]
});`
    }
  },
  {
    id: 'mistral-7b-instruct-v0.3',
    name: 'Mistral 7B Instruct v0.3',
    developer: 'Mistral AI',
    family: 'Mistral',
    modality: 'LLM / Text',
    framework: 'WebLLM',
    format: 'WebGPU WGSL / MLC',
    quantization: 'q4f16_1',
    paramCount: '7.2B',
    paramValueMillion: 7200,
    downloadSizeMB: 4600,
    minRamGB: 16,
    recommendedRamGB: 24,
    minVramGB: 6.2,
    recommendedVramGB: 9,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 2048,
    contextWindow: 8192,
    description: 'Renowned open model from Mistral AI with sliding-window attention and function calling support. Runs on WebGPU workstations.',
    useCases: ['Tool invocation', 'Data extraction', 'High-throughput chat'],
    hfUrl: 'https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3',
    demoAvailable: false,
    codeSnippet: {
      framework: 'WebLLM',
      lang: 'javascript',
      code: `import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("Mistral-7B-Instruct-v0.3-q4f16_1-MLC");
const res = await engine.chat.completions.create({
  messages: [{ role: "user", content: "Summarize this RFC specification in three bullet points." }]
});`
    }
  },
  {
    id: 'whisper-large-v3-turbo',
    name: 'Whisper Large v3 Turbo',
    developer: 'OpenAI',
    family: 'Whisper',
    modality: 'Audio / Speech',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q4 / fp16',
    paramCount: '809M',
    paramValueMillion: 809,
    downloadSizeMB: 980,
    minRamGB: 6,
    recommendedRamGB: 12,
    minVramGB: 2.5,
    recommendedVramGB: 4.5,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 1024,
    description: "OpenAI's latest Whisper model with trimmed decoder layers. Delivers near-zero word error rate with 4x faster transcription speed on WebGPU.",
    useCases: ['High-accuracy transcription', 'Live lecture subtitling', 'Multilingual translation'],
    hfUrl: 'https://huggingface.co/openai/whisper-large-v3-turbo',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-large-v3-turbo', {
  device: 'webgpu',
  dtype: 'fp16'
});

const out = await transcriber(audioUrl);
console.log('Transcription:', out.text);`
    }
  },
  {
    id: 'bge-m3-embeddings',
    name: 'BGE-M3 Multi-Function Embeddings',
    developer: 'BAAI',
    family: 'BGE',
    modality: 'Embeddings',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8',
    paramCount: '568M',
    paramValueMillion: 568,
    downloadSizeMB: 610,
    minRamGB: 4,
    recommendedRamGB: 8,
    minVramGB: 1.2,
    recommendedVramGB: 2.5,
    requiresWebGPU: true,
    requiresShaderF16: false,
    minStorageBufferMB: 512,
    description: 'State-of-the-art multilingual embedding model supporting dense, sparse, and multi-vector representations across 100+ languages with 8192 context.',
    useCases: ['Hybrid dense/sparse RAG', 'Cross-language search', 'Complex document clustering'],
    hfUrl: 'https://huggingface.co/BAAI/bge-m3',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { pipeline } from '@huggingface/transformers';

const extractor = await pipeline('feature-extraction', 'Xenova/bge-m3', {
  device: 'webgpu'
});
const embeddings = await extractor('Multi-vector search on WebGPU');`
    }
  },
  {
    id: 'florence-2-large',
    name: 'Florence-2 Large',
    developer: 'Microsoft',
    family: 'Florence',
    modality: 'Vision & Multimodal',
    framework: 'Transformers.js',
    format: 'ONNX',
    quantization: 'q8 / fp16',
    paramCount: '770M',
    paramValueMillion: 770,
    downloadSizeMB: 1100,
    minRamGB: 6,
    recommendedRamGB: 12,
    minVramGB: 2.5,
    recommendedVramGB: 4.5,
    requiresWebGPU: true,
    requiresShaderF16: true,
    minStorageBufferMB: 1024,
    description: 'Microsoft foundation vision model for advanced visual comprehension, dense region grounding, OCR, and multi-task object segmentation.',
    useCases: ['Visual document parsing', 'Fine-grained object detection', 'High-detail visual QA'],
    hfUrl: 'https://huggingface.co/microsoft/Florence-2-large',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Transformers.js v3',
      lang: 'javascript',
      code: `import { AutoProcessor, AutoModelForCausalLM } from '@huggingface/transformers';

const model = await AutoModelForCausalLM.from_pretrained('onnx-community/Florence-2-large-ft', {
  device: 'webgpu',
  dtype: 'fp16'
});`
    }
  },
  {
    id: 'danube-3-500m-chat',
    name: 'H2O Danube 3 500M Chat (WASM GGUF)',
    developer: 'H2O.ai',
    family: 'Danube',
    modality: 'LLM / Text',
    framework: 'Wllama',
    format: 'GGUF',
    quantization: 'Q4_K_M',
    paramCount: '500M',
    paramValueMillion: 500,
    downloadSizeMB: 330,
    minRamGB: 1.5,
    recommendedRamGB: 3,
    minVramGB: 0,
    recommendedVramGB: 0,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 0,
    contextWindow: 4096,
    description: 'Compact 500M parameter model trained by H2O.ai. Excellent conversational density for pure CPU execution via WebAssembly SIMD.',
    useCases: ['Low-end mobile phones', 'Chromebooks', 'Offline browser extensions'],
    hfUrl: 'https://huggingface.co/h2oai/h2o-danube3-500m-chat',
    demoAvailable: false,
    codeSnippet: {
      framework: 'Wllama (llama.cpp WASM)',
      lang: 'javascript',
      code: `import { Wllama } from '@wllama/wllama';

const wllama = new Wllama({ 'single-thread/wllama.wasm': '/wllama.wasm' });
await wllama.loadModelFromUrl('https://huggingface.co/.../danube3-500m-chat.Q4_K_M.gguf');
const res = await wllama.createCompletion('Explain gravity in simple terms.');`
    }
  },
  {
    id: 'mediapipe-gemma-2b',
    name: 'MediaPipe LLM (Gemma 2B)',
    developer: 'Google',
    family: 'Gemma',
    modality: 'LLM / Text',
    framework: 'MediaPipe',
    format: 'ONNX',
    quantization: 'int8',
    paramCount: '2.0B',
    paramValueMillion: 2000,
    downloadSizeMB: 1550,
    minRamGB: 4,
    recommendedRamGB: 8,
    minVramGB: 2,
    recommendedVramGB: 3.5,
    requiresWebGPU: true,
    requiresShaderF16: false,
    minStorageBufferMB: 512,
    contextWindow: 4096,
    description: "Google's official MediaPipe Web LLM Inference engine. Optimized for WebGPU and CPU WebAssembly with streaming token generation.",
    useCases: ['Google ecosystem web apps', 'On-device assistant', 'Interactive web tools'],
    hfUrl: 'https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference/web_js',
    demoAvailable: false,
    codeSnippet: {
      framework: 'MediaPipe Web',
      lang: 'javascript',
      code: `import { FilesetResolver, LlmInference } from '@google/mediapipe-tasks-genai';

const genai = await FilesetResolver.forGenAiTasks('/wasm');
const llm = await LlmInference.createFromOptions(genai, {
  baseOptions: { modelAssetPath: '/models/gemma-2b-it-gpu-int8.bin' },
  maxTokens: 512
});
const response = await llm.generateResponse("How do Web Workers work?");`
    }
  },
  {
    id: 'mediapipe-face-landmarker',
    name: 'MediaPipe Face Mesh (478 Points)',
    developer: 'Google',
    family: 'MediaPipe Vision',
    modality: 'Vision & Multimodal',
    framework: 'MediaPipe',
    format: 'TFJS',
    quantization: 'fp32',
    paramCount: '5M',
    paramValueMillion: 5,
    downloadSizeMB: 18,
    minRamGB: 1,
    recommendedRamGB: 2,
    minVramGB: 0.1,
    recommendedVramGB: 0.5,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 32,
    description: 'Real-time 478-point 3D facial landmark detection at 60 FPS in browser video streams. Powers filters, eye tracking, and expression detection.',
    useCases: ['Virtual try-on glasses/makeup', 'Webcam avatar animation', 'Eye gaze tracking'],
    demoAvailable: false,
    codeSnippet: {
      framework: 'MediaPipe Web',
      lang: 'javascript',
      code: `import { FaceLandmarker, FilesetResolver } from '@google/mediapipe-tasks-vision';

const vision = await FilesetResolver.forVisionTasks('/wasm');
const landmarker = await FaceLandmarker.createFromOptions(vision, {
  baseOptions: { modelAssetPath: '/models/face_landmarker.task' },
  runningMode: 'VIDEO'
});`
    }
  },
  {
    id: 'universal-sentence-encoder',
    name: 'Universal Sentence Encoder (USE)',
    developer: 'Google',
    family: 'USE',
    modality: 'Embeddings',
    framework: 'TensorFlow.js',
    format: 'TFJS',
    quantization: 'fp32',
    paramCount: '30M',
    paramValueMillion: 30,
    downloadSizeMB: 30,
    minRamGB: 1,
    recommendedRamGB: 2,
    minVramGB: 0.1,
    recommendedVramGB: 0.3,
    requiresWebGPU: false,
    requiresShaderF16: false,
    minStorageBufferMB: 64,
    description: "Google's classic Universal Sentence Encoder in TensorFlow.js. Encodes sentences into 512-dimensional vectors with WebGL acceleration.",
    useCases: ['Fast semantic similarity', 'Intent classification', 'Duplicate text detection'],
    demoAvailable: false,
    codeSnippet: {
      framework: 'TensorFlow.js',
      lang: 'javascript',
      code: `import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

await tf.setBackend('webgl');
const model = await use.load();
const embeddings = await model.embed(['How are you?', 'What is your status?']);
embeddings.print();`
    }
  },

  // ==================== AUTOMATED & REGISTRY EXPANSIONS ====================
  {
  id: "deepseek-r1-distill-llama-8b",
  name: "DeepSeek R1 Distill Llama 8B",
  developer: "DeepSeek",
  family: "DeepSeek-R1",
  modality: "LLM / Text",
  framework: "WebLLM",
  format: "WebGPU WGSL / MLC",
  quantization: "q4f16_1",
  paramCount: "8.0B",
  paramValueMillion: 8030,
  downloadSizeMB: 4920,
  minRamGB: 16,
  recommendedRamGB: 32,
  minVramGB: 6,
  recommendedVramGB: 8,
  requiresWebGPU: true,
  requiresShaderF16: true,
  minStorageBufferMB: 2048,
  contextWindow: 32768,
  description: "Llama 3.1 8B fine-tuned on DeepSeek R1 reasoning trajectories for rigorous analytical problem solving directly inside WebGPU.",
  useCases: [
    "Rigorous reasoning",
    "Logic & puzzle breakdown",
    "Long-form analytical reasoning"
  ],
  hfUrl: "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
  demoAvailable: false,
  codeSnippet: {
    framework: "WebLLM",
    lang: "javascript",
    code: "import * as webllm from '@mlc-ai/web-llm';\n\nconst engine = await webllm.CreateMLCEngine(\n  'DeepSeek-R1-Distill-Llama-8B-q4f16_1-MLC'\n);\nconst reply = await engine.chat.completions.create({\n  messages: [{ role: 'user', content: 'Explain Godel incompleteness theorems.' }]\n});"
  }
},
  {
  id: "qwen2.5-0.5b-instruct",
  name: "Qwen 2.5 0.5B Instruct",
  developer: "Alibaba Cloud",
  family: "Qwen",
  modality: "LLM / Text",
  framework: "Transformers.js",
  format: "ONNX",
  quantization: "q4f16",
  paramCount: "490M",
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
  description: "Extremely lightweight multilingual model from the Qwen 2.5 family. Great balance of quality and sub-350MB bundle size for instant page load.",
  useCases: [
    "Multilingual chat",
    "Fast inline auto-completion",
    "Client-side summarization"
  ],
  hfUrl: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct",
  demoAvailable: true,
  testModelId: "onnx-community/Qwen2.5-0.5B-Instruct",
  codeSnippet: {
    framework: "Transformers.js v3",
    lang: "javascript",
    code: "import { pipeline } from '@huggingface/transformers';\n\nconst generator = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {\n  device: 'webgpu',\n  dtype: 'q4f16'\n});\nconst result = await generator('Summarize WebGPU benefits:');"
  }
},
  {
  id: "qwen2.5-7b-instruct",
  name: "Qwen 2.5 7B Instruct",
  developer: "Alibaba Cloud",
  family: "Qwen",
  modality: "LLM / Text",
  framework: "WebLLM",
  format: "WebGPU WGSL / MLC",
  quantization: "q4f16_1",
  paramCount: "7.6B",
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
  description: "Flagship open-weights model excelling at mathematics, structured coding, and 29+ natural languages in WebGPU.",
  useCases: [
    "Complex coding assistance",
    "High-accuracy multilingual translation",
    "In-depth research"
  ],
  hfUrl: "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct",
  demoAvailable: false,
  codeSnippet: {
    framework: "WebLLM",
    lang: "javascript",
    code: "import * as webllm from '@mlc-ai/web-llm';\n\nconst engine = await webllm.CreateMLCEngine('Qwen2.5-7B-Instruct-q4f16_1-MLC');\nconst reply = await engine.chat.completions.create({\n  messages: [{ role: 'user', content: 'Generate a TypeScript state machine.' }]\n});"
  }
},
  {
  id: "gemma-2-9b-it",
  name: "Gemma 2 9B Instruct",
  developer: "Google",
  family: "Gemma",
  modality: "LLM / Text",
  framework: "WebLLM",
  format: "WebGPU WGSL / MLC",
  quantization: "q4f16_1",
  paramCount: "9.2B",
  paramValueMillion: 9240,
  downloadSizeMB: 5600,
  minRamGB: 16,
  recommendedRamGB: 32,
  minVramGB: 7,
  recommendedVramGB: 12,
  requiresWebGPU: true,
  requiresShaderF16: true,
  minStorageBufferMB: 2048,
  contextWindow: 8192,
  description: "Google's 9B parameter model trained on 8T tokens. Competes with models twice its size for complex reasoning and knowledge benchmarks.",
  useCases: [
    "In-depth writing and critique",
    "Technical document analysis",
    "Advanced agentic planning"
  ],
  hfUrl: "https://huggingface.co/google/gemma-2-9b-it",
  demoAvailable: false,
  codeSnippet: {
    framework: "WebLLM",
    lang: "javascript",
    code: "import * as webllm from '@mlc-ai/web-llm';\n\nconst engine = await webllm.CreateMLCEngine('gemma-2-9b-it-q4f16_1-MLC');"
  }
},
  {
  id: "danube3-4b-chat",
  name: "H2O Danube 3 4B Chat",
  developer: "H2O.ai",
  family: "Danube",
  modality: "LLM / Text",
  framework: "Wllama",
  format: "GGUF",
  quantization: "Q4_K_M",
  paramCount: "4.0B",
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
  description: "Compact conversational model run via llama.cpp WebAssembly with multi-threading. Does not require a discrete GPU.",
  useCases: [
    "CPU-only devices",
    "Chromebook offline assistant",
    "Enterprise private chat"
  ],
  hfUrl: "https://huggingface.co/h2oai/h2o-danube3-4b-chat",
  demoAvailable: false,
  codeSnippet: {
    framework: "Wllama",
    lang: "javascript",
    code: "import { Wllama } from '@wllama/wllama';\n\nconst wllama = new Wllama({ 'single-thread': false });\nawait wllama.loadModelFromUrl('https://huggingface.co/.../danube3-4b.gguf');\nconst output = await wllama.createCompletion('User: Hello! Assistant:');"
  }
},
  {
  id: "whisper-small",
  name: "Whisper Small",
  developer: "OpenAI",
  family: "Whisper",
  modality: "Audio / Speech",
  framework: "Transformers.js",
  format: "ONNX",
  quantization: "q8 / fp16",
  paramCount: "244M",
  paramValueMillion: 244,
  downloadSizeMB: 480,
  minRamGB: 3,
  recommendedRamGB: 6,
  minVramGB: 1.2,
  recommendedVramGB: 2.5,
  requiresWebGPU: false,
  requiresShaderF16: false,
  minStorageBufferMB: 256,
  description: "Higher accuracy speech transcription and translation model. Ideal for podcast transcripts, meetings, and video subtitle generation.",
  useCases: [
    "Multilingual video transcription",
    "Voice note transcription",
    "Meeting minutes generator"
  ],
  hfUrl: "https://huggingface.co/openai/whisper-small",
  demoAvailable: true,
  testModelId: "onnx-community/whisper-small",
  codeSnippet: {
    framework: "Transformers.js v3",
    lang: "javascript",
    code: "import { pipeline } from '@huggingface/transformers';\n\nconst transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-small', {\n  device: 'webgpu'\n});\nconst result = await transcriber(audioFloat32Array);"
  }
},
  {
  id: "whisper-medium",
  name: "Whisper Medium",
  developer: "OpenAI",
  family: "Whisper",
  modality: "Audio / Speech",
  framework: "Transformers.js",
  format: "ONNX",
  quantization: "q4f16",
  paramCount: "769M",
  paramValueMillion: 769,
  downloadSizeMB: 890,
  minRamGB: 6,
  recommendedRamGB: 10,
  minVramGB: 2.5,
  recommendedVramGB: 4.5,
  requiresWebGPU: true,
  requiresShaderF16: true,
  minStorageBufferMB: 1024,
  description: "Near human-level accuracy for complex audio with heavy accents or background noise. Powered by WebGPU fp16 acceleration.",
  useCases: [
    "High-fidelity medical/legal transcription",
    "Accent-heavy audio translation",
    "Professional subtitling"
  ],
  hfUrl: "https://huggingface.co/openai/whisper-medium",
  demoAvailable: false,
  codeSnippet: {
    framework: "Transformers.js v3",
    lang: "javascript",
    code: "import { pipeline } from '@huggingface/transformers';\n\nconst transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-medium', {\n  device: 'webgpu',\n  dtype: 'q4f16'\n});"
  }
},
  {
  id: "musicgen-small",
  name: "MusicGen Small",
  developer: "Meta",
  family: "MusicGen",
  modality: "Audio / Speech",
  framework: "Transformers.js",
  format: "ONNX",
  quantization: "q8 / fp32",
  paramCount: "300M",
  paramValueMillion: 300,
  downloadSizeMB: 620,
  minRamGB: 4,
  recommendedRamGB: 8,
  minVramGB: 1.5,
  recommendedVramGB: 3,
  requiresWebGPU: true,
  requiresShaderF16: false,
  minStorageBufferMB: 512,
  description: "Generates original audio and music from natural language text prompts directly inside the browser using WebGPU and Web Audio API.",
  useCases: [
    "Background music generator",
    "Game audio soundscaping",
    "Podcast intro creation"
  ],
  hfUrl: "https://huggingface.co/facebook/musicgen-small",
  demoAvailable: false,
  codeSnippet: {
    framework: "Transformers.js v3",
    lang: "javascript",
    code: "import { pipeline } from '@huggingface/transformers';\n\nconst synthesizer = await pipeline('text-to-audio', 'Xenova/musicgen-small', {\n  device: 'webgpu'\n});\nconst audio = await synthesizer('An 80s synthwave dance track with punchy drums');"
  }
},
  {
  id: "silero-vad",
  name: "Silero VAD (Voice Activity Detector)",
  developer: "Silero",
  family: "Silero",
  modality: "Audio / Speech",
  framework: "Transformers.js",
  format: "ONNX",
  quantization: "fp32",
  paramCount: "1.5M",
  paramValueMillion: 1.5,
  downloadSizeMB: 2,
  minRamGB: 0.5,
  recommendedRamGB: 1,
  minVramGB: 0,
  recommendedVramGB: 0,
  requiresWebGPU: false,
  requiresShaderF16: false,
  minStorageBufferMB: 32,
  description: "Sub-2MB voice activity detector that processes 30ms audio chunks in less than 1ms. Ideal for live microphone silence trimming before LLM prompts.",
  useCases: [
    "Voice assistant trigger",
    "Push-to-talk automation",
    "Speech boundary detection"
  ],
  hfUrl: "https://huggingface.co/onnx-community/silero-vad",
  demoAvailable: false,
  codeSnippet: {
    framework: "Transformers.js v3",
    lang: "javascript",
    code: "import { AutoModel, AutoProcessor } from '@huggingface/transformers';\n\nconst model = await AutoModel.from_pretrained('onnx-community/silero-vad');\n// Run inference on 512-sample PCM chunks in <1ms"
  }
},
  {
  id: "llava-onevision-0.5b",
  name: "LLaVA OneVision Qwen2 0.5B",
  developer: "LLaVA Team",
  family: "LLaVA",
  modality: "Vision & Multimodal",
  framework: "Transformers.js",
  format: "ONNX",
  quantization: "q4f16",
  paramCount: "800M",
  paramValueMillion: 800,
  downloadSizeMB: 650,
  minRamGB: 4,
  recommendedRamGB: 8,
  minVramGB: 1.8,
  recommendedVramGB: 3.5,
  requiresWebGPU: true,
  requiresShaderF16: true,
  minStorageBufferMB: 512,
  description: "Compact multimodal visual assistant able to inspect images, charts, and diagrams directly in the browser tab with zero server roundtrips.",
  useCases: [
    "Visual chart extraction",
    "Webcam object recognition",
    "Receipt reading"
  ],
  hfUrl: "https://huggingface.co/llava-hf/llava-onevision-qwen2-0.5b-ov-hf",
  demoAvailable: false,
  codeSnippet: {
    framework: "Transformers.js v3",
    lang: "javascript",
    code: "import { pipeline } from '@huggingface/transformers';\n\nconst vlm = await pipeline('image-text-to-text', 'onnx-community/llava-onevision-qwen2-0.5b-ov-hf', {\n  device: 'webgpu',\n  dtype: 'q4f16'\n});\nconst answer = await vlm({ image: 'https://...', prompt: 'What is shown in this chart?' });"
  }
},
  {
  id: "rmbg-2.0",
  name: "Bria RMBG 2.0 (Background Remover)",
  developer: "Bria AI",
  family: "RMBG",
  modality: "Vision & Multimodal",
  framework: "Transformers.js",
  format: "ONNX",
  quantization: "fp16",
  paramCount: "44M",
  paramValueMillion: 44,
  downloadSizeMB: 90,
  minRamGB: 2,
  recommendedRamGB: 4,
  minVramGB: 0.6,
  recommendedVramGB: 1.5,
  requiresWebGPU: true,
  requiresShaderF16: false,
  minStorageBufferMB: 256,
  description: "State-of-the-art background removal model in 90MB. Strips backgrounds from portraits and ecommerce products entirely inside the browser.",
  useCases: [
    "E-commerce product cutout",
    "Profile picture background removal",
    "Design tools"
  ],
  hfUrl: "https://huggingface.co/briaai/RMBG-2.0",
  demoAvailable: false,
  codeSnippet: {
    framework: "Transformers.js v3",
    lang: "javascript",
    code: "import { pipeline } from '@huggingface/transformers';\n\nconst segmenter = await pipeline('image-segmentation', 'briaai/RMBG-2.0', {\n  device: 'webgpu'\n});\nconst cutout = await segmenter('https://example.com/product.jpg');"
  }
},
  {
  id: "mobile-sam",
  name: "MobileSAM (Segment Anything)",
  developer: "Chaoning Zhang et al.",
  family: "SAM",
  modality: "Vision & Multimodal",
  framework: "Transformers.js",
  format: "ONNX",
  quantization: "q8 / fp32",
  paramCount: "9.8M",
  paramValueMillion: 9.8,
  downloadSizeMB: 40,
  minRamGB: 1.5,
  recommendedRamGB: 3,
  minVramGB: 0.4,
  recommendedVramGB: 1,
  requiresWebGPU: true,
  requiresShaderF16: false,
  minStorageBufferMB: 128,
  description: "Lightweight adaptation of Meta Segment Anything Model. Computes image embeddings and allows click-to-segment masks in milliseconds.",
  useCases: [
    "Interactive image masking",
    "Smart canvas selection",
    "Video rotoscoping"
  ],
  hfUrl: "https://huggingface.co/Xenova/mobile-sam",
  demoAvailable: false,
  codeSnippet: {
    framework: "Transformers.js v3",
    lang: "javascript",
    code: "import { SamModel, AutoProcessor } from '@huggingface/transformers';\n\nconst model = await SamModel.from_pretrained('Xenova/mobile-sam', { device: 'webgpu' });"
  }
},
  {
  id: "modernbert-base",
  name: "ModernBERT Base",
  developer: "Answer.AI & LightOn",
  family: "ModernBERT",
  modality: "Embeddings",
  framework: "Transformers.js",
  format: "ONNX",
  quantization: "q8 / fp16",
  paramCount: "149M",
  paramValueMillion: 149,
  downloadSizeMB: 310,
  minRamGB: 2.5,
  recommendedRamGB: 5,
  minVramGB: 0.8,
  recommendedVramGB: 1.5,
  requiresWebGPU: false,
  requiresShaderF16: false,
  minStorageBufferMB: 256,
  description: "Modernized encoder architecture with rotary embeddings (RoPE), unpadding, and native 8192 context length. SOTA encoder for search.",
  useCases: [
    "Semantic search",
    "Document classification",
    "Vector embeddings"
  ],
  hfUrl: "https://huggingface.co/onnx-community/ModernBERT-base",
  demoAvailable: false,
  codeSnippet: {
    framework: "Transformers.js v3",
    lang: "javascript",
    code: "import { pipeline } from '@huggingface/transformers';\n\nconst pipe = await pipeline('feature-extraction', 'onnx-community/ModernBERT-base');"
  }
},
  {
  id: "mxbai-embed-large-v1",
  name: "mxbai-embed-large-v1",
  developer: "Mixedbread AI",
  family: "mxbai",
  modality: "Embeddings",
  framework: "Transformers.js",
  format: "ONNX",
  quantization: "q8 / fp32",
  paramCount: "335M",
  paramValueMillion: 335,
  downloadSizeMB: 670,
  minRamGB: 3.5,
  recommendedRamGB: 6,
  minVramGB: 1,
  recommendedVramGB: 2,
  requiresWebGPU: false,
  requiresShaderF16: false,
  minStorageBufferMB: 512,
  description: "Top-ranking 1024-dimension embedding model on the MTEB leaderboard. Provides retrieval quality on par with proprietary hosted embedding APIs.",
  useCases: [
    "High-precision enterprise search",
    "RAG pipelines in-browser",
    "Legal & medical discovery"
  ],
  hfUrl: "https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1",
  demoAvailable: false,
  codeSnippet: {
    framework: "Transformers.js v3",
    lang: "javascript",
    code: "import { pipeline } from '@huggingface/transformers';\n\nconst embedder = await pipeline('feature-extraction', 'mixedbread-ai/mxbai-embed-large-v1');"
  }
},
  {
  id: "snowflake-arctic-embed-m",
  name: "Snowflake Arctic Embed M",
  developer: "Snowflake",
  family: "Arctic",
  modality: "Embeddings",
  framework: "Transformers.js",
  format: "ONNX",
  quantization: "q8 / fp32",
  paramCount: "110M",
  paramValueMillion: 110,
  downloadSizeMB: 220,
  minRamGB: 1.5,
  recommendedRamGB: 3,
  minVramGB: 0.4,
  recommendedVramGB: 0.8,
  requiresWebGPU: false,
  requiresShaderF16: false,
  minStorageBufferMB: 128,
  description: "High-efficiency embedding model built by Snowflake specifically for fast corporate document retrieval and hybrid search.",
  useCases: [
    "Enterprise knowledge search",
    "Local code search",
    "E-commerce recommendations"
  ],
  hfUrl: "https://huggingface.co/Snowflake/snowflake-arctic-embed-m",
  demoAvailable: false,
  codeSnippet: {
    framework: "Transformers.js v3",
    lang: "javascript",
    code: "import { pipeline } from '@huggingface/transformers';\n\nconst extractor = await pipeline('feature-extraction', 'Snowflake/snowflake-arctic-embed-m');"
  }
},
  {
  id: "sd-turbo",
  name: "SD-Turbo (Single-Step Diffusion)",
  developer: "Stability AI",
  family: "Stable Diffusion",
  modality: "Image Generation",
  framework: "Transformers.js",
  format: "ONNX",
  quantization: "fp16",
  paramCount: "1.0B",
  paramValueMillion: 1000,
  downloadSizeMB: 2100,
  minRamGB: 8,
  recommendedRamGB: 16,
  minVramGB: 4.5,
  recommendedVramGB: 8,
  requiresWebGPU: true,
  requiresShaderF16: true,
  minStorageBufferMB: 1024,
  description: "Adversarial diffusion distillation model generating 512x512 images in a single step with zero server latency on high-end WebGPU.",
  useCases: [
    "Real-time canvas drawing prompt",
    "Avatar generation",
    "Instant AI sketches"
  ],
  hfUrl: "https://huggingface.co/stabilityai/sd-turbo",
  demoAvailable: false,
  codeSnippet: {
    framework: "Transformers.js v3",
    lang: "javascript",
    code: "// Experimental WebGPU single-step diffusion pipeline\nimport { AutoModelForImageGeneration } from '@huggingface/transformers';"
  }
},
];
