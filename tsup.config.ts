import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/sdk.ts', 'src/worker.ts'],
    format: ['cjs', 'esm'],
    platform: 'neutral',
    outDir: 'dist',
    splitting: false,
    clean: true,
    dts: true,
    sourcemap: true
})
