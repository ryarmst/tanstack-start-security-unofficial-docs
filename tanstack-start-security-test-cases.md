---
title: Security test case catalog
description: Focused TanStack Start server function mutations mapped to code patterns.
outline: deep
---

# Security test case catalog

Use these cases after reading the guide and identifying the target server function.

## How to run a case

1. Find the `createServerFn` definition.
2. Record the method, validator, and handler writes.
3. Capture one known-good request.
4. Decode the request body or GET `payload`.
5. Change one field.
6. Re-encode and replay.
7. Decode the response.

## Case: unexpected field on strict schema

Target code:

```ts
z.object({ displayName: z.string() }).strict()
```

Mutation:

```json
{
  "data": {
    "displayName": "Ada",
    "isAdmin": true
  }
}
```

Expected result: `input_validator_rejected`.

## Case: unexpected field on passthrough schema

Target code:

```ts
z.object({ displayName: z.string() }).passthrough()
```

Mutation:

```json
{
  "data": {
    "displayName": "Ada",
    "role": "admin"
  }
}
```

Expected result: the handler must ignore `role`. If `role` appears in persisted or returned state, review the handler.

## Case: dynamic field name

Target code:

```ts
profile[data.field] = data.value
```

Mutation:

```json
{
  "data": {
    "field": "isAdmin",
    "value": true
  }
}
```

Expected result: only allow-listed field names should be accepted.

## Case: object ownership

Target code:

```ts
z.object({ invoiceId: z.string() })
```

Mutation:

```json
{
  "data": {
    "invoiceId": "invoice_belonging_to_someone_else"
  }
}
```

Expected result: the handler rejects the request or returns no object unless the session can access that invoice.

## Case: client-shaped context

Target code:

```ts
const role = (context as { role?: string }).role
```

Mutation:

```json
{
  "data": {
    "action": "ping"
  },
  "context": {
    "role": "admin"
  }
}
```

Expected result: request-shaped context must not grant privileges.

## Case: verbose error behavior

Target code:

```ts
return { message: err.message, stack: err.stack }
```

Mutation: trigger the error path with invalid or edge-case data.

Expected result: production code should not return stack traces, internal markers, or filesystem paths.

## Related pages

- [Zod validation choices](./guide/07-zod-validation-choices.md)
- [TanStack Start failure patterns](./guide/09-tanstack-failure-patterns.md)
- [Testing TanStack Start server functions](./guide/10-testing-tanstack-start.md)
