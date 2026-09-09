import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { IN_BROWSER_MODELS } from '../dist-lib/index.mjs';
const source = await readFile(new URL('../src/data/demoModels.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { getDemoModel, DEMO_MODELS } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('catalog text demos use explicit tasks, including Qwen and BGE', () => {
  assert.equal(getDemoModel('onnx-community/Qwen2.5-0.5B-Instruct').task, 'text-generation');
  assert.equal(getDemoModel('Xenova/bge-small-en-v1.5').task, 'feature-extraction');
  assert.equal(getDemoModel('Xenova/distilbert-base-uncased-finetuned-sst-2-english').task, 'sentiment-analysis');
  for (const demo of DEMO_MODELS) assert.ok(IN_BROWSER_MODELS.some(model => model.testModelId === demo.id));
});
test('audio and unknown models never fall through to a text demo', () => {
  assert.equal(getDemoModel('Xenova/whisper-tiny.en'), undefined);
  assert.equal(getDemoModel('unknown'), undefined);
  assert.equal(getDemoModel(undefined), undefined);
});
