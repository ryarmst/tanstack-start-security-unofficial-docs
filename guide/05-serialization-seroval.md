---
title: 5. Serialization and Seroval
description: Why server function traffic uses a structured wire format instead of plain application JSON.
---

# Serialization and Seroval

Serialization turns runtime values into bytes that can travel over HTTP.

Plain JSON can represent objects, arrays, strings, numbers, booleans, and null. JavaScript has more values than that.

TanStack Start uses Seroval-shaped data so it can represent JavaScript values more precisely.

## Why plain JSON is not enough

JavaScript can contain values such as:

- `undefined`
- `Date`
- `Map`
- `Set`
- `Error`
- shared object references
- cyclic object references

Plain JSON cannot represent all of these safely or exactly.

## What this means in traffic

A request body may not look like this:

```json
{ "data": { "email": "ada@example.com" } }
```

It may look like a tree of typed nodes:

```json
{
  "t": {
    "t": 10,
    "i": 0,
    "p": {
      "k": ["data"],
      "v": []
    }
  },
  "f": 63,
  "m": []
}
```

You do not need to memorize every tag before testing. You need to know that this is the transport representation, not the final object the handler sees.

## Security implication

Deserialization is a security-relevant step.

If an attacker changes the wire shape, the framework may reject it before validation. If the wire shape is valid, the validator still needs to reject unsafe application data.

These are different failures.

## Security property

The property to preserve is safe materialization:

- The framework should reject invalid serialized values.
- The application should validate materialized values.
- Application code should not trust values because they came through a framework decoder.

## Next

Next, define the trust boundaries in the pipeline.
