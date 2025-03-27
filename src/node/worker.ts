import { KZGInitializer } from '../core/init';
import workerpool from 'workerpool';

KZGInitializer.initialize();
const kzg = KZGInitializer.getInstance();

workerpool.worker({
    computeCommitment: (blobHex: string) => {
        return kzg.blobToKzgCommitment(blobHex);
    },

    computeProof: (blobHex: string, commitmentHex: string) => {
        return kzg.computeBlobProof(blobHex, commitmentHex);
    },

    verifyProof: (blobHex: string, commitmentHex: string) => {
        const proof = kzg.computeBlobProof(blobHex, commitmentHex);
        return kzg.verifyBlobProof(blobHex, commitmentHex, proof);
    }
});
