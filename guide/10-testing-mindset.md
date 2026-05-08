---
title: 10. A simple testing mindset
description: How to test server functions by checking security properties in order.
---

# A simple testing mindset

Testing is easier when you follow the same order as the request pipeline.

Start with the property you want to verify. Then choose a small request change that tests that property.

## Step 1: Identify the action

Ask what the server function does.

Examples:

- Reads data
- Updates a profile
- Creates a record
- Sends a message
- Changes permissions

State-changing actions deserve more caution.

## Step 2: Identify trusted inputs

Ask where identity, role, tenant, account, and object ownership come from.

These should come from server-side session or database state.

## Step 3: Identify parsed request data

Ask what fields the handler receives after validation.

Look for extra fields, loose schemas, coercion, and unknown values.

## Step 4: Modify one thing

Change one property at a time.

Examples:

- Add an unexpected field
- Change a type
- Remove a required field
- Change a role-like value
- Change a dynamic field name

Record whether the request fails during decoding, validation, authorization, or handler logic.

## Step 5: Check the result

Good failures are boring.

Look for:

- No state change
- No privileged effect
- No stack trace
- No internal details
- A clear but generic error

## Where tools fit

After you understand the model, tools save time.

Use `tss-codec` to decode and re-encode server function traffic. Use the security lab to practice against intentional vulnerable patterns.

## Security property

The property to preserve is measurable behavior:

- The server rejects unsafe input.
- The server explains only what the caller should know.
- The server state remains correct after tampering.

## Next

Use the appendices for wire details, decoded examples, test cases, and tooling notes.
