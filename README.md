
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

`fit('model')` tests a model against WebGPU buffer limits and VRAM. `fit()` returns all models sorted by device compatibility. That's the whole API.

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
