---
title: 6. Trust boundaries
description: Where trust changes in a TanStack Start server function request.
---

# Trust boundaries

A trust boundary is a place where data moves from one trust level to another.

Server functions have a clear boundary: the browser sends data, and the server receives it.

## Main boundaries

There are three useful boundaries to track.

## Browser to network

Anything in browser memory can be changed by the user.

Client-side validation, hidden fields, disabled buttons, and TypeScript types are not security controls.

## Network to framework

The framework receives bytes and tries to deserialize them.

This step protects the framework's own assumptions. It does not prove that the resulting application value is safe.

## Framework to application handler

The application receives `data` and sometimes `context`.

This is where developer choices matter most. The handler must not treat client-influenced values as server facts.

## Context is not always authority

Some frameworks let requests carry context-like values through middleware or serialized calls.

Treat request-carried context as input unless you can prove it was created on the server from a trusted session.

Roles, tenant IDs, account IDs, and permissions should come from server-side authority, not client-provided objects.

## Security property

The property to preserve is authority separation:

- Identity comes from authenticated server state.
- Authorization comes from server policy.
- Request data describes what the user wants, not what the user is allowed to do.

## Next

Next, connect trust boundaries to validation and parsing.
