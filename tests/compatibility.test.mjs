import { test } from 'node:test';
import assert from 'node:assert/strict';
import fit, { detectHardwareProfile, evaluateModelCompatibility, IN_BROWSER_MODELS } from '../dist-lib/index.mjs';

Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
  userAgent: 'Firefox', platform: 'test', hardwareConcurrency: 8,
} });
globalThis.document = { createElement: () => ({ getContext: () => null }) };
globalThis.window = {};
const cpuModel = IN_BROWSER_MODELS.find(m => m.id === 'smollm2-135m-instruct');
const gpuModel = IN_BROWSER_MODELS.find(m => m.requiresWebGPU && m.minVramGB >= 4);
const hardware = {
  reportedRamGB: 32, estimatedRamGB: 32, hasWebGPU: true, hasShaderF16: true,
  webgpuLimits: { maxStorageBufferBindingSize: 2 ** 31 }, storageAvailableGB: 100,
  downlinkMbps: 50, hasWasm: true, hasWasmSimd: true, effectiveGpuVramGB: 0.5,
};
const sim = { isActive: true, ramGB: 32, cpuCores: 8, gpuBackend: 'webgpu-f16',
  maxStorageBufferMB: 2048, storageAvailableGB: 100, hasWasmSimd: true, downlinkMbps: 50 };

test('SIMD probe detects the SIMD-capable test runtime', async () => {
  assert.equal((await detectHardwareProfile()).hasWasmSimd, true);
});
test('unknown VRAM cannot produce an unconditional smooth verdict', () => {
  const result = evaluateModelCompatibility(gpuModel, hardware);
  assert.notEqual(result.tier, 'smooth');
  assert.ok(result.checks.some(c => c.name === 'GPU Memory Budget' && c.severity === 'warning'));
});
test('explicit GPU budgets enforce minimum VRAM, including the boundary', () => {
  assert.equal(evaluateModelCompatibility(gpuModel, hardware, { ...sim, vramGB: gpuModel.minVramGB - 0.1 }).tier, 'incompatible');
  assert.notEqual(evaluateModelCompatibility(gpuModel, hardware, { ...sim, vramGB: gpuModel.minVramGB }).tier, 'incompatible');
});
test('missing WASM or SIMD blocks CPU execution', () => {
  for (const missing of [{ hasWasm: false }, { hasWasmSimd: false }]) {
    assert.equal(evaluateModelCompatibility(cpuModel, { ...hardware, hasWebGPU: false, ...missing }).tier, 'incompatible');
  }
});
test('RAM below minimum and missing f16 block required models', () => {
  assert.equal(evaluateModelCompatibility(cpuModel, { ...hardware, reportedRamGB: 0.1 }).tier, 'incompatible');
  const f16Model = IN_BROWSER_MODELS.find(m => m.requiresShaderF16);
  assert.equal(evaluateModelCompatibility(f16Model, { ...hardware, hasShaderF16: false }).tier, 'incompatible');
});
test('empty options preserve detected estimated RAM and evaluation', async () => {
  const plain = await fit(cpuModel.id);
  const empty = await fit(cpuModel.id, {});
  assert.equal(plain.hardware.estimatedRamGB, 16);
  assert.deepEqual(empty.checks, plain.checks);
});
test('invalid simulation options and blank names are rejected', async () => {
  for (const options of [{ ram: NaN }, { ram: -1 }, { vram: 0 }, { cpuCores: 1.5 }, { gpu: 'invalid' }]) {
    await assert.rejects(fit(cpuModel.id, options), TypeError);
  }
  await assert.rejects(fit('   '), TypeError);
});
test('incompatible non-text models report unrunnable throughput', () => {
  const model = IN_BROWSER_MODELS.find(m => m.modality === 'Embeddings');
  assert.equal(evaluateModelCompatibility(model, { ...hardware, reportedRamGB: 0.1 }).estimatedSpeed, 'Unrunnable');
});
