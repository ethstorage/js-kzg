import workerpool from 'workerpool';
import os from 'os';
import { getBytes, uint8ToHex } from '../utils/converter';

export abstract class KZGBase {
    private pool: workerpool.Pool | null = null;

    protected abstract getWorkerPath(): string;

    constructor() {
        this.createWorkerPool();
    }

    private createWorkerPool() {
        if (this.pool === null) {
            this.pool = workerpool.pool(this.getWorkerPath(), {
                minWorkers: 3,
                maxWorkers: os.cpus().length
            });
        }
        return this.pool!;
    }

    async computeCommitment(blob: Uint8Array): Promise<Uint8Array> {
        const pool = this.createWorkerPool();
        const hexBlob = uint8ToHex(blob);
        const result = await pool.exec('computeCommitment', [hexBlob]);
        return getBytes(result);
    }

    async computeCommitmentBatch(blobs: Uint8Array[]): Promise<Uint8Array[]> {
        this.createWorkerPool();
        return await Promise.all(blobs.map(blob => this.computeCommitment(blob)));
    }

    async computeProof(blob: Uint8Array, commitment: Uint8Array): Promise<Uint8Array> {
        const pool = this.createWorkerPool();
        const blobHex = uint8ToHex(blob);
        const commitmentHex = uint8ToHex(commitment);
        const proofHex = await pool.exec('computeProof', [blobHex, commitmentHex]);
        return getBytes(proofHex);
    }

    async computeProofBatch(blobs: Uint8Array[], commitments: Uint8Array[]): Promise<Uint8Array[]> {
        if (blobs.length !== commitments.length) {
            throw new Error("The number of blobs and commitments must be the same.");
        }
        this.createWorkerPool();
        return await Promise.all(
            blobs.map((blob, index) => this.computeProof(blob, commitments[index]))
        );
    }

    async verifyProof(blob: Uint8Array, commitment: Uint8Array, proof: Uint8Array): Promise<boolean> {
        const pool = this.createWorkerPool();
        const blobHex = uint8ToHex(blob);
        const commitmentHex = uint8ToHex(commitment);
        const proofHex = uint8ToHex(proof);
        return await pool.exec('verifyProof', [blobHex, commitmentHex, proofHex]);
    }

    async close(): Promise<void> {
        try {
            if (this.pool !== null) {
                await this.pool.terminate(true);
                this.pool = null;
            }
        } catch (error) {
            console.error('Error terminating pool:', error);
        }
    }
}
