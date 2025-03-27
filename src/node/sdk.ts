import workerpool from 'workerpool';
import { getBytes, uint8ToHex } from '../utils/converter';

export abstract class kzgBase {
    private pool: workerpool.Pool | null = null;

    protected abstract getWorkerPath(): string;

    constructor() {
        this.pool = workerpool.pool(this.getWorkerPath(), {
            minWorkers: 'max'
        });
    }

    // Method to close the worker pool after all tasks are done
    async closeWorkerPool(): Promise<void> {
        if (this.pool === null) {
            throw new Error("Worker pool has already been closed.");
        }
        await this.pool.terminate();
        this.pool = null;
    }

    async blobToKzgCommitment(blob: Uint8Array): Promise<Uint8Array> {
        if (this.pool === null) {
            throw new Error("Cannot execute task on a closed or uninitialized worker pool.");
        }

        const hexBlob = uint8ToHex(blob);
        const result = await this.pool.exec('computeCommitment', [hexBlob]);
        return getBytes(result);
    }

    async blobToKzgCommitmentBatch(blobs: Uint8Array[]): Promise<Uint8Array[]> {
        if (this.pool === null) {
            throw new Error("Cannot execute task on a closed or uninitialized worker pool.");
        }
        return await Promise.all(
            blobs.map(blob => this.blobToKzgCommitment(blob))
        );
    }

    async computeBlobKzgProof(blob: Uint8Array, commitment: Uint8Array): Promise<Uint8Array> {
        if (this.pool === null) {
            throw new Error("Cannot execute task on a closed or uninitialized worker pool.");
        }
        const blobHex = uint8ToHex(blob);
        const commitmentHex = uint8ToHex(commitment);
        const proofHex = await this.pool.exec('computeProof', [blobHex, commitmentHex]);
        return getBytes(proofHex);
    }

    async computeBlobKzgProofBatch(blobs: Uint8Array[], commitments: Uint8Array[]): Promise<Uint8Array[]> {
        if (this.pool === null) {
            throw new Error("Cannot execute task on a closed or uninitialized worker pool.");
        }
        if (blobs.length !== commitments.length) {
            throw new Error("The number of blobs and commitments must be the same.");
        }
        return await Promise.all(
            blobs.map((blob, index) =>
                this.computeBlobKzgProof(blob, commitments[index])
            )
        );
    }

    async verifyBlobProof(blob: Uint8Array, commitment: Uint8Array): Promise<boolean> {
        if (this.pool === null) {
            throw new Error("Cannot execute task on a closed or uninitialized worker pool.");
        }
        const blobHex = uint8ToHex(blob);
        const commitmentHex = uint8ToHex(commitment);
        return this.pool.exec('verifyProof', [blobHex, commitmentHex]);
    }
}
