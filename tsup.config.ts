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

    // browser
    {
        entry: ['src/browser/sdk.ts'],
        format: ['esm'],
        platform: 'browser',
        target: 'esnext',
        outDir: 'dist/browser',
        clean: true,
        splitting: false,
        bundle: true,
        noExternal: ['rust-kzg-node-wasm32-wasi'],
        onSuccess: () => {
            const wasmSrc = path.resolve(
                'node_modules/rust-kzg-node-wasm32-wasi/rust_kzg_node.wasm32-wasi.wasm'
            );
            const wasmDest = path.resolve('dist/browser');
            console.log('Copying wasm file to browser dist...');
            execSync(`copyfiles -f ${wasmSrc} ${wasmDest}`);
        },
    }
])
