---
title: Security test case catalog
description: A compact set of mutation ideas mapped to the security properties they test.
outline: deep
---

# Security test case catalog

Use this page after you understand the tutorial path.

The goal is not to send every possible mutation. The goal is to test one security property at a time.

## How to use this catalog

1. Capture a normal working server function request.
2. Decode it into a readable value.
3. Choose one property to test.
4. Modify one thing.
5. Send the request.
6. Record which stage rejected it.

For state-changing functions, use a test account and non-production data.

## Expected safe outcomes

Safe outcomes are boring.

- Invalid wire data fails before validation.
- Invalid input fails before the handler.
- Unauthorized input fails before state changes.
- Error responses do not include stack traces or internal paths.
- Server state remains correct.

## Test group: type changes

Property tested: runtime validation.

Examples:

- Replace a string with `null`.
- Replace a number with a string.
- Replace an object with an array.
- Remove a required field.

Expected result: validation rejects the request before handler logic.

## Test group: unexpected fields

Property tested: narrow accepted input.

Examples:

- Add `isAdmin`.
- Add `role`.
- Add `accountId`.
- Add `permissions`.

Expected result: strict schemas reject the fields, or handlers ignore them completely.

## Test group: dangerous property names

Property tested: safe object handling.

Examples:

- Add `__proto__`.
- Add `constructor`.
- Add `prototype`.

Expected result: the value is rejected or treated as inert data. It must not affect object prototypes or server state.

## Test group: dynamic field names

Property tested: allow-listed state changes.

Examples:

- Change `field` to `role`.
- Change `field` to `isAdmin`.
- Change `field` to a nested-looking value such as `profile.role`.

Expected result: only approved field names can be updated.

## Test group: context and authority

Property tested: least authority.

Examples:

- Add a role-like value to request context.
- Change tenant-like identifiers.
- Change owner-like identifiers.

Expected result: authority still comes from the server-side session or database, not from request data.

## Test group: error behavior

Property tested: safe error behavior.

Examples:

- Send a malformed value.
- Trigger validation failure.
- Trigger an authorization failure.
- Trigger a handler-level edge case.

Expected result: the caller receives only safe error information.

## Mapping results

Record results with these categories:

- `decode_rejected`
- `validation_rejected`
- `authorization_rejected`
- `handler_error`
- `unexpected_state_change`
- `unexpected_success`

`unexpected_success` and `unexpected_state_change` deserve the most attention.

## Related pages

- [Security properties](./guide/08-security-properties.md)
- [Common failure patterns](./guide/09-common-failure-patterns.md)
- [A simple testing mindset](./guide/10-testing-mindset.md)
