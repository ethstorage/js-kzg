import { KZGBase } from './sdk';
import path from 'node:path';

export class KZG extends KZGBase {
    protected getWorkerPath(): string {
        return path.join(__dirname, 'worker.cjs');
    };
}
