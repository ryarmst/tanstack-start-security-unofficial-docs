---
title: Tooling appendix
description: Where tss-codec and the training lab fit into TanStack Start server function review.
outline: deep
---

# Tooling appendix

Use tools after you have mapped the target `createServerFn`.

## tss-codec

Repository:

```text
https://github.com/ryarmst/tss-codec
```

Use it to decode and re-encode TanStack Start server function traffic.

Decode a POST request body:

```bash
tss-codec decode-request body.json
```

Encode an edited request:

```bash
tss-codec encode-request decoded-request.json > body.json
```

Decode a serialized response:

```bash
tss-codec decode-response response.json
```

Decode a framed response:

```bash
tss-codec decode-framed response.bin
```

Generate mutation cases from a known-good request:

```bash
tss-tester generate body.json -o cases
```

## Training lab

Repository:

```text
https://github.com/ryarmst/Tanstack-Server-Functions-Security-Lab
```

The lab contains server functions for:

- Strict Zod validation
- Passthrough schemas
- `Object.assign` mass assignment
- Dynamic field writes
- Client-influenced context
- Verbose error responses
- GET server functions

Use it to practice mapping code to traffic.

## Tool-assisted workflow

1. Open the lab and submit a normal form.
2. Capture the `/_serverFn/<id>` request.
3. Save the body as `body.json`.
4. Decode it.
5. Edit `data` or `context`.
6. Re-encode it.
7. Replay it in a proxy.
8. Decode the response.
9. Compare result with the handler code.

## What not to automate away

Before using generated cases, write this map manually:

```text
server fn:
method:
validator:
accepted data fields:
handler reads:
handler writes:
session or ownership check:
expected rejection stage:
```

Generated mutations are easier to interpret when this map exists.

## Related pages

- [Testing TanStack Start server functions](./guide/10-testing-tanstack-start.md)
- [Wire format reference](./tanstack-start-wire-format-spec.md)
- [Security test case catalog](./tanstack-start-security-test-cases.md)
