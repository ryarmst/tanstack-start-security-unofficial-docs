---
title: Wire vs decoded walkthrough
description: Map one TanStack Start Seroval request body to the data received by inputValidator.
outline: deep
---

# Wire vs decoded walkthrough

This appendix maps one server function call from TypeScript to HTTP to decoded data.

## Server function

```ts
export const saveProfile = createServerFn({ method: 'POST' })
  .inputValidator((raw) =>
    z
      .object({
        displayName: z.string().min(1).max(80),
        newsletter: z.boolean(),
      })
      .strict()
      .parse(raw),
  )
  .handler(async ({ data }) => {
    return {
      ok: true,
      stored: {
        displayName: data.displayName,
        newsletter: data.newsletter,
      },
    }
  })
```

## Browser call

```tsx
await saveProfile({
  data: {
    displayName: 'Ada',
    newsletter: true,
  },
})
```

## HTTP request

```http
POST /_serverFn/<function-id> HTTP/1.1
Host: localhost:3000
Content-Type: application/json
X-Tsr-ServerFn: true

{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["displayName","newsletter"],"v":[{"t":1,"s":"Ada"},{"t":0,"b":true}]},"o":0}]},"o":0},"f":63,"m":[]}
```

## Decoded request

```json
{
  "kind": "tanstack-start-request",
  "envelope": {
    "f": 63,
    "m": []
  },
  "value": {
    "data": {
      "displayName": "Ada",
      "newsletter": true
    }
  }
}
```

## What the validator sees

The `inputValidator` receives the decoded `data` value, not the entire HTTP request.

```json
{
  "displayName": "Ada",
  "newsletter": true
}
```

If you add an extra field:

```json
{
  "displayName": "Ada",
  "newsletter": true,
  "isAdmin": true
}
```

The `.strict()` schema should reject it before `.handler(...)`.

## What the handler returns

The handler returns an application object:

```json
{
  "ok": true,
  "stored": {
    "displayName": "Ada",
    "newsletter": true
  }
}
```

The raw response may be serialized by TanStack Start. Decode it before checking whether the response contains a `result` or `error`.

## Review shortcut

```text
server fn: saveProfile
method: POST
validator: strict object
data fields: displayName, newsletter
dangerous fields tested: isAdmin, role, accountId
expected failure: input_validator_rejected
```

## Related pages

- [createServerFn anatomy](./guide/03-create-server-fn-anatomy.md)
- [POST request lifecycle](./guide/04-post-request-lifecycle.md)
- [Zod validation choices](./guide/07-zod-validation-choices.md)
