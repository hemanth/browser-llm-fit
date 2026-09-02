import React from 'react';
import type { InBrowserModel, CompatibilityEvaluation } from '../types/model';
import { CheckCircle2, AlertTriangle, XCircle, Code, ExternalLink, Play } from 'lucide-react';

interface ModelTableViewProps {
  modelsWithEval: { model: InBrowserModel; evaluation: CompatibilityEvaluation }[];
  onOpenCode: (model: InBrowserModel) => void;
  onTestLive: (model: InBrowserModel) => void;
}

export const ModelTableView: React.FC<ModelTableViewProps> = ({
  modelsWithEval,
  onOpenCode,
  onTestLive,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Status & Score</th>
              <th className="py-3 px-4">Model & Developer</th>
              <th className="py-3 px-4">Modality</th>
              <th className="py-3 px-4">Framework</th>
              <th className="py-3 px-4">Params</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Memory Req</th>
              <th className="py-3 px-4">Est. Speed</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {modelsWithEval.map(({ model, evaluation }) => {
              const tierBadge = {
                smooth: { bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700', icon: CheckCircle2 },
                moderate: { bg: 'bg-cyan-950/80 text-cyan-300 border-cyan-700', icon: CheckCircle2 },
                tight: { bg: 'bg-amber-950/80 text-amber-300 border-amber-700', icon: AlertTriangle },
                incompatible: { bg: 'bg-rose-950/80 text-rose-300 border-rose-700', icon: XCircle }
              }[evaluation.tier];

              const Icon = tierBadge.icon;

              return (
                <tr key={model.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Status & Score */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${tierBadge.bg}`}>
                        <Icon className="h-3 w-3" />
                        <span>{evaluation.headline}</span>
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        {evaluation.score}%
                      </span>
                    </div>
                  </td>

                  {/* Model & Developer */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{model.name}</div>
                    <div className="text-[11px] text-slate-400">{model.developer}</div>
                  </td>

                  {/* Modality */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[11px]">
                      {model.modality}
                    </span>
                  </td>

                  {/* Framework */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                    <span className="font-mono text-[11px]">{model.framework}</span>
                    <span className="text-[10px] text-slate-500 block font-mono">{model.quantization}</span>
                  </td>

                  {/* Params */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-200">
                    {model.paramCount}
                  </td>

                  {/* Download Size */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-200">
                    {model.downloadSizeMB === 0 ? 'Chrome Native' : `${model.downloadSizeMB} MB`}
                  </td>

                  {/* Memory Req */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 text-[11px]">
                    <div>{model.minRamGB}GB RAM</div>
                    <div className="text-[10px] text-slate-500">Buffer: {model.minStorageBufferMB}MB</div>
                  </td>

                  {/* Speed */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-300 text-[11px]">
                    {evaluation.estimatedSpeed}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {model.hfUrl && (
                        <a
                          href={model.hfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                          title="Hugging Face Card"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => onOpenCode(model)}
                        className="px-2 py-1 rounded-lg bg-slate-800 text-cyan-300 hover:bg-slate-700 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                      >
                        <Code className="h-3 w-3" />
                        <span>Code</span>
                      </button>
                      {model.testModelId && evaluation.tier !== 'incompatible' && (
                        <button
                          onClick={() => onTestLive(model)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-all text-xs font-bold flex items-center gap-1"
                        >
                          <Play className="h-3 w-3 fill-white" />
                          <span>Test</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
