import React, { useState } from 'react';
import { X, PlayCircle, Sparkles, CheckCircle2, Clock, Cpu } from 'lucide-react';
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
    'Running machine learning models locally in the browser with WebGPU is astonishingly fast and private!'
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
    setLoadingProgress('Initializing model pipeline...');

    try {
      const { pipeline, env } = await import('@huggingface/transformers');
      env.allowLocalModels = false;

      // Determine device: webgpu if available, else wasm
      const device = hasWebGPU ? 'webgpu' : 'wasm';
      setDeviceUsed(device);

      // Check task type based on model
      const isFeatureExtractor = targetModelId.includes('MiniLM') || targetModelId.includes('bge');
      const task = isFeatureExtractor ? 'feature-extraction' : 'sentiment-analysis';

      const pipe = await pipeline(task as any, targetModelId, {
        device,
        progress_callback: (progress: any) => {
          if (progress.status === 'progress') {
            const percent = Math.round((progress.loaded / progress.total) * 100) || 0;
            setLoadingProgress(`Downloading ${progress.file}: ${percent}%`);
          } else if (progress.status === 'ready') {
            setLoadingProgress('Model compiled and ready!');
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
        setResult(`Embedding Vector generated (${shape}): [${sample}, ...]`);
      } else {
        const top = Array.isArray(output) ? output[0] : output;
        setResult(`Label: ${top.label} • Confidence: ${(top.score * 100).toFixed(2)}%`);
      }
    } catch (err) {
      console.error(err);
      setResult(`Inference Error: ${(err as Error).message}. (Check browser console)`);
    } finally {
      setLoadingModel(false);
      setRunningInference(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <PlayCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Live In-Browser Inference
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Transformers.js
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Testing {modelTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Target Model Info */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span className="text-slate-400">Model:</span>
              <strong className="text-white font-mono">{targetModelId}</strong>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
              Backend: {hasWebGPU ? 'WebGPU' : 'WASM CPU'}
            </span>
          </div>

          {/* Text Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Sample Prompt / Input Text:
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              placeholder="Enter text to classify or embed..."
            />
          </div>

          {/* Trigger Button */}
          <button
            onClick={handleRunInference}
            disabled={loadingModel || runningInference}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30 transition-all cursor-pointer"
          >
            {loadingModel ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{loadingProgress || 'Loading Model...'}</span>
              </>
            ) : runningInference ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Evaluating Inference...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Run In-Browser Model</span>
              </>
            )}
          </button>

          {/* Results Box */}
          {result && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Execution Result
                </span>
                {latencyMs !== null && (
                  <span className="font-mono text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="h-3 w-3 text-cyan-400" />
                    Latency: <strong className="text-white">{latencyMs} ms</strong> ({deviceUsed})
                  </span>
                )}
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg text-xs font-mono text-slate-100 border border-slate-800">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
