# inbrowser.ai

Probe client device hardware and match browser-compatible LLMs and AI models across WebGPU, WASM, and ONNX Runtime.

```bash
npm install
```

## Quick start

```ts
import { detectHardwareProfile } from './src/utils/hardwareDetector';
import { evaluateModelCompatibility } from './src/utils/compatibilityChecker';
import { IN_BROWSER_MODELS } from './src/data/modelsData';

const hardware = await detectHardwareProfile();

const results = IN_BROWSER_MODELS.map((model) => ({
  model: model.name,
  score: evaluateModelCompatibility(model, hardware).score,
  status: evaluateModelCompatibility(model, hardware).tier,
}));
```

`detectHardwareProfile()` extracts WebGPU limits, WASM SIMD, and memory headroom. `evaluateModelCompatibility()` calculates suitability scores and bottleneck diagnostics.

## Hardware simulation sandbox

```ts
import { evaluateModelCompatibility } from './src/utils/compatibilityChecker';

const simulation = {
  isActive: true,
  ramGB: 8,
  cpuCores: 8,
  gpuBackend: 'webgpu-f16' as const,
  maxStorageBufferMB: 2048,
  storageAvailableGB: 30,
  hasWasmSimd: true,
  downlinkMbps: 100,
};

const evaluation = evaluateModelCompatibility(model, hardware, simulation);
```

Tests model viability against simulated constraints or device presets (M1/M2/M3, RTX 4080, Chromebook, mobile).

## Live GPU and CPU diagnostics

```ts
import { runHardwareDiagnostics } from './src/utils/webgpuBenchmark';

const diagnostics = await runHardwareDiagnostics();
console.log(diagnostics.maxAllocatableBufferMB);
console.log(diagnostics.gflops);
```

Allocates memory buffers up to hardware thresholds and executes compute shader matrix multiplications. Falls back to CPU WASM when WebGPU is absent.

## On-device model execution

```ts
import { pipeline } from '@huggingface/transformers';

const pipe = await pipeline('text-generation', 'onnx-community/SmolLM2-135M-Instruct', {
  device: 'webgpu',
  dtype: 'q4f16',
});

const output = await pipe('Explain WebGPU simply:', { max_new_tokens: 32 });
```

Executes inference directly in the browser tab with zero server roundtrips.

## Automated registry updates

```bash
node scripts/update-models.js
```

Queries Hugging Face API and WebLLM registries weekly via GitHub Actions to track new model weights and quantization builds.

## Demo

```bash
npm run dev
```

Starts the local development server on `http://localhost:5180`.

## License

MIT © [Hemanth.HM](https://h3manth.com)
