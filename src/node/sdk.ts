import { loadTrustedSetup } from "../shared/core";
import { KzgWrapper } from 'rust-kzg-node';

export class KZG {
    static create() {
        const ts = loadTrustedSetup();
        const inst = KzgWrapper.loadKzg(
            ts.g1Monomial,
            ts.g1Lagrange,
            ts.g2Monomial
        );
        return new KZG(inst);
    }

    constructor(private kzg: KzgWrapper) {}

    commitmentBatch(blobs: Uint8Array[]): string[] {
        return this.kzg.blobToCommitmentBatch(blobs);
    }

    cellProofBatch(blobs: Uint8Array[]): string[][] {
        return this.kzg.computeCellProofsBatch(blobs);
    }
}
