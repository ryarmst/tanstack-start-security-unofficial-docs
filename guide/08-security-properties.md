---
title: 8. Security properties
description: The core properties to preserve when building or testing server functions.
---

# Security properties

Security properties are the facts that must remain true even when a request is modified.

Use these properties as a checklist while reading code or testing traffic.

## Boundary clarity

The application must know which values are client-controlled.

If a value crosses from browser to server, it is input.

## Runtime validation

The server must check actual request values at runtime.

TypeScript helps developers write code. It does not validate HTTP traffic.

## Least authority

The handler should use only the authority needed for the requested action.

Role, tenant, and account decisions should come from trusted server state.

## Allow-listed state changes

State changes should write known fields.

Avoid patterns that copy all request keys into persistent objects.

## Safe error behavior

Errors should help the legitimate caller without exposing internals.

Detailed stack traces, internal markers, and framework paths are useful during development. They should not be returned to untrusted clients in production.

## Observable rejection

A rejected request should fail cleanly.

Good outcomes include:

- No state change
- Generic error text
- Stable status code
- No stack trace
- No platform error page

## Security property

The property to preserve is predictable enforcement:

- Invalid wire data stops at decoding.
- Invalid application data stops at validation.
- Unauthorized actions stop before state changes.
- Errors do not disclose internal implementation details.

## Next

Next, look at common failure patterns that break these properties.
