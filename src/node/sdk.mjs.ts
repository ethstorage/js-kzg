import { kzgBase } from './sdk';
import { fileURLToPath } from 'node:url';

export class Kzg extends kzgBase {
    protected getWorkerPath(): string {
        return fileURLToPath(new URL('../dist/worker.mjs', import.meta.url));
    };
}
