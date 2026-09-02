import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'dist-lib',
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/lib/index.ts'),
      name: 'browserLlmFit',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['@huggingface/transformers', 'react', 'react-dom'],
      output: {
        exports: 'named',
      },
    },
  },
});
