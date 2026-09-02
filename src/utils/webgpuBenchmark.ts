export interface BenchmarkResults {
  webgpuSupported: boolean;
  maxAllocatableBufferMB: number;
  testedSizesMB: { sizeMB: number; success: boolean; timeMs: number }[];
  gflops: number | null;
  computeTimeMs: number | null;
  timestamp: string;
  notes: string[];
}

// Safe GPUBufferUsage bit flags fallback
const BUFFER_STORAGE = typeof GPUBufferUsage !== 'undefined' ? GPUBufferUsage.STORAGE : 0x0080;
const BUFFER_COPY_DST = typeof GPUBufferUsage !== 'undefined' ? GPUBufferUsage.COPY_DST : 0x0008;
const BUFFER_COPY_SRC = typeof GPUBufferUsage !== 'undefined' ? GPUBufferUsage.COPY_SRC : 0x0004;

export async function runHardwareDiagnostics(): Promise<BenchmarkResults> {
  const notes: string[] = [];
  const testedSizesMB: { sizeMB: number; success: boolean; timeMs: number }[] = [];
  let maxAllocatableBufferMB = 0;
  let gflops: number | null = null;
  let computeTimeMs: number | null = null;

  if (!('gpu' in navigator) || !navigator.gpu) {
    notes.push('WebGPU is not supported or is disabled in your browser.');
    return {
      webgpuSupported: false,
      maxAllocatableBufferMB: 0,
      testedSizesMB: [],
      gflops: null,
      computeTimeMs: null,
      timestamp: new Date().toLocaleTimeString(),
      notes,
    };
  }

  let device: GPUDevice | null = null;
  try {
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: 'high-performance'
    });
    if (!adapter) {
      notes.push('Could not obtain a high-performance WebGPU adapter.');
      return {
        webgpuSupported: false,
        maxAllocatableBufferMB: 0,
        testedSizesMB: [],
        gflops: null,
        computeTimeMs: null,
        timestamp: new Date().toLocaleTimeString(),
        notes,
      };
    }

    const requiredFeatures: GPUFeatureName[] = [];
    if (adapter.features.has('shader-f16')) {
      requiredFeatures.push('shader-f16');
    }

    device = await adapter.requestDevice({
      requiredFeatures,
      requiredLimits: {
        maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
        maxBufferSize: adapter.limits.maxBufferSize,
      }
    });

    notes.push(`WebGPU device acquired with ${requiredFeatures.length} enabled feature(s).`);

    // 1. Live Buffer Allocation Stress Test
    // Test progressively: 32MB, 64MB, 128MB, 256MB, 512MB, 1024MB, 2048MB
    const sizesToTest = [32, 64, 128, 256, 512, 1024, 2048];
    const maxLimitBytes = adapter.limits.maxStorageBufferBindingSize;

    for (const sizeMB of sizesToTest) {
      const sizeBytes = sizeMB * 1024 * 1024;
      if (sizeBytes > maxLimitBytes) {
        testedSizesMB.push({
          sizeMB,
          success: false,
          timeMs: 0
        });
        continue;
      }

      const t0 = performance.now();
      try {
        const buffer = device.createBuffer({
          size: sizeBytes,
          usage: BUFFER_STORAGE | BUFFER_COPY_DST,
        });

        // Destroy buffer to reclaim memory immediately
        buffer.destroy();
        const t1 = performance.now();
        testedSizesMB.push({
          sizeMB,
          success: true,
          timeMs: Math.round((t1 - t0) * 100) / 100
        });
        maxAllocatableBufferMB = sizeMB;
      } catch (err) {
        testedSizesMB.push({
          sizeMB,
          success: false,
          timeMs: 0
        });
        notes.push(`Buffer allocation of ${sizeMB}MB failed: ${(err as Error).message}`);
        break;
      }
    }

    // 2. Compute Shader Matrix Multiply Test (512x512 matrix multiplication)
    try {
      const N = 512;
      const wgsl = `
        @group(0) @binding(0) var<storage, read> matrixA: array<f32>;
        @group(0) @binding(1) var<storage, read> matrixB: array<f32>;
        @group(0) @binding(2) var<storage, read_write> matrixC: array<f32>;

        @compute @workgroup_size(16, 16)
        fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
          let row = global_id.x;
          let col = global_id.y;
          let n = 512u;
          if (row >= n || col >= n) {
            return;
          }
          var sum = 0.0;
          for (var k = 0u; k < n; k = k + 1u) {
            sum = sum + matrixA[row * n + k] * matrixB[k * n + col];
          }
          matrixC[row * n + col] = sum;
        }
      `;

      const shaderModule = device.createShaderModule({ code: wgsl });
      const pipeline = device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: shaderModule,
          entryPoint: 'main'
        }
      });

      const matrixSize = N * N * 4; // Float32
      const bufA = device.createBuffer({ size: matrixSize, usage: BUFFER_STORAGE, mappedAtCreation: true });
      new Float32Array(bufA.getMappedRange()).fill(1.0);
      bufA.unmap();

      const bufB = device.createBuffer({ size: matrixSize, usage: BUFFER_STORAGE, mappedAtCreation: true });
      new Float32Array(bufB.getMappedRange()).fill(2.0);
      bufB.unmap();

      const bufC = device.createBuffer({ size: matrixSize, usage: BUFFER_STORAGE | BUFFER_COPY_SRC });

      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: bufA } },
          { binding: 1, resource: { buffer: bufB } },
          { binding: 2, resource: { buffer: bufC } },
        ]
      });

      // Warm up
      const commandEncoderWarm = device.createCommandEncoder();
      const passWarm = commandEncoderWarm.beginComputePass();
      passWarm.setPipeline(pipeline);
      passWarm.setBindGroup(0, bindGroup);
      passWarm.dispatchWorkgroups(N / 16, N / 16);
      passWarm.end();
      device.queue.submit([commandEncoderWarm.finish()]);
      await device.queue.onSubmittedWorkDone();

      // Benchmark timed pass
      const benchStart = performance.now();
      const commandEncoder = device.createCommandEncoder();
      const pass = commandEncoder.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      // Run 4 dispatches to average
      const iterations = 4;
      for (let i = 0; i < iterations; i++) {
        pass.dispatchWorkgroups(N / 16, N / 16);
      }
      pass.end();
      device.queue.submit([commandEncoder.finish()]);
      await device.queue.onSubmittedWorkDone();
      const benchEnd = performance.now();

      computeTimeMs = Math.round((benchEnd - benchStart) / iterations * 10) / 10;
      // Flops = 2 * N^3 operations per iteration
      const totalOps = 2 * Math.pow(N, 3);
      const seconds = (computeTimeMs / 1000);
      gflops = Math.round((totalOps / seconds / 1e9) * 10) / 10;

      notes.push(`GPU Compute Shader test: ~${gflops} GFLOPS with ${computeTimeMs}ms average dispatch latency.`);

      bufA.destroy();
      bufB.destroy();
      bufC.destroy();
    } catch (computeErr) {
      notes.push(`Compute shader test skipped: ${(computeErr as Error).message}`);
    }

    device.destroy();
  } catch (e) {
    notes.push(`Diagnostic error: ${(e as Error).message}`);
  }

  return {
    webgpuSupported: true,
    maxAllocatableBufferMB,
    testedSizesMB,
    gflops,
    computeTimeMs,
    timestamp: new Date().toLocaleTimeString(),
    notes,
  };
}
