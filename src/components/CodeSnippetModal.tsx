import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, ExternalLink } from 'lucide-react';
import type { InBrowserModel } from '../types/model';

interface CodeSnippetModalProps {
  model: InBrowserModel | null;
  onClose: () => void;
}

export const CodeSnippetModal: React.FC<CodeSnippetModalProps> = ({
  model,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'install'>('code');

  if (!model) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(model.codeSnippet.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const installCommand = model.framework === 'Transformers.js'
    ? 'npm install @huggingface/transformers'
    : model.framework === 'WebLLM'
    ? 'npm install @mlc-ai/web-llm'
    : model.framework === 'Wllama'
    ? 'npm install @wllama/wllama'
    : model.framework === 'TensorFlow.js'
    ? 'npm install @tensorflow/tfjs'
    : '// Built-in browser feature (no npm package required)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {model.name}
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {model.framework}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Run in your browser or web application
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

        {/* Tabs & Copy Button */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'code'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Implementation Code
            </button>
            <button
              onClick={() => setActiveTab('install')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'install'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Installation Command
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30 transition-all text-xs font-semibold flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-5 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed">
          {activeTab === 'code' ? (
            <pre className="whitespace-pre-wrap">{model.codeSnippet.code}</pre>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span>Run this in your project terminal:</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-cyan-300 font-mono">
                {installCommand}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Backend required: <strong className="text-slate-200">{model.requiresWebGPU ? 'WebGPU' : 'WebGPU or WASM'}</strong></span>
          {model.hfUrl && (
            <a
              href={model.hfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Hugging Face Model Card</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
