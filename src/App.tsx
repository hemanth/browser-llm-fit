import { useState, useEffect, useMemo } from 'react';
import type { HardwareProfile, HardwareSimulation } from './types/hardware';
import type { InBrowserModel, ModelModality } from './types/model';
import { detectHardwareProfile } from './utils/hardwareDetector';
import { evaluateModelCompatibility } from './utils/compatibilityChecker';
import { IN_BROWSER_MODELS } from './data/modelsData';
import type { HardwarePreset } from './data/presetsData';
import { Navbar } from './components/Navbar';
import { HardwareDashboard } from './components/HardwareDashboard';
import { HardwareSimulator } from './components/HardwareSimulator';
import { ModelFilters } from './components/ModelFilters';
import { ModelCard } from './components/ModelCard';
import { ModelTableView } from './components/ModelTableView';
import { CodeSnippetModal } from './components/CodeSnippetModal';
import { LiveBenchmarkModal } from './components/LiveBenchmarkModal';
import { LiveInferenceModal } from './components/LiveInferenceModal';
import { Sparkles, Cpu, Layers, ShieldCheck } from 'lucide-react';

export function App() {
  const [hardware, setHardware] = useState<HardwareProfile | null>(null);
  const [loadingHardware, setLoadingHardware] = useState<boolean>(true);

  // Simulation state
  const [simulation, setSimulation] = useState<HardwareSimulation>({
    isActive: false,
    presetName: undefined,
    ramGB: 16,
    cpuCores: 8,
    gpuBackend: 'webgpu-f16',
    maxStorageBufferMB: 1024,
    storageAvailableGB: 30,
    hasWasmSimd: true,
    downlinkMbps: 100,
  });
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState('all');
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [codeModel, setCodeModel] = useState<InBrowserModel | null>(null);
  const [testModel, setTestModel] = useState<InBrowserModel | null>(null);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [isInferenceOpen, setIsInferenceOpen] = useState(false);

  // Auto-detect hardware on mount
  const loadHardware = async () => {
    setLoadingHardware(true);
    try {
      const profile = await detectHardwareProfile();
      setHardware(profile);

      // Pre-seed simulation state with detected values if user switches to sandbox
      setSimulation((prev) => ({
        ...prev,
        ramGB: profile.reportedRamGB || profile.estimatedRamGB,
        cpuCores: profile.cpuCores,
        gpuBackend: profile.hasWebGPU
          ? (profile.hasShaderF16 ? 'webgpu-f16' : 'webgpu-nof16')
          : 'wasm-cpu',
        maxStorageBufferMB: profile.webgpuLimits
          ? Math.round(profile.webgpuLimits.maxStorageBufferBindingSize / (1024 * 1024))
          : 128,
        storageAvailableGB: profile.storageAvailableGB ?? 25,
        downlinkMbps: profile.downlinkMbps ?? 50,
      }));
    } catch (err) {
      console.error('Failed to detect hardware', err);
    } finally {
      setLoadingHardware(false);
    }
  };

  useEffect(() => {
    loadHardware();
  }, []);

  // Preset selector
  const handleSelectPreset = (preset: HardwarePreset) => {
    setSimulation({
      isActive: true,
      ...preset.config,
    });
  };

  // Update simulation
  const handleUpdateSimulation = (updated: Partial<HardwareSimulation>) => {
    setSimulation((prev) => ({
      ...prev,
      isActive: true,
      ...updated,
    }));
  };

  // Reset simulation to auto-detected
  const handleResetToAutoDetected = () => {
    if (!hardware) return;
    setSimulation({
      isActive: false,
      presetName: undefined,
      ramGB: hardware.reportedRamGB || hardware.estimatedRamGB,
      cpuCores: hardware.cpuCores,
      gpuBackend: hardware.hasWebGPU
        ? (hardware.hasShaderF16 ? 'webgpu-f16' : 'webgpu-nof16')
        : 'wasm-cpu',
      maxStorageBufferMB: hardware.webgpuLimits
        ? Math.round(hardware.webgpuLimits.maxStorageBufferBindingSize / (1024 * 1024))
        : 128,
      storageAvailableGB: hardware.storageAvailableGB ?? 25,
      hasWasmSimd: hardware.hasWasmSimd,
      downlinkMbps: hardware.downlinkMbps ?? 50,
    });
  };

  // Evaluate all models against current hardware / simulation
  const evaluatedModels = useMemo(() => {
    if (!hardware) return [];
    return IN_BROWSER_MODELS.map((model) => {
      const evaluation = evaluateModelCompatibility(model, hardware, simulation);
      return { model, evaluation };
    });
  }, [hardware, simulation]);

  // Compute modalities with counts
  const modalitiesWithCounts = useMemo(() => {
    const list: { id: string; label: string; count: number }[] = [
      { id: 'all', label: 'All Modalities', count: IN_BROWSER_MODELS.length },
    ];
    const mods: ModelModality[] = [
      'LLM / Text',
      'Embeddings',
      'Audio / Speech',
      'Vision & Multimodal',
      'Image Generation',
      'NLP & Classification',
    ];
    mods.forEach((mod) => {
      const count = IN_BROWSER_MODELS.filter((m) => m.modality === mod).length;
      list.push({ id: mod, label: mod, count });
    });
    return list;
  }, []);

  // Compute unique frameworks
  const frameworks = useMemo(() => {
    return Array.from(new Set(IN_BROWSER_MODELS.map((m) => m.framework)));
  }, []);

  // Filter and sort models
  const filteredAndSorted = useMemo(() => {
    let list = evaluatedModels.filter(({ model, evaluation }) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = model.name.toLowerCase().includes(q);
        const matchDev = model.developer.toLowerCase().includes(q);
        const matchFam = model.family.toLowerCase().includes(q);
        const matchDesc = model.description.toLowerCase().includes(q);
        const matchUse = model.useCases.some((u) => u.toLowerCase().includes(q));
        if (!matchName && !matchDev && !matchFam && !matchDesc && !matchUse) {
          return false;
        }
      }

      // Modality
      if (selectedModality !== 'all' && model.modality !== selectedModality) {
        return false;
      }

      // Framework
      if (selectedFramework !== 'all' && model.framework !== selectedFramework) {
        return false;
      }

      // Compatibility Tier
      if (selectedTier !== 'all') {
        if (selectedTier === 'smooth' && evaluation.tier !== 'smooth') return false;
        if (selectedTier === 'moderate' && (evaluation.tier !== 'moderate' && evaluation.tier !== 'tight')) return false;
        if (selectedTier === 'incompatible' && evaluation.tier !== 'incompatible') return false;
      }

      return true;
    });

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case 'recommended':
          return b.evaluation.score - a.evaluation.score;
        case 'size-asc':
          return a.model.downloadSizeMB - b.model.downloadSizeMB;
        case 'size-desc':
          return b.model.downloadSizeMB - a.model.downloadSizeMB;
        case 'params-asc':
          return a.model.paramValueMillion - b.model.paramValueMillion;
        case 'params-desc':
          return b.model.paramValueMillion - a.model.paramValueMillion;
        case 'ram-asc':
          return a.model.minRamGB - b.model.minRamGB;
        default:
          return 0;
      }
    });

    return list;
  }, [evaluatedModels, searchQuery, selectedModality, selectedFramework, selectedTier, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        hardware={hardware}
        simulation={simulation}
        onToggleSimulator={() => setIsSimulatorOpen(!isSimulatorOpen)}
        onRefreshHardware={loadHardware}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
        onOpenInference={() => {
          setTestModel(null);
          setIsInferenceOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Introduction */}
        <div className="text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-400 text-xs font-semibold mb-2 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Real-Time In-Browser AI Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Can My Browser Run It?
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Auto-detects your CPU, WebGPU, RAM, and buffer limits. Instantly see which LLMs, speech models, vision models, and embeddings run smoothly on your machine.
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <button
              onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 shadow-sm"
            >
              <Cpu className="h-4 w-4 text-amber-400" />
              <span>{isSimulatorOpen ? 'Hide Simulator' : 'Hardware Simulator'}</span>
            </button>

            <button
              onClick={() => setIsBenchmarkOpen(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white transition-all flex items-center gap-2 shadow-lg shadow-cyan-900/30"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>GPU Diagnostic Test</span>
            </button>
          </div>
        </div>

        {/* Hardware Dashboard Card */}
        <HardwareDashboard
          hardware={hardware}
          simulation={simulation}
          loading={loadingHardware}
          onOpenBenchmark={() => setIsBenchmarkOpen(true)}
        />

        {/* Hardware Simulator Drawer */}
        {isSimulatorOpen && (
          <HardwareSimulator
            simulation={simulation}
            onUpdateSimulation={handleUpdateSimulation}
            onSelectPreset={handleSelectPreset}
            onResetToAutoDetected={handleResetToAutoDetected}
          />
        )}

        {/* Model Catalog Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="h-6 w-6 text-cyan-400" />
                Browser AI Models Catalog
              </h2>
              <p className="text-xs text-slate-400">
                Models evaluated dynamically against your active hardware configuration
              </p>
            </div>
          </div>

          {/* Search, Modality, Framework Filters */}
          <ModelFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedModality={selectedModality}
            onSelectModality={setSelectedModality}
            selectedFramework={selectedFramework}
            onSelectFramework={setSelectedFramework}
            selectedTier={selectedTier}
            onSelectTier={setSelectedTier}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalModels={IN_BROWSER_MODELS.length}
            filteredCount={filteredAndSorted.length}
            modalities={modalitiesWithCounts}
            frameworks={frameworks}
          />

          {/* Model Display (Grid or Table) */}
          {filteredAndSorted.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
              <p className="text-sm font-semibold text-slate-300">No models match your current filters.</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting your search query or selecting "All Statuses".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedModality('all');
                  setSelectedFramework('all');
                  setSelectedTier('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-cyan-400 hover:bg-slate-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAndSorted.map(({ model, evaluation }) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  evaluation={evaluation}
                  onOpenCode={(m) => setCodeModel(m)}
                  onTestLive={(m) => {
                    setTestModel(m);
                    setIsInferenceOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <ModelTableView
              modelsWithEval={filteredAndSorted}
              onOpenCode={(m) => setCodeModel(m)}
              onTestLive={(m) => {
                setTestModel(m);
                setIsInferenceOpen(true);
              }}
            />
          )}
        </div>

        {/* Technology Deep-Dive & Architecture Info */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            How In-Browser AI Execution Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong className="text-cyan-400 block text-xs mb-1">WebGPU & WGSL Compute</strong>
              Direct access to device GPU compute shaders. Bypasses WebGL overhead and executes half-precision FP16 matrix operations natively, enabling up to 60+ tokens/sec on Apple Silicon and modern discrete GPUs.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong className="text-indigo-400 block text-xs mb-1">ONNX Runtime Web & Transformers.js</strong>
              Provides full Hugging Face pipeline ergonomics directly in JavaScript. Models are downloaded and cached permanently in the browser's Cache/IndexedDB storage for 100% offline execution.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong className="text-emerald-400 block text-xs mb-1">WebAssembly (WASM SIMD) Fallback</strong>
              For devices without WebGPU or restrictive browser flags, models fall back to highly optimized 128-bit SIMD vector instructions on the CPU via llama.cpp or ONNX CPU runtimes.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} LLM Locally • 100% Private, Client-Side Device Profiler</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Zero data sent to servers • All detection performed locally</span>
          </div>
        </div>
      </footer>

      {/* Code Snippet Modal */}
      <CodeSnippetModal
        model={codeModel}
        onClose={() => setCodeModel(null)}
      />

      {/* Live GPU Benchmark Modal */}
      <LiveBenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />

      {/* Live In-Browser Model Runner Modal */}
      <LiveInferenceModal
        model={testModel}
        isOpen={isInferenceOpen}
        onClose={() => {
          setIsInferenceOpen(false);
          setTestModel(null);
        }}
        hasWebGPU={hardware?.hasWebGPU ?? false}
      />
    </div>
  );
}

export default App;
