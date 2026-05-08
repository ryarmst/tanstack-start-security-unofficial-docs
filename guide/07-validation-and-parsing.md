---
title: 7. Validation and parsing
description: How runtime validation changes untrusted request values into application inputs.
---

# Validation and parsing

Validation is the process of checking whether a value is acceptable.

Parsing is stronger. A parser takes an unknown value and either returns a safe typed value or rejects it.

Good server functions parse first, then act.

## Shape validation

Shape validation checks that required fields exist and have the expected type.

```ts
z.object({
  email: z.string().email(),
  displayName: z.string().min(1).max(80),
})
```

This protects the handler from missing fields and wrong types.

## Strictness

Strict validation rejects fields the server did not ask for.

This matters when the handler later merges objects into a database row, profile object, or command payload.

Loose validation can be useful, but only when the handler deliberately handles extra fields.

## Coercion

Coercion turns one type into another.

For example, `"1"` may become `1`.

Coercion is convenient for forms. It can also hide surprising inputs. Use it only when the accepted conversions are understood.

## Authorization is separate

Validation checks whether the request is well-formed.

Authorization checks whether the current user may perform the action.

A valid request can still be unauthorized.

## Security property

The property to preserve is narrow accepted input:

- Parse unknown input into a known shape.
- Reject unexpected fields unless there is a reason to keep them.
- Keep authorization checks tied to server-side identity.

## Next

Next, name the security properties this tutorial relies on.
