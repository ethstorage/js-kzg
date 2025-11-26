declare module 'rust-kzg-node-wasm32-wasi' {
    export class KzgWrapper {
        static loadKzg(
            g1Monomial: Uint8Array,
            g1Lagrange: Uint8Array,
            g2Monomial: Uint8Array
        ): KzgWrapper;

        blobToCommitmentBatch(blobs: Uint8Array[]): string[];
        computeCellProofsBatch(blobs: Uint8Array[]): string[][];
    }
}
