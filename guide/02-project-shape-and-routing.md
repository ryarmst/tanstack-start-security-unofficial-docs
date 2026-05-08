---
title: 2. Project shape and routing
description: How TanStack Start route files and server function modules fit together.
---

# Project shape and routing

TanStack Start apps usually combine route files, React components, and server function modules in one TypeScript project.

A common training layout looks like this:

```text
src/
  routes/
    lab.basics.tsx
    lab.strict.tsx
  server/
    trainingFns.ts
```

The route renders UI. The server module exports functions called by that UI.

## Route code calls a server function

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { echoMessage } from '~/server/trainingFns'

export const Route = createFileRoute('/lab/basics')({
  component: Page,
})

function Page() {
  async function submit() {
    const result = await echoMessage({
      data: { message: 'hello' },
    })
    console.log(result)
  }

  return <button onClick={submit}>Invoke</button>
}
```

This reads like local code, but it crosses from client code to server code.

## Server code defines the boundary

```ts
export const echoMessage = createServerFn({ method: 'POST' })
  .inputValidator((raw) =>
    z.object({ message: z.string() }).parse(raw),
  )
  .handler(async ({ data }) => {
    return { ok: true, echo: data.message }
  })
```

The important boundary is between the generated client call and the server function handler.

## Why this matters in review

When reviewing a TanStack Start app, follow imports from route files into server function definitions.

Look for:

- `createServerFn({ method: ... })`
- `.inputValidator(...)`
- `.handler(async ({ data, context }) => ...)`
- Object copies such as `Object.assign(row, data)`
- Dynamic writes such as `profile[data.field] = data.value`

## Example request path

The exact function ID depends on the build, but the request shape is similar:

```http
POST /_serverFn/sha256-or-build-id HTTP/1.1
X-Tsr-ServerFn: true
Content-Type: application/json
```

Your code review path and your proxy path should meet at the same server function.

## Next

Next, break down `createServerFn` itself.
