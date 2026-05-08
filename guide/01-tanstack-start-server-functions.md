---
title: 1. TanStack Start server functions
description: Start with the exact TanStack Start abstraction and the HTTP request it creates.
---

# TanStack Start server functions

TanStack Start server functions let React code call server-only code through a generated HTTP endpoint.

The development experience looks like a function call. The runtime behavior is still HTTP.

## The smallest useful example

```ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const echoMessage = createServerFn({ method: 'POST' })
  .inputValidator((raw) =>
    z.object({ message: z.string().max(120) }).parse(raw),
  )
  .handler(async ({ data }) => {
    return { ok: true, echo: data.message }
  })
```

A React component can call it like this:

```tsx
const result = await echoMessage({
  data: { message: 'hello from the browser' },
})
```

The handler does not run in the browser. TanStack Start turns the call into a request to a server function endpoint.

## What to look for in HTTP

The path commonly contains:

```text
/_serverFn/
```

The request usually includes a server-function marker:

```http
POST /_serverFn/<function-id> HTTP/1.1
Host: localhost:3000
Content-Type: application/json
X-Tsr-ServerFn: true
Accept: application/x-tss-framed, application/x-ndjson, application/json
```

The body is not plain application JSON. It is a Seroval envelope that represents the arguments passed to the server function.

## The security question

For each server function, ask:

- What object is passed as `data`?
- What schema parses `data`?
- What does the handler do after parsing?
- Which values affect database writes, permissions, or object ownership?

Do not start by memorizing every wire tag. Start by finding the server function, validator, and handler.

## Next

Next, look at the TanStack Start files where these calls usually live.
