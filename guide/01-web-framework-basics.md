---
title: 1. Web framework basics
description: The minimum web framework concepts needed before looking at TanStack Start server functions.
---

# Web framework basics

A web framework helps developers build an application that runs partly in the browser and partly on a server.

The browser handles user interaction. The server handles trusted work such as reading databases, checking sessions, and calling private services.

## Request and response

Every web feature eventually becomes a request and a response.

The browser sends:

- A method, such as `GET` or `POST`
- A path, such as `/login`
- Headers, such as cookies and content type
- An optional body

The server returns:

- A status code
- Headers
- A body

Security starts here. Every value sent by the browser is attacker-controlled unless the server proves otherwise.

## Routing

A route maps a request path to code.

Traditional APIs often expose routes like this:

```text
POST /api/profile
```

Modern full-stack frameworks may hide this behind generated client code. The browser still sends HTTP. The server still receives a request.

## Client code and server code

Client code runs in the browser. Users can inspect it, modify requests, and replay traffic.

Server code runs on infrastructure controlled by the application owner. It can keep secrets and enforce authorization.

The main security rule is simple: client code may improve user experience, but server code must enforce trust.

## Security property

The property to preserve is a clear boundary:

- Browser input is untrusted.
- Server state is trusted only after authentication and authorization.
- Parsed request data is not automatically safe.

## Next

Next, learn what TanStack Start adds to this normal web model.
