import { expose } from 'comlink';
import { KZG } from 'micro-eth-signer/kzg';
import { trustedSetup as fastSetup } from '@paulmillr/trusted-setups/fast.js';

const kzg = new KZG(fastSetup);
const workerAPI = {
    computeCommitment: (blobHex: string) => kzg.blobToKzgCommitment(blobHex),
    computeProof: (blobHex: string, commitmentHex: string) => kzg.computeBlobProof(blobHex, commitmentHex),
    verifyProof: (blobHex: string, commitmentHex: string, proofHex: string) => kzg.verifyBlobProof(blobHex, commitmentHex, proofHex)
};

expose(workerAPI);
