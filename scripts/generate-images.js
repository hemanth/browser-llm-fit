import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generate() {
  const browser = await chromium.launch({ headless: true });

  // 1. Generate Favicon PNGs
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <rect width="32" height="32" rx="8" fill="#000000"/>
    <rect x="1" y="1" width="30" height="30" rx="7" fill="none" stroke="#262626" stroke-width="1"/>
    <rect x="10" y="10" width="12" height="12" rx="2.5" fill="#EDEDED"/>
    <line x1="16" y1="4" x2="16" y2="8" stroke="#707070" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="16" y1="24" x2="16" y2="28" stroke="#707070" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="4" y1="16" x2="8" y2="16" stroke="#707070" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="24" y1="16" x2="28" y2="16" stroke="#707070" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="16" cy="16" r="2" fill="#000000"/>
  </svg>`;

  const favPage = await browser.newPage();
  await favPage.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:transparent;overflow:hidden;">
        ${svgContent}
      </body>
    </html>
  `);

  await favPage.setViewportSize({ width: 180, height: 180 });
  await favPage.screenshot({
    path: path.resolve(__dirname, '../public/apple-touch-icon.png'),
    omitBackground: true
  });

  await favPage.setViewportSize({ width: 32, height: 32 });
  await favPage.screenshot({
    path: path.resolve(__dirname, '../public/favicon-32x32.png'),
    omitBackground: true
  });

  // 2. Generate 1200x630 OG Image
  const ogPage = await browser.newPage();
  await ogPage.setViewportSize({ width: 1200, height: 630 });
  await ogPage.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 1200px;
            height: 630px;
            background: #000000;
            color: #EDEDED;
            font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 80px;
            position: relative;
            overflow: hidden;
          }
          .grid-bg {
            position: absolute;
            inset: 0;
            background-image: 
              linear-gradient(to right, #171717 1px, transparent 1px),
              linear-gradient(to bottom, #171717 1px, transparent 1px);
            background-size: 60px 60px;
            opacity: 0.4;
            mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
          }
          .content {
            position: relative;
            z-index: 10;
          }
          .top-bar {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 40px;
          }
          .logo-box {
            width: 32px;
            height: 32px;
            background: #171717;
            border: 1px solid #262626;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .logo-dot {
            width: 10px;
            height: 10px;
            background: #EDEDED;
            border-radius: 2px;
          }
          .brand {
            font-size: 20px;
            font-weight: 600;
            letter-spacing: -0.5px;
            color: #EDEDED;
          }
          .sub-brand {
            font-size: 16px;
            color: #707070;
          }
          h1 {
            font-size: 64px;
            font-weight: 600;
            letter-spacing: -2.8px;
            line-height: 1.05;
            color: #EDEDED;
            margin-bottom: 24px;
            max-width: 900px;
          }
          p {
            font-size: 24px;
            color: #A1A1A1;
            font-weight: 400;
            line-height: 1.4;
            max-width: 840px;
            letter-spacing: -0.4px;
          }
          .bottom-bar {
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 32px;
            border-top: 1px solid #1F1F1F;
          }
          .badges {
            display: flex;
            gap: 12px;
          }
          .badge {
            font-family: 'Geist Mono', monospace;
            font-size: 14px;
            padding: 6px 14px;
            background: #0A0A0A;
            border: 1px solid #262626;
            border-radius: 6px;
            color: #A1A1A1;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .badge-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #398E4A;
          }
          .author {
            font-size: 16px;
            color: #707070;
            font-family: 'Geist Mono', monospace;
          }
        </style>
      </head>
      <body>
        <div class="grid-bg"></div>
        <div class="content">
          <div class="top-bar">
            <div class="logo-box">
              <div class="logo-dot"></div>
            </div>
            <span class="brand">inbrowser.ai</span>
            <span style="color: #333333;">/</span>
            <span class="sub-brand">browser ai matrix</span>
          </div>

          <h1>Can your browser run it?</h1>
          <p>Probe WebGPU memory bindings, shader limits, and WASM threads to discover which models execute client-side with zero server roundtrips.</p>
        </div>

        <div class="bottom-bar">
          <div class="badges">
            <div class="badge"><span class="badge-dot"></span>WebGPU WGSL</div>
            <div class="badge"><span class="badge-dot"></span>Transformers.js v3</div>
            <div class="badge"><span class="badge-dot"></span>WebLLM MLC</div>
            <div class="badge"><span class="badge-dot"></span>Wllama WASM</div>
          </div>
          <div class="author">h3manth.com/ai/inbrowser</div>
        </div>
      </body>
    </html>
  `);

  await ogPage.waitForLoadState('networkidle');
  await ogPage.screenshot({
    path: path.resolve(__dirname, '../public/og-image.png'),
    type: 'png'
  });

  console.log('✓ Generated apple-touch-icon.png, favicon-32x32.png, and og-image.png');
  await browser.close();
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
