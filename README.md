# llm-locally

Probe client device hardware and match browser-compatible LLMs and AI models across WebGPU, WASM, and ONNX Runtime.

```bash
npm install
npm run dev
```

## Quick start

```ts
import { detectHardwareProfile } from './src/utils/hardwareDetector';
import { evaluateModelCompatibility } from './src/utils/compatibilityChecker';
import { IN_BROWSER_MODELS } from './src/data/modelsData';

// Auto-detect CPU cores, RAM, WebGPU adapter, shader-f16, and max buffer limits
const hardware = await detectHardwareProfile();

// Score every model against local device constraints
const results = IN_BROWSER_MODELS.map((model) => ({
  model: model.name,
  score: evaluateModelCompatibility(model, hardware).score,
  status: evaluateModelCompatibility(model, hardware).tier,
}));
```

`detectHardwareProfile()` extracts WebGPU limits, WASM SIMD, and memory headroom. `evaluateModelCompatibility()` calculates suitability scores and bottleneck diagnostics.

## Hardware simulation sandbox

```ts
// Tweak parameters or pick device presets to test model viability
const simulatedHardware = {
  ramGB: 8,
  gpuBackend: 'webgpu-f16',
  maxStorageBufferMB: 2048,
  storageAvailableGB: 30,
};

const evaluation = evaluateModelCompatibility(model, hardware, {
  isActive: true,
  ...simulatedHardware,
  cpuCores: 8,
  hasWasmSimd: true,
  downlinkMbps: 100,
});
```

Test presets for MacBook Air M1/M2, M3 Max, Gaming RTX 4080, Chromebooks, and flagship smartphones.

## Live GPU allocation diagnostics

```ts
import { runHardwareDiagnostics } from './src/utils/webgpuBenchmark';

const diagnostics = await runHardwareDiagnostics();
console.log(diagnostics.maxAllocatableBufferMB); // e.g. 2048 MB
console.log(diagnostics.gflops); // e.g. 1450 GFLOPS
```

Stress-tests buffer allocations directly in VRAM and measures compute shader dispatch latency.

## Live in-browser inference

```ts
import { pipeline } from '@huggingface/transformers';

const classifier = await pipeline(
  'sentiment-analysis',
  'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
  { device: 'webgpu' }
);

const out = await classifier('Local in-browser AI works seamlessly.');
```

Executes inference on-device with zero server calls.

## Supported frameworks

- Transformers.js v3 (ONNX Runtime Web with WebGPU & WASM SIMD)
- WebLLM (MLC AI WebGPU WGSL runtime)
- Wllama (llama.cpp compiled to WebAssembly)
- MediaPipe Web & TensorFlow.js
- Chrome Built-in AI (Prompt API / Gemini Nano)

## License

MIT © [Hemanth.HM](https://h3manth.com)
