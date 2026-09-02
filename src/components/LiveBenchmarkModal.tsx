import React, { useState } from 'react';
import { X, Activity, Play, CheckCircle2, XCircle, ShieldCheck, Zap, HardDrive } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Live WebGPU Hardware Stress Test
              </h3>
              <p className="text-xs text-slate-400">
                Directly allocates GPU memory buffers and dispatches WGSL matrix multiplication shaders
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {!results && !running && (
            <div className="text-center py-6">
              <ShieldCheck className="h-12 w-12 text-cyan-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white mb-1">
                Verify In-Browser GPU Capabilities
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5 leading-relaxed">
                This test creates real WebGPU buffer storage structures and benchmarks compute shader execution throughput on your device.
              </p>
              <button
                onClick={handleStartBenchmark}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 mx-auto shadow-lg shadow-cyan-900/30 transition-all"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Start Diagnostics & Stress Test</span>
              </button>
            </div>
          )}

          {running && (
            <div className="text-center py-10 space-y-3">
              <div className="inline-block h-10 w-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-sm font-bold text-white">Testing GPU Buffers & Compute Shaders...</div>
              <p className="text-xs text-slate-400">Allocating storage buffers and running WGSL matrix math</p>
            </div>
          )}

          {results && (
            <div className="space-y-4">
              {/* Summary Score Banner */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${results.webgpuSupported ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {results.webgpuSupported ? <Zap className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {results.webgpuSupported ? 'WebGPU Fully Operational' : 'WebGPU Unavailable'}
                    </div>
                    <div className="text-xs text-slate-400">
                      Max verified buffer: <strong className="text-cyan-400 font-mono">{results.maxAllocatableBufferMB} MB</strong>
                    </div>
                  </div>
                </div>

                {results.gflops && (
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold text-emerald-400">
                      ~{results.gflops} GFLOPS
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      Compute Throughput
                    </div>
                  </div>
                )}
              </div>

              {/* Buffer allocation tests */}
              <div>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5 text-cyan-400" />
                  Live Storage Buffer Allocations
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {results.testedSizesMB.map((t) => (
                    <div
                      key={t.sizeMB}
                      className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                        t.success
                          ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{t.sizeMB} MB</span>
                        {t.success ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-slate-600" />
                        )}
                      </div>
                      <span className="text-[10px] font-mono mt-1 text-slate-400">
                        {t.success ? `${t.timeMs} ms` : 'Exceeds limit'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnostic notes */}
              {results.notes.length > 0 && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-1">
                    Telemetry Logs
                  </span>
                  {results.notes.map((n, i) => (
                    <div key={i} className="text-slate-300">
                      &gt; {n}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleStartBenchmark}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
              >
                Re-run Benchmark
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
