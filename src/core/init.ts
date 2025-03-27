import { KZG } from 'micro-eth-signer/kzg';
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js';

export class KZGInitializer {
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
