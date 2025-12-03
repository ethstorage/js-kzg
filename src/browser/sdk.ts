import { wrap, releaseProxy, Remote } from 'comlink';
import { uint8ToHex } from './converter';

import KZGWorkerClass from './worker.ts?worker&inline';

interface KZGWorkerAPI {
    initKZG(): Promise<void>;
    computeCommitment(blobHex: string): Promise<string>;
    computeProof(blobHex: string, commitmentHex: string): Promise<string>;
    computeCellsAndProofs(blobHex: string): Promise<[string[], string[]]>;
}

export class KZG {
    private constructor(
        private readonly worker: Worker,
        private readonly api: Remote<KZGWorkerAPI>
    ) {}

    static async create(): Promise<KZG> {
        const worker = new KZGWorkerClass({
            name: 'kzg-worker'
        });

        worker.onerror = (error) => {
            console.error('KZG Worker error:', error);
        };

        const api = wrap<KZGWorkerAPI>(worker);
        try {
            await api.initKZG();
            return new KZG(worker, api);
        } catch (error) {
            worker.terminate();
            throw new Error(`Failed to initialize KZG: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // ---- API ----
    async computeCommitment(blob: Uint8Array): Promise<string> {
        return this.api.computeCommitment(uint8ToHex(blob));
    }

    async computeCommitmentBatch(blobs: Uint8Array[]): Promise<string[]> {
        const hexBlobs = blobs.map(uint8ToHex);
        return await Promise.all(hexBlobs.map(b => this.api.computeCommitment(b)));
    }

    async computeProof(blob: Uint8Array, commitment: Uint8Array): Promise<string> {
        return await this.api.computeProof(uint8ToHex(blob), uint8ToHex(commitment));
    }

    async computeProofBatch(blobs: Uint8Array[], commitments: Uint8Array[]): Promise<string[]> {
        if (blobs.length !== commitments.length) {
            throw new Error("The number of blobs and commitments must be the same.");
        }
        return await Promise.all(
            blobs.map((blob, index) => this.computeProof(blob, commitments[index]))
        );
    }

    async computeCellsProofs(blob: Uint8Array): Promise<string[]> {
        const blobHex = uint8ToHex(blob);
        const result = await this.api.computeCellsAndProofs(blobHex);
        return result[1];
    }

    async computeCellsProofsBatch(blobs: Uint8Array[]): Promise<string[][]> {
        return Promise.all(blobs.map(blob =>
            this.computeCellsProofs(blob)
        ));
    }

    async terminate() {
        try {
            await this.api[releaseProxy](); // optional but recommended
        } catch {}
        this.worker.terminate();
    }
}
