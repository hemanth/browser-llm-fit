/**
 * Automated In-Browser Model Catalog & Registry Synchronizer
 *
 * Runs weekly via GitHub Actions (.github/workflows/update-models.yml).
 * Queries Hugging Face API (transformers.js, webgpu tags) and MLC WebLLM registry
 * to keep the inbrowser/browser-llm-fit catalog synchronized with upstream releases.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchHF(filter) {
  try {
    const url = `https://huggingface.co/api/models?filter=${filter}&sort=downloads&direction=-1&limit=50`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'browser-llm-fit-updater/1.0' }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn(`HF query failed for ${filter}:`, err.message);
    return [];
  }
}

async function fetchWebLLM() {
  try {
    const url = 'https://raw.githubusercontent.com/mlc-ai/web-llm/main/src/config.ts';
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    const matches = text.match(/model_id:\s*["']([^"']+-MLC)["']/g) || [];
    return [...new Set(matches.map(m => m.replace(/model_id:\s*["']/, '').replace(/["']/, '')))];
  } catch (err) {
    console.warn('WebLLM config query failed:', err.message);
    return [];
  }
}

async function update() {
  console.log('🔄 Checking upstream model registries for new in-browser weights...');

  const [transformersModels, webgpuModels, webllmModels] = await Promise.all([
    fetchHF('transformers.js'),
    fetchHF('webgpu'),
    fetchWebLLM()
  ]);

  console.log(`✓ Hugging Face (transformers.js): ${transformersModels.length} models`);
  console.log(`✓ Hugging Face (webgpu):          ${webgpuModels.length} models`);
  console.log(`✓ WebLLM MLC Registry:            ${webllmModels.length} models`);

  // Load existing modelsData.ts
  const modelsDataPath = path.resolve(__dirname, '../src/data/modelsData.ts');
  const modelsDataContent = fs.readFileSync(modelsDataPath, 'utf8');

  // Find newly trending models that aren't yet cataloged
  const newHF = transformersModels
    .filter(m => !modelsDataContent.includes(m.id) && m.downloads > 500)
    .slice(0, 10);

  const newWebLLM = webllmModels
    .filter(id => !modelsDataContent.includes(id))
    .slice(0, 10);

  const syncReport = {
    lastCheckedAt: new Date().toISOString(),
    totalActiveInCatalog: (modelsDataContent.match(/id:\s*["'][^"']+["']/g) || []).length,
    upstream: {
      hfTransformersJsCount: transformersModels.length,
      hfWebgpuCount: webgpuModels.length,
      webllmCount: webllmModels.length,
    },
    topHFModels: transformersModels.slice(0, 20).map(m => ({
      id: m.id,
      downloads: m.downloads,
      likes: m.likes
    })),
    webllmRegistry: webllmModels,
    untrackedCandidates: {
      transformersJs: newHF.map(m => ({ id: m.id, downloads: m.downloads })),
      webllm: newWebLLM
    }
  };

  const syncPath = path.resolve(__dirname, '../src/data/registry-sync.json');
  fs.writeFileSync(syncPath, JSON.stringify(syncReport, null, 2), 'utf8');
  console.log(`✓ Synced registry report to ${syncPath}`);
  console.log(`✓ Total cataloged models in browser-llm-fit: ${syncReport.totalActiveInCatalog}`);
}

update().catch(err => {
  console.error('Update script failed:', err);
  process.exit(1);
});
