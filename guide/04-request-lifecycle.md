---
title: 4. The request lifecycle
description: The path from a browser call to parsed data and handler execution.
---

# The request lifecycle

A server function call looks like a function call in application code. At runtime, it is a request.

The useful mental model is a pipeline.

```text
Browser call
  -> HTTP request
  -> framework route
  -> deserialization
  -> input validation
  -> handler
  -> serialized response
```

## Browser call

The browser code calls a generated client stub. The stub knows the server function identifier and method.

The developer sees a friendly API. A tester sees an HTTP request.

## HTTP request

TanStack Start server function requests commonly use paths under:

```text
/_serverFn/
```

The request may be `POST` with a body, or `GET` with a payload in the query string.

## Deserialization

The framework decodes the request into JavaScript values.

This happens before the developer's validator runs.

If deserialization fails, the handler should not run.

## Validation

The validator receives the deserialized value and decides whether it matches the expected shape.

Strict validation rejects unexpected fields. Loose validation may keep them.

## Handler

The handler runs only after the framework reaches application code.

This is where state changes, database reads, and authorization checks usually happen.

## Security property

The property to preserve is stage separation:

- Wire format errors stop before validation.
- Validation errors stop before the handler.
- Authorization failures stop before state changes.

## Next

Next, learn why TanStack Start request bodies do not look like ordinary JSON.
