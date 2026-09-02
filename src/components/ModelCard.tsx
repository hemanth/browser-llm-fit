import React, { useState } from 'react';
import { 
  Code, 
  ExternalLink, 
  Play, 
  ChevronDown, 
  ChevronUp, 
} from 'lucide-react';
import type { InBrowserModel, CompatibilityEvaluation } from '../types/model';

interface ModelCardProps {
  model: InBrowserModel;
  evaluation: CompatibilityEvaluation;
  onOpenCode: (model: InBrowserModel) => void;
  onTestLive?: (model: InBrowserModel) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  evaluation,
  onOpenCode,
  onTestLive,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Vercel small status dot
  const statusDot = {
    smooth: { dot: 'bg-[#398E4A]', label: 'Ready' },
    moderate: { dot: 'bg-[#398E4A]', label: 'Compatible' },
    tight: { dot: 'bg-[#FF990A]', label: 'Tight fit' },
    incompatible: { dot: 'bg-[#E5484D]', label: 'Unsupported' }
  }[evaluation.tier];

  return (
    <div className="bg-[#0A0A0A] border border-[#262626] hover:border-[#383838] transition-colors rounded-xl flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          {/* Status Dot + Label */}
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${statusDot.dot}`}></span>
            <span className="text-xs font-medium text-[#EDEDED]">{statusDot.label}</span>
            <span className="text-[11px] font-mono text-[#707070]">• {evaluation.score}%</span>
          </div>

          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#121212] text-[#8F8F8F] border border-[#262626]">
            {model.framework}
          </span>
        </div>

        {/* Title & Metadata */}
        <div>
          <h4 className="text-sm font-semibold tracking-[-0.28px] text-[#EDEDED]">
            {model.name}
          </h4>
          <div className="text-xs font-normal text-[#707070] mt-0.5">
            {model.developer} • {model.modality}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#8F8F8F] mt-2 line-clamp-2 leading-relaxed">
          {model.description}
        </p>

        {/* Spec Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded bg-[#121212] text-[#A1A1A1] border border-[#1F1F1F]">
            {model.paramCount}
          </span>
          <span className="px-2 py-0.5 rounded bg-[#121212] text-[#A1A1A1] border border-[#1F1F1F]">
            {model.quantization}
          </span>
          <span className="px-2 py-0.5 rounded bg-[#121212] text-[#A1A1A1] border border-[#1F1F1F]">
            {model.format}
          </span>
        </div>

        {/* Metric Specs */}
        <div className="mt-4 pt-3 border-t border-[#1F1F1F] space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-[#A1A1A1]">
            <span className="text-[#707070]">Est. Throughput:</span>
            <span className="font-mono text-[#EDEDED]">{evaluation.estimatedSpeed}</span>
          </div>
          <div className="flex justify-between items-center text-[#A1A1A1]">
            <span className="text-[#707070]">Download Size:</span>
            <span className="font-mono text-[#EDEDED]">
              {model.downloadSizeMB === 0 ? 'Built-in (0 MB)' : `${model.downloadSizeMB} MB`}
            </span>
          </div>
          <div className="flex justify-between items-center text-[#A1A1A1]">
            <span className="text-[#707070]">Required RAM:</span>
            <span className="font-mono text-[#EDEDED]">{model.minRamGB} GB</span>
          </div>
        </div>

        {/* Diagnostics Accordion */}
        <div className="mt-3 pt-2 border-t border-[#1F1F1F]">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-[11px] font-normal text-[#707070] hover:text-[#EDEDED] transition-colors"
          >
            <span>Hardware checks ({evaluation.checks.filter(c => c.passed).length}/{evaluation.checks.length})</span>
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {expanded && (
            <div className="mt-2 p-2.5 rounded-lg bg-[#000000] border border-[#1F1F1F] space-y-1.5 text-xs">
              {evaluation.checks.map((check, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-[11px]">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${check.passed ? 'bg-[#398E4A]' : check.severity === 'warning' ? 'bg-[#FF990A]' : 'bg-[#E5484D]'}`}></span>
                  <div className="text-[#A1A1A1]">
                    <span className="text-[#EDEDED] font-medium">{check.name}: </span>
                    <span className="text-[#707070]">{check.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-3 bg-[#0A0A0A] border-t border-[#1F1F1F] flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          {model.hfUrl && (
            <a
              href={model.hfUrl}
              target="_blank"
              rel="noreferrer"
              className="h-7 w-7 rounded-md bg-transparent text-[#707070] hover:text-[#EDEDED] border border-[#262626] hover:bg-[#171717] transition-colors flex items-center justify-center"
              title="View on Hugging Face"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <button
            onClick={() => onOpenCode(model)}
            className="h-7 px-2.5 rounded-md bg-transparent text-[#A1A1A1] hover:text-[#EDEDED] border border-[#262626] hover:bg-[#171717] transition-colors text-xs font-normal flex items-center gap-1.5"
          >
            <Code className="h-3 w-3 text-[#707070]" />
            <span>Code</span>
          </button>
        </div>

        {model.testModelId && evaluation.tier !== 'incompatible' ? (
          <button
            onClick={() => onTestLive && onTestLive(model)}
            className="h-7 px-3 rounded-md bg-[#EDEDED] hover:bg-[#FFFFFF] text-[#000000] text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Run Test</span>
          </button>
        ) : (
          <span className="text-[11px] font-mono text-[#707070]">
            {evaluation.recommendedBackend}
          </span>
        )}
      </div>
    </div>
  );
};
