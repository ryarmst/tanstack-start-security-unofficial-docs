---
title: 9. TanStack Start failure patterns
description: Concrete server function patterns to look for in code and traffic.
---

# TanStack Start failure patterns

These patterns show up when a convenient server function abstraction hides where client input is used.

## `.passthrough()` plus object copy

```ts
const schema = z
  .object({
    displayName: z.string(),
  })
  .passthrough()

export const createUser = createServerFn({ method: 'POST' })
  .inputValidator((raw) => schema.parse(raw))
  .handler(async ({ data }) => {
    const row = { id: crypto.randomUUID() }
    Object.assign(row, data)
    return { row }
  })
```

Tampered decoded data:

```json
{
  "data": {
    "displayName": "Ada",
    "role": "admin"
  }
}
```

Risk: `role` reaches `row`.

Fix: use `.strict()` and explicit assignment.

## Dynamic field write

```ts
export const updateField = createServerFn({ method: 'POST' })
  .inputValidator((raw) =>
    z.object({
      field: z.string(),
      value: z.unknown(),
    }).parse(raw),
  )
  .handler(async ({ data }) => {
    const profile: Record<string, unknown> = {}
    profile[data.field] = data.value
    return { profile }
  })
```

Tampered decoded data:

```json
{
  "data": {
    "field": "isAdmin",
    "value": true
  }
}
```

Risk: caller chooses the property that changes.

Fix: validate `field` with an enum.

```ts
field: z.enum(['displayName', 'timezone'])
```

## Client-shaped context

```ts
.handler(async ({ context }) => {
  const role = (context as { role?: string }).role
  return { effectiveRole: role ?? 'guest' }
})
```

Tampered decoded request:

```json
{
  "data": {},
  "context": {
    "role": "admin"
  }
}
```

Risk: request material changes a server decision.

Fix: derive roles from server-side session or database state.

## Missing object ownership check

```ts
export const loadInvoice = createServerFn({ method: 'GET' })
  .inputValidator((raw) =>
    z.object({ invoiceId: z.string() }).parse(raw),
  )
  .handler(async ({ data }) => {
    return db.invoice.findById(data.invoiceId)
  })
```

Risk: changing `invoiceId` may reveal another user's object.

Fix: scope the query to the session user or tenant.

```ts
return db.invoice.findFirst({
  id: data.invoiceId,
  ownerId: session.userId,
})
```

## Next

Next, use a concrete testing flow against a captured server function request.
