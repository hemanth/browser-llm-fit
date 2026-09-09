
# browser-llm-fit

Check if an AI model fits the browser hardware (WebGPU, WASM, RAM, shader-f16).


https://github.com/user-attachments/assets/f4ceae3a-a2b3-4955-bec2-36de9238f56a



```bash
npm install browser-llm-fit
```

## Quick start

```js
import fit from 'browser-llm-fit';

const res = await fit('SmolLM2-135M');
console.log(res.fits);   // true
console.log(res.tier);   // 'smooth'
console.log(res.speed);  // '45-65 tokens/sec'
```

`fit('model')` checks runtime features, buffer limits, and memory requirements, with warnings where capacity is unknown. `fit()` returns all models sorted by device compatibility. That's the whole API.

## Probe all models

```js
import fit from 'browser-llm-fit';

const { hardware, models } = await fit();
console.log(hardware.webgpuDevice);
console.log(models[0].model.name, models[0].evaluation.score);
```

Returns detected adapter limits and catalog models ranked by compatibility score.

## Simulate constraints

```js
import fit from 'browser-llm-fit';

const res = await fit('Llama-3.2-3B', { ram: 4, gpu: 'wasm-cpu' });
console.log(res.fits); // false
```

Simulates low-memory phones, Chromebooks, or WASM CPU fallback without physical hardware.

## Demo

- Live: [https://h3manth.com/ai/browser-llm-fit/](https://h3manth.com/ai/browser-llm-fit/)
  
```bash
npm run dev
```

Starts the local development server on `http://localhost:5180`.

## License

MIT © [Hemanth.HM](https://h3manth.com)

## Compatibility limits

Results are estimates, not a guarantee that model allocation or inference will succeed.
Browsers do not expose free VRAM. GPU models therefore receive a memory warning
unless you supply an explicit budget, for example:

```js
await fit('Qwen 2.5 7B', { ram: 32, vram: 8, gpu: 'webgpu-f16' });
```

RAM may also be estimated when the browser does not report it. Throughput ranges
are heuristics, not measurements of your device. `cpuCores` is retained as simulation
metadata; it does not calibrate throughput. Empty options preserve automatic detection.
The API requires a browser environment, including when simulating constraints.

Live demos support the text models listed in the demo selector. Audio models have
code examples but no embedded demo until an audio input flow is implemented.
Inference runs in a worker; switching models or closing the dialog terminates it.
Completed runs dispose the pipeline, and subsequent runs load it again using browser caches.

## Development checks

```bash
npm run lint
npm test
npm run build:app
npx playwright install chromium
npm run test:browser
```

The browser check starts and stops its own preview server. Set `TEST_BASE_URL` to
check an already running server instead. The weekly registry job writes discovery
candidates to `src/data/registry-sync.json`; catalog additions still require review.
