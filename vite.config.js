import { defineConfig } from 'vite';
import { resolve } from 'path';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
	build: {
		lib: {
			entry: {
				sdk: resolve(__dirname, 'src/browser/sdk.ts'),
				worker: resolve(__dirname, 'src/browser/worker.ts'),
			},
			formats: ['es'],
			fileName: (format, entryName) => {
				return entryName === 'worker' ? 'worker.mjs' : `${entryName}.js`;
			}
		},
		outDir: 'dist/browser',
		emptyOutDir: true,
		target: 'es2022',
		rollupOptions: {
			output: {
				entryFileNames: (chunkInfo) => {
					return chunkInfo.name === 'worker' ? 'worker.mjs' : '[name].js';
				},
				assetFileNames: 'assets/[name][extname]',
			}
		}
	},
	optimizeDeps: {
		exclude: ['kzg-wasm'],
	},
	plugins: [
		wasm(),
		topLevelAwait(),
	]
});
