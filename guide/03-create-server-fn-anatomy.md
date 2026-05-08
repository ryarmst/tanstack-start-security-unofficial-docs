---
title: 3. createServerFn anatomy
description: The method, validator, and handler stages that matter for security testing.
---

# createServerFn anatomy

Most TanStack Start server function security review starts with this chain:

```ts
createServerFn({ method: 'POST' })
  .inputValidator((raw) => parseRawInput(raw))
  .handler(async ({ data, context }) => runServerCode(data, context))
```

Each part answers a different question.

## `method`

The method controls how the browser sends the call.

```ts
export const saveProfile = createServerFn({ method: 'POST' })
```

For state-changing actions, expect `POST`.

If a state-changing action uses `GET`, check cache behavior, URL exposure, and whether arguments travel in the `payload` query parameter.

## `inputValidator`

The validator receives the deserialized input.

```ts
const profileSchema = z
  .object({
    displayName: z.string().min(1).max(80),
    newsletter: z.boolean(),
  })
  .strict()

export const saveProfile = createServerFn({ method: 'POST' })
  .inputValidator((raw) => profileSchema.parse(raw))
```

The validator should reject unexpected fields before the handler runs.

## `handler`

The handler receives parsed `data`.

```ts
.handler(async ({ data }) => {
  await db.profile.update({
    displayName: data.displayName,
    newsletter: data.newsletter,
  })

  return { ok: true }
})
```

Prefer explicit writes. Avoid copying the whole request object into server state.

## What an error should mean

If the request body cannot deserialize, the validator should not run.

If validation fails, the handler should not run.

If authorization fails in the handler, the state change should not happen.

## Review shortcut

For each server function, write this small map:

```text
method: POST
expected data: displayName, newsletter
validator: Zod strict object
handler writes: profile.displayName, profile.newsletter
dangerous copy: none
```

This map makes later HTTP testing much easier.

## Next

Next, trace a POST call from client code to HTTP and back.
