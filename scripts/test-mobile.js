import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { preview } from 'vite';

const externalUrl = process.env.TEST_BASE_URL;
const server = externalUrl ? null : await preview({ preview: { host: '127.0.0.1', port: 5181, strictPort: true } });
const url = externalUrl ?? 'http://127.0.0.1:5181/ai/browser-llm-fit/';
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const errors = [];
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    const response = await page.goto(url);
    assert.equal(response.status(), 200);
    await page.getByRole('heading', { name: 'Can your browser run it?' }).waitFor();
    await page.getByPlaceholder('Search models', { exact: false }).fill('Qwen');
    await page.getByText('Qwen 2.5 0.5B Instruct', { exact: true }).filter({ visible: true }).first().waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow at ${width}px`);
    await page.getByPlaceholder('Search models', { exact: false }).fill('no-such-model-123');
    await page.getByText('No matching models', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Reset Filters', exact: true }).click();
    console.log(`PASS: ${width}px layout, catalog, search and reset`);
  }

  // Isolate orchestration from model downloads. This worker deliberately finishes late.
  await page.route('**/inference.worker-*.js', route => route.fulfill({
    contentType: 'application/javascript',
    body: `self.onmessage=({data})=>{self.postMessage({type:'running'});setTimeout(()=>self.postMessage({type:'result',text:'Completed '+data.modelId,latencyMs:1}),400)}`,
  }));
  await page.getByRole('button', { name: 'Run Model', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Live In-Browser Inference' });
  const selector = dialog.getByLabel('Target Model');
  assert.equal(await selector.locator('option').count(), 5);
  const qwen = 'onnx-community/Qwen2.5-0.5B-Instruct';
  await selector.selectOption(qwen);
  await dialog.getByRole('button', { name: 'Run In-Browser Model', exact: true }).click();
  await dialog.getByText('Evaluating on-device...').waitFor();
  await selector.selectOption('Xenova/all-MiniLM-L6-v2');
  await page.waitForTimeout(600); // Wait past the deliberately delayed stale result.
  assert.equal(await dialog.getByText(`Completed ${qwen}`, { exact: true }).count(), 0);
  await dialog.getByRole('button', { name: 'Run In-Browser Model', exact: true }).click();
  await dialog.getByText('Completed Xenova/all-MiniLM-L6-v2', { exact: true }).waitFor();
  await dialog.getByRole('button', { name: 'Run In-Browser Model', exact: true }).click();
  await dialog.getByRole('button', { name: 'Close inference demo' }).click();
  await page.getByRole('button', { name: 'Run Model', exact: true }).click();
  assert.equal(await selector.inputValue(), 'HuggingFaceTB/SmolLM2-135M-Instruct');
  await page.waitForTimeout(600);
  assert.equal(await dialog.getByText('Inference Output', { exact: true }).count(), 0);
  await dialog.getByRole('button', { name: 'Close inference demo' }).click();
  assert.deepEqual(errors, []);
  console.log('PASS: demo selection, results, stale-result suppression, close/reopen and console errors');
} finally {
  await browser?.close();
  await new Promise((resolve, reject) => server ? server.httpServer.close(error => error ? reject(error) : resolve()) : resolve());
}
