import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Code, 
  ExternalLink, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Download, 
  Zap 
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

  // Badge styling based on tier
  const tierConfig = {
    smooth: {
      border: 'border-emerald-500/40 hover:border-emerald-500/70',
      badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80',
      icon: CheckCircle2,
      scoreColor: 'text-emerald-400',
      glow: 'shadow-emerald-950/20'
    },
    moderate: {
      border: 'border-cyan-500/30 hover:border-cyan-500/60',
      badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/80',
      icon: CheckCircle2,
      scoreColor: 'text-cyan-400',
      glow: 'shadow-cyan-950/20'
    },
    tight: {
      border: 'border-amber-500/40 hover:border-amber-500/70',
      badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-700/80',
      icon: AlertTriangle,
      scoreColor: 'text-amber-400',
      glow: 'shadow-amber-950/20'
    },
    incompatible: {
      border: 'border-rose-500/30 hover:border-rose-500/50 opacity-75 hover:opacity-100',
      badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-700/80',
      icon: XCircle,
      scoreColor: 'text-rose-400',
      glow: 'shadow-rose-950/20'
    }
  }[evaluation.tier];

  const TierIcon = tierConfig.icon;

  return (
    <div
      className={`bg-slate-900/85 rounded-2xl border ${tierConfig.border} transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xl ${tierConfig.glow}`}
    >
      {/* Top Banner / Compatibility Pill */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${tierConfig.badgeBg}`}
            >
              <TierIcon className="h-3.5 w-3.5" />
              <span>{evaluation.headline}</span>
            </span>
            <span className={`text-xs font-mono font-bold ${tierConfig.scoreColor}`}>
              {evaluation.score}% Match
            </span>
          </div>

          {/* Framework pill */}
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
            {model.framework}
          </span>
        </div>

        {/* Model Title & Developer */}
        <div>
          <h4 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
            {model.name}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span>By <strong className="text-slate-300 font-medium">{model.developer}</strong></span>
            <span>•</span>
            <span className="text-cyan-400 font-medium">{model.modality}</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
          {model.description}
        </p>

        {/* Spec Pill Tags (Parameters, Quantization, Format) */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-indigo-900/50">
            {model.paramCount} Params
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-amber-900/50">
            {model.quantization}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
            {model.format}
          </span>
          {model.contextWindow && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-purple-300 border border-purple-900/50">
              {model.contextWindow.toLocaleString()} ctx
            </span>
          )}
        </div>

        {/* Estimated Speed & Download Performance Metrics */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Est. Inference Speed:
            </span>
            <span className="font-semibold text-slate-200 font-mono">
              {evaluation.estimatedSpeed}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              Weight Size:
            </span>
            <span className="font-semibold text-slate-200 font-mono">
              {model.downloadSizeMB === 0 ? '0 MB (Chrome Native)' : `${model.downloadSizeMB} MB`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-indigo-400" />
              Min Memory Req:
            </span>
            <span className="font-mono text-slate-300">
              {model.minRamGB}GB RAM {model.minVramGB > 0 ? `• ${model.minVramGB}GB VRAM` : ''}
            </span>
          </div>

          {model.downloadSizeMB > 0 && (
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-900 flex justify-between">
              <span>Est. download duration:</span>
              <span className="text-cyan-400">{evaluation.estimatedDownloadTime}</span>
            </div>
          )}
        </div>

        {/* Hardware Compatibility Breakdown Drawer */}
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-400 hover:text-slate-200 py-1 transition-colors"
          >
            <span>Compatibility Breakdown ({evaluation.checks.filter(c => c.passed).length}/{evaluation.checks.length} checks passed)</span>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {expanded && (
            <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              {evaluation.checks.map((check, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  {check.passed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  ) : check.severity === 'warning' ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-rose-400 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold text-slate-300 text-[11px]">{check.name}: </span>
                    <span className="text-[11px] text-slate-400 leading-snug">{check.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Buttons Footer */}
      <div className="p-4 pt-3 bg-slate-950/40 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {model.hfUrl && (
            <a
              href={model.hfUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-xs"
              title="View on Hugging Face"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          <button
            onClick={() => onOpenCode(model)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-xs font-semibold flex items-center gap-1.5"
            title="View ready-to-run JavaScript / HTML code snippet"
          >
            <Code className="h-3.5 w-3.5 text-cyan-400" />
            <span>Code</span>
          </button>
        </div>

        {/* Live In-Browser Test Button */}
        {model.testModelId && evaluation.tier !== 'incompatible' ? (
          <button
            onClick={() => onTestLive && onTestLive(model)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500 transition-all text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-900/20"
          >
            <Play className="h-3 w-3 fill-white" />
            <span>Test Live</span>
          </button>
        ) : (
          <span className="text-[11px] font-medium text-slate-500 font-mono">
            {evaluation.recommendedBackend}
          </span>
        )}
      </div>
    </div>
  );
};
