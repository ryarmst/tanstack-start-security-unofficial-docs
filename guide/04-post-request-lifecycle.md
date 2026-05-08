---
title: 4. POST request lifecycle
description: A concrete POST server function request from browser call to serialized response.
---

# POST request lifecycle

A POST server function call has a predictable flow:

```text
React call -> client stub -> POST /_serverFn/<id> -> Seroval decode
  -> inputValidator -> handler -> serialized response
```

## Client call

```tsx
await saveProfile({
  data: {
    displayName: 'Ada',
    newsletter: true,
  },
})
```

## HTTP request

In a proxy, the request resembles:

```http
POST /_serverFn/<function-id> HTTP/1.1
Host: localhost:3000
Content-Type: application/json
X-Tsr-ServerFn: true
Accept: application/x-tss-framed, application/x-ndjson, application/json

{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["displayName","newsletter"],"v":[{"t":1,"s":"Ada"},{"t":0,"b":true}]},"o":0}]},"o":0},"f":63,"m":[]}
```

The important application value is inside `data`.

Decoded, it is easier to read:

```json
{
  "data": {
    "displayName": "Ada",
    "newsletter": true
  }
}
```

## Validation stage

```ts
const parsed = profileSchema.parse(raw)
```

If a tester adds `isAdmin`, a strict schema should reject it here.

```json
{
  "data": {
    "displayName": "Ada",
    "newsletter": true,
    "isAdmin": true
  }
}
```

The handler should not run for that request.

## Handler stage

The handler should write only fields that are part of the intended action.

```ts
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

## Response stage

A normal JSON response may still be serialized by TanStack Start.

Look for:

```http
x-tss-serialized: true
```

Do not stop at the raw response body if it is encoded. Decode it before judging whether the server returned `result`, `error`, or context data.

## Next

Next, compare this with GET server functions and the `payload` query parameter.
