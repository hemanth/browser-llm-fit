//#region src/utils/hardwareDetector.ts
function e() {
	try {
		return WebAssembly.validate(new Uint8Array([
			0,
			97,
			115,
			109,
			1,
			0,
			0,
			0,
			1,
			5,
			1,
			96,
			0,
			1,
			123,
			3,
			2,
			1,
			0,
			10,
			10,
			1,
			8,
			0,
			125,
			0,
			0,
			0,
			0,
			11
		]));
	} catch {
		return !1;
	}
}
function t() {
	try {
		return typeof SharedArrayBuffer < "u";
	} catch {
		return !1;
	}
}
function n() {
	try {
		return WebAssembly.validate(new Uint8Array([
			0,
			97,
			115,
			109,
			1,
			0,
			0,
			0,
			5,
			3,
			1,
			4,
			1
		]));
	} catch {
		return !1;
	}
}
function r() {
	try {
		let e = document.createElement("canvas"), t = e.getContext("webgl2") || e.getContext("webgl");
		if (!t) return {
			vendor: "Unavailable",
			renderer: "Unavailable"
		};
		let n = t.getExtension("WEBGL_debug_renderer_info");
		return n ? {
			vendor: t.getParameter(n.UNMASKED_VENDOR_WEBGL) || "Unknown",
			renderer: t.getParameter(n.UNMASKED_RENDERER_WEBGL) || "Unknown"
		} : {
			vendor: t.getParameter(t.VENDOR) || "Generic",
			renderer: t.getParameter(t.RENDERER) || "Generic"
		};
	} catch {
		return {
			vendor: "Error detecting",
			renderer: "Error detecting"
		};
	}
}
function i(e, t, n) {
	let r = e.toLowerCase();
	return r.includes("apple") && (r.includes("m3") || r.includes("m4") || r.includes("max") || r.includes("pro")) || r.includes("rtx 40") || r.includes("rtx 30") || r.includes("radeon rx 7") || r.includes("radeon rx 6") ? "High-End" : r.includes("apple m1") || r.includes("apple m2") || r.includes("rtx 20") || r.includes("gtx 1660") ? "Mid-Range" : r.includes("iris") || r.includes("intel uhd") || r.includes("radeon graphics") || r.includes("mali") || r.includes("adreno") ? "Integrated" : t && n ? "Mid-Range" : t ? "Entry-Level" : "Unknown";
}
function a() {
	let e = navigator.userAgent, t = "Unknown OS", n = "Unknown Browser", r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(e);
	return e.includes("Mac OS X") || e.includes("Macintosh") ? (t = "macOS", navigator.maxTouchPoints > 1 && !e.includes("iPhone") && (t = "iPadOS / macOS Touch")) : e.includes("Windows") ? t = "Windows" : e.includes("Android") ? t = "Android" : e.includes("iPhone") || e.includes("iPad") ? t = "iOS" : e.includes("Linux") && (t = "Linux"), e.includes("Edg/") ? n = "Microsoft Edge" : e.includes("Chrome/") && !e.includes("Edg/") ? n = "Google Chrome / Chromium" : e.includes("Safari/") && !e.includes("Chrome/") ? n = "Apple Safari" : e.includes("Firefox/") ? n = "Mozilla Firefox" : e.includes("Brave/") && (n = "Brave Browser"), {
		os: t,
		browser: n,
		isMobile: r
	};
}
async function o() {
	let { os: o, browser: s, isMobile: c } = a(), l = r(), u = navigator.hardwareConcurrency || 4, d = "x86_64";
	(l.renderer.toLowerCase().includes("apple") || o === "iOS" || o === "Android" || navigator.platform.includes("ARM")) && (d = "ARM64");
	let f = navigator.deviceMemory ?? null, p = f || 8;
	f || (p = c ? 4 : l.renderer.toLowerCase().includes("apple") || u >= 8 ? 16 : 8);
	let m = performance.memory, h = m ? Math.round(m.jsHeapSizeLimit / 1048576) : null, g = !1, _ = "Not supported", v = "", y = "", b = "", x = !1, S = !1, C = null;
	if ("gpu" in navigator && navigator.gpu) try {
		let e = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
		if (e) {
			g = !0, x = e.features.has("shader-f16"), S = e.features.has("subgroups") || e.features.has("subgroups-f16");
			let t = e.limits;
			if (C = {
				maxStorageBufferBindingSize: t.maxStorageBufferBindingSize,
				maxBufferSize: t.maxBufferSize,
				maxComputeWorkgroupStorageSize: t.maxComputeWorkgroupStorageSize,
				maxComputeInvocationsPerWorkgroup: t.maxComputeInvocationsPerWorkgroup,
				maxComputeWorkgroupSizeX: t.maxComputeWorkgroupSizeX,
				maxComputeWorkgroupSizeY: t.maxComputeWorkgroupSizeY,
				maxComputeWorkgroupSizeZ: t.maxComputeWorkgroupSizeZ
			}, "requestAdapterInfo" in e && typeof e.requestAdapterInfo == "function") try {
				let t = await e.requestAdapterInfo();
				_ = t.vendor || "", v = t.architecture || "", y = t.device || "", b = t.description || "";
			} catch {}
			if ("info" in e && e.info) {
				let t = e.info;
				_ = t.vendor || _, v = t.architecture || v, y = t.device || y, b = t.description || b;
			}
			(!_ || _ === "") && (_ = l.vendor), (!y || y === "") && (y = l.renderer);
		}
	} catch {
		g = !1;
	}
	let w = null, T = null, E = null, D = !1;
	if (navigator.storage && navigator.storage.estimate) try {
		let e = await navigator.storage.estimate();
		e.quota && (w = Math.round(e.quota / 1073741824 * 10) / 10), e.usage !== void 0 && (T = Math.round(e.usage / 1073741824 * 10) / 10), w !== null && T !== null && (E = Math.round((w - T) * 10) / 10);
	} catch {}
	if (navigator.storage && navigator.storage.persisted) try {
		D = await navigator.storage.persisted();
	} catch {
		D = !1;
	}
	let O = !1, k = "Unavailable", A = window;
	if (A.ai && A.ai.languageModel) try {
		let e = await A.ai.languageModel.capabilities();
		e && e.available !== "no" ? (O = !0, k = e.available === "readily" ? "Ready (Gemini Nano preloaded)" : "Available after download") : k = "Disabled / Model not installed";
	} catch {
		k = "Prompt API detected (flag required)";
	}
	let j = navigator.connection, M = j?.downlink ?? null, N = j?.effectiveType ?? null, P = j?.rtt ?? null, F = i(y || l.renderer, g, x), I = l.renderer.toLowerCase().includes("apple") || o === "macOS" && d === "ARM64" || o === "iOS", L = I ? Math.round(p * .75 * 10) / 10 : C ? Math.max(2, Math.round(C.maxStorageBufferBindingSize / 1073741824 * 3 * 10) / 10) : 2;
	return {
		platform: navigator.platform || o,
		os: o,
		browser: s,
		userAgent: navigator.userAgent,
		isMobile: c,
		cpuCores: u,
		cpuArchitecture: d,
		reportedRamGB: f,
		estimatedRamGB: p,
		jsHeapLimitMB: h,
		hasWebGPU: g,
		webgpuVendor: _ || "Generic WebGPU",
		webgpuArchitecture: v,
		webgpuDevice: y || l.renderer,
		webgpuDescription: b,
		hasShaderF16: x,
		hasSubgroups: S,
		webgpuLimits: C,
		webglRenderer: l.renderer,
		webglVendor: l.vendor,
		gpuTier: F,
		isUnifiedMemory: I,
		effectiveGpuVramGB: L,
		hasWasm: typeof WebAssembly == "object",
		hasWasmSimd: e(),
		hasWasmThreads: t(),
		hasWasmMemory64: n(),
		storageQuotaGB: w,
		storageUsageGB: T,
		storageAvailableGB: E ?? 25,
		isStoragePersisted: D,
		hasChromeBuiltinAI: O,
		chromeBuiltinAIStatus: k,
		downlinkMbps: M,
		effectiveNetworkType: N,
		rttMs: P,
		timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
	};
}
//#endregion
//#region src/utils/compatibilityChecker.ts
function s(e, t, n) {
	let r = n && n.isActive, i = r ? n.ramGB : t.reportedRamGB || t.estimatedRamGB, a = r ? n.gpuBackend : t.hasWebGPU ? t.hasShaderF16 ? "webgpu-f16" : "webgpu-nof16" : "wasm-cpu", o = a.startsWith("webgpu"), s = a === "webgpu-f16", c = r ? n.maxStorageBufferMB : t.webgpuLimits ? Math.round(t.webgpuLimits.maxStorageBufferBindingSize / 1048576) : 128, l = r ? n.storageAvailableGB : t.storageAvailableGB ?? 20, u = r ? n.downlinkMbps : t.downlinkMbps ?? 50, d = [], f = 100, p = !1;
	if (e.framework === "Chrome Built-in AI") return t.hasChromeBuiltinAI ? (d.push({
		name: "Chrome Built-in AI (Prompt API)",
		passed: !0,
		detail: `Native Gemini Nano active (${t.chromeBuiltinAIStatus})`,
		severity: "ok"
	}), {
		tier: "smooth",
		score: 98,
		headline: "Native Instant Execution",
		summary: "Built directly into Chrome. Zero download required; runs natively with high optimization.",
		checks: d,
		estimatedSpeed: "40 - 65 tokens/sec",
		estimatedDownloadTime: "0s (Pre-installed in browser)",
		recommendedBackend: "Native Chrome"
	}) : (d.push({
		name: "Chrome Built-in AI API",
		passed: !1,
		detail: "window.ai.languageModel not available or Gemini Nano not downloaded in this browser build.",
		severity: "error"
	}), {
		tier: "incompatible",
		score: 15,
		headline: "Chrome AI Unavailable",
		summary: "Requires Chrome 128+ with Built-in AI enabled via chrome://flags/#optimization-guide-on-device-model.",
		checks: d,
		estimatedSpeed: "N/A",
		estimatedDownloadTime: "N/A",
		recommendedBackend: "Native Chrome"
	});
	e.requiresWebGPU ? o ? d.push({
		name: "WebGPU Engine",
		passed: !0,
		detail: `WebGPU active on ${r ? "Simulated Adapter" : t.webgpuDevice}`,
		severity: "ok"
	}) : (d.push({
		name: "WebGPU Engine",
		passed: !1,
		detail: "Model strictly requires WebGPU for shader acceleration. Your current configuration has only CPU/WebGL.",
		severity: "error"
	}), f -= 50, p = !0) : d.push({
		name: "Runtime Engine",
		passed: !0,
		detail: o ? "WebGPU accelerated (WASM CPU fallback also supported)" : "Running on CPU via WebAssembly (SIMD)",
		severity: "ok"
	}), e.requiresShaderF16 && (s ? d.push({
		name: "16-bit Float Shaders (shader-f16)",
		passed: !0,
		detail: "Full half-precision FP16 shader support detected",
		severity: "ok"
	}) : (d.push({
		name: "16-bit Float Shaders (shader-f16)",
		passed: !1,
		detail: "GPU missing \"shader-f16\" feature. Models compiled with fp16/q4f16 require this WebGPU extension.",
		severity: "error"
	}), f -= 40, p = !0)), e.minStorageBufferMB > 0 && (o && c < e.minStorageBufferMB ? (d.push({
		name: "WebGPU Buffer Binding Limit",
		passed: !1,
		detail: `Layer tensor needs ${e.minStorageBufferMB}MB buffer, but browser limit is ${c}MB.`,
		severity: "error"
	}), f -= 35, p = !0) : o && d.push({
		name: "WebGPU Buffer Binding Limit",
		passed: !0,
		detail: `Max buffer limit (${c}MB) accommodates model layer requirements (${e.minStorageBufferMB}MB).`,
		severity: "ok"
	})), i < e.minRamGB ? (d.push({
		name: "System Memory (RAM)",
		passed: !1,
		detail: `Insufficient RAM: Needs at least ${e.minRamGB}GB RAM, but device has ~${i}GB. High risk of browser tab crash.`,
		severity: "error"
	}), f -= 40, p = !0) : i < e.recommendedRamGB ? (d.push({
		name: "System Memory (RAM)",
		passed: !0,
		detail: `Meets minimum ${e.minRamGB}GB RAM (has ${i}GB), but ${e.recommendedRamGB}GB recommended for heavy loads.`,
		severity: "warning"
	}), f -= 15) : d.push({
		name: "System Memory (RAM)",
		passed: !0,
		detail: `Comfortable memory headroom (${i}GB available vs ${e.recommendedRamGB}GB recommended).`,
		severity: "ok"
	});
	let m = e.downloadSizeMB / 1024;
	l < m ? (d.push({
		name: "Browser Cache Storage",
		passed: !1,
		detail: `Model requires ${m.toFixed(2)}GB storage, but only ${l}GB available.`,
		severity: "error"
	}), f -= 30, p = !0) : d.push({
		name: "Browser Cache Storage",
		passed: !0,
		detail: `${m.toFixed(2)}GB model fits easily within ${l}GB browser storage.`,
		severity: "ok"
	});
	let h = Math.max(1, Math.round(e.downloadSizeMB * 8 / u)), g = "";
	g = e.downloadSizeMB === 0 ? "Instant (Pre-cached)" : h < 60 ? `~${h}s on ${u} Mbps` : `~${(h / 60).toFixed(1)} min on ${u} Mbps`;
	let _ = "";
	_ = e.modality === "LLM / Text" ? p ? "Unrunnable" : o && s ? e.paramValueMillion <= 360 ? "60 - 100+ tokens/sec" : e.paramValueMillion <= 1500 ? "35 - 55 tokens/sec" : e.paramValueMillion <= 3500 ? "20 - 38 tokens/sec" : "10 - 22 tokens/sec" : o ? "12 - 25 tokens/sec" : e.paramValueMillion <= 360 ? "15 - 30 tokens/sec (CPU)" : e.paramValueMillion <= 1200 ? "5 - 12 tokens/sec (CPU)" : "< 4 tokens/sec (CPU slow)" : e.modality === "Embeddings" ? o ? "< 15ms per query" : "< 45ms per query (CPU)" : e.modality === "Audio / Speech" ? o ? "5x - 10x real-time speed" : "1.5x - 2.5x real-time speed" : e.modality === "Vision & Multimodal" ? o ? "~200 - 450ms per image" : "~1.2 - 2.5s per image (CPU)" : e.modality === "Image Generation" ? o ? "1.5 - 3.5s per 512x512 image" : "30s+ per image" : "< 20ms per item";
	let v = "smooth", y = "Runs Smoothly", b = "Hardware fully meets and exceeds all compute, shader, and memory requirements.";
	return p || f <= 40 ? (v = "incompatible", y = "Cannot Run", b = "Crucial hardware requirements (WebGPU, memory, or storage limits) are missing.") : f < 75 ? (v = "tight", y = "Borderline / Tight Fit", b = "Will run, but memory or buffer constraints may cause throttling or tab lag under load.") : f < 90 && (v = "moderate", y = "Moderate Performance", b = "Compatible with adequate speed, though closer to recommended specifications."), {
		tier: v,
		score: Math.max(5, Math.min(100, f)),
		headline: y,
		summary: b,
		checks: d,
		estimatedSpeed: _,
		estimatedDownloadTime: g,
		recommendedBackend: o ? s ? "WebGPU (f16)" : "WebGPU (fp32)" : "WASM (SIMD)"
	};
}
//#endregion
//#region src/data/modelsData.ts
var c = [
	{
		id: "smollm2-135m-instruct",
		name: "SmolLM2 135M Instruct",
		developer: "Hugging Face",
		family: "SmolLM",
		modality: "LLM / Text",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q4f16",
		paramCount: "135M",
		paramValueMillion: 135,
		downloadSizeMB: 92,
		minRamGB: 1.5,
		recommendedRamGB: 3,
		minVramGB: .5,
		recommendedVramGB: 1,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 128,
		contextWindow: 2048,
		description: "Ultra-compact language model designed specifically for edge and in-browser devices. Runs smoothly even on low-tier smartphones and WASM CPU.",
		useCases: [
			"Instruction following",
			"On-device text completion",
			"Proofreading",
			"IoT / Low-spec web apps"
		],
		hfUrl: "https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct",
		demoAvailable: !0,
		testModelId: "onnx-community/SmolLM2-135M-Instruct",
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\n// Initialize pipeline with WebGPU (falls back to WASM)\nconst generator = await pipeline(\n  'text-generation',\n  'onnx-community/SmolLM2-135M-Instruct',\n  { device: 'webgpu', dtype: 'q4f16' }\n);\n\nconst output = await generator('Explain quantum computing simply:', {\n  max_new_tokens: 64,\n  temperature: 0.7,\n});\nconsole.log(output[0].generated_text);"
		}
	},
	{
		id: "smollm2-360m-instruct",
		name: "SmolLM2 360M Instruct",
		developer: "Hugging Face",
		family: "SmolLM",
		modality: "LLM / Text",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q4f16",
		paramCount: "360M",
		paramValueMillion: 360,
		downloadSizeMB: 240,
		minRamGB: 2,
		recommendedRamGB: 4,
		minVramGB: .8,
		recommendedVramGB: 1.5,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 256,
		contextWindow: 4096,
		description: "Balanced small language model offering strong reasoning and coherence while keeping memory consumption well under 1GB.",
		useCases: [
			"Chatbots",
			"Summarization",
			"Structured extraction",
			"Form autofill"
		],
		hfUrl: "https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst generator = await pipeline(\n  'text-generation',\n  'onnx-community/SmolLM2-360M-Instruct',\n  { device: 'webgpu', dtype: 'q4f16' }\n);\n\nconst res = await generator('Summarize this meeting note: ...', { max_new_tokens: 128 });\nconsole.log(res);"
		}
	},
	{
		id: "smollm2-1.7b-instruct",
		name: "SmolLM2 1.7B Instruct",
		developer: "Hugging Face",
		family: "SmolLM",
		modality: "LLM / Text",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q4f16",
		paramCount: "1.7B",
		paramValueMillion: 1700,
		downloadSizeMB: 980,
		minRamGB: 4,
		recommendedRamGB: 8,
		minVramGB: 1.8,
		recommendedVramGB: 3,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 512,
		contextWindow: 8192,
		description: "Premier edge model trained on 11 trillion tokens. Delivers impressive reasoning, coding, and roleplay directly in browser tabs via WebGPU.",
		useCases: [
			"Code assistance",
			"Creative writing",
			"Complex Q&A",
			"Local agent workflows"
		],
		hfUrl: "https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst pipe = await pipeline(\n  'text-generation',\n  'onnx-community/SmolLM2-1.7B-Instruct',\n  { device: 'webgpu', dtype: 'q4f16' }\n);\n\nconst response = await pipe([\n  { role: 'system', content: 'You are a helpful coding assistant.' },\n  { role: 'user', content: 'Write a TypeScript debounce function.' }\n], { max_new_tokens: 256 });\nconsole.log(response[0].generated_text);"
		}
	},
	{
		id: "llama-3.2-1b-instruct",
		name: "Llama 3.2 1B Instruct",
		developer: "Meta",
		family: "Llama 3",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "1.2B",
		paramValueMillion: 1200,
		downloadSizeMB: 760,
		minRamGB: 4,
		recommendedRamGB: 8,
		minVramGB: 1.5,
		recommendedVramGB: 2.5,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 512,
		contextWindow: 8192,
		description: "Meta's official lightweight Llama 3.2 model. Highly optimized for on-device multilingual chat, knowledge retrieval, and tool usage.",
		useCases: [
			"Multilingual chat",
			"Agentic tool use",
			"Summarization",
			"Personal assistants"
		],
		hfUrl: "https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct",
		demoAvailable: !0,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from \"@mlc-ai/web-llm\";\n\nconst engine = await webllm.CreateMLCEngine(\"Llama-3.2-1B-Instruct-q4f16_1-MLC\", {\n  initProgressCallback: (report) => console.log(report.text)\n});\n\nconst reply = await engine.chat.completions.create({\n  messages: [{ role: \"user\", content: \"What is WebGPU in 2 sentences?\" }]\n});\nconsole.log(reply.choices[0].message.content);"
		}
	},
	{
		id: "llama-3.2-3b-instruct",
		name: "Llama 3.2 3B Instruct",
		developer: "Meta",
		family: "Llama 3",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "3.2B",
		paramValueMillion: 3200,
		downloadSizeMB: 1950,
		minRamGB: 8,
		recommendedRamGB: 16,
		minVramGB: 3.2,
		recommendedVramGB: 5,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 1024,
		contextWindow: 8192,
		description: "High-capability 3B model from Meta. Outstanding performance on benchmarks, competing with larger previous generation models in-browser.",
		useCases: [
			"Advanced reasoning",
			"Code generation",
			"Deep text synthesis",
			"Interactive storytelling"
		],
		hfUrl: "https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct",
		demoAvailable: !0,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from \"@mlc-ai/web-llm\";\n\nconst engine = await webllm.CreateMLCEngine(\"Llama-3.2-3B-Instruct-q4f16_1-MLC\");\nconst reply = await engine.chat.completions.create({\n  messages: [{ role: \"user\", content: \"Write a high performance quicksort algorithm.\" }]\n});\nconsole.log(reply.choices[0].message.content);"
		}
	},
	{
		id: "qwen-2.5-0.5b-instruct",
		name: "Qwen 2.5 0.5B Instruct",
		developer: "Alibaba Cloud",
		family: "Qwen 2.5",
		modality: "LLM / Text",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q4f16",
		paramCount: "0.5B",
		paramValueMillion: 490,
		downloadSizeMB: 360,
		minRamGB: 2,
		recommendedRamGB: 4,
		minVramGB: .9,
		recommendedVramGB: 1.8,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 256,
		contextWindow: 4096,
		description: "Exceptional sub-billion model supporting 29+ languages and strong math/coding capabilities. High token-generation speeds in-browser.",
		useCases: [
			"Multilingual translation",
			"Fast auto-complete",
			"Grammar correction",
			"Embedded browser extensions"
		],
		hfUrl: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst pipe = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {\n  device: 'webgpu',\n  dtype: 'q4f16'\n});\n\nconst out = await pipe('Translate to French and Japanese: \"Artificial intelligence is advancing quickly.\"');\nconsole.log(out[0].generated_text);"
		}
	},
	{
		id: "qwen-2.5-1.5b-instruct",
		name: "Qwen 2.5 1.5B Instruct",
		developer: "Alibaba Cloud",
		family: "Qwen 2.5",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "1.5B",
		paramValueMillion: 1540,
		downloadSizeMB: 1050,
		minRamGB: 4,
		recommendedRamGB: 8,
		minVramGB: 1.9,
		recommendedVramGB: 3,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 512,
		contextWindow: 8192,
		description: "Top-tier 1.5B model beating many 3B models across coding and STEM tasks. Highly responsive on modern laptops and tablets.",
		useCases: [
			"Coding help",
			"Technical documentation",
			"Mathematical reasoning",
			"Data extraction"
		],
		hfUrl: "https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct",
		demoAvailable: !0,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from \"@mlc-ai/web-llm\";\n\nconst engine = await webllm.CreateMLCEngine(\"Qwen2.5-1.5B-Instruct-q4f16_1-MLC\");\nconst res = await engine.chat.completions.create({\n  messages: [{ role: \"user\", content: \"Solve: If a train travels at 90 km/h for 2.5 hours...\" }]\n});\nconsole.log(res.choices[0].message.content);"
		}
	},
	{
		id: "qwen-2.5-3b-instruct",
		name: "Qwen 2.5 3B Instruct",
		developer: "Alibaba Cloud",
		family: "Qwen 2.5",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "3.1B",
		paramValueMillion: 3100,
		downloadSizeMB: 2150,
		minRamGB: 8,
		recommendedRamGB: 16,
		minVramGB: 3.5,
		recommendedVramGB: 5.5,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 1024,
		contextWindow: 8192,
		description: "Benchmark leader in the 3B weight class. Strong instruction following and tool usage capabilities for local web apps.",
		useCases: [
			"Full conversational assistant",
			"Long-form writing",
			"Complex logic puzzles"
		],
		hfUrl: "https://huggingface.co/Qwen/Qwen2.5-3B-Instruct",
		demoAvailable: !0,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from \"@mlc-ai/web-llm\";\n\nconst engine = await webllm.CreateMLCEngine(\"Qwen2.5-3B-Instruct-q4f16_1-MLC\");\nconst out = await engine.chat.completions.create({\n  messages: [{ role: \"user\", content: \"Write a complete SQL schema for an e-commerce platform.\" }]\n});\nconsole.log(out.choices[0].message.content);"
		}
	},
	{
		id: "qwen-2.5-7b-instruct",
		name: "Qwen 2.5 7B Instruct",
		developer: "Alibaba Cloud",
		family: "Qwen 2.5",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "7.6B",
		paramValueMillion: 7600,
		downloadSizeMB: 4800,
		minRamGB: 16,
		recommendedRamGB: 24,
		minVramGB: 6.5,
		recommendedVramGB: 10,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 2048,
		contextWindow: 8192,
		description: "Powerhouse 7B model. Requires a dedicated GPU (e.g. RTX 3070+, Apple M1/M2/M3 Pro/Max 16GB+) with large storage buffer limits.",
		useCases: [
			"Heavy reasoning",
			"End-to-end coding",
			"Complex multi-step workflows"
		],
		hfUrl: "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct",
		demoAvailable: !1,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from \"@mlc-ai/web-llm\";\n\n// Requires high VRAM GPU (>= 8GB) and maxStorageBufferBindingSize >= 2GB\nconst engine = await webllm.CreateMLCEngine(\"Qwen2.5-7B-Instruct-q4f16_1-MLC\");\nconst stream = await engine.chat.completions.create({\n  stream: true,\n  messages: [{ role: \"user\", content: \"Design an entire distributed queue architecture.\" }]\n});\nfor await (const chunk of stream) {\n  process.stdout.write(chunk.choices[0]?.delta?.content || \"\");\n}"
		}
	},
	{
		id: "deepseek-r1-distill-qwen-1.5b",
		name: "DeepSeek R1 Distill Qwen 1.5B",
		developer: "DeepSeek / MLC AI",
		family: "DeepSeek R1",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "1.5B",
		paramValueMillion: 1500,
		downloadSizeMB: 1100,
		minRamGB: 4,
		recommendedRamGB: 8,
		minVramGB: 2.1,
		recommendedVramGB: 3.5,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 512,
		contextWindow: 8192,
		description: "Distilled reasoning model trained with reinforcement learning traces. Outputs <think> step-by-step reasoning tokens directly in your browser tab.",
		useCases: [
			"Chain-of-thought reasoning",
			"Math proofs",
			"Logical deduction",
			"Algorithm design"
		],
		hfUrl: "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B",
		demoAvailable: !0,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from \"@mlc-ai/web-llm\";\n\nconst engine = await webllm.CreateMLCEngine(\"DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC\");\nconst reply = await engine.chat.completions.create({\n  messages: [{ role: \"user\", content: \"How many r's are in the word strawberry? Think step by step.\" }]\n});\nconsole.log(reply.choices[0].message.content);"
		}
	},
	{
		id: "deepseek-r1-distill-qwen-7b",
		name: "DeepSeek R1 Distill Qwen 7B",
		developer: "DeepSeek / MLC AI",
		family: "DeepSeek R1",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "7.6B",
		paramValueMillion: 7600,
		downloadSizeMB: 4900,
		minRamGB: 16,
		recommendedRamGB: 32,
		minVramGB: 6.8,
		recommendedVramGB: 10,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 2048,
		contextWindow: 8192,
		description: "Heavyweight reasoning distillation model. Outperforms OpenAI o1-mini on competitive math and coding benchmarks, running locally via WebGPU.",
		useCases: [
			"Deep scientific reasoning",
			"Olympiad math",
			"Full stack code synthesis"
		],
		hfUrl: "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
		demoAvailable: !1,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from \"@mlc-ai/web-llm\";\n\nconst engine = await webllm.CreateMLCEngine(\"DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC\");\nconst reply = await engine.chat.completions.create({\n  messages: [{ role: \"user\", content: \"Solve this Putnam math problem: ...\" }]\n});\nconsole.log(reply.choices[0].message.content);"
		}
	},
	{
		id: "gemma-2-2b-it",
		name: "Gemma 2 2B Instruct",
		developer: "Google",
		family: "Gemma",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "2.6B",
		paramValueMillion: 2600,
		downloadSizeMB: 1780,
		minRamGB: 6,
		recommendedRamGB: 12,
		minVramGB: 2.8,
		recommendedVramGB: 4.5,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 1024,
		contextWindow: 8192,
		description: "Google's high-efficiency open model built with knowledge distillation. Offers remarkable conversational nuance and factual alignment.",
		useCases: [
			"Creative writing",
			"Factual QA",
			"Educational tutoring",
			"Client-side chat"
		],
		hfUrl: "https://huggingface.co/google/gemma-2-2b-it",
		demoAvailable: !0,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from \"@mlc-ai/web-llm\";\n\nconst engine = await webllm.CreateMLCEngine(\"gemma-2-2b-it-q4f16_1-MLC\");\nconst res = await engine.chat.completions.create({\n  messages: [{ role: \"user\", content: \"Teach me how gradient descent works like I am five.\" }]\n});\nconsole.log(res.choices[0].message.content);"
		}
	},
	{
		id: "phi-3.5-mini-instruct",
		name: "Phi-3.5 Mini Instruct",
		developer: "Microsoft",
		family: "Phi",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "3.8B",
		paramValueMillion: 3800,
		downloadSizeMB: 2350,
		minRamGB: 8,
		recommendedRamGB: 16,
		minVramGB: 3.8,
		recommendedVramGB: 6,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 1024,
		contextWindow: 16384,
		description: "Microsoft's state-of-the-art small model with 128k context support. Unmatched reasoning density for its parameter count.",
		useCases: [
			"Long document analysis",
			"Code refactoring",
			"Logic synthesis"
		],
		hfUrl: "https://huggingface.co/microsoft/Phi-3.5-mini-instruct",
		demoAvailable: !0,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from \"@mlc-ai/web-llm\";\n\nconst engine = await webllm.CreateMLCEngine(\"Phi-3.5-mini-instruct-q4f16_1-MLC\");\nconst out = await engine.chat.completions.create({\n  messages: [{ role: \"user\", content: \"Analyze this code for potential memory leaks...\" }]\n});\nconsole.log(out.choices[0].message.content);"
		}
	},
	{
		id: "tinyllama-1.1b-chat",
		name: "TinyLlama 1.1B Chat (WASM GGUF)",
		developer: "TinyLlama Team",
		family: "TinyLlama",
		modality: "LLM / Text",
		framework: "Wllama",
		format: "GGUF",
		quantization: "Q4_K_M",
		paramCount: "1.1B",
		paramValueMillion: 1100,
		downloadSizeMB: 669,
		minRamGB: 2.5,
		recommendedRamGB: 4,
		minVramGB: 0,
		recommendedVramGB: 0,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 0,
		contextWindow: 2048,
		description: "Runs on CPU via llama.cpp compiled to WebAssembly (WASM + SIMD). Does not require WebGPU or dedicated graphics cards at all.",
		useCases: [
			"Pure CPU environments",
			"Chromebooks",
			"Older PCs",
			"Firefox / Safari without WebGPU"
		],
		hfUrl: "https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Wllama (llama.cpp WASM)",
			lang: "javascript",
			code: "import { Wllama } from '@wllama/wllama';\n\nconst wllama = new Wllama({\n  'single-thread/wllama.wasm': '/wllama.wasm'\n});\n\nawait wllama.loadModelFromUrl('https://huggingface.co/.../tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf');\nconst output = await wllama.createCompletion('Hello, what can you do?', {\n  nPredict: 50,\n});\nconsole.log(output);"
		}
	},
	{
		id: "chrome-builtin-gemini-nano",
		name: "Chrome Built-in Gemini Nano",
		developer: "Google",
		family: "Gemini",
		modality: "LLM / Text",
		framework: "Chrome Built-in AI",
		format: "Native Chrome",
		quantization: "Native System",
		paramCount: "1.8B ~ 3B",
		paramValueMillion: 2e3,
		downloadSizeMB: 0,
		minRamGB: 4,
		recommendedRamGB: 8,
		minVramGB: 1,
		recommendedVramGB: 2,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 0,
		contextWindow: 4096,
		description: "Chrome's native on-device Gemini Nano accessible via window.ai.languageModel. Zero website bundle download; model is pre-installed in the browser.",
		useCases: [
			"Native zero-bundle chat",
			"Writing assistance",
			"Instant browser summarization"
		],
		demoAvailable: !0,
		codeSnippet: {
			framework: "Chrome Prompt API",
			lang: "javascript",
			code: "// Built-in Chrome Prompt API (Chrome 128+)\nif ('ai' in window && 'languageModel' in window.ai) {\n  const capabilities = await window.ai.languageModel.capabilities();\n  if (capabilities.available !== 'no') {\n    const session = await window.ai.languageModel.create();\n    const result = await session.prompt(\"Write a haiku about WebGPU.\");\n    console.log(result);\n  }\n}"
		}
	},
	{
		id: "all-minilm-l6-v2",
		name: "all-MiniLM-L6-v2",
		developer: "Sentence Transformers",
		family: "MiniLM",
		modality: "Embeddings",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "fp32 / q8",
		paramCount: "22M",
		paramValueMillion: 22,
		downloadSizeMB: 23,
		minRamGB: 1,
		recommendedRamGB: 2,
		minVramGB: .1,
		recommendedVramGB: .5,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 64,
		description: "The golden standard lightweight embedding model. 384 dimensions, blazing fast (under 15ms per sentence in browser). Compatible with almost every device.",
		useCases: [
			"Semantic search in IndexedDB",
			"In-browser vector database",
			"Duplicate detection",
			"RAG pipelines"
		],
		hfUrl: "https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2",
		demoAvailable: !0,
		testModelId: "Xenova/all-MiniLM-L6-v2",
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {\n  device: 'webgpu' // or 'wasm'\n});\n\nconst output = await extractor('Semantic search on the client side', {\n  pooling: 'mean',\n  normalize: true\n});\nconsole.log('Embedding vector (384d):', output.data);"
		}
	},
	{
		id: "bge-small-en-v1.5",
		name: "BGE Small EN v1.5",
		developer: "BAAI",
		family: "BGE",
		modality: "Embeddings",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8",
		paramCount: "33M",
		paramValueMillion: 33,
		downloadSizeMB: 67,
		minRamGB: 1,
		recommendedRamGB: 2,
		minVramGB: .2,
		recommendedVramGB: .5,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 64,
		description: "Top-ranking embedding model on MTEB benchmarks in the small weight class. Ideal for client-side local RAG knowledge bases.",
		useCases: [
			"Local RAG retrieval",
			"Recommendation engines",
			"Clustering user documents"
		],
		hfUrl: "https://huggingface.co/BAAI/bge-small-en-v1.5",
		demoAvailable: !0,
		testModelId: "Xenova/bge-small-en-v1.5",
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst pipe = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');\nconst embeddings = await pipe(['Document 1 text...', 'Document 2 text...'], {\n  pooling: 'cls',\n  normalize: true\n});\nconsole.log(embeddings);"
		}
	},
	{
		id: "nomic-embed-text-v1.5",
		name: "Nomic Embed Text v1.5",
		developer: "Nomic AI",
		family: "Nomic",
		modality: "Embeddings",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8",
		paramCount: "137M",
		paramValueMillion: 137,
		downloadSizeMB: 274,
		minRamGB: 2,
		recommendedRamGB: 4,
		minVramGB: .6,
		recommendedVramGB: 1.2,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 128,
		description: "8192-token context length embedding model with Matryoshka dimensionality reduction (truncate embeddings to 128d, 256d, or 768d).",
		useCases: [
			"Long document embeddings",
			"Flexible dimension vector search",
			"Code search"
		],
		hfUrl: "https://huggingface.co/nomic-ai/nomic-embed-text-v1.5",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst extractor = await pipeline('feature-extraction', 'nomic-ai/nomic-embed-text-v1.5', {\n  device: 'webgpu'\n});\nconst res = await extractor('search_query: What is WebGPU?');\nconsole.log(res);"
		}
	},
	{
		id: "multilingual-e5-small",
		name: "Multilingual E5 Small",
		developer: "Microsoft",
		family: "E5",
		modality: "Embeddings",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8",
		paramCount: "118M",
		paramValueMillion: 118,
		downloadSizeMB: 120,
		minRamGB: 1.5,
		recommendedRamGB: 3,
		minVramGB: .4,
		recommendedVramGB: 1,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 128,
		description: "High performance multilingual embeddings across 100+ languages. Perfect for internationalized client apps.",
		useCases: [
			"Cross-lingual search",
			"Multilingual document ranking",
			"Language clustering"
		],
		hfUrl: "https://huggingface.co/intfloat/multilingual-e5-small",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst pipe = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small');\nconst vector = await pipe('query: comment marche l intelligence artificielle?', {\n  pooling: 'mean',\n  normalize: true\n});"
		}
	},
	{
		id: "whisper-tiny-en",
		name: "Whisper Tiny (English)",
		developer: "OpenAI",
		family: "Whisper",
		modality: "Audio / Speech",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8 / fp32",
		paramCount: "39M",
		paramValueMillion: 39,
		downloadSizeMB: 75,
		minRamGB: 1.5,
		recommendedRamGB: 3,
		minVramGB: .3,
		recommendedVramGB: .8,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 128,
		description: "Ultra-fast speech-to-text in the browser. Transcribes audio chunks in real-time even on low-end laptops and mobile phones.",
		useCases: [
			"Voice commands",
			"Meeting live captions",
			"Voice notes transcription",
			"Accessibility"
		],
		hfUrl: "https://huggingface.co/openai/whisper-tiny.en",
		demoAvailable: !0,
		testModelId: "Xenova/whisper-tiny.en",
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-tiny.en', {\n  device: 'webgpu'\n});\n\n// Pass AudioBuffer or Float32Array from microphone\nconst result = await transcriber(audioData);\nconsole.log('Transcription:', result.text);"
		}
	},
	{
		id: "whisper-base-en",
		name: "Whisper Base (English)",
		developer: "OpenAI",
		family: "Whisper",
		modality: "Audio / Speech",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8",
		paramCount: "74M",
		paramValueMillion: 74,
		downloadSizeMB: 145,
		minRamGB: 2,
		recommendedRamGB: 4,
		minVramGB: .5,
		recommendedVramGB: 1.2,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 256,
		description: "Significantly higher accuracy than Tiny with only ~145MB download. Excellent balance of speed and recognition precision.",
		useCases: [
			"Dictation software",
			"Podcasts transcription",
			"Voice search"
		],
		hfUrl: "https://huggingface.co/openai/whisper-base.en",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-base.en', {\n  device: 'webgpu'\n});\nconst out = await transcriber(audioUrl);\nconsole.log(out.text);"
		}
	},
	{
		id: "whisper-small-en",
		name: "Whisper Small (English)",
		developer: "OpenAI",
		family: "Whisper",
		modality: "Audio / Speech",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8",
		paramCount: "244M",
		paramValueMillion: 244,
		downloadSizeMB: 480,
		minRamGB: 4,
		recommendedRamGB: 8,
		minVramGB: 1.2,
		recommendedVramGB: 2.5,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 512,
		description: "Professional grade speech recognition with low word-error-rate (WER). Requires WebGPU acceleration for fast real-time transcription.",
		useCases: ["High-accuracy legal/medical dictation", "Subtitling video editor"],
		hfUrl: "https://huggingface.co/openai/whisper-small.en",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-small.en', {\n  device: 'webgpu',\n  dtype: 'fp16'\n});\nconst res = await transcriber(audioData);\nconsole.log(res.text);"
		}
	},
	{
		id: "kokoro-82m-tts",
		name: "Kokoro 82M Text-to-Speech",
		developer: "Hexgrad / ONNX Community",
		family: "Kokoro",
		modality: "Audio / Speech",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "fp32 / q8",
		paramCount: "82M",
		paramValueMillion: 82,
		downloadSizeMB: 88,
		minRamGB: 2,
		recommendedRamGB: 4,
		minVramGB: .4,
		recommendedVramGB: 1,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 128,
		description: "Viral open-source text-to-speech model generating natural, human-like voice audio directly in browser memory without server APIs.",
		useCases: [
			"Client-side audio narration",
			"Screen readers",
			"Voice agents",
			"E-book readers"
		],
		hfUrl: "https://huggingface.co/hexgrad/Kokoro-82M",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { KokoroTTS } from 'kokoro-js';\n\nconst tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M', {\n  device: 'webgpu'\n});\nconst audio = await tts.generate('Hello from your local browser! No server required.');\nconst audioUrl = URL.createObjectURL(audio.toBlob());\nnew Audio(audioUrl).play();"
		}
	},
	{
		id: "moondream-2-vision-llm",
		name: "Moondream 2 (Vision LLM)",
		developer: "vikhyatk",
		family: "Moondream",
		modality: "Vision & Multimodal",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q4f16",
		paramCount: "1.8B",
		paramValueMillion: 1860,
		downloadSizeMB: 1200,
		minRamGB: 6,
		recommendedRamGB: 12,
		minVramGB: 2.2,
		recommendedVramGB: 4,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 512,
		description: "Small, nimble vision-language model. Ask questions about images, extract structured data, count objects, and inspect diagrams directly in the browser.",
		useCases: [
			"Visual question answering",
			"Receipt & invoice extraction",
			"Object identification",
			"Accessibility image captions"
		],
		hfUrl: "https://huggingface.co/vikhyatk/moondream2",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { AutoProcessor, MultiModalForCausalLM, RawImage } from '@huggingface/transformers';\n\nconst model = await MultiModalForCausalLM.from_pretrained('onnx-community/moondream2', {\n  device: 'webgpu',\n  dtype: 'q4f16'\n});\nconst processor = await AutoProcessor.from_pretrained('onnx-community/moondream2');\n\nconst image = await RawImage.fromURL('https://example.com/photo.jpg');\nconst prompt = \"<image>\\nDescribe what the person in the photo is holding.\";\nconst inputs = await processor(prompt, image);\nconst outputs = await model.generate({ ...inputs, max_new_tokens: 64 });"
		}
	},
	{
		id: "florence-2-base",
		name: "Florence-2 Base",
		developer: "Microsoft",
		family: "Florence",
		modality: "Vision & Multimodal",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8 / fp16",
		paramCount: "232M",
		paramValueMillion: 232,
		downloadSizeMB: 460,
		minRamGB: 3,
		recommendedRamGB: 6,
		minVramGB: 1.1,
		recommendedVramGB: 2.2,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 256,
		description: "Unified vision foundation model by Microsoft. Performs captioning, object detection, bounding box grounding, and OCR all in one model.",
		useCases: [
			"Visual object detection",
			"Dense image captioning",
			"Referring expression segmentation",
			"Document OCR"
		],
		hfUrl: "https://huggingface.co/microsoft/Florence-2-base",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { AutoProcessor, AutoModelForCausalLM, RawImage } from '@huggingface/transformers';\n\nconst model = await AutoModelForCausalLM.from_pretrained('onnx-community/Florence-2-base-ft', {\n  device: 'webgpu',\n  dtype: 'fp16'\n});\nconst processor = await AutoProcessor.from_pretrained('onnx-community/Florence-2-base-ft');\n// Run tasks like '<OD>' (Object Detection) or '<CAPTION>'"
		}
	},
	{
		id: "depth-anything-v2-small",
		name: "Depth Anything V2 Small",
		developer: "Depth Anything Team",
		family: "Depth Anything",
		modality: "Vision & Multimodal",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "fp16 / fp32",
		paramCount: "24M",
		paramValueMillion: 24,
		downloadSizeMB: 98,
		minRamGB: 1.5,
		recommendedRamGB: 3,
		minVramGB: .3,
		recommendedVramGB: .8,
		requiresWebGPU: !0,
		requiresShaderF16: !1,
		minStorageBufferMB: 128,
		description: "Monocular depth estimation that turns standard 2D photos into high-definition 3D depth maps in 30 milliseconds in your browser.",
		useCases: [
			"3D photo effects",
			"AR / WebXR",
			"Background blur / bokeh",
			"Robotics vision"
		],
		hfUrl: "https://huggingface.co/depth-anything/Depth-Anything-V2-Small",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst depthEstimator = await pipeline('depth-estimation', 'onnx-community/Depth-Anything-V2-Small', {\n  device: 'webgpu'\n});\n\nconst result = await depthEstimator('https://example.com/room.jpg');\n// result.depth is a raw grayscale canvas with precise z-depth values"
		}
	},
	{
		id: "clip-vit-base-patch32",
		name: "CLIP ViT-B/32 (Zero-Shot Vision)",
		developer: "OpenAI",
		family: "CLIP",
		modality: "Vision & Multimodal",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8",
		paramCount: "87M",
		paramValueMillion: 87,
		downloadSizeMB: 160,
		minRamGB: 2,
		recommendedRamGB: 4,
		minVramGB: .4,
		recommendedVramGB: 1,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 128,
		description: "Connects images and text into shared vector space. Enables instant zero-shot image search and visual categorization locally.",
		useCases: [
			"Photo gallery semantic search",
			"Zero-shot classification",
			"Visual similarity"
		],
		hfUrl: "https://huggingface.co/openai/clip-vit-base-patch32",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst classifier = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32');\nconst output = await classifier('https://example.com/photo.jpg', ['dog', 'cat', 'car', 'tree']);\nconsole.log(output);"
		}
	},
	{
		id: "mobilenet-v4-small",
		name: "MobileNetV4 Small",
		developer: "Google",
		family: "MobileNet",
		modality: "Vision & Multimodal",
		framework: "TensorFlow.js",
		format: "TFJS",
		quantization: "int8",
		paramCount: "4M",
		paramValueMillion: 4,
		downloadSizeMB: 14,
		minRamGB: .5,
		recommendedRamGB: 1,
		minVramGB: .05,
		recommendedVramGB: .2,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 32,
		description: "Ultra-lightweight real-time image classifier. Runs at 60 FPS even on low-cost mobile phones and smart displays.",
		useCases: [
			"Real-time webcam classification",
			"Smart web cameras",
			"Edge sensor processing"
		],
		hfUrl: "https://huggingface.co/google/mobilenet_v4_small",
		demoAvailable: !0,
		codeSnippet: {
			framework: "TensorFlow.js",
			lang: "javascript",
			code: "import * as tf from '@tensorflow/tfjs';\n\n// Works with WebGL, WebGPU, or CPU WASM\nawait tf.setBackend('webgl');\nconst model = await tf.loadGraphModel('https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v4_small/model.json');\nconst tensor = tf.browser.fromPixels(videoElement).expandDims(0);\nconst predictions = await model.predict(tensor);"
		}
	},
	{
		id: "yolov11n-detection",
		name: "YOLOv11 Nano (Object Detection)",
		developer: "Ultralytics",
		family: "YOLO",
		modality: "Vision & Multimodal",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "fp16 / fp32",
		paramCount: "2.6M",
		paramValueMillion: 2.6,
		downloadSizeMB: 11,
		minRamGB: 1,
		recommendedRamGB: 2,
		minVramGB: .1,
		recommendedVramGB: .4,
		requiresWebGPU: !0,
		requiresShaderF16: !1,
		minStorageBufferMB: 64,
		description: "Real-time multi-class object detector detecting people, cars, phones, and 80 COCO classes at 60+ FPS via WebGPU.",
		useCases: [
			"Webcam object tracking",
			"Security camera monitors",
			"Augmented reality"
		],
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst detector = await pipeline('object-detection', 'onnx-community/yolov11n-ONNX', {\n  device: 'webgpu'\n});\nconst results = await detector(videoElement);\nconsole.log(results); // [{ box: { xmin, ymin, xmax, ymax }, label: 'person', score: 0.94 }]"
		}
	},
	{
		id: "lcm-dreamshaper-v7",
		name: "LCM Dreamshaper v7 (Diffusion)",
		developer: "SimianLUO / LCM Team",
		family: "Latent Consistency",
		modality: "Image Generation",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "fp16",
		paramCount: "1.2B",
		paramValueMillion: 1200,
		downloadSizeMB: 1850,
		minRamGB: 8,
		recommendedRamGB: 16,
		minVramGB: 4,
		recommendedVramGB: 8,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 1024,
		description: "High-speed image synthesis generating 512x512 images in only 4 inference steps (~1-3 seconds on WebGPU).",
		useCases: [
			"Real-time AI drawing canvas",
			"In-browser image generation",
			"Game asset generator"
		],
		demoAvailable: !1,
		codeSnippet: {
			framework: "WebStableDiffusion",
			lang: "javascript",
			code: "// WebStableDiffusion WebGPU Pipeline\nconst pipeline = await createSDPipeline(\"LCM-Dreamshaper-v7-fp16\");\nconst imageCanvas = await pipeline.generate({\n  prompt: \"A cinematic cybernetic garden in Tokyo, 8k render\",\n  numInferenceSteps: 4,\n  guidanceScale: 2.0\n});"
		}
	},
	{
		id: "sd-turbo-onnx",
		name: "SD-Turbo ONNX WebGPU",
		developer: "Stability AI",
		family: "Stable Diffusion",
		modality: "Image Generation",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "fp16",
		paramCount: "1.4B",
		paramValueMillion: 1400,
		downloadSizeMB: 2300,
		minRamGB: 8,
		recommendedRamGB: 16,
		minVramGB: 4.5,
		recommendedVramGB: 8,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 1024,
		description: "1-step adversarial diffusion model. Generates full photographic images in a single forward pass over WebGPU.",
		useCases: [
			"Interactive live canvas",
			"Rapid prototyping",
			"Photorealistic text-to-image"
		],
		demoAvailable: !1,
		codeSnippet: {
			framework: "ONNX Runtime Web",
			lang: "javascript",
			code: "// ONNX Runtime Web WebGPU execution provider\nimport * as ort from 'onnxruntime-web/webgpu';\n// Loads UNet, VAE, and TextEncoder directly into WebGPU memory\nconst session = await ort.InferenceSession.create('sd_turbo_unet_fp16.onnx', {\n  executionProviders: ['webgpu']\n});"
		}
	},
	{
		id: "distilbert-sst2",
		name: "DistilBERT SST-2 (Sentiment Analysis)",
		developer: "Hugging Face",
		family: "DistilBERT",
		modality: "NLP & Classification",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8",
		paramCount: "66M",
		paramValueMillion: 66,
		downloadSizeMB: 67,
		minRamGB: 1,
		recommendedRamGB: 2,
		minVramGB: .1,
		recommendedVramGB: .4,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 64,
		description: "Fast sentiment analysis classifying text into Positive / Negative with confidence score in < 10 milliseconds.",
		useCases: [
			"Review sentiment analysis",
			"Customer support triage",
			"Social media monitoring",
			"Live comment filtering"
		],
		hfUrl: "https://huggingface.co/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
		demoAvailable: !0,
		testModelId: "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');\nconst output = await classifier('I absolutely love using on-device machine learning in the browser!');\nconsole.log(output); // [{ label: 'POSITIVE', score: 0.9998 }]"
		}
	},
	{
		id: "trocr-small-printed",
		name: "TrOCR Small Printed (OCR)",
		developer: "Microsoft",
		family: "TrOCR",
		modality: "NLP & Classification",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8",
		paramCount: "62M",
		paramValueMillion: 62,
		downloadSizeMB: 130,
		minRamGB: 1.5,
		recommendedRamGB: 3,
		minVramGB: .3,
		recommendedVramGB: .8,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 128,
		description: "Transformer-based Optical Character Recognition. Extracts typed and printed text from photos, scans, and documents with high fidelity.",
		useCases: [
			"Business card scanning",
			"Receipt digitizer",
			"Document archiving"
		],
		hfUrl: "https://huggingface.co/microsoft/trocr-small-printed",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst ocr = await pipeline('image-to-text', 'Xenova/trocr-small-printed');\nconst text = await ocr('https://example.com/receipt-snippet.png');\nconsole.log('Recognized text:', text[0].generated_text);"
		}
	},
	{
		id: "bart-large-mnli",
		name: "BART Large MNLI (Zero-Shot Classification)",
		developer: "Facebook / Meta",
		family: "BART",
		modality: "NLP & Classification",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8",
		paramCount: "407M",
		paramValueMillion: 407,
		downloadSizeMB: 420,
		minRamGB: 3,
		recommendedRamGB: 6,
		minVramGB: .9,
		recommendedVramGB: 2,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 256,
		description: "Classify any arbitrary text into custom label categories without training. Outstanding zero-shot accuracy.",
		useCases: [
			"Email classification",
			"Topic labeling",
			"Content moderation",
			"Lead categorization"
		],
		hfUrl: "https://huggingface.co/facebook/bart-large-mnli",
		demoAvailable: !0,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst classifier = await pipeline('zero-shot-classification', 'Xenova/bart-large-mnli');\nconst res = await classifier('Apple unveiled the new M4 chips with neural accelerators.', [\n  'technology', 'sports', 'finance', 'healthcare'\n]);\nconsole.log(res);"
		}
	},
	{
		id: "qwen-2.5-coder-1.5b-instruct",
		name: "Qwen 2.5 Coder 1.5B Instruct",
		developer: "Alibaba Cloud",
		family: "Qwen 2.5 Coder",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "1.5B",
		paramValueMillion: 1540,
		downloadSizeMB: 1050,
		minRamGB: 4,
		recommendedRamGB: 8,
		minVramGB: 2,
		recommendedVramGB: 3,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 512,
		contextWindow: 8192,
		description: "Specialized code generation model trained on 5.5 trillion tokens of source code. Delivers fast client-side code autocomplete and refactoring in browser IDEs.",
		useCases: [
			"In-browser code completion",
			"Bug fixing",
			"SQL query generation",
			"Unit test writing"
		],
		hfUrl: "https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct",
		demoAvailable: !0,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from \"@mlc-ai/web-llm\";\n\nconst engine = await webllm.CreateMLCEngine(\"Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC\");\nconst res = await engine.chat.completions.create({\n  messages: [{ role: \"user\", content: \"Write a high-performance LRU cache class in TypeScript.\" }]\n});\nconsole.log(res.choices[0].message.content);"
		}
	},
	{
		id: "qwen-2.5-coder-7b-instruct",
		name: "Qwen 2.5 Coder 7B Instruct",
		developer: "Alibaba Cloud",
		family: "Qwen 2.5 Coder",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "7.6B",
		paramValueMillion: 7600,
		downloadSizeMB: 4850,
		minRamGB: 16,
		recommendedRamGB: 24,
		minVramGB: 6.5,
		recommendedVramGB: 10,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 2048,
		contextWindow: 8192,
		description: "Flagship open code model competing with larger proprietary models. Capable of end-to-end software architecture synthesis directly in browser memory.",
		useCases: [
			"Full-stack code generation",
			"Multi-file refactoring",
			"Algorithm implementation"
		],
		hfUrl: "https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct",
		demoAvailable: !1,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from \"@mlc-ai/web-llm\";\n\nconst engine = await webllm.CreateMLCEngine(\"Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC\");\nconst res = await engine.chat.completions.create({\n  messages: [{ role: \"user\", content: \"Refactor this React hook to support Web Workers...\" }]\n});"
		}
	},
	{
		id: "llama-3.1-8b-instruct",
		name: "Llama 3.1 8B Instruct",
		developer: "Meta",
		family: "Llama 3.1",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "8.0B",
		paramValueMillion: 8030,
		downloadSizeMB: 4950,
		minRamGB: 16,
		recommendedRamGB: 32,
		minVramGB: 6.8,
		recommendedVramGB: 10,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 2048,
		contextWindow: 8192,
		description: "Meta's flagship 8B foundation model. Offers exceptional instruction following, general knowledge, and reasoning for high-end Apple Silicon and desktop GPUs.",
		useCases: [
			"Comprehensive enterprise assistants",
			"Complex logic puzzles",
			"Deep analytical synthesis"
		],
		hfUrl: "https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct",
		demoAvailable: !1,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from \"@mlc-ai/web-llm\";\n\nconst engine = await webllm.CreateMLCEngine(\"Llama-3.1-8B-Instruct-q4f16_1-MLC\");\nconst res = await engine.chat.completions.create({\n  messages: [{ role: \"user\", content: \"Explain how memory allocation works in modern WebAssembly runtimes.\" }]\n});"
		}
	},
	{
		id: "mistral-7b-instruct-v0.3",
		name: "Mistral 7B Instruct v0.3",
		developer: "Mistral AI",
		family: "Mistral",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "7.2B",
		paramValueMillion: 7200,
		downloadSizeMB: 4600,
		minRamGB: 16,
		recommendedRamGB: 24,
		minVramGB: 6.2,
		recommendedVramGB: 9,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 2048,
		contextWindow: 8192,
		description: "Renowned open model from Mistral AI with sliding-window attention and function calling support. Runs on WebGPU workstations.",
		useCases: [
			"Tool invocation",
			"Data extraction",
			"High-throughput chat"
		],
		hfUrl: "https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3",
		demoAvailable: !1,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from \"@mlc-ai/web-llm\";\n\nconst engine = await webllm.CreateMLCEngine(\"Mistral-7B-Instruct-v0.3-q4f16_1-MLC\");\nconst res = await engine.chat.completions.create({\n  messages: [{ role: \"user\", content: \"Summarize this RFC specification in three bullet points.\" }]\n});"
		}
	},
	{
		id: "whisper-large-v3-turbo",
		name: "Whisper Large v3 Turbo",
		developer: "OpenAI",
		family: "Whisper",
		modality: "Audio / Speech",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q4 / fp16",
		paramCount: "809M",
		paramValueMillion: 809,
		downloadSizeMB: 980,
		minRamGB: 6,
		recommendedRamGB: 12,
		minVramGB: 2.5,
		recommendedVramGB: 4.5,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 1024,
		description: "OpenAI's latest Whisper model with trimmed decoder layers. Delivers near-zero word error rate with 4x faster transcription speed on WebGPU.",
		useCases: [
			"High-accuracy transcription",
			"Live lecture subtitling",
			"Multilingual translation"
		],
		hfUrl: "https://huggingface.co/openai/whisper-large-v3-turbo",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-large-v3-turbo', {\n  device: 'webgpu',\n  dtype: 'fp16'\n});\n\nconst out = await transcriber(audioUrl);\nconsole.log('Transcription:', out.text);"
		}
	},
	{
		id: "bge-m3-embeddings",
		name: "BGE-M3 Multi-Function Embeddings",
		developer: "BAAI",
		family: "BGE",
		modality: "Embeddings",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8",
		paramCount: "568M",
		paramValueMillion: 568,
		downloadSizeMB: 610,
		minRamGB: 4,
		recommendedRamGB: 8,
		minVramGB: 1.2,
		recommendedVramGB: 2.5,
		requiresWebGPU: !0,
		requiresShaderF16: !1,
		minStorageBufferMB: 512,
		description: "State-of-the-art multilingual embedding model supporting dense, sparse, and multi-vector representations across 100+ languages with 8192 context.",
		useCases: [
			"Hybrid dense/sparse RAG",
			"Cross-language search",
			"Complex document clustering"
		],
		hfUrl: "https://huggingface.co/BAAI/bge-m3",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst extractor = await pipeline('feature-extraction', 'Xenova/bge-m3', {\n  device: 'webgpu'\n});\nconst embeddings = await extractor('Multi-vector search on WebGPU');"
		}
	},
	{
		id: "florence-2-large",
		name: "Florence-2 Large",
		developer: "Microsoft",
		family: "Florence",
		modality: "Vision & Multimodal",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8 / fp16",
		paramCount: "770M",
		paramValueMillion: 770,
		downloadSizeMB: 1100,
		minRamGB: 6,
		recommendedRamGB: 12,
		minVramGB: 2.5,
		recommendedVramGB: 4.5,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 1024,
		description: "Microsoft foundation vision model for advanced visual comprehension, dense region grounding, OCR, and multi-task object segmentation.",
		useCases: [
			"Visual document parsing",
			"Fine-grained object detection",
			"High-detail visual QA"
		],
		hfUrl: "https://huggingface.co/microsoft/Florence-2-large",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { AutoProcessor, AutoModelForCausalLM } from '@huggingface/transformers';\n\nconst model = await AutoModelForCausalLM.from_pretrained('onnx-community/Florence-2-large-ft', {\n  device: 'webgpu',\n  dtype: 'fp16'\n});"
		}
	},
	{
		id: "danube-3-500m-chat",
		name: "H2O Danube 3 500M Chat (WASM GGUF)",
		developer: "H2O.ai",
		family: "Danube",
		modality: "LLM / Text",
		framework: "Wllama",
		format: "GGUF",
		quantization: "Q4_K_M",
		paramCount: "500M",
		paramValueMillion: 500,
		downloadSizeMB: 330,
		minRamGB: 1.5,
		recommendedRamGB: 3,
		minVramGB: 0,
		recommendedVramGB: 0,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 0,
		contextWindow: 4096,
		description: "Compact 500M parameter model trained by H2O.ai. Excellent conversational density for pure CPU execution via WebAssembly SIMD.",
		useCases: [
			"Low-end mobile phones",
			"Chromebooks",
			"Offline browser extensions"
		],
		hfUrl: "https://huggingface.co/h2oai/h2o-danube3-500m-chat",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Wllama (llama.cpp WASM)",
			lang: "javascript",
			code: "import { Wllama } from '@wllama/wllama';\n\nconst wllama = new Wllama({ 'single-thread/wllama.wasm': '/wllama.wasm' });\nawait wllama.loadModelFromUrl('https://huggingface.co/.../danube3-500m-chat.Q4_K_M.gguf');\nconst res = await wllama.createCompletion('Explain gravity in simple terms.');"
		}
	},
	{
		id: "mediapipe-gemma-2b",
		name: "MediaPipe LLM (Gemma 2B)",
		developer: "Google",
		family: "Gemma",
		modality: "LLM / Text",
		framework: "MediaPipe",
		format: "ONNX",
		quantization: "int8",
		paramCount: "2.0B",
		paramValueMillion: 2e3,
		downloadSizeMB: 1550,
		minRamGB: 4,
		recommendedRamGB: 8,
		minVramGB: 2,
		recommendedVramGB: 3.5,
		requiresWebGPU: !0,
		requiresShaderF16: !1,
		minStorageBufferMB: 512,
		contextWindow: 4096,
		description: "Google's official MediaPipe Web LLM Inference engine. Optimized for WebGPU and CPU WebAssembly with streaming token generation.",
		useCases: [
			"Google ecosystem web apps",
			"On-device assistant",
			"Interactive web tools"
		],
		hfUrl: "https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference/web_js",
		demoAvailable: !1,
		codeSnippet: {
			framework: "MediaPipe Web",
			lang: "javascript",
			code: "import { FilesetResolver, LlmInference } from '@google/mediapipe-tasks-genai';\n\nconst genai = await FilesetResolver.forGenAiTasks('/wasm');\nconst llm = await LlmInference.createFromOptions(genai, {\n  baseOptions: { modelAssetPath: '/models/gemma-2b-it-gpu-int8.bin' },\n  maxTokens: 512\n});\nconst response = await llm.generateResponse(\"How do Web Workers work?\");"
		}
	},
	{
		id: "mediapipe-face-landmarker",
		name: "MediaPipe Face Mesh (478 Points)",
		developer: "Google",
		family: "MediaPipe Vision",
		modality: "Vision & Multimodal",
		framework: "MediaPipe",
		format: "TFJS",
		quantization: "fp32",
		paramCount: "5M",
		paramValueMillion: 5,
		downloadSizeMB: 18,
		minRamGB: 1,
		recommendedRamGB: 2,
		minVramGB: .1,
		recommendedVramGB: .5,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 32,
		description: "Real-time 478-point 3D facial landmark detection at 60 FPS in browser video streams. Powers filters, eye tracking, and expression detection.",
		useCases: [
			"Virtual try-on glasses/makeup",
			"Webcam avatar animation",
			"Eye gaze tracking"
		],
		demoAvailable: !1,
		codeSnippet: {
			framework: "MediaPipe Web",
			lang: "javascript",
			code: "import { FaceLandmarker, FilesetResolver } from '@google/mediapipe-tasks-vision';\n\nconst vision = await FilesetResolver.forVisionTasks('/wasm');\nconst landmarker = await FaceLandmarker.createFromOptions(vision, {\n  baseOptions: { modelAssetPath: '/models/face_landmarker.task' },\n  runningMode: 'VIDEO'\n});"
		}
	},
	{
		id: "universal-sentence-encoder",
		name: "Universal Sentence Encoder (USE)",
		developer: "Google",
		family: "USE",
		modality: "Embeddings",
		framework: "TensorFlow.js",
		format: "TFJS",
		quantization: "fp32",
		paramCount: "30M",
		paramValueMillion: 30,
		downloadSizeMB: 30,
		minRamGB: 1,
		recommendedRamGB: 2,
		minVramGB: .1,
		recommendedVramGB: .3,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 64,
		description: "Google's classic Universal Sentence Encoder in TensorFlow.js. Encodes sentences into 512-dimensional vectors with WebGL acceleration.",
		useCases: [
			"Fast semantic similarity",
			"Intent classification",
			"Duplicate text detection"
		],
		demoAvailable: !1,
		codeSnippet: {
			framework: "TensorFlow.js",
			lang: "javascript",
			code: "import * as tf from '@tensorflow/tfjs';\nimport * as use from '@tensorflow-models/universal-sentence-encoder';\n\nawait tf.setBackend('webgl');\nconst model = await use.load();\nconst embeddings = await model.embed(['How are you?', 'What is your status?']);\nembeddings.print();"
		}
	},
	{
		id: "deepseek-r1-distill-llama-8b",
		name: "DeepSeek R1 Distill Llama 8B",
		developer: "DeepSeek",
		family: "DeepSeek-R1",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "8.0B",
		paramValueMillion: 8030,
		downloadSizeMB: 4920,
		minRamGB: 16,
		recommendedRamGB: 32,
		minVramGB: 6,
		recommendedVramGB: 8,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 2048,
		contextWindow: 32768,
		description: "Llama 3.1 8B fine-tuned on DeepSeek R1 reasoning trajectories for rigorous analytical problem solving directly inside WebGPU.",
		useCases: [
			"Rigorous reasoning",
			"Logic & puzzle breakdown",
			"Long-form analytical reasoning"
		],
		hfUrl: "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
		demoAvailable: !1,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from '@mlc-ai/web-llm';\n\nconst engine = await webllm.CreateMLCEngine(\n  'DeepSeek-R1-Distill-Llama-8B-q4f16_1-MLC'\n);\nconst reply = await engine.chat.completions.create({\n  messages: [{ role: 'user', content: 'Explain Godel incompleteness theorems.' }]\n});"
		}
	},
	{
		id: "qwen2.5-0.5b-instruct",
		name: "Qwen 2.5 0.5B Instruct",
		developer: "Alibaba Cloud",
		family: "Qwen",
		modality: "LLM / Text",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q4f16",
		paramCount: "490M",
		paramValueMillion: 490,
		downloadSizeMB: 330,
		minRamGB: 2,
		recommendedRamGB: 4,
		minVramGB: .8,
		recommendedVramGB: 1.5,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 256,
		contextWindow: 8192,
		description: "Extremely lightweight multilingual model from the Qwen 2.5 family. Great balance of quality and sub-350MB bundle size for instant page load.",
		useCases: [
			"Multilingual chat",
			"Fast inline auto-completion",
			"Client-side summarization"
		],
		hfUrl: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct",
		demoAvailable: !0,
		testModelId: "onnx-community/Qwen2.5-0.5B-Instruct",
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst generator = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {\n  device: 'webgpu',\n  dtype: 'q4f16'\n});\nconst result = await generator('Summarize WebGPU benefits:');"
		}
	},
	{
		id: "qwen2.5-7b-instruct",
		name: "Qwen 2.5 7B Instruct",
		developer: "Alibaba Cloud",
		family: "Qwen",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "7.6B",
		paramValueMillion: 7610,
		downloadSizeMB: 4400,
		minRamGB: 16,
		recommendedRamGB: 32,
		minVramGB: 5.5,
		recommendedVramGB: 8,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 2048,
		contextWindow: 32768,
		description: "Flagship open-weights model excelling at mathematics, structured coding, and 29+ natural languages in WebGPU.",
		useCases: [
			"Complex coding assistance",
			"High-accuracy multilingual translation",
			"In-depth research"
		],
		hfUrl: "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct",
		demoAvailable: !1,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from '@mlc-ai/web-llm';\n\nconst engine = await webllm.CreateMLCEngine('Qwen2.5-7B-Instruct-q4f16_1-MLC');\nconst reply = await engine.chat.completions.create({\n  messages: [{ role: 'user', content: 'Generate a TypeScript state machine.' }]\n});"
		}
	},
	{
		id: "gemma-2-9b-it",
		name: "Gemma 2 9B Instruct",
		developer: "Google",
		family: "Gemma",
		modality: "LLM / Text",
		framework: "WebLLM",
		format: "WebGPU WGSL / MLC",
		quantization: "q4f16_1",
		paramCount: "9.2B",
		paramValueMillion: 9240,
		downloadSizeMB: 5600,
		minRamGB: 16,
		recommendedRamGB: 32,
		minVramGB: 7,
		recommendedVramGB: 12,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 2048,
		contextWindow: 8192,
		description: "Google's 9B parameter model trained on 8T tokens. Competes with models twice its size for complex reasoning and knowledge benchmarks.",
		useCases: [
			"In-depth writing and critique",
			"Technical document analysis",
			"Advanced agentic planning"
		],
		hfUrl: "https://huggingface.co/google/gemma-2-9b-it",
		demoAvailable: !1,
		codeSnippet: {
			framework: "WebLLM",
			lang: "javascript",
			code: "import * as webllm from '@mlc-ai/web-llm';\n\nconst engine = await webllm.CreateMLCEngine('gemma-2-9b-it-q4f16_1-MLC');"
		}
	},
	{
		id: "danube3-4b-chat",
		name: "H2O Danube 3 4B Chat",
		developer: "H2O.ai",
		family: "Danube",
		modality: "LLM / Text",
		framework: "Wllama",
		format: "GGUF",
		quantization: "Q4_K_M",
		paramCount: "4.0B",
		paramValueMillion: 4e3,
		downloadSizeMB: 2350,
		minRamGB: 6,
		recommendedRamGB: 12,
		minVramGB: 0,
		recommendedVramGB: 0,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 0,
		contextWindow: 8192,
		description: "Compact conversational model run via llama.cpp WebAssembly with multi-threading. Does not require a discrete GPU.",
		useCases: [
			"CPU-only devices",
			"Chromebook offline assistant",
			"Enterprise private chat"
		],
		hfUrl: "https://huggingface.co/h2oai/h2o-danube3-4b-chat",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Wllama",
			lang: "javascript",
			code: "import { Wllama } from '@wllama/wllama';\n\nconst wllama = new Wllama({ 'single-thread': false });\nawait wllama.loadModelFromUrl('https://huggingface.co/.../danube3-4b.gguf');\nconst output = await wllama.createCompletion('User: Hello! Assistant:');"
		}
	},
	{
		id: "whisper-small",
		name: "Whisper Small",
		developer: "OpenAI",
		family: "Whisper",
		modality: "Audio / Speech",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8 / fp16",
		paramCount: "244M",
		paramValueMillion: 244,
		downloadSizeMB: 480,
		minRamGB: 3,
		recommendedRamGB: 6,
		minVramGB: 1.2,
		recommendedVramGB: 2.5,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 256,
		description: "Higher accuracy speech transcription and translation model. Ideal for podcast transcripts, meetings, and video subtitle generation.",
		useCases: [
			"Multilingual video transcription",
			"Voice note transcription",
			"Meeting minutes generator"
		],
		hfUrl: "https://huggingface.co/openai/whisper-small",
		demoAvailable: !0,
		testModelId: "onnx-community/whisper-small",
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-small', {\n  device: 'webgpu'\n});\nconst result = await transcriber(audioFloat32Array);"
		}
	},
	{
		id: "whisper-medium",
		name: "Whisper Medium",
		developer: "OpenAI",
		family: "Whisper",
		modality: "Audio / Speech",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q4f16",
		paramCount: "769M",
		paramValueMillion: 769,
		downloadSizeMB: 890,
		minRamGB: 6,
		recommendedRamGB: 10,
		minVramGB: 2.5,
		recommendedVramGB: 4.5,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 1024,
		description: "Near human-level accuracy for complex audio with heavy accents or background noise. Powered by WebGPU fp16 acceleration.",
		useCases: [
			"High-fidelity medical/legal transcription",
			"Accent-heavy audio translation",
			"Professional subtitling"
		],
		hfUrl: "https://huggingface.co/openai/whisper-medium",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-medium', {\n  device: 'webgpu',\n  dtype: 'q4f16'\n});"
		}
	},
	{
		id: "musicgen-small",
		name: "MusicGen Small",
		developer: "Meta",
		family: "MusicGen",
		modality: "Audio / Speech",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8 / fp32",
		paramCount: "300M",
		paramValueMillion: 300,
		downloadSizeMB: 620,
		minRamGB: 4,
		recommendedRamGB: 8,
		minVramGB: 1.5,
		recommendedVramGB: 3,
		requiresWebGPU: !0,
		requiresShaderF16: !1,
		minStorageBufferMB: 512,
		description: "Generates original audio and music from natural language text prompts directly inside the browser using WebGPU and Web Audio API.",
		useCases: [
			"Background music generator",
			"Game audio soundscaping",
			"Podcast intro creation"
		],
		hfUrl: "https://huggingface.co/facebook/musicgen-small",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst synthesizer = await pipeline('text-to-audio', 'Xenova/musicgen-small', {\n  device: 'webgpu'\n});\nconst audio = await synthesizer('An 80s synthwave dance track with punchy drums');"
		}
	},
	{
		id: "silero-vad",
		name: "Silero VAD (Voice Activity Detector)",
		developer: "Silero",
		family: "Silero",
		modality: "Audio / Speech",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "fp32",
		paramCount: "1.5M",
		paramValueMillion: 1.5,
		downloadSizeMB: 2,
		minRamGB: .5,
		recommendedRamGB: 1,
		minVramGB: 0,
		recommendedVramGB: 0,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 32,
		description: "Sub-2MB voice activity detector that processes 30ms audio chunks in less than 1ms. Ideal for live microphone silence trimming before LLM prompts.",
		useCases: [
			"Voice assistant trigger",
			"Push-to-talk automation",
			"Speech boundary detection"
		],
		hfUrl: "https://huggingface.co/onnx-community/silero-vad",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { AutoModel, AutoProcessor } from '@huggingface/transformers';\n\nconst model = await AutoModel.from_pretrained('onnx-community/silero-vad');\n// Run inference on 512-sample PCM chunks in <1ms"
		}
	},
	{
		id: "llava-onevision-0.5b",
		name: "LLaVA OneVision Qwen2 0.5B",
		developer: "LLaVA Team",
		family: "LLaVA",
		modality: "Vision & Multimodal",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q4f16",
		paramCount: "800M",
		paramValueMillion: 800,
		downloadSizeMB: 650,
		minRamGB: 4,
		recommendedRamGB: 8,
		minVramGB: 1.8,
		recommendedVramGB: 3.5,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 512,
		description: "Compact multimodal visual assistant able to inspect images, charts, and diagrams directly in the browser tab with zero server roundtrips.",
		useCases: [
			"Visual chart extraction",
			"Webcam object recognition",
			"Receipt reading"
		],
		hfUrl: "https://huggingface.co/llava-hf/llava-onevision-qwen2-0.5b-ov-hf",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst vlm = await pipeline('image-text-to-text', 'onnx-community/llava-onevision-qwen2-0.5b-ov-hf', {\n  device: 'webgpu',\n  dtype: 'q4f16'\n});\nconst answer = await vlm({ image: 'https://...', prompt: 'What is shown in this chart?' });"
		}
	},
	{
		id: "rmbg-2.0",
		name: "Bria RMBG 2.0 (Background Remover)",
		developer: "Bria AI",
		family: "RMBG",
		modality: "Vision & Multimodal",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "fp16",
		paramCount: "44M",
		paramValueMillion: 44,
		downloadSizeMB: 90,
		minRamGB: 2,
		recommendedRamGB: 4,
		minVramGB: .6,
		recommendedVramGB: 1.5,
		requiresWebGPU: !0,
		requiresShaderF16: !1,
		minStorageBufferMB: 256,
		description: "State-of-the-art background removal model in 90MB. Strips backgrounds from portraits and ecommerce products entirely inside the browser.",
		useCases: [
			"E-commerce product cutout",
			"Profile picture background removal",
			"Design tools"
		],
		hfUrl: "https://huggingface.co/briaai/RMBG-2.0",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst segmenter = await pipeline('image-segmentation', 'briaai/RMBG-2.0', {\n  device: 'webgpu'\n});\nconst cutout = await segmenter('https://example.com/product.jpg');"
		}
	},
	{
		id: "mobile-sam",
		name: "MobileSAM (Segment Anything)",
		developer: "Chaoning Zhang et al.",
		family: "SAM",
		modality: "Vision & Multimodal",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8 / fp32",
		paramCount: "9.8M",
		paramValueMillion: 9.8,
		downloadSizeMB: 40,
		minRamGB: 1.5,
		recommendedRamGB: 3,
		minVramGB: .4,
		recommendedVramGB: 1,
		requiresWebGPU: !0,
		requiresShaderF16: !1,
		minStorageBufferMB: 128,
		description: "Lightweight adaptation of Meta Segment Anything Model. Computes image embeddings and allows click-to-segment masks in milliseconds.",
		useCases: [
			"Interactive image masking",
			"Smart canvas selection",
			"Video rotoscoping"
		],
		hfUrl: "https://huggingface.co/Xenova/mobile-sam",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { SamModel, AutoProcessor } from '@huggingface/transformers';\n\nconst model = await SamModel.from_pretrained('Xenova/mobile-sam', { device: 'webgpu' });"
		}
	},
	{
		id: "modernbert-base",
		name: "ModernBERT Base",
		developer: "Answer.AI & LightOn",
		family: "ModernBERT",
		modality: "Embeddings",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8 / fp16",
		paramCount: "149M",
		paramValueMillion: 149,
		downloadSizeMB: 310,
		minRamGB: 2.5,
		recommendedRamGB: 5,
		minVramGB: .8,
		recommendedVramGB: 1.5,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 256,
		description: "Modernized encoder architecture with rotary embeddings (RoPE), unpadding, and native 8192 context length. SOTA encoder for search.",
		useCases: [
			"Semantic search",
			"Document classification",
			"Vector embeddings"
		],
		hfUrl: "https://huggingface.co/onnx-community/ModernBERT-base",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst pipe = await pipeline('feature-extraction', 'onnx-community/ModernBERT-base');"
		}
	},
	{
		id: "mxbai-embed-large-v1",
		name: "mxbai-embed-large-v1",
		developer: "Mixedbread AI",
		family: "mxbai",
		modality: "Embeddings",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8 / fp32",
		paramCount: "335M",
		paramValueMillion: 335,
		downloadSizeMB: 670,
		minRamGB: 3.5,
		recommendedRamGB: 6,
		minVramGB: 1,
		recommendedVramGB: 2,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 512,
		description: "Top-ranking 1024-dimension embedding model on the MTEB leaderboard. Provides retrieval quality on par with proprietary hosted embedding APIs.",
		useCases: [
			"High-precision enterprise search",
			"RAG pipelines in-browser",
			"Legal & medical discovery"
		],
		hfUrl: "https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst embedder = await pipeline('feature-extraction', 'mixedbread-ai/mxbai-embed-large-v1');"
		}
	},
	{
		id: "snowflake-arctic-embed-m",
		name: "Snowflake Arctic Embed M",
		developer: "Snowflake",
		family: "Arctic",
		modality: "Embeddings",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "q8 / fp32",
		paramCount: "110M",
		paramValueMillion: 110,
		downloadSizeMB: 220,
		minRamGB: 1.5,
		recommendedRamGB: 3,
		minVramGB: .4,
		recommendedVramGB: .8,
		requiresWebGPU: !1,
		requiresShaderF16: !1,
		minStorageBufferMB: 128,
		description: "High-efficiency embedding model built by Snowflake specifically for fast corporate document retrieval and hybrid search.",
		useCases: [
			"Enterprise knowledge search",
			"Local code search",
			"E-commerce recommendations"
		],
		hfUrl: "https://huggingface.co/Snowflake/snowflake-arctic-embed-m",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "import { pipeline } from '@huggingface/transformers';\n\nconst extractor = await pipeline('feature-extraction', 'Snowflake/snowflake-arctic-embed-m');"
		}
	},
	{
		id: "sd-turbo",
		name: "SD-Turbo (Single-Step Diffusion)",
		developer: "Stability AI",
		family: "Stable Diffusion",
		modality: "Image Generation",
		framework: "Transformers.js",
		format: "ONNX",
		quantization: "fp16",
		paramCount: "1.0B",
		paramValueMillion: 1e3,
		downloadSizeMB: 2100,
		minRamGB: 8,
		recommendedRamGB: 16,
		minVramGB: 4.5,
		recommendedVramGB: 8,
		requiresWebGPU: !0,
		requiresShaderF16: !0,
		minStorageBufferMB: 1024,
		description: "Adversarial diffusion distillation model generating 512x512 images in a single step with zero server latency on high-end WebGPU.",
		useCases: [
			"Real-time canvas drawing prompt",
			"Avatar generation",
			"Instant AI sketches"
		],
		hfUrl: "https://huggingface.co/stabilityai/sd-turbo",
		demoAvailable: !1,
		codeSnippet: {
			framework: "Transformers.js v3",
			lang: "javascript",
			code: "// Experimental WebGPU single-step diffusion pipeline\nimport { AutoModelForImageGeneration } from '@huggingface/transformers';"
		}
	}
];
//#endregion
//#region src/lib/index.ts
async function l(e, t) {
	let n = await o(), r = n.hasWebGPU ? n.hasShaderF16 ? "webgpu-f16" : "webgpu-nof16" : "wasm-cpu", i = t ? {
		isActive: !0,
		ramGB: t.ram ?? n.reportedRamGB ?? 8,
		cpuCores: t.cpuCores ?? n.cpuCores ?? 8,
		gpuBackend: t.gpu ?? r,
		maxStorageBufferMB: n.webgpuLimits ? Math.round(n.webgpuLimits.maxStorageBufferBindingSize / 1048576) : 128,
		storageAvailableGB: n.storageAvailableGB ?? 25,
		hasWasmSimd: n.hasWasmSimd ?? !0,
		downlinkMbps: n.downlinkMbps ?? 50
	} : {
		isActive: !1,
		ramGB: n.reportedRamGB ?? 8,
		cpuCores: n.cpuCores ?? 8,
		gpuBackend: r,
		maxStorageBufferMB: n.webgpuLimits ? Math.round(n.webgpuLimits.maxStorageBufferBindingSize / 1048576) : 128,
		storageAvailableGB: n.storageAvailableGB ?? 25,
		hasWasmSimd: n.hasWasmSimd ?? !0,
		downlinkMbps: n.downlinkMbps ?? 50
	};
	if (!e) return {
		hardware: n,
		models: c.map((e) => ({
			model: e,
			evaluation: s(e, n, i)
		})).sort((e, t) => t.evaluation.score - e.evaluation.score)
	};
	let a = e.toLowerCase(), l = c.find((e) => e.id.toLowerCase() === a || e.name.toLowerCase().includes(a) || e.hfUrl && e.hfUrl.toLowerCase().includes(a));
	if (!l) throw Error(`[browser-llm-fit] Unknown model "${e}". Call fit() without arguments to inspect supported models.`);
	let u = s(l, n, i);
	return {
		fits: u.tier !== "incompatible",
		tier: u.tier,
		score: u.score,
		headline: u.headline,
		summary: u.summary,
		speed: u.estimatedSpeed,
		checks: u.checks,
		hardware: n,
		model: l
	};
}
//#endregion
export { c as IN_BROWSER_MODELS, l as default, o as detectHardware, o as detectHardwareProfile, s as evaluateModelCompatibility };
