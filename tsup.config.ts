import { defineConfig } from 'tsup'

export default defineConfig([
    {
        entry: ['src/worker.ts'],
        format: ['cjs', 'esm'],
        platform: 'node',
        outDir: 'dist',
        splitting: false,
        clean: true,
        dts: true,
        sourcemap: true,
        outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.mjs' }),
    },
    {
        entry: ['src/sdk.cjs.ts'],
        format: ['cjs'],
        outDir: 'dist',
        outExtension: () => ({ js: '.cjs' }),
        dts: true,
    },
    {
        entry: ['src/sdk.mjs.ts'],
        format: ['esm'],
        outDir: 'dist',
        outExtension: () => ({ js: '.mjs' }),
        dts: false,
    },
    {
        entry: ['src/sdk.browser.ts'],
        format: ['esm'],
        outDir: 'dist',
        outExtension: () => ({ js: '.mjs' }),
        dts: false,
    }
])
