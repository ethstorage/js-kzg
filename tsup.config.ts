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

    // browser
    {
        entry: ['src/browser/sdk.ts', 'src/browser/worker.ts'],
        format: ['esm'],
        platform: 'browser',
        target: 'esnext',
        outDir: 'dist/browser',
        clean: true,
        splitting: false,
        bundle: true,
        noExternal: ['comlink', 'micro-eth-signer', '@paulmillr/trusted-setups'],
    }
])
