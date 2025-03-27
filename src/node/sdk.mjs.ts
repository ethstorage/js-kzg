import { KZGBase } from './sdk';
import { fileURLToPath } from 'node:url';

export class KZG extends KZGBase {
    protected getWorkerPath(): string {
        return fileURLToPath(new URL('../dist/worker.mjs', import.meta.url));
    };
}
