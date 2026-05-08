---
title: 8. Responses and errors
description: How TanStack Start responses are serialized and what error detail should look like.
---

# Responses and errors

TanStack Start responses may be serialized even when the handler returns a simple object.

The security review should separate three cases:

- Successful result
- Validation or authorization error
- Framework or deserialization error

## Successful result

Handler:

```ts
.handler(async ({ data }) => {
  return {
    ok: true,
    profile: {
      displayName: data.displayName,
    },
  }
})
```

Decoded response:

```json
{
  "result": {
    "ok": true,
    "profile": {
      "displayName": "Ada"
    }
  },
  "error": null,
  "context": {}
}
```

Depending on response mode, you may need to decode the raw response body before it looks this clear.

## Validation error

A strict schema rejection should not expose a stack trace.

Useful development detail is fine in a local lab. Production responses should be smaller.

Example production-style response:

```json
{
  "error": {
    "message": "Invalid input"
  }
}
```

## Verbose error anti-pattern

Avoid returning internal error objects directly.

```ts
.handler(async () => {
  try {
    throw new Error('divideByZero:internal_check_failed')
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    }
  }
})
```

This leaks internal markers and stack details.

## Better pattern

Log detailed errors server-side. Return a stable client message.

```ts
.handler(async () => {
  try {
    return await runAction()
  } catch (err) {
    console.error(err)
    return { ok: false, message: 'Action failed' }
  }
})
```

## HTTP signs to record

When testing, record:

- Status code
- `content-type`
- `x-tss-serialized`
- Whether the response is JSON, NDJSON, or `application/x-tss-framed`
- Whether decoded output contains `result` or `error`

## Next

Next, review common TanStack Start server function failure patterns.
