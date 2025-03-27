import { getBytes, uint8ToHex } from '../utils/converter';
import { wrap } from 'comlink';

const workerCode = `
    import { expose } from 'comlink';
    import { KZG } from 'micro-eth-signer/kzg';
    import { trustedSetup } from '@paulmillr/trusted-setups';
     
    class KZGInitializer {
        private static instance: KZG | null = null;
        private static isInitialized = false;
    
        static initialize(): void {
            if (this.isInitialized) return;
            this.instance = new KZG(trustedSetup);
            this.isInitialized = true;
        }
    
        static getInstance(): KZG {
            if (!this.instance) {
                throw new Error('KZG not initialized. Call initializeSync() first');
            }
            return this.instance;
        }
    }
    KZGInitializer.initialize();
    const kzg = KZGInitializer.getInstance();
    
    const workerAPI = {
        computeCommitment: (blobHex: string) => kzg.blobToKzgCommitment(blobHex),
        computeProof: (blobHex: string, commitmentHex: string) => kzg.computeBlobProof(blobHex, commitmentHex),
        verifyProof: (blobHex: string, commitmentHex: string) => {
            const proof = kzg.computeBlobProof(blobHex, commitmentHex);
            return kzg.verifyBlobProof(blobHex, commitmentHex, proof);
        }
    };
    
    expose(workerAPI);
`;

const blob = new Blob([workerCode], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(blob);
const worker = new Worker(workerUrl, { type: 'module' });
const kzgWorker = wrap(worker) as any;

export abstract class Kzg {

    async blobToKzgCommitment(blob: Uint8Array): Promise<Uint8Array> {
        const hexBlob = uint8ToHex(blob);
        const result = await kzgWorker.computeCommitment(hexBlob);
        return getBytes(result);
    }

    async blobToKzgCommitmentBatch(blobs: Uint8Array[]): Promise<Uint8Array[]> {
        return await Promise.all(blobs.map(blob => this.blobToKzgCommitment(blob)));
    }

    async computeBlobKzgProof(blob: Uint8Array, commitment: Uint8Array): Promise<Uint8Array> {
        const blobHex = uint8ToHex(blob);
        const commitmentHex = uint8ToHex(commitment);
        const proofHex = await kzgWorker.computeProof(blobHex, commitmentHex);
        return getBytes(proofHex);
    }

    async computeBlobKzgProofBatch(blobs: Uint8Array[], commitments: Uint8Array[]): Promise<Uint8Array[]> {
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
        const blobHex = uint8ToHex(blob);
        const commitmentHex = uint8ToHex(commitment);
        return await kzgWorker.verifyProof(blobHex, commitmentHex);
    }
}
