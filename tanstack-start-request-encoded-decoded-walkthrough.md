---
title: Wire vs decoded walkthrough
description: A small example that maps a Seroval request body to the application data a handler receives.
outline: deep
---

# Wire vs decoded walkthrough

This appendix shows one small request in two forms:

- The wire form a proxy sees
- The decoded form a human wants to reason about

## Application value

Assume the browser calls a server function with this data:

```json
{
  "data": {
    "email": "ada@example.com",
    "displayName": "Ada"
  }
}
```

This is the application value. It is not necessarily the exact HTTP body.

## Wire form

The request body may use a Seroval envelope:

```json
{
  "t": {
    "t": 10,
    "i": 0,
    "p": {
      "k": ["data"],
      "v": [
        {
          "t": 10,
          "i": 1,
          "p": {
            "k": ["email", "displayName"],
            "v": [
              { "t": 1, "s": "ada@example.com" },
              { "t": 1, "s": "Ada" }
            ]
          },
          "o": 0
        }
      ]
    },
    "o": 0
  },
  "f": 63,
  "m": []
}
```

The exact tags are serializer details. The useful point is that `data.email` and `data.displayName` are encoded as nodes in a value tree.

## Decoded form

A decoder can expand the wire body into a readable shape:

```json
{
  "kind": "tanstack-start-request",
  "envelope": {
    "f": 63,
    "m": []
  },
  "value": {
    "data": {
      "email": "ada@example.com",
      "displayName": "Ada"
    }
  }
}
```

This is the form most useful for security reasoning.

## How to read it

Focus on three questions:

1. What application fields are present?
2. Which fields were expected by the validator?
3. Which fields affect authorization or state changes?

If an unexpected field appears in decoded data, the server must either reject it or intentionally ignore it.

## Security interpretation

Changing the wire form can produce different classes of result:

- Invalid serialization: rejected before validation.
- Valid serialization with invalid data: rejected by validation.
- Valid data with insufficient permission: rejected by authorization.
- Valid and authorized data: handler runs.

Do not treat all failures as the same. The failure stage tells you which security property is working.

## Related pages

- [The request lifecycle](./guide/04-request-lifecycle.md)
- [Validation and parsing](./guide/07-validation-and-parsing.md)
- [Wire format reference](./tanstack-start-wire-format-spec.md)
---
outline: deep
description: Side-by-side Seroval wire body and tss-codec decode output so keys line up mentally.
---

# TanStack Start request: wire JSON vs decoded JSON (field-by-field)

> One fixed example duplicated in two representations. Use it to map **what you see in Burp** (`"t"` / `"f"` tree) to **what tools expand** (`data.firstName`, `data.email`, …).

This note walks through one real request body in both forms: the **wire** shape sent over HTTP (Seroval cross-JSON inside TanStack’s envelope) and the **decoded** shape produced by tools such as `tss-codec decode-request`. It uses the same example payload throughout so you can align keys between columns.

The wire example:

```json
{
  "t": {
    "t": 10,
    "i": 0,
    "p": {
      "k": [
        "data"
      ],
      "v": [
        {
          "t": 10,
          "i": 1,
          "p": {
            "k": [
              "firstName",
              "lastName",
              "email"
            ],
            "v": [
              {
                "t": 1,
                "s": "test"
              },
              {
                "t": 1,
                "s": "test"
              },
              {
                "t": 1,
                "s": "anything@email.com"
              }
            ]
          },
          "o": 0
        }
      ]
    },
    "o": 0
  },
  "f": 63,
  "m": []
}
```

The decoded example:

```json
{
  "kind": "tanstack-start-request",
  "envelope": {
    "f": 63,
    "m": []
  },
  "value": {
    "$type": "Object",
    "$id": 0,
    "flags": 0,
    "value": {
      "data": {
        "$type": "Object",
        "$id": 1,
        "flags": 0,
        "value": {
          "firstName": "test",
          "lastName": "test",
          "email": "anything@email.com"
        }
      }
    }
  }
}
```

---

## Part 1 — Top-level TanStack envelope (wire)

These three keys wrap the Seroval graph for a JSON `POST` body.

### `t` (wire)

The **root Seroval node** for the payload. Everything about `data` / `context` / etc. lives under this tree as nested Seroval nodes. It is not the same meaning as the inner `"t"` on each node (see below).

