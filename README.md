# browser-llm-fit

Check if an AI model fits the browser hardware (WebGPU, WASM, RAM, shader-f16).

```bash
npm install browser-llm-fit
```

## Quick start

```js
import fit from 'browser-llm-fit';

const res = await fit('SmolLM2-135M');
console.log(res.fits); // true
console.log(res.tier); // 'smooth'
console.log(res.speed); // '45-65 tokens/sec'
```

Evaluates WebGPU storage buffer limits, half-precision float (`shader-f16`) availability, VRAM thresholds, and WASM threads to prevent browser tab crashes before loading model weights.

## Probe all models on current hardware

```js
import fit from 'browser-llm-fit';

const { hardware, models } = await fit();

console.log(hardware.webgpuDevice, hardware.reportedRamGB);
console.log(models[0].model.name, models[0].evaluation.score);
```

Returns detected adapter limits and all catalog models sorted by hardware compatibility score.

## Test with custom hardware constraints

```js
import fit from 'browser-llm-fit';

const res = await fit('Llama-3.2-3B', {
  ram: 4,
  gpu: 'wasm-cpu'
});

console.log(res.fits); // false
console.log(res.headline); // 'Insufficient System RAM'
```

Simulate mobile devices, Chromebooks, or discrete GPUs without physical access.

## Supported runtimes

- **WebLLM** (WebGPU WGSL shaders: Llama 3.2, Qwen 2.5 Coder, DeepSeek-R1 Distill)
- **Transformers.js v3** (ONNX Runtime Web: SmolLM2, Whisper, Florence-2, BGE-M3)
- **Wllama** (llama.cpp WASM threads: TinyLlama, Danube 3 GGUF)
- **MediaPipe** (Web ML: Gemma 2B, Face Mesh)
- **TensorFlow.js** (WebGL/WebGPU: Universal Sentence Encoder, MobileNet)
- **Chrome Built-in AI** (`window.ai.languageModel`: Gemini Nano)

## Automated registry updates

```bash
node scripts/update-models.js
```

Queries Hugging Face API and WebLLM registries weekly via GitHub Actions to track new model weights and quantization builds.

## Demo

Live: [https://h3manth.com/ai/browser-llm-fit/](https://h3manth.com/ai/browser-llm-fit/)

Video walkthrough: [recordings/demo.mp4](recordings/demo.mp4)

```bash
npm run dev
```

Starts the local development server on `http://localhost:5180`.

## License

MIT © [Hemanth.HM](https://h3manth.com)
