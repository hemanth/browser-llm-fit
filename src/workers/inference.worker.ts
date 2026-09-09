import { pipeline, env } from '@huggingface/transformers';
import { getDemoModel } from '../data/demoModels';

export interface InferenceRequest {
  modelId: string;
  text: string;
  device: 'webgpu' | 'wasm';
  hasShaderF16: boolean;
}
export type InferenceResponse =
  | { type: 'progress'; message: string }
  | { type: 'running' }
  | { type: 'result'; text: string; latencyMs: number }
  | { type: 'error'; message: string };

const send = (message: InferenceResponse) => self.postMessage(message);
env.allowLocalModels = false;

self.onmessage = async ({ data }: MessageEvent<InferenceRequest>) => {
  let dispose: (() => Promise<unknown>) | undefined;
  let response: InferenceResponse;
  try {
    const model = getDemoModel(data.modelId);
    if (!model) throw new Error('This model does not have a supported text demo.');
    const options = {
      device: data.device,
      progress_callback: (progress: { status: string; progress?: number; file?: string }) => {
        if (progress.status === 'progress') {
          send({ type: 'progress', message: `Downloading ${progress.file ?? 'weights'}: ${Math.round(progress.progress ?? 0)}%` });
        }
      },
    };
    let text: string;
    let started: number;
    if (model.task === 'text-generation') {
      const pipe = await pipeline('text-generation', model.id, {
        ...options, dtype: data.device === 'webgpu' && data.hasShaderF16 ? 'q4f16' : 'q4',
      });
      dispose = () => pipe.dispose();
      send({ type: 'running' });
      started = performance.now();
      const output = await pipe(data.text, { max_new_tokens: 36, do_sample: false });
      const first = output[0];
      text = first && 'generated_text' in first && typeof first.generated_text === 'string'
        ? first.generated_text : JSON.stringify(output);
    } else if (model.task === 'feature-extraction') {
      const pipe = await pipeline('feature-extraction', model.id, options);
      dispose = () => pipe.dispose();
      send({ type: 'running' });
      started = performance.now();
      const output = await pipe(data.text, { pooling: 'mean', normalize: true });
      const sample = Array.from(output.data.slice(0, 5)).map(value => Number(value).toFixed(4)).join(', ');
      text = `Embedding Vector ([${output.dims.join(' × ')}]): [${sample}, ...]`;
    } else {
      const pipe = await pipeline('sentiment-analysis', model.id, options);
      dispose = () => pipe.dispose();
      send({ type: 'running' });
      started = performance.now();
      const output = await pipe(data.text);
      const top = output[0];
      if (!top || Array.isArray(top)) throw new Error('Unexpected classification output.');
      text = `Classification: ${top.label} • ${(top.score * 100).toFixed(2)}% confidence`;
    }
    response = { type: 'result', text, latencyMs: Math.round(performance.now() - started) };
  } catch (error) {
    response = { type: 'error', message: error instanceof Error ? error.message : String(error) };
  } finally {
    try { await dispose?.(); } catch { /* Worker termination also releases the runtime. */ }
  }
  send(response);
  self.close();
};
