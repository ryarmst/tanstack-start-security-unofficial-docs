---
title: 2. TanStack Start basics
description: What TanStack Start is, what it is for, and where server functions fit.
---

# TanStack Start basics

TanStack Start is a full-stack React framework built on TanStack Router.

It lets developers build routes, server-rendered pages, and server-side logic in one TypeScript project.

## What developers use it for

Developers use TanStack Start to:

- Build React pages and layouts
- Load data for routes
- Run code on the server
- Share types between client code and server code
- Avoid hand-writing many small API routes

That last point matters for security. A server function can feel like a normal TypeScript function call, but it still crosses a network trust boundary.

## What server functions are

A server function is a function that the browser can call, but the implementation runs on the server.

From a developer perspective, this is convenient:

```ts
const result = await updateProfile({ data: formValues })
```

From a security perspective, this is still an HTTP request.

```text
Browser -> server function endpoint -> validator -> handler
```

## Why this abstraction is useful

Server functions reduce boilerplate.

They can also make it less obvious where validation, authorization, and serialization happen.

Good security work is not about distrusting the framework. It is about locating the exact boundary where untrusted data becomes server-side data.

## Security property

The property to preserve is explicit server authority:

- The browser may request an action.
- The server decides whether the action is allowed.
- Shared TypeScript types do not replace runtime checks.

## Next

Next, look at how a developer writes a server function.
