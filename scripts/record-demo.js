import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function record() {
  const recordingsDir = path.resolve(__dirname, '../recordings');
  if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
  }

  console.log('🎥 Launching browser with Retina 2x 1080p HD profile...');
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--enable-unsafe-webgpu',
      '--use-gl=angle',
      '--force-device-scale-factor=2',
      '--high-dpi-support=1'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // Crisp Retina resolution for text and UI
    recordVideo: {
      dir: recordingsDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  console.log('Navigating to app...');
  await page.goto('http://localhost:5180/ai/inbrowser/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // 1. Initial view: Hardware dashboard & List view
  console.log('Highlighting hardware metrics...');
  await page.evaluate(() => window.scrollBy({ top: 180, behavior: 'smooth' }));
  await page.waitForTimeout(1800);

  // 2. Modality filtering
  console.log('Filtering modalities...');
  const audioTab = page.locator('button:has-text("Audio / Speech")');
  if (await audioTab.isVisible()) {
    await audioTab.click();
    await page.waitForTimeout(1800);
  }

  const visionTab = page.locator('button:has-text("Vision & Multimodal")');
  if (await visionTab.isVisible()) {
    await visionTab.click();
    await page.waitForTimeout(1800);
  }

  const allTab = page.locator('button:has-text("All Modalities")');
  if (await allTab.isVisible()) {
    await allTab.click();
    await page.waitForTimeout(1200);
  }

  // 3. Search model
  console.log('Searching models...');
  const searchInput = page.locator('input[placeholder*="Search models"]');
  await searchInput.focus();
  await searchInput.pressSequentially('whisper', { delay: 100 });
  await page.waitForTimeout(1800);
  await searchInput.fill('');
  await page.waitForTimeout(1000);

  // 4. Toggle view to Grid then back to Table
  console.log('Toggling views...');
  const gridButton = page.locator('button:has-text("Grid")');
  if (await gridButton.isVisible()) {
    await gridButton.click();
    await page.waitForTimeout(2000);
  }
  const tableButton = page.locator('button:has-text("Table")');
  if (await tableButton.isVisible()) {
    await tableButton.click();
    await page.waitForTimeout(1500);
  }

  // 5. Open Hardware Simulator
  console.log('Demonstrating Hardware Simulator...');
  const simButton = page.locator('button:has-text("Hardware Simulator")');
  await simButton.click();
  await page.waitForTimeout(1500);

  // Click M3 Max preset
  const m3Preset = page.locator('button:has-text("Apple M3 Max")');
  if (await m3Preset.isVisible()) {
    await m3Preset.click();
    await page.waitForTimeout(1800);
  }

  // Click Chromebook preset
  const chromebookPreset = page.locator('button:has-text("CPU Chromebook")');
  if (await chromebookPreset.isVisible()) {
    await chromebookPreset.click();
    await page.waitForTimeout(1800);
  }

  // Reset to auto-detected
  const resetBtn = page.locator('button:has-text("Reset to Auto-Detected")');
  if (await resetBtn.isVisible()) {
    await resetBtn.click();
    await page.waitForTimeout(1200);
  }

  // Close simulator
  const hideSimButton = page.locator('button:has-text("Hide Simulator")');
  if (await hideSimButton.isVisible()) {
    await hideSimButton.click();
    await page.waitForTimeout(1200);
  }

  // 6. Open GPU Test Modal
  console.log('Running GPU / Hardware Diagnostics...');
  const testGpuBtn = page.locator('button:has-text("Run GPU Test")').first();
  await testGpuBtn.click();
  await page.waitForTimeout(1200);

  const startTestBtn = page.locator('button:has-text("Start GPU Stress Test")');
  if (await startTestBtn.isVisible()) {
    await startTestBtn.click();
    await page.waitForTimeout(3500);
  }

  // Close modal
  const closeGpuBtn = page.locator('button:has(svg.lucide-x)').first();
  if (await closeGpuBtn.isVisible()) {
    await closeGpuBtn.click();
    await page.waitForTimeout(1200);
  }

  // 7. Open Code Snippet
  console.log('Viewing Code Snippet modal...');
  const codeBtn = page.locator('button:has-text("Code")').first();
  if (await codeBtn.isVisible()) {
    await codeBtn.click();
    await page.waitForTimeout(2200);
    const closeCodeBtn = page.locator('button:has(svg.lucide-x)').first();
    if (await closeCodeBtn.isVisible()) {
      await closeCodeBtn.click();
      await page.waitForTimeout(1000);
    }
  }

  console.log('Finishing recording...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(1500);

  // Close page to flush video
  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (video) {
    const videoPath = await video.path();
    console.log(`✓ Raw video saved at: ${videoPath}`);

    const finalMp4Path = path.resolve(recordingsDir, 'demo.mp4');
    console.log(`Encoding crystal-clear 1080p 60fps HD video at: ${finalMp4Path}...`);
    try {
      // Visually lossless CRF 14, slow preset, 60fps, high profile, faststart
      execSync(
        `ffmpeg -y -i "${videoPath}" -c:v libx264 -preset slow -crf 14 -profile:v high -level 4.2 -pix_fmt yuv420p -r 60 -movflags +faststart "${finalMp4Path}"`,
        { stdio: 'inherit' }
      );
      console.log(`✓ Pristine HD video ready: ${finalMp4Path}`);
    } catch (err) {
      console.error('ffmpeg conversion error:', err.message);
    }
  }
}

record().catch((err) => {
  console.error('Error during recording:', err);
  process.exit(1);
});
