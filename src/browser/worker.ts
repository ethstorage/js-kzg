import { expose } from 'comlink';
import { loadKZG } from 'kzg-wasm'

export interface KZGWorkerAPI {
    initKZG(): Promise<void>;
    computeCommitment(blobHex: string): Promise<string>;
    computeProof(blobHex: string, commitmentHex: string): Promise<string>;
    computeCellsAndProofs(blobHex: string): Promise<[string[], string[]]>;
}

let kzg: any = null;

async function initKZG() {
    if (!kzg) {
        kzg = await loadKZG();
    }
}


function computeCommitment(blobHex: string): string {
    return kzg.blobToKzgCommitment(blobHex);
}

function computeProof(blobHex: string, commitmentHex: string): string {
    return kzg.computeBlobProof(blobHex, commitmentHex);
}

function computeCellsAndProofs(blobHex: string): [string[], string[]] {
    return kzg.computeCellsAndProofs(blobHex);
}

expose({
    initKZG,
    computeCommitment,
    computeProof,
    computeCellsAndProofs
});
