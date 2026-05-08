---
title: 3. Server functions from a developer view
description: How server functions are written and why each stage matters for security.
---

# Server functions from a developer view

A server function has two jobs:

1. Accept input from a browser call.
2. Run trusted server code.

The secure version makes every stage visible.

## A simple shape

Many server functions follow this pattern:

```ts
export const updateProfile = createServerFn({ method: 'POST' })
  .inputValidator((raw) => profileSchema.parse(raw))
  .handler(async ({ data }) => {
    return saveProfile(data)
  })
```

This example has three important parts:

- `method` controls the HTTP method.
- `inputValidator` parses untrusted input.
- `handler` performs the server-side action.

## Why validation is separate

TypeScript types disappear at runtime. A browser can send values that TypeScript would never allow in source code.

The validator must check the actual request value.

Good validation answers:

- Is the value the expected type?
- Are only expected fields present?
- Are string lengths and numeric ranges safe?
- Is the request allowed for this user?

The last question is authorization. It often belongs in or near the handler because it depends on server-side session state.

## Common developer mistake

A developer may assume that a typed function call means the server receives typed data.

That is not true. The server receives serialized data from HTTP. It becomes typed only after runtime validation.

## Security property

The property to preserve is runtime enforcement:

- Validate shape before use.
- Authorize action before state changes.
- Build database writes from allow-listed fields.

## Next

Next, follow a request from browser code to the handler.
