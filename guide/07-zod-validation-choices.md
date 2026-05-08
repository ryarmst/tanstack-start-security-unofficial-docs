---
title: 7. Zod validation choices
description: Strict, passthrough, and coercion behavior in TanStack Start input validators.
---

# Zod validation choices

Most examples in this material use Zod inside `inputValidator`.

The important question is not "is there a schema?" The important question is "what does the schema allow through?"

## Strict object

```ts
const strictProfileSchema = z
  .object({
    displayName: z.string().min(1).max(80),
    newsletter: z.boolean(),
  })
  .strict()

export const saveProfile = createServerFn({ method: 'POST' })
  .inputValidator((raw) => strictProfileSchema.parse(raw))
```

If the decoded request includes `isAdmin`, Zod rejects it.

```json
{
  "data": {
    "displayName": "Ada",
    "newsletter": true,
    "isAdmin": true
  }
}
```

Expected result: validation error before the handler.

## Passthrough object

```ts
const permissiveProfileSchema = z
  .object({
    displayName: z.string().min(1).max(80),
    newsletter: z.boolean(),
  })
  .passthrough()
```

This keeps unknown keys.

That is risky if the handler later does this:

```ts
Object.assign(row, data)
```

In that pattern, `isAdmin` can survive validation and reach the object copy.

## Coercion

```ts
const mathSchema = z.object({
  dividend: z.coerce.number(),
  divisor: z.coerce.number(),
})
```

Coercion can be fine for form input. It can also make surprising request bodies look valid.

For example:

```json
{
  "data": {
    "dividend": "10",
    "divisor": "0"
  }
}
```

The handler receives numbers, not strings.

Check edge cases such as `NaN`, `Infinity`, empty strings, and zero divisors if the result affects logic.

## Safer handler after validation

Even after validation, write explicit fields:

```ts
.handler(async ({ data }) => {
  const row = {
    displayName: data.displayName,
    newsletter: data.newsletter,
  }

  return { ok: true, row }
})
```

Validation and explicit field selection work together.

## Next

Next, look at response and error behavior.
