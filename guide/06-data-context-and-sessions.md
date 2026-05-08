---
title: 6. data, context, and sessions
description: Distinguish request data from trusted server-side session state in TanStack Start handlers.
---

# data, context, and sessions

TanStack Start handlers commonly receive `data` and may also receive `context`.

```ts
.handler(async ({ data, context }) => {
  // server-side code
})
```

Treat `data` as request input. Treat `context` carefully: verify where it was created before using it as authority.

## Good pattern: derive authority on the server

```ts
export const updateOwnProfile = createServerFn({ method: 'POST' })
  .inputValidator((raw) =>
    z.object({ displayName: z.string().min(1).max(80) }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const session = await requireSession(context)

    await db.profile.update({
      userId: session.userId,
      displayName: data.displayName,
    })

    return { ok: true }
  })
```

The request controls `displayName`. The server controls `session.userId`.

## Bad pattern: trust a role from request-shaped context

```ts
export const adminPing = createServerFn({ method: 'POST' })
  .inputValidator((raw) =>
    z.object({ action: z.literal('ping') }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const role = (context as { role?: string }).role ?? 'guest'
    return { ok: true, action: data.action, effectiveRole: role }
  })
```

If a client can influence that context value, `role` is not authority.

## What tampering looks like

A decoded request may show more than `data`:

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

That should not make the caller an admin.

## Review questions

Ask these for each handler:

- Does `data` contain object IDs such as `userId`, `tenantId`, or `accountId`?
- Does the handler compare those IDs to server-side session state?
- Does `context` come from trusted server middleware or from serialized request material?
- Are role and permission decisions made from server-side data?

## Next

Next, look at validation choices that determine what reaches the handler.
