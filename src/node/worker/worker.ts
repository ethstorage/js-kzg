import workerpool from 'workerpool';
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js';
import { KZG } from 'micro-eth-signer/kzg';

const kzg = new KZG(trustedSetup);

workerpool.worker({
    computeCommitment: (blobHex: string) => {
        return kzg.blobToKzgCommitment(blobHex);
    },

    computeProof: (blobHex: string, commitmentHex: string) => {
        return kzg.computeBlobProof(blobHex, commitmentHex);
    },

    verifyProof: (blobHex: string, commitmentHex: string, proofHex: string) => {
        return kzg.verifyBlobProof(blobHex, commitmentHex, proofHex);
    }
});
