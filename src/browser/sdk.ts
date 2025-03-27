import { getBytes, uint8ToHex } from '../utils/converter';
import { wrap, releaseProxy } from 'comlink';

const workerCode = `
    import { expose } from 'comlink';
    import { KZG } from 'micro-eth-signer/kzg';
    import { trustedSetup } from '@paulmillr/trusted-setups';
     
    const kzg = new KZG(trustedSetup);
    const workerAPI = {
        computeCommitment: (blobHex: string) => kzg.blobToKzgCommitment(blobHex),
        computeProof: (blobHex: string, commitmentHex: string) => kzg.computeBlobProof(blobHex, commitmentHex),
        verifyProof: (blobHex: string, commitmentHex: string, proofHex: string) => kzg.verifyBlobProof(blobHex, commitmentHex, proofHex)
    };
    
    expose(workerAPI);
`;

const blob = new Blob([workerCode], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(blob);

export abstract class KZG {
    private worker: Worker | null = null;
    private kzgWorker: any = null;

    private createWorker() {
        if (this.worker === null) {
            this.worker = new Worker(workerUrl, { type: 'module' });
            this.kzgWorker = wrap(this.worker);
        }
    }

    async computeCommitment(blob: Uint8Array): Promise<Uint8Array> {
        this.createWorker();
        const hexBlob = uint8ToHex(blob);
        const result = await this.kzgWorker.computeCommitment(hexBlob);
        return getBytes(result);
    }

    async computeCommitmentBatch(blobs: Uint8Array[]): Promise<Uint8Array[]> {
        this.createWorker();
        return await Promise.all(blobs.map(blob => this.computeCommitment(blob)));
    }

    async computeProof(blob: Uint8Array, commitment: Uint8Array): Promise<Uint8Array> {
        this.createWorker();
        const blobHex = uint8ToHex(blob);
        const commitmentHex = uint8ToHex(commitment);
        const proofHex = await this.kzgWorker.computeProof(blobHex, commitmentHex);
        return getBytes(proofHex);
    }

    async computeProofBatch(blobs: Uint8Array[], commitments: Uint8Array[]): Promise<Uint8Array[]> {
        if (blobs.length !== commitments.length) {
            throw new Error("The number of blobs and commitments must be the same.");
        }
        this.createWorker();
        return await Promise.all(
            blobs.map((blob, index) => this.computeProof(blob, commitments[index]))
        );
    }

    async verifyProof(blob: Uint8Array, commitment: Uint8Array, proof: Uint8Array): Promise<boolean> {
        this.createWorker();
        const blobHex = uint8ToHex(blob);
        const commitmentHex = uint8ToHex(commitment);
        const proofHex = uint8ToHex(proof);
        return await this.kzgWorker.verifyProof(blobHex, commitmentHex, proofHex);
    }

    async close(): Promise<void> {
        if (this.worker !== null) {
            try {
                await this.kzgWorker[releaseProxy]();
            } catch (err) {
                console.warn('Error releasing KZG worker proxy:', err);
            }
            this.worker.terminate();
            this.worker = null;
            this.kzgWorker = null;
        }
    }
}
