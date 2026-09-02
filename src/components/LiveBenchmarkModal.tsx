import React, { useState } from 'react';
import { X, Play } from 'lucide-react';
import type { BenchmarkResults } from '../utils/webgpuBenchmark';
import { runHardwareDiagnostics } from '../utils/webgpuBenchmark';

interface LiveBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveBenchmarkModal: React.FC<LiveBenchmarkModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<BenchmarkResults | null>(null);

  if (!isOpen) return null;

  const handleStartBenchmark = async () => {
    setRunning(true);
    setResults(null);
    try {
      const res = await runHardwareDiagnostics();
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm">
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#262626] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-[-0.28px] text-[#EDEDED]">
              GPU Diagnostics & Buffer Allocation
            </h3>
            <p className="text-xs text-[#707070] mt-0.5">
              Live WebGPU buffer memory and compute shader tests.
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
        <div className="p-5 space-y-4 overflow-y-auto">
          {!results && !running && (
            <div className="text-center py-6 space-y-3">
              <p className="text-xs text-[#8F8F8F] max-w-sm mx-auto leading-relaxed">
                Directly tests your browser's WebGPU device by progressively allocating VRAM storage buffers (32MB to 2048MB) and measuring compute shader matrix multiplication throughput.
              </p>
              <button
                onClick={handleStartBenchmark}
                className="h-9 px-4 rounded-md bg-[#EDEDED] hover:bg-[#FFFFFF] text-[#000000] text-xs font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run Diagnostic Test</span>
              </button>
            </div>
          )}

          {running && (
            <div className="text-center py-8 space-y-2">
              <div className="inline-block h-6 w-6 border-2 border-[#EDEDED] border-t-transparent rounded-full animate-spin"></div>
              <div className="text-xs font-medium text-[#EDEDED]">Executing WebGPU Shaders...</div>
              <p className="text-[11px] text-[#707070]">Testing storage buffer bindings and compute passes</p>
            </div>
          )}

          {results && (
            <div className="space-y-4">
              {/* Summary Block */}
              <div className="p-4 rounded-lg bg-[#000000] border border-[#262626] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${results.webgpuSupported ? 'bg-[#398E4A]' : 'bg-[#E5484D]'}`}></span>
                    <span className="text-xs font-medium text-[#EDEDED]">
                      {results.webgpuSupported ? 'WebGPU Fully Supported' : 'WebGPU Unavailable'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#707070] mt-1">
                    Max Allocatable Buffer: <span className="text-[#EDEDED]">{results.maxAllocatableBufferMB} MB</span>
                  </div>
                </div>

                {results.gflops && (
                  <div className="text-right">
                    <div className="text-sm font-mono font-medium text-[#EDEDED]">
                      ~{results.gflops} GFLOPS
                    </div>
                    <div className="text-[10px] text-[#707070]">Throughput</div>
                  </div>
                )}
              </div>

              {/* Buffer allocation tests */}
              <div>
                <span className="text-[11px] text-[#707070] block mb-2">
                  Buffer allocation stages
                </span>
                <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
                  {results.testedSizesMB.map((t) => (
                    <div
                      key={t.sizeMB}
                      className={`p-2 rounded border text-center ${
                        t.success
                          ? 'bg-[#121212] border-[#262626] text-[#EDEDED]'
                          : 'bg-[#000000] border-[#1F1F1F] text-[#4D4D4D]'
                      }`}
                    >
                      <div className="font-medium">{t.sizeMB}M</div>
                      <div className="text-[10px] text-[#707070] mt-0.5">
                        {t.success ? `${t.timeMs}ms` : 'fail'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnostic notes */}
              {results.notes.length > 0 && (
                <div className="p-3 bg-[#000000] rounded-lg border border-[#262626] text-[11px] font-mono space-y-1 text-[#A1A1A1]">
                  {results.notes.map((n, i) => (
                    <div key={i} className="text-[#8F8F8F]">
                      &gt; {n}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleStartBenchmark}
                className="w-full h-8 rounded-md bg-[#171717] hover:bg-[#262626] text-[#EDEDED] border border-[#262626] text-xs font-normal transition-colors"
              >
                Run Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
