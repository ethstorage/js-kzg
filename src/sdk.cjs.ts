import { kzgBase } from './sdk';
import path from 'node:path';

export class Kzg extends kzgBase {
    protected getWorkerPath(): string {
        return path.join(__dirname, 'worker.cjs');
    };
}
