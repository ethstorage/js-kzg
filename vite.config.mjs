import { defineConfig } from 'vite';
import { resolve } from 'path';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
	build: {
		lib: {
			entry: {
				sdk: resolve(__dirname, 'src/browser/sdk.ts')
			},
			formats: ['es'],
			fileName: (format, entryName) => {
				return `${entryName}.mjs`;
			}
		},
		outDir: 'dist/browser',
		emptyOutDir: true,
		target: 'es2022',
		rollupOptions: {
			output: {
				assetFileNames: 'assets/[name][extname]',
			}
		}
	},
	optimizeDeps: {
		exclude: ['kzg-wasm'],
	},
	plugins: [
		wasm()
	]
});
