import { defineConfig } from 'vite';
import { resolve } from 'path';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
	server: {
		port: 8080,
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp',
			'Cross-Origin-Resource-Policy': 'same-origin'
		}
	},
	build: {
		lib: {
			entry: resolve(__dirname, 'src/browser/sdk.ts'),
			formats: ['es'],
			fileName: 'sdk'
		},
		outDir: 'dist/browser',
		emptyOutDir: true,
		target: 'es2022',
		rollupOptions: {
			external: ['env', 'wasi', 'wasi_snapshot_preview1'],
		}
	},
	optimizeDeps: {
		exclude: ['rust-kzg-node-wasm32-wasi']
	},
	plugins: [
		wasm()
	]
});
