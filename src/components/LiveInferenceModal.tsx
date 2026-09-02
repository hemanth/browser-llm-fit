import React, { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';
import type { InBrowserModel } from '../types/model';

interface LiveInferenceModalProps {
  model: InBrowserModel | null;
  isOpen: boolean;
  onClose: () => void;
  hasWebGPU: boolean;
}

const AVAILABLE_TEST_MODELS = [
  {
    id: 'onnx-community/SmolLM2-135M-Instruct',
    name: 'SmolLM2 135M Instruct (LLM / Text Generation)',
    task: 'text-generation',
    defaultPrompt: 'The future of local in-browser artificial intelligence is'
  },
  {
    id: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
    name: 'DistilBERT SST-2 (Sentiment Analysis)',
    task: 'sentiment-analysis',
    defaultPrompt: 'Running machine learning models locally in the browser with WebGPU is fast and completely private.'
  },
  {
    id: 'Xenova/all-MiniLM-L6-v2',
    name: 'all-MiniLM-L6-v2 (Vector Embeddings 384d)',
    task: 'feature-extraction',
    defaultPrompt: 'Local vector search and semantic retrieval.'
  }
];

export const LiveInferenceModal: React.FC<LiveInferenceModalProps> = ({
  model,
  isOpen,
  onClose,
  hasWebGPU,
}) => {
  // Determine initial selected model id
  const initialModelId = model?.testModelId || 'onnx-community/SmolLM2-135M-Instruct';
  const [selectedModelId, setSelectedModelId] = useState(initialModelId);
  const [inputText, setInputText] = useState('The future of local in-browser artificial intelligence is');

  const [loadingModel, setLoadingModel] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [runningInference, setRunningInference] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [deviceUsed, setDeviceUsed] = useState<string>('');

  // Sync selected model when prop changes
  useEffect(() => {
    if (model?.testModelId) {
      setSelectedModelId(model.testModelId);
      const match = AVAILABLE_TEST_MODELS.find(m => m.id === model.testModelId);
      if (match) {
        setInputText(match.defaultPrompt);
      }
    } else {
      setSelectedModelId('onnx-community/SmolLM2-135M-Instruct');
      setInputText('The future of local in-browser artificial intelligence is');
    }
  }, [model]);

  if (!isOpen) return null;

  const handleSelectModelChange = (id: string) => {
    setSelectedModelId(id);
    const match = AVAILABLE_TEST_MODELS.find(m => m.id === id);
    if (match) {
      setInputText(match.defaultPrompt);
    }
    setResult(null);
    setLatencyMs(null);
  };

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

      const isTextGen = selectedModelId.includes('SmolLM');
      const isFeatureExtractor = selectedModelId.includes('MiniLM') || selectedModelId.includes('bge');
      const task = isTextGen ? 'text-generation' : isFeatureExtractor ? 'feature-extraction' : 'sentiment-analysis';

      const pipeOptions: Record<string, any> = {
        device,
        progress_callback: (progress: any) => {
          if (progress.status === 'progress') {
            const percent = Math.round((progress.loaded / progress.total) * 100) || 0;
            setLoadingProgress(`Downloading ${progress.file}: ${percent}%`);
          } else if (progress.status === 'ready') {
            setLoadingProgress('Ready');
          }
        }
      };

      if (isTextGen) {
        pipeOptions.dtype = device === 'webgpu' ? 'q4f16' : 'q4';
      }

      const pipe = await pipeline(task as any, selectedModelId, pipeOptions);

      setLoadingModel(false);
      setRunningInference(true);

      const t0 = performance.now();

      if (isTextGen) {
        const output = await pipe(inputText, {
          max_new_tokens: 36,
          temperature: 0.7,
        });
        const t1 = performance.now();
        setLatencyMs(Math.round(t1 - t0));
        const text = Array.isArray(output) ? output[0]?.generated_text : (output as any)?.generated_text;
        setResult(text || JSON.stringify(output));
      } else if (isFeatureExtractor) {
        const output = await pipe(inputText, { pooling: 'mean', normalize: true });
        const t1 = performance.now();
        setLatencyMs(Math.round(t1 - t0));
        const shape = output.dims ? `[${output.dims.join(' × ')}]` : `Array(${output.data?.length || output.length})`;
        const sample = Array.from(output.data ? output.data.slice(0, 5) : output.slice(0, 5))
          .map((v: any) => Number(v).toFixed(4))
          .join(', ');
        setResult(`Embedding Vector (${shape}): [${sample}, ...]`);
      } else {
        const output = await pipe(inputText);
        const t1 = performance.now();
        setLatencyMs(Math.round(t1 - t0));
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
              Client-side execution via Transformers.js ONNX Runtime
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
          {/* Target Model Selector */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-[#A1A1A1]">Target Model</label>
            <select
              value={selectedModelId}
              onChange={(e) => handleSelectModelChange(e.target.value)}
              className="w-full bg-[#000000] border border-[#262626] rounded-lg px-2.5 py-1.5 text-xs text-[#EDEDED] font-mono focus:outline-none focus:border-[#4D4D4D]"
            >
              {AVAILABLE_TEST_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#707070] px-1">
            <span>Repository: {selectedModelId}</span>
            <span>{hasWebGPU ? 'WebGPU' : 'WASM CPU'}</span>
          </div>

          {/* Text Input */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-[#A1A1A1]">Input Text / Prompt</label>
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
              <span>Evaluating on-device...</span>
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
              <div className="text-[#EDEDED] text-xs leading-relaxed whitespace-pre-wrap">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
