import workerpool from 'workerpool';
import { loadKZG } from 'kzg-wasm';

async function main() {
    const kzg = await loadKZG();

    workerpool.worker({
        computeCommitment: (blobHex: string) => {
            return kzg.blobToKZGCommitment(blobHex);
        },

        computeProof: (blobHex: string, commitmentHex: string) => {
            return kzg.computeBlobKZGProof(blobHex, commitmentHex);
        },

        verifyProof: (blobHex: string, commitmentHex: string, proofHex: string) => {
            return kzg.verifyBlobKZGProof(blobHex, commitmentHex, proofHex);
        }
    });
}

main().catch((err) => {
    console.error('[KZG Worker] Initialization failed:', err);
});
