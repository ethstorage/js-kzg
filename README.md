# js-kzg

## Overview
This library provides a multi-threaded implementation of KZG commitments, optimized for handling multiple blobs efficiently. It is built on top of [@paulmillr/trusted-setups](https://www.npmjs.com/package/@paulmillr/trusted-setups) and [micro-eth-signer](https://www.npmjs.com/package/micro-eth-signer), ensuring fast and reliable cryptographic computations.

## Features
- Multi-threaded execution for faster computation.
- Supports Node.js (CommonJS and ESM) and browser environments.
- Automatically adapts to the execution environment (threads in Node.js, single-threaded fallback in browsers).
- Efficiently handles multiple blob computations in parallel.
- Uses thread pools to maximize performance and minimize overhead.

## Installation
```sh
npm install js-kzg
```

## Usage

```sh
import { Kzg } from 'js-kzg';

const kzg = new Kzg();
const blobs = [blob1, blob2, blob3];
const commitments = await kzg.blobToKzgCommitmentBatch(blobs);
console.log(commitments);
```
