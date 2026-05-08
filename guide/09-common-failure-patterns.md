---
title: 9. Common failure patterns
description: Frequent server function mistakes and the security property each one breaks.
---

# Common failure patterns

Most server function issues are not caused by exotic serialization tricks.

They happen when normal development shortcuts cross a trust boundary.

## Extra fields survive validation

Problem:

```ts
z.object({ displayName: z.string() }).passthrough()
```

If the handler later copies the whole object, fields like `role` or `isAdmin` may survive.

Broken property: narrow accepted input.

## Mass assignment

Problem:

```ts
Object.assign(userRow, data)
```

This copies client-controlled keys into server state.

Broken property: allow-listed state changes.

## Dynamic property writes

Problem:

```ts
profile[data.field] = data.value
```

If `field` is not allow-listed, the caller controls what property changes.

Broken property: boundary clarity.

## Client-controlled authority

Problem:

```ts
const role = context.role
```

If that context can be influenced by the request, the handler may treat input as authority.

Broken property: least authority.

## Verbose error returns

Problem:

```ts
return { error: err.stack }
```

This can expose code paths, internal markers, package versions, and deployment details.

Broken property: safe error behavior.

## Security property

The property to preserve is explicit intent:

- Name the fields that can change.
- Name the users who can perform the action.
- Name the errors that clients are allowed to see.

## Next

Next, learn a simple testing mindset that checks these properties without starting from tooling.
