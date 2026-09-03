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
import { NpmModuleSection } from './components/NpmModuleSection';
import { Terminal } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Modals
  const [codeModel, setCodeModel] = useState<InBrowserModel | null>(null);
  const [testModel, setTestModel] = useState<InBrowserModel | null>(null);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [isInferenceOpen, setIsInferenceOpen] = useState(false);

  const syncProfileToState = (profile: HardwareProfile) => {
    setHardware(profile);
    setLoadingHardware(false);
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
  };

  const refreshHardware = () => {
    setLoadingHardware(true);
    detectHardwareProfile().then(syncProfileToState).catch(console.error);
  };

  useEffect(() => {
    let active = true;
    detectHardwareProfile().then((profile) => {
      if (active) syncProfileToState(profile);
    }).catch(console.error);
    return () => {
      active = false;
    };
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
    <div className="min-h-screen bg-[#000000] text-[#EDEDED] flex flex-col selection:bg-[#EDEDED] selection:text-[#000000]">
      {/* Top Navbar */}
      <Navbar
        hardware={hardware}
        simulation={simulation}
        onToggleSimulator={() => setIsSimulatorOpen(!isSimulatorOpen)}
        onRefreshHardware={refreshHardware}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
        onOpenInference={() => {
          setTestModel(null);
          setIsInferenceOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-5 sm:space-y-7">
        {/* Minimal Hero Header with Vercel Typographic Hierarchy */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 sm:gap-4 pb-3 border-b border-[#1F1F1F]">
          <div>
            <h1 className="text-2xl sm:text-4xl text-[#EDEDED] font-semibold tracking-[-1.2px] sm:tracking-[-2.28px]">
              Can your browser run it?
            </h1>
            <p className="text-xs sm:text-sm text-[#707070] mt-1 sm:mt-1.5 max-w-xl leading-relaxed">
              Auto-detects WebGPU memory limits, shader features, and WASM threads to determine which AI models run directly inside your browser tab without terminal installs.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <a
              href="#npm-module"
              className="hidden md:flex h-8 px-3 rounded-md text-xs font-medium bg-transparent hover:bg-[#171717] text-[#A1A1A1] hover:text-[#EDEDED] border border-[#262626] transition-colors items-center gap-1.5"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>npm module</span>
            </a>
            <button
              onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
              className="flex-1 sm:flex-none h-8 px-3 rounded-md text-xs font-medium bg-[#171717] hover:bg-[#262626] text-[#EDEDED] border border-[#333333] transition-colors text-center"
            >
              {isSimulatorOpen ? 'Hide Simulator' : 'Hardware Simulator'}
            </button>
            <button
              onClick={() => setIsBenchmarkOpen(true)}
              className="flex-1 sm:flex-none h-8 px-3 rounded-md text-xs font-medium bg-[#EDEDED] hover:bg-[#FFFFFF] text-[#000000] transition-colors text-center"
            >
              Run GPU Test
            </button>
          </div>
        </div>

        {/* Hardware Dashboard */}
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
              <h2 className="text-sm font-medium tracking-[-0.28px] text-[#EDEDED]">
                Models Matrix
              </h2>
              <p className="text-xs text-[#707070]">
                Evaluated against active hardware constraints.
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
            <div className="p-12 text-center bg-[#0A0A0A] rounded-xl border border-[#262626]">
              <p className="text-xs font-medium text-[#EDEDED]">No matching models</p>
              <p className="text-xs text-[#707070] mt-1">Try resetting your search query or status filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedModality('all');
                  setSelectedFramework('all');
                  setSelectedTier('all');
                }}
                className="mt-3 px-3 py-1.5 rounded-md text-xs font-medium bg-[#171717] text-[#EDEDED] border border-[#333333] hover:bg-[#262626]"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Programmatic NPM Module Integration */}
        <div id="npm-module">
          <NpmModuleSection />
        </div>

        {/* Minimal Vercel Architecture Reference */}
        <div className="mt-8 p-5 rounded-xl bg-[#0A0A0A] border border-[#262626] text-xs text-[#707070] space-y-3">
          <h3 className="text-xs font-medium text-[#EDEDED] uppercase tracking-wider">
            In-Browser AI Execution Architecture
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#000000] rounded-lg border border-[#1F1F1F]">
              <span className="text-[#EDEDED] block font-medium mb-1">WebGPU WGSL</span>
              Executes half-precision FP16 matrix multiplication directly on GPU compute pipelines, bypassing WebGL overhead.
            </div>
            <div className="p-3 bg-[#000000] rounded-lg border border-[#1F1F1F]">
              <span className="text-[#EDEDED] block font-medium mb-1">ONNX Runtime Web</span>
              Compiles models to WebGPU or CPU WASM SIMD. Weights persist inside browser Cache API for offline use.
            </div>
            <div className="p-3 bg-[#000000] rounded-lg border border-[#1F1F1F]">
              <span className="text-[#EDEDED] block font-medium mb-1">WASM SIMD Fallback</span>
              128-bit vector instructions executed on CPU threads via llama.cpp or Wllama when WebGPU is unavailable.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#262626] bg-[#000000] py-6 text-xs text-[#707070]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} browser-llm-fit — zero server telemetry</p>
          <p>All hardware checks executed client-side in the browser</p>
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
