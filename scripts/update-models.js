/**
 * Automated Model List Updater
 * 
 * Fetches latest in-browser compatible models from Hugging Face API (transformers.js, webgpu tags)
 * and WebLLM model registries, validates their configurations, and synchronizes the catalog.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchHFModels(tag) {
  try {
    const url = `https://huggingface.co/api/models?filter=${tag}&sort=downloads&direction=-1&limit=50`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'canirun-ai-model-updater' }
    });
    if (!res.ok) {
      console.warn(`Failed to fetch HF tag: ${tag} (${res.status})`);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error(`Error querying Hugging Face API for ${tag}:`, err.message);
    return [];
  }
}

async function fetchWebLLMConfig() {
  try {
    const url = 'https://raw.githubusercontent.com/mlc-ai/web-llm/main/src/config.ts';
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    // Extract model IDs matching "*-MLC"
    const matches = text.match(/model_id:\s*["']([^"']+-MLC)["']/g) || [];
    return matches.map(m => m.replace(/model_id:\s*["']/, '').replace(/["']/, ''));
  } catch (err) {
    console.warn('Could not fetch WebLLM config:', err.message);
    return [];
  }
}

async function run() {
  console.log('🔍 Fetching latest in-browser AI models...');

  const [transformersModels, webgpuModels, webllmModels] = await Promise.all([
    fetchHFModels('transformers.js'),
    fetchHFModels('webgpu'),
    fetchWebLLMConfig()
  ]);

  console.log(`✓ Retrieved ${transformersModels.length} transformers.js models from Hugging Face`);
  console.log(`✓ Retrieved ${webgpuModels.length} webgpu tagged models from Hugging Face`);
  console.log(`✓ Retrieved ${webllmModels.length} models from WebLLM registry`);

  const manifest = {
    updatedAt: new Date().toISOString(),
    stats: {
      transformersJsCount: transformersModels.length,
      webgpuCount: webgpuModels.length,
      webllmCount: webllmModels.length,
    },
    topTransformersJs: transformersModels.slice(0, 15).map(m => ({
      id: m.id,
      downloads: m.downloads,
      likes: m.likes
    })),
    availableWebLLM: webllmModels.slice(0, 20)
  };

  const outputPath = path.resolve(__dirname, '../src/data/registry-sync.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log(`✓ Registry sync written to ${outputPath}`);
}

run().catch(err => {
  console.error('Fatal error during model update:', err);
  process.exit(1);
});