Maps to: the whole `value` subtree in the decoded output (the decoded root object and everything inside it).

### `f` (wire) → `envelope.f` (decoded)

A **numeric feature mask** used by Seroval in cross-JSON mode. You normally treat it as opaque metadata and keep it unchanged when round-tripping unless you know the Seroval version and feature bits you are targeting.

In this example, `63` is the value carried through to `envelope.f`.

### `m` (wire) → `envelope.m` (decoded)

An array of **marked reference identifiers** used by Seroval when serializing to vanilla JSON. In many simple calls it is an empty array. Preserve it when re-encoding if you need a byte-for-byte–stable body; otherwise the encoder may emit a normalized form.

---

## Part 2 — Decoded wrapper (`tss-codec` / editable form)

### `kind` (decoded)

Literal discriminator: `tanstack-start-request`. It tells tools and humans that this JSON is the decoded form of a TanStack Start **request** envelope, not a raw Seroval node alone and not a response.

There is no separate wire key for this; it is only in the decoded representation.

### `envelope` (decoded)

Holds the same **routing metadata** as the top-level wire fields `f` and `m`.

- **`envelope.f`** — same as wire `f`.
- **`envelope.m`** — same as wire `m`.

### `value` (decoded)

The human-readable view of the wire **root Seroval node** (wire top-level `t`). Described in the next section.

---

## Part 3 — Seroval node: outer payload object (wire `t` root)

Here the root node is a **plain object** in Seroval’s type system.

### Inner `t`: `10` (wire)

Seroval **type tag** for a normal **plain object** (`Object`).

Decoded as: `$type: "Object"` at the same conceptual level.

### `i`: `0` (wire)

**Identity number** for this object in the Seroval graph. The deserializer uses it for references and cycles (`{"t":4,"i":0}` would mean “this same object”).

Decoded as: `$id: 0` on the matching object.

### `p` (wire)

**Properties bag** for an object. Seroval stores keys and values in **parallel arrays**:

- **`p.k`** — list of string keys (property names).
- **`p.v`** — list of Seroval nodes, in the **same order** as `p.k`.

Here `k` is `["data"]` and `v` has one element: the Seroval node for the `data` property.

Decoded as: a single key `data` under `value.value`, whose value is another decoded object (next section).

### `o`: `0` (wire)

**Object integrity flags** in Seroval (for example whether the object was created as extensible, sealed, or frozen in the original JS engine).

Decoded as: `flags: 0`. For everyday inspection you can read `0` as “no special flags.”

---

## Part 4 — The `data` object (nested Seroval object)

This is the object in `p.v[0]`, paired with key `"data"`.

### Inner `t`: `10`, `i`: `1`, `o`: `0` (wire)

Same pattern as the root: plain object, **id 1**, flags **0**.

Decoded as: under `value.value.data`, an object with `$type: "Object"`, `$id: 1`, `flags: 0`, and a `value` bag holding the form fields.

### `p.k` / `p.v` for `firstName`, `lastName`, `email` (wire)

Three keys and three value nodes, order preserved:

1. `firstName` → string node  
2. `lastName` → string node  
3. `email` → string node  

---

## Part 5 — String primitives inside `data`

Each field is a Seroval **string** node.

### `t`: `1` (wire)

Seroval type tag for **string**.

### `s`: `"test"`, `"test"`, `"anything@email.com"` (wire)

The string **payload**.

Decoded as: plain JSON strings in `value.value.data.value`:

- `firstName`
- `lastName`
- `email`

There is no `$type` wrapper in the decoded tree for simple strings; they appear as normal string values inside the object’s `value` map.

---

## Quick mapping summary

- Wire **top-level** `t` → decoded **`value`** (plus inner `$type` / `$id` / `flags` / nested `value`).
- Wire **top-level** `f` / `m` → decoded **`envelope.f`** / **`envelope.m`**.
- Wire **`p.k` / `p.v`** on an object → decoded **object `value` map**: keys from `k`, values decoded from each node in `v`.
- Wire object **`t`: 10**, **`i`**, **`o`** → decoded **`$type`: `"Object"`**, **`$id`**, **`flags`**.
- Wire string **`t`: 1**, **`s`** → decoded **JSON string** at the corresponding key.

---

## See also

- [tanstack-start-wire-format-spec.md](./tanstack-start-wire-format-spec.md) — broader wire format and security notes.
