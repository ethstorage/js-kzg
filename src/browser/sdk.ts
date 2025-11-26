import { loadTrustedSetup } from "../shared/core";
import { KzgWrapper } from 'rust-kzg-node-wasm32-wasi';

export class KZG {
    static async create() {
        const ts = await loadTrustedSetup();
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
