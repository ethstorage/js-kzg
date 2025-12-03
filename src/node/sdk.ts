import { loadTrustedSetup } from "./shared/core";
import { KzgWrapper } from 'rust-kzg-node';

export class KZG {
    private constructor(private readonly kzg: KzgWrapper) {
    }

    static async create(): Promise<KZG> {
        const ts = loadTrustedSetup();
        const inst = KzgWrapper.loadKzg(
            ts.g1Monomial,
            ts.g1Lagrange,
            ts.g2Monomial
        );
        return new KZG(inst);
    }

    async computeCommitment(blob: Uint8Array): Promise<string> {
        return this.kzg.blobToCommitment(blob);
    }

    async computeCommitmentBatch(blobs: Uint8Array[]): Promise<string[]> {
        return this.kzg.blobToCommitmentBatch(blobs);
    }

    async computeCellsProofs(blob: Uint8Array): Promise<string[]> {
        return this.kzg.computeCellProofs(blob);
    }

    async computeCellsProofsBatch(blobs: Uint8Array[]): Promise<string[][]> {
        return this.kzg.computeCellProofsBatch(blobs);
    }

    async terminate() {
        // nothing
    }
}
