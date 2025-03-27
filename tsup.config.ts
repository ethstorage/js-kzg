import { defineConfig } from 'tsup'

export default defineConfig([
    {
        entry: ['src/node/worker/worker.ts'],
        format: ['cjs', 'esm'],
        platform: 'neutral',
        outDir: 'dist',
        splitting: false,
        clean: true,
        outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.mjs' }),
    },
    {
        entry: ['src/node/sdk.cjs.ts'],
        format: ['cjs'],
        outDir: 'dist',
        outExtension: () => ({ js: '.cjs' }),
        dts: true,
    },
    {
        entry: ['src/node/sdk.mjs.ts'],
        format: ['esm'],
        outDir: 'dist',
        outExtension: () => ({ js: '.mjs' }),
    },

    {
        entry: ['src/browser/sdk.ts'],
        format: ['esm'],
        splitting: false,
        noExternal: ['comlink'],
        bundle: true,
        clean: true,
        sourcemap: true,
        outDir: 'dist/browser',
    }
])
