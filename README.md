# js-kzg

## Overview
This library provides a multi-threaded implementation of KZG commitments, optimized for handling multiple blobs efficiently. It is built on top of [kzg-wasm](https://github.com/ethereumjs/kzg-wasm), ensuring fast and reliable cryptographic computations.

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
import { KZG } from 'js-kzg';

const kzg = new KZG();
const blobs = [blob1, blob2, blob3];
const commitments = await kzg.computeCommitmentBatch(blobs);
console.log(commitments);

// After execution is completed, release the thread
await kzg.close();
```
