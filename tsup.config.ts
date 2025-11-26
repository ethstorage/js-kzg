import { defineConfig } from 'tsup'

export default defineConfig([
    // Node SDK
    {
        entry: ['src/node/sdk.ts'],
        format: ['cjs', 'esm'],
        platform: 'node',
        outDir: 'dist/node',
        clean: true,
        dts: true,
        splitting: false,
        bundle: false,
        noExternal: ['rust-kzg-node'],
        sourcemap: true,
    },

    // browser
    {
        entry: ['src/browser/sdk.ts'],
        format: ['esm'],
        platform: 'browser',
        target: 'esnext',
        outDir: 'dist/browser',
        clean: true,
        bundle: true,
        splitting: false,
        noExternal: ['rust-kzg-node-wasm32-wasi'],
        sourcemap: true,
    }
])
