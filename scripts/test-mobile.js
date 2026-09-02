import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testMobile() {
  const browser = await chromium.launch({ headless: true });
  
  // Test iPhone 13/14/15 viewport (390x844)
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();
  await page.goto('http://localhost:5180/ai/inbrowser/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check for horizontal overflow
  const overflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });

  console.log('Mobile Viewport Check (390px):', overflow);

  const screenshotPath = path.resolve(__dirname, '../recordings/mobile-preview.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`✓ Mobile screenshot saved at: ${screenshotPath}`);

  await browser.close();
}

testMobile().catch(console.error);
