Got tired of WebGPU browser tabs crashing when models exceed `maxStorageBufferBindingSize` or lack `shader-f16` support.

Built **browser-llm-fit** to probe client hardware limits and rank 30+ browser-executable models before downloading weights.

```js
import fit from 'browser-llm-fit';

const res = await fit('SmolLM2-135M');
console.log(res.fits, res.speed); // true, '45-65 tokens/sec'
```

`fit('model')` tests a model. `fit()` returns all models sorted by hardware fit.

- **Live**: https://h3manth.com/ai/browser-llm-fit/
- **Repo**: https://github.com/hemanth/browser-llm-fit
- **npm**: `npm install browser-llm-fit`

Feedback on odd GPU setups and mobile WebGPU is appreciated!
