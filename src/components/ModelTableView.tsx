import React from 'react';
import type { InBrowserModel, CompatibilityEvaluation } from '../types/model';
import { ExternalLink, Code, Play } from 'lucide-react';

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
    <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl overflow-hidden">
      {/* Mobile Card List View (< 768px) */}
      <div className="block md:hidden divide-y divide-[#1F1F1F]">
        {modelsWithEval.map(({ model, evaluation }) => {
          const dotColor = {
            smooth: 'bg-[#398E4A]',
            moderate: 'bg-[#398E4A]',
            tight: 'bg-[#FF990A]',
            incompatible: 'bg-[#E5484D]'
          }[evaluation.tier];

          return (
            <div key={model.id} className="p-4 space-y-3">
              {/* Header: Status and External Link */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                  <span className="text-xs font-medium text-[#EDEDED]">{evaluation.headline}</span>
                  <span className="font-mono text-[#707070] text-[11px]">• {evaluation.score}%</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono text-[#707070] px-1.5 py-0.5 rounded bg-[#171717]">
                    {model.framework}
                  </span>
                  {model.hfUrl && (
                    <a
                      href={model.hfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-[#707070] hover:text-[#EDEDED]"
                      title="Hugging Face"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Title & Modality */}
              <div>
                <h3 className="text-sm font-semibold text-[#EDEDED]">{model.name}</h3>
                <div className="flex items-center space-x-2 text-xs text-[#707070] mt-0.5">
                  <span>{model.developer}</span>
                  <span>•</span>
                  <span>{model.modality}</span>
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#000000] border border-[#1F1F1F] text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#707070] block font-sans">Params</span>
                  <span className="text-[#EDEDED]">{model.paramCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#707070] block font-sans">Download</span>
                  <span className="text-[#EDEDED]">{model.downloadSizeMB === 0 ? '0 MB' : `${model.downloadSizeMB} MB`}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#707070] block font-sans">Min RAM</span>
                  <span className="text-[#EDEDED]">{model.minRamGB} GB</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => onOpenCode(model)}
                  className="flex-1 h-8 rounded-md bg-[#171717] hover:bg-[#262626] text-[#EDEDED] border border-[#333333] transition-colors flex items-center justify-center gap-1.5 text-xs font-medium"
                >
                  <Code className="h-3.5 w-3.5" />
                  <span>Code Snippet</span>
                </button>

                {model.testModelId && evaluation.tier !== 'incompatible' && (
                  <button
                    onClick={() => onTestLive(model)}
                    className="flex-1 h-8 rounded-md bg-[#EDEDED] hover:bg-[#FFFFFF] text-[#000000] transition-colors flex items-center justify-center gap-1.5 text-xs font-medium"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Test In-Browser</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (>= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#262626] text-[#707070] font-normal text-[11px]">
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Model</th>
              <th className="py-2.5 px-4">Modality</th>
              <th className="py-2.5 px-4">Framework</th>
              <th className="py-2.5 px-4">Params</th>
              <th className="py-2.5 px-4">Size</th>
              <th className="py-2.5 px-4">RAM</th>
              <th className="py-2.5 px-4">Throughput</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F1F1F]">
            {modelsWithEval.map(({ model, evaluation }) => {
              const dotColor = {
                smooth: 'bg-[#398E4A]',
                moderate: 'bg-[#398E4A]',
                tight: 'bg-[#FF990A]',
                incompatible: 'bg-[#E5484D]'
              }[evaluation.tier];

              return (
                <tr key={model.id} className="hover:bg-[#121212] transition-colors">
                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                      <span className="text-[#EDEDED] font-medium">{evaluation.headline}</span>
                      <span className="font-mono text-[#707070] text-[11px]">• {evaluation.score}%</span>
                    </div>
                  </td>

                  {/* Model */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#EDEDED]">{model.name}</div>
                    <div className="text-[11px] text-[#707070]">{model.developer}</div>
                  </td>

                  {/* Modality */}
                  <td className="py-3 px-4 whitespace-nowrap text-[#A1A1A1]">
                    {model.modality}
                  </td>

                  {/* Framework */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[#A1A1A1] text-[11px]">
                    <div>{model.framework}</div>
                    <div className="text-[#707070] text-[10px]">{model.quantization}</div>
                  </td>

                  {/* Params */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[#EDEDED]">
                    {model.paramCount}
                  </td>

                  {/* Size */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[#A1A1A1]">
                    {model.downloadSizeMB === 0 ? 'Built-in' : `${model.downloadSizeMB} MB`}
                  </td>

                  {/* RAM */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[#A1A1A1]">
                    {model.minRamGB} GB
                  </td>

                  {/* Speed */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[#A1A1A1]">
                    {evaluation.estimatedSpeed}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {model.hfUrl && (
                        <a
                          href={model.hfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="h-7 w-7 rounded-md bg-transparent text-[#707070] hover:text-[#EDEDED] border border-[#262626] hover:bg-[#171717] transition-colors flex items-center justify-center"
                          title="Hugging Face"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <button
                        onClick={() => onOpenCode(model)}
                        className="h-7 px-2 rounded-md bg-transparent text-[#A1A1A1] hover:text-[#EDEDED] border border-[#262626] hover:bg-[#171717] transition-colors flex items-center gap-1"
                      >
                        <Code className="h-3 w-3" />
                        <span>Code</span>
                      </button>
                      {model.testModelId && evaluation.tier !== 'incompatible' && (
                        <button
                          onClick={() => onTestLive(model)}
                          className="h-7 px-2.5 rounded-md bg-[#EDEDED] text-[#000000] hover:bg-[#FFFFFF] transition-colors flex items-center gap-1 font-medium"
                        >
                          <Play className="h-3 w-3 fill-current" />
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
