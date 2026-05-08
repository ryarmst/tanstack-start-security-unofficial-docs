---
title: 5. GET and Seroval payloads
description: How GET server functions carry arguments and what to check in URLs.
---

# GET and Seroval payloads

TanStack Start can define a server function with `method: 'GET'`.

```ts
export const getProfilePreview = createServerFn({ method: 'GET' })
  .inputValidator((raw) =>
    z.object({ userId: z.string() }).parse(raw),
  )
  .handler(async ({ data }) => {
    return { ok: true, userId: data.userId }
  })
```

## Client call

```tsx
await getProfilePreview({
  data: { userId: 'user_123' },
})
```

## HTTP shape

For GET calls with arguments, the serialized request can travel in a URL query parameter.

```http
GET /_serverFn/<function-id>?payload=%7B%22t%22%3A...%7D HTTP/1.1
Host: localhost:3000
X-Tsr-ServerFn: true
```

The `payload` value is URL-encoded Seroval JSON.

Decode the URL parameter before inspecting or editing it.

## Why GET needs extra care

GET URLs are more likely to appear in:

- Browser history
- Proxy logs
- Server access logs
- Shared links
- Cache keys

Do not put secrets or high-risk state-changing actions in GET payloads.

## Testing example

If decoded `payload` contains:

```json
{
  "data": {
    "userId": "user_123"
  }
}
```

Try changing only `userId`.

The handler should still check whether the current session may view that profile. The validator only proves that `userId` is a string.

## Server-side pattern

```ts
.handler(async ({ data, context }) => {
  const session = await requireSession(context)
  await assertCanViewUser(session.userId, data.userId)
  return loadProfilePreview(data.userId)
})
```

The key check is not the Zod schema. It is the ownership or permission check tied to server-side session state.

## Next

Next, look more closely at `data` and `context`.
