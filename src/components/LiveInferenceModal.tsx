import React, { useState } from 'react';
import { X, Play } from 'lucide-react';
import type { InBrowserModel } from '../types/model';

interface LiveInferenceModalProps {
  model: InBrowserModel | null;
  isOpen: boolean;
  onClose: () => void;
  hasWebGPU: boolean;
}

export const LiveInferenceModal: React.FC<LiveInferenceModalProps> = ({
  model,
  isOpen,
  onClose,
  hasWebGPU,
}) => {
  const [inputText, setInputText] = useState(
    'Running machine learning models locally in the browser with WebGPU is fast and completely private.'
  );
  const [loadingModel, setLoadingModel] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [runningInference, setRunningInference] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [deviceUsed, setDeviceUsed] = useState<string>('');

  if (!isOpen) return null;

  const targetModelId = model?.testModelId || 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
  const modelTitle = model ? model.name : 'DistilBERT Sentiment Classifier';

  const handleRunInference = async () => {
    setLoadingModel(true);
    setResult(null);
    setLatencyMs(null);
    setLoadingProgress('Loading pipeline...');

    try {
      const { pipeline, env } = await import('@huggingface/transformers');
      env.allowLocalModels = false;

      const device = hasWebGPU ? 'webgpu' : 'wasm';
      setDeviceUsed(device);

      const isFeatureExtractor = targetModelId.includes('MiniLM') || targetModelId.includes('bge');
      const task = isFeatureExtractor ? 'feature-extraction' : 'sentiment-analysis';

      const pipe = await pipeline(task as any, targetModelId, {
        device,
        progress_callback: (progress: any) => {
          if (progress.status === 'progress') {
            const percent = Math.round((progress.loaded / progress.total) * 100) || 0;
            setLoadingProgress(`Downloading ${progress.file}: ${percent}%`);
          } else if (progress.status === 'ready') {
            setLoadingProgress('Ready');
          }
        }
      });

      setLoadingModel(false);
      setRunningInference(true);

      const t0 = performance.now();
      const output = await pipe(inputText);
      const t1 = performance.now();

      const elapsed = Math.round(t1 - t0);
      setLatencyMs(elapsed);

      if (isFeatureExtractor) {
        const shape = output.dims ? `[${output.dims.join(' × ')}]` : `Array(${output.data.length})`;
        const sample = Array.from(output.data.slice(0, 5)).map((v: any) => v.toFixed(4)).join(', ');
        setResult(`Embedding Vector (${shape}): [${sample}, ...]`);
      } else {
        const top = Array.isArray(output) ? output[0] : output;
        setResult(`Classification: ${top.label} • ${(top.score * 100).toFixed(2)}% confidence`);
      }
    } catch (err) {
      console.error(err);
      setResult(`Execution error: ${(err as Error).message}`);
    } finally {
      setLoadingModel(false);
      setRunningInference(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm">
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#262626] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-[-0.28px] text-[#EDEDED]">
              Live In-Browser Inference
            </h3>
            <p className="text-xs text-[#707070] mt-0.5">
              {modelTitle} via Transformers.js
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-7 w-7 rounded-md text-[#707070] hover:text-[#EDEDED] hover:bg-[#171717] transition-colors flex items-center justify-center"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 overflow-y-auto text-xs">
          {/* Target Model Bar */}
          <div className="p-2.5 bg-[#000000] rounded-lg border border-[#262626] flex items-center justify-between font-mono">
            <span className="text-[#EDEDED] truncate">{targetModelId}</span>
            <span className="text-[11px] text-[#707070] ml-2 shrink-0">{hasWebGPU ? 'WebGPU' : 'WASM'}</span>
          </div>

          {/* Text Input */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-[#A1A1A1]">Input Text</label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-[#000000] border border-[#262626] rounded-lg p-2.5 text-xs text-[#EDEDED] placeholder-[#707070] focus:outline-none focus:border-[#4D4D4D]"
            />
          </div>

          {/* Run Button */}
          <button
            onClick={handleRunInference}
            disabled={loadingModel || runningInference}
            className="w-full h-8 rounded-md bg-[#EDEDED] hover:bg-[#FFFFFF] disabled:opacity-50 text-[#000000] font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {loadingModel ? (
              <span>{loadingProgress || 'Loading weights...'}</span>
            ) : runningInference ? (
              <span>Evaluating...</span>
            ) : (
              <>
                <Play className="h-3 w-3 fill-current" />
                <span>Run In-Browser Model</span>
              </>
            )}
          </button>

          {/* Results */}
          {result && (
            <div className="p-3 rounded-lg bg-[#000000] border border-[#262626] space-y-1.5 font-mono">
              <div className="flex justify-between items-center text-[11px] text-[#707070]">
                <span>Inference Output</span>
                {latencyMs !== null && <span>{latencyMs}ms ({deviceUsed})</span>}
              </div>
              <div className="text-[#EDEDED] text-xs leading-relaxed">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
