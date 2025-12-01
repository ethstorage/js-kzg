import { defineConfig } from 'tsup';
import { execSync } from 'child_process';
import path from 'path';

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
        external: ['rust-kzg-node'],
    },
])
