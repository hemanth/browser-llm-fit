import React, { useEffect, useRef, useState } from 'react';
import { DEMO_MODELS, getDemoModel } from '../data/demoModels';
import type { InferenceRequest, InferenceResponse } from '../workers/inference.worker';
import { X, Play } from 'lucide-react';
import type { InBrowserModel } from '../types/model';
import { Select } from './Select';

interface LiveInferenceModalProps {
  model: InBrowserModel | null;
  isOpen: boolean;
  onClose: () => void;
  hasWebGPU: boolean;
  hasShaderF16: boolean;
}

export const LiveInferenceModal: React.FC<LiveInferenceModalProps> = ({
  model,
  isOpen,
  onClose,
  hasWebGPU,
  hasShaderF16,
}) => {
  // Determine initial selected model id
  const initialModelId = model ? (getDemoModel(model.testModelId)?.id ?? '') : DEMO_MODELS[0].id;
  const [selectedModelId, setSelectedModelId] = useState(initialModelId);
  const [inputText, setInputText] = useState(getDemoModel(initialModelId)?.defaultPrompt ?? '');

  const [loadingModel, setLoadingModel] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [runningInference, setRunningInference] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [deviceUsed, setDeviceUsed] = useState<string>('');

  const workerRef = useRef<Worker | null>(null);
  useEffect(() => () => { workerRef.current?.terminate(); }, []);

  const stopInference = () => {
    workerRef.current?.terminate();
    workerRef.current = null;
    setLoadingModel(false);
    setRunningInference(false);
  };
  const close = () => { stopInference(); onClose(); };

  const handleSelectModelChange = (id: string) => {
    stopInference();
    setSelectedModelId(id);
    setInputText(getDemoModel(id)?.defaultPrompt ?? '');
    setResult(null);
    setLatencyMs(null);
  };

  const handleRunInference = () => {
    if (!getDemoModel(selectedModelId) || !inputText.trim()) return;
    stopInference();
    setLoadingModel(true);
    setResult(null);
    setLatencyMs(null);
    setLoadingProgress('Loading pipeline...');
    const device = hasWebGPU ? 'webgpu' : 'wasm';
    setDeviceUsed(device);
    try {
      const worker = new Worker(new URL('../workers/inference.worker.ts', import.meta.url), { type: 'module' });
      workerRef.current = worker;
      worker.onmessage = ({ data }: MessageEvent<InferenceResponse>) => {
        if (workerRef.current !== worker) return;
        if (data.type === 'progress') setLoadingProgress(data.message);
        else if (data.type === 'running') {
          setLoadingModel(false);
          setRunningInference(true);
        } else {
          if (data.type === 'result') {
            setResult(data.text);
            setLatencyMs(data.latencyMs);
          } else setResult(`Execution error: ${data.message}`);
          stopInference();
        }
      };
      worker.onerror = (event) => {
        if (workerRef.current !== worker) return;
        setResult(`Execution error: ${event.message || 'The inference worker failed.'}`);
        stopInference();
      };
      const request: InferenceRequest = { modelId: selectedModelId, text: inputText, device, hasShaderF16 };
      worker.postMessage(request);
    } catch (error) {
      setResult(`Execution error: ${error instanceof Error ? error.message : String(error)}`);
      stopInference();
    }
  };

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Live In-Browser Inference" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm">
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
            onClick={close}
            aria-label="Close inference demo"
            className="h-7 w-7 rounded-md text-[#707070] hover:text-[#EDEDED] hover:bg-[#171717] transition-colors flex items-center justify-center"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 overflow-y-auto text-xs">
          {/* Target Model Selector */}
          <div className="space-y-1">
            <label htmlFor="demo-model" className="text-xs font-normal text-[#A1A1A1]">Target Model</label>
            <Select
              id="demo-model"
              value={selectedModelId}
              onChange={(e) => handleSelectModelChange(e.target.value)}
              options={DEMO_MODELS.map((m) => ({ value: m.id, label: m.name }))}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#707070] px-1">
            <span>Repository: {selectedModelId}</span>
            <span>{hasWebGPU ? 'WebGPU' : 'WASM CPU'}</span>
          </div>

          {/* Text Input */}
          <div className="space-y-1">
            <label htmlFor="demo-prompt" className="text-xs font-normal text-[#A1A1A1]">Input Text / Prompt</label>
            <textarea
              id="demo-prompt"
              disabled={loadingModel || runningInference}
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-[#000000] border border-[#262626] rounded-lg p-2.5 text-xs text-[#EDEDED] placeholder-[#707070] focus:outline-none focus:border-[#4D4D4D]"
            />
          </div>

          {/* Run Button */}
          <button
            onClick={handleRunInference}
            disabled={loadingModel || runningInference || !getDemoModel(selectedModelId) || !inputText.trim()}
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
