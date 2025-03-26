import { kzgBase } from './sdk';

export class Kzg extends kzgBase {
    protected getWorkerPath(): string {
        return new URL('./worker.mjs', import.meta.url).href;
    }
}
