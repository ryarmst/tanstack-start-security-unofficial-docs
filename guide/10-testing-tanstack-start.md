---
title: 10. Testing TanStack Start server functions
description: A concrete, TanStack Start focused workflow for reviewing code and traffic.
---

# Testing TanStack Start server functions

Use the same order every time:

```text
find function -> read validator -> read handler -> capture request
  -> decode data -> change one value -> replay -> decode response
```

## 1. Find the server function

Search code for:

```ts
createServerFn({
```

For each match, record:

```text
name: saveProfile
method: POST
validator: strict Zod profile schema
handler: writes displayName and newsletter
```

## 2. Capture a known-good request

Run the UI once and capture the request.

Expected signs:

```http
X-Tsr-ServerFn: true
Content-Type: application/json
```

Path:

```text
/_serverFn/<function-id>
```

## 3. Decode the body

Use a decoder such as `tss-codec` after you understand the code path.

```bash
tss-codec decode-request body.json
```

Look for the decoded `data` object.

```json
{
  "data": {
    "displayName": "Ada",
    "newsletter": true
  }
}
```

## 4. Choose one mutation

Pick one change that maps to the code you saw.

Examples:

- Add `isAdmin` when the schema is strict.
- Add `role` when the schema is `.passthrough()`.
- Change `field` to `isAdmin` for dynamic writes.
- Change `invoiceId` for object ownership checks.
- Put `role` in `context` if the handler reads context directly.

## 5. Re-encode and replay

Encode the edited request:

```bash
tss-codec encode-request decoded-request.json > body.json
```

Replay with the same method, path, and headers. Fix `Content-Length` if your proxy does not do it automatically.

## 6. Classify the result

Use TanStack-specific stages:

- `seroval_decode_failed`
- `input_validator_rejected`
- `handler_authorization_rejected`
- `handler_returned_error`
- `handler_succeeded_without_state_change`
- `handler_succeeded_with_unexpected_state_change`

The last result is the most important.

## 7. Decode the response

If the response is serialized or framed, decode it before judging the result.

Record:

- HTTP status
- `x-tss-serialized`
- `content-type`
- decoded `result`
- decoded `error`
- state change observed in the application

## Practice targets

Use the training lab after reading the guide.

```text
https://github.com/ryarmst/Tanstack-Server-Functions-Security-Lab
```

Use `tss-codec` for request and response decoding.

```text
https://github.com/ryarmst/tss-codec
```

## Next

Use the appendices for wire-format details and mutation catalogs.
