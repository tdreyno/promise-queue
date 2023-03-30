# promise-queue

[![npm latest version](https://img.shields.io/npm/v/@tdreyno/promise-queue/latest.svg)](https://www.npmjs.com/package/@tdreyno/promise-queue)
[![Minified Size](https://badgen.net/bundlephobia/minzip/@tdreyno/promise-queue)](https://bundlephobia.com/result?p=@tdreyno/promise-queue)

promise-queue is a tiny library for running arbitrary promise-returning functions in sequence.

## Install

```bash
npm install --save @tdreyno/promise-queue
```

## Example

```typescript
import { create } from "@tdreyno/promise-queue"

const q = create()

// Will run these in order of function execution (a, b, c) rather than in parallel.
const results = await Promise.all([
  q.enqueue(() => "a"),
  q.enqueue(() => "b"),
  q.enqueue(() => "c"),
])
```
