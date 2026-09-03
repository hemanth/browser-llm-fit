import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink, Package } from 'lucide-react';

export const NpmModuleSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'probe' | 'simulate'>('single');
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const installCmd = 'npm install browser-llm-fit';

  const snippets = {
    single: `import fit from 'browser-llm-fit';

// 1. Evaluate model before downloading weights
const res = await fit('SmolLM2-135M');

if (res.fits) {
  console.log(\`Fits smoothly (~\${res.speed})\`);
  await loadClientModel();
} else {
  console.warn(\`Hardware bottleneck: \${res.headline}\`);
  await fallbackToCloudAPI();
}`,
    probe: `import fit from 'browser-llm-fit';

// 2. Extract hardware profile & rank all 60+ in-browser models
const { hardware, models } = await fit();

console.log('GPU Device:', hardware.webgpuDevice);
console.log('shader-f16 support:', hardware.hasShaderF16);
console.log('Top compatible model:', models[0].model.name, \`(\${models[0].evaluation.score}%)\`);`,
    simulate: `import fit from 'browser-llm-fit';

// 3. Test compatibility under custom device constraints
const res = await fit('Llama-3.2-3B', {
  ram: 4,          // Simulate 4GB RAM budget
  gpu: 'wasm-cpu'  // Simulate CPU fallback without WebGPU
});

console.log(res.fits);     // false
console.log(res.headline); // "Insufficient System RAM"
console.log(res.checks);   // Detailed diagnostic checklist`
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(installCmd);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="mt-12 rounded-xl bg-[#0A0A0A] border border-[#262626] overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-[#262626] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="px-2 py-0.5 rounded-full bg-[#171717] border border-[#333333] text-[11px] font-mono text-[#EDEDED] flex items-center gap-1.5">
              <Package className="h-3 w-3 text-[#A1A1A1]" />
              <span>npm module</span>
            </span>
            <span className="text-[11px] font-mono text-[#707070]">v1.0.0</span>
            <span className="text-[11px] font-mono text-[#398E4A]">• Zero Dependencies</span>
          </div>

          <h2 className="text-base sm:text-lg font-semibold tracking-[-0.3px] text-[#EDEDED] mt-2">
            Use <code className="font-mono text-white">browser-llm-fit</code> in your application
          </h2>
          <p className="text-xs text-[#707070] mt-1 max-w-2xl leading-relaxed">
            Building client-side AI or local RAG? Use the official npm package to probe WebGPU limits, half-precision float shaders, and RAM headroom to route models safely before crashing the user's browser tab.
          </p>
        </div>

        {/* Install Command & Repo Links */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <button
            onClick={handleCopyInstall}
            className="h-9 px-3 rounded-lg bg-[#121212] hover:bg-[#171717] border border-[#262626] text-xs font-mono text-[#EDEDED] transition-colors flex items-center justify-between gap-2.5 group"
            title="Click to copy install command"
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-[#707070] group-hover:text-[#EDEDED]" />
              <span>{installCmd}</span>
            </div>
            {copiedInstall ? (
              <Check className="h-3.5 w-3.5 text-[#398E4A] shrink-0" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-[#707070] group-hover:text-[#EDEDED] shrink-0" />
            )}
          </button>

          <a
            href="https://github.com/hemanth/browser-llm-fit"
            target="_blank"
            rel="noreferrer"
            className="h-9 px-3 rounded-lg bg-transparent hover:bg-[#171717] border border-[#262626] text-xs text-[#A1A1A1] hover:text-[#EDEDED] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>GitHub</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Code Snippet Tabs */}
      <div className="px-4 sm:px-6 pt-4 bg-[#050505]">
        <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-2 gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'single'
                  ? 'bg-[#171717] text-[#EDEDED] font-medium border border-[#333333]'
                  : 'text-[#707070] hover:text-[#EDEDED]'
              }`}
            >
              1. Check Single Model
            </button>
            <button
              onClick={() => setActiveTab('probe')}
              className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'probe'
                  ? 'bg-[#171717] text-[#EDEDED] font-medium border border-[#333333]'
                  : 'text-[#707070] hover:text-[#EDEDED]'
              }`}
            >
              2. Probe All Models
            </button>
            <button
              onClick={() => setActiveTab('simulate')}
              className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'simulate'
                  ? 'bg-[#171717] text-[#EDEDED] font-medium border border-[#333333]'
                  : 'text-[#707070] hover:text-[#EDEDED]'
              }`}
            >
              3. Simulate Constraints
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="h-7 px-2.5 rounded-md text-[11px] bg-[#121212] hover:bg-[#171717] text-[#A1A1A1] hover:text-[#EDEDED] border border-[#262626] transition-colors flex items-center gap-1.5 shrink-0"
          >
            {copiedCode ? <Check className="h-3 w-3 text-[#398E4A]" /> : <Copy className="h-3 w-3" />}
            <span className="hidden xs:inline">{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Code Block */}
      <div className="p-5 sm:p-6 bg-[#050505]">
        <pre className="text-xs font-mono text-[#D4D4D4] leading-relaxed overflow-x-auto p-4 rounded-lg bg-[#000000] border border-[#1F1F1F]">
          <code>{snippets[activeTab]}</code>
        </pre>

        {/* Feature Pills */}
        <div className="mt-4 pt-4 border-t border-[#1F1F1F] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#707070]">
          <div>
            <span className="text-[#EDEDED] font-medium block">Pure Client-Side</span>
            Zero network requests or telemetry. Evaluates device memory, WASM SIMD, and WebGPU limits directly.
          </div>
          <div>
            <span className="text-[#EDEDED] font-medium block">Dual ESM & CommonJS</span>
            Ships with full TypeScript declaration files (`index.d.ts`) and works in Vite, Next.js, and Webpack.
          </div>
          <div>
            <span className="text-[#EDEDED] font-medium block">Graceful Fallbacks</span>
            Prevents tab memory crashes by dynamically routing users to server APIs when on-device limits are exceeded.
          </div>
        </div>
      </div>
    </div>
  );
};
