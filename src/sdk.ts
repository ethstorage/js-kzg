import workerpool from 'workerpool';
import { hexlify, getBytes } from './utils/converter';

export abstract class kzgBase {
    private pool: workerpool.Pool;

    protected abstract getWorkerPath(): string;

    constructor() {
        this.pool = workerpool.pool(this.getWorkerPath(), {
            minWorkers: 'max'
        });
    }

    async blobToKzgCommitment(blob: Uint8Array): Promise<Uint8Array> {
        const hexBlob = this.uint8ToHex(blob);
        const result = await this.pool.exec('computeCommitment', [hexBlob]);
        return getBytes(result);
    }

    async computeBlobKzgProof(blob: Uint8Array, commitment: Uint8Array): Promise<Uint8Array> {
        const blobHex = this.uint8ToHex(blob);
        const commitmentHex = this.uint8ToHex(commitment);
        const proofHex = await this.pool.exec('computeProof', [blobHex, commitmentHex]);
        return getBytes(proofHex);
    }

    async verifyBlobProof(blob: Uint8Array, commitment: Uint8Array): Promise<boolean> {
        const blobHex = this.uint8ToHex(blob);
        const commitmentHex = this.uint8ToHex(commitment);
        return this.pool.exec('verifyProof', [blobHex, commitmentHex]);
    }

    private uint8ToHex(data: Uint8Array): string {
        return hexlify(data);
    }
}
