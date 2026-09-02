import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
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
    : '// Built-in browser feature (no package install needed)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm">
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold tracking-[-0.28px] text-[#EDEDED]">
              {model.name}
            </h3>
            <span className="text-[11px] font-mono text-[#707070]">
              ({model.framework})
            </span>
          </div>

          <button
            onClick={onClose}
            className="h-7 w-7 rounded-md text-[#707070] hover:text-[#EDEDED] hover:bg-[#171717] transition-colors flex items-center justify-center"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-4 py-2 bg-[#000000] border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setActiveTab('code')}
              className={`h-7 px-2.5 rounded-md transition-colors ${
                activeTab === 'code'
                  ? 'bg-[#171717] text-[#EDEDED] font-medium'
                  : 'text-[#707070] hover:text-[#EDEDED]'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab('install')}
              className={`h-7 px-2.5 rounded-md transition-colors ${
                activeTab === 'install'
                  ? 'bg-[#171717] text-[#EDEDED] font-medium'
                  : 'text-[#707070] hover:text-[#EDEDED]'
              }`}
            >
              Installation
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="h-7 px-2.5 rounded-md bg-[#171717] hover:bg-[#262626] text-[#EDEDED] border border-[#333333] transition-colors text-xs flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#398E4A]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-[#707070]" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-y-auto bg-[#000000] font-mono text-xs text-[#EDEDED] leading-relaxed">
          {activeTab === 'code' ? (
            <pre className="whitespace-pre-wrap">{model.codeSnippet.code}</pre>
          ) : (
            <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#262626] text-[#EDEDED]">
              {installCommand}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0A0A0A] border-t border-[#262626] flex items-center justify-between text-xs text-[#707070]">
          <span>Required Backend: <strong className="text-[#EDEDED] font-medium">{model.requiresWebGPU ? 'WebGPU' : 'WebGPU / WASM'}</strong></span>
          {model.hfUrl && (
            <a
              href={model.hfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#EDEDED] hover:underline flex items-center gap-1 text-xs"
            >
              <span>Hugging Face</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
