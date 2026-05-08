---
title: Tooling appendix
description: Where tss-codec and the training lab fit after the conceptual tutorial.
outline: deep
---

# Tooling appendix

Tools are useful after the model is clear.

This page explains where the companion projects fit.

## tss-codec

Repository:

```text
https://github.com/ryarmst/tss-codec
```

Use `tss-codec` to:

- Detect TanStack Start traffic
- Extract server function IDs from bundles
- Decode request bodies
- Decode response bodies
- Decode framed responses
- Re-encode edited request values
- Generate mutation cases

## Security lab

Repository:

```text
https://github.com/ryarmst/Tanstack-Server-Functions-Security-Lab
```

Use the lab to practice:

- Strict validation
- Passthrough validation
- Mass assignment
- Dynamic field writes
- Client-influenced context
- Verbose error responses
- GET payload handling

The lab intentionally includes vulnerable patterns. Do not expose it to the internet.

## Suggested workflow

1. Run the lab locally.
2. Submit a normal request in the browser.
3. Capture the request in a proxy.
4. Decode the body with `tss-codec`.
5. Modify one property.
6. Re-encode the body.
7. Replay the request.
8. Record the rejection stage.

Decode a captured request body:

```bash
tss-codec decode-request body.json
```

Encode an edited decoded request:

```bash
tss-codec encode-request decoded-request.json > body.json
```

Generate mutation cases:

```bash
tss-tester generate body.json -o cases
```

## What tools should not replace

Tools do not replace reasoning about trust.

Before using a tool, identify:

- The server function action
- The trusted source of identity
- The fields the validator allows
- The state the handler can change
- The error behavior you expect

## Related pages

- [A simple testing mindset](./guide/10-testing-mindset.md)
- [Wire format reference](./tanstack-start-wire-format-spec.md)
- [Security test case catalog](./tanstack-start-security-test-cases.md)
---
outline: deep
description: Design goals and architecture notes for tooling (detection, decode/encode, Burp ergonomics); see tss-codec for shipped implementation.
---

# TanStack Start Testing Tooling Plan

> **Audience:** builders of security tooling more than testers. Describes fingerprints and backlog; pairing with **[tss-codec](https://github.com/ryarmst/tss-codec)** is the pragmatic path until every item lands.

This plan covers tooling for TanStack Start server function discovery, request/response decoding, and Burp integration.

The goal is to support a tester working at raw HTTP level. The first version should make TanStack traffic obvious, decode it into a readable shape, and let the tester edit values without hand-writing Seroval nodes.

## Findings To Build On

TanStack Start server functions have these useful fingerprints:

- Client bundles contain server function stubs such as `createClientRpc("<id>")` or minified equivalents.
- Server function URLs are `TSS_SERVER_FN_BASE + functionId`; default base is `/_serverFn/`.
- Production default IDs are SHA-256 hex strings derived from `filename--functionName`.
- Requests use `X-Tsr-ServerFn: true`.
- JSON requests use Seroval vanilla JSON wrapper `{ "t": <node>, "f": <featureMask>, "m": <markedRefs> }`.
- Serialized responses use `x-tss-serialized: true`.
- Non-streaming responses are bare Seroval cross-JSON nodes.
- Streaming responses use `application/x-tss-framed; v=1` binary frames.

Relevant source files:

- `router/packages/start-client-core/src/client-rpc/serverFnFetcher.ts`
- `router/packages/start-client-core/src/client-rpc/createClientRpc.ts`
- `router/packages/start-server-core/src/server-functions-handler.ts`
- `router/packages/start-server-core/src/frame-protocol.ts`
- `router/packages/start-client-core/src/client-rpc/frame-decoder.ts`
- `router/packages/start-plugin-core/src/start-compiler/compiler.ts`
- `seroval@1.5.4/src/core/constants.ts`
- `seroval@1.5.4/src/core/types.ts`

## Tooling Goals

The tooling should answer two questions quickly:

1. Does this app use TanStack Start server functions, and what is exposed?
2. What does this request or response mean, and how can I edit it safely?

Core capabilities:

- Detect TanStack Start traffic from headers, paths, body shapes, and bundled JavaScript.
- Extract server function IDs, HTTP methods, and URL base from JavaScript.
- Decode Seroval request bodies into readable JSON-like output.
- Decode Seroval response bodies into readable output.
- Decode `application/x-tss-framed` responses into JSON frames and raw stream chunks.
- Re-encode edited readable data back into valid Seroval.
- Preserve reference IDs and special values such as `undefined`, `NaN`, `Date`, `Map`, and `Set`.

## Recommended Architecture

Build this as a layered toolkit:

1. A small protocol core library.
2. A command-line decoder/encoder.
3. A Burp extension with custom message viewers.
4. Optional Bambdas for lightweight discovery and scanner surfacing.
5. Optional web UI for manual editing outside Burp.

The protocol core should be the first artifact. Everything else should call it.

## Protocol Core

Language recommendation: TypeScript first.

Reasons:

- Seroval is JavaScript-native.
- The exact serializer can be reused for correctness.
- A browser-based editor becomes easy.
- The same core can power a Node CLI and a webapp.

Core modules:

- `detectTanStackStart(message)`: classify request, response, or JS asset.
- `extractServerFns(jsText)`: find function IDs, methods, and stub names.
- `decodeSerovalNode(node)`: convert Seroval node to an editable intermediate representation.
- `encodeSerovalNode(ir)`: convert edited intermediate representation back to Seroval.
- `decodeRequestBody(body)`: handle `{t,f,m}` wrapper.
- `encodeRequestBody(ir, f, m)`: preserve wrapper metadata.
- `decodeResponseBody(body)`: handle bare cross-JSON response nodes.
- `decodeFramed(bytes)`: split binary frames.
- `encodeFramed(frames)`: only needed later.

Do not convert everything to normal JSON too early. Normal JSON cannot represent `undefined`, `NaN`, `Map`, `Set`, cycles, empty array slots, or shared references.

Use an explicit editable IR:

```json
{
  "$type": "Object",
  "$id": 0,
  "value": {
    "result": { "$type": "Undefined" },
    "error": { "$type": "Undefined" },
    "context": {
      "$type": "NullObject",
      "$id": 1,
      "value": {}
    }
  }
}
```

This is more verbose than JSON, but it prevents accidental corruption.

## Discovery Tooling

Discovery should inspect both traffic and static assets.

Traffic fingerprints:

- Request header `X-Tsr-ServerFn: true`
- Request path matching `/_serverFn/<id>`
- Request body with top-level `t`, `f`, and `m`
- Response header `x-tss-serialized: true`
- Response content type `application/x-tss-framed`

JavaScript fingerprints:

- `createClientRpc("...")`
- `.handler(createClientRpc("..."))`
- Minified `handler(wt("..."))`
- `"/_serverFn/" + id`
- `x-tsr-serverFn`
- `application/x-tss-framed`
- `__TSS_CONTEXT`
- 64-character lowercase hex IDs near `GET` or `POST`

Extracted record shape:

```json
{
  "id": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  "method": "POST",
  "base": "/_serverFn/",
  "url": "/_serverFn/9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  "sourceAsset": "/assets/index-DmRqCZ_Q.js",
  "symbol": "oO",
  "confidence": "high"
}
```

## Burp Option 1: Bambdas

Bambdas are best for fast, lightweight detection and scanner surfacing. They are not ideal for full Seroval parsing or custom UI.

Recommended Bambdas:

- Passive per-request scan check: flag TanStack Start server function requests and serialized responses.
- Passive per-request scan check: flag JavaScript assets that expose server function IDs.
- Custom column: show `TanStack Start`, function ID, method, or decoded result/error summary.
- View filter: show only TanStack Start RPC traffic.
- Repeater custom action: send the current request body to an external local decoder service and replace the editor body with re-encoded output.

Benefits:

- Fast to deploy.
- No full extension build.
- Good for triage and scanner issue creation.
- Can use Burp Globals as feature gates.

Limitations:

- Bambdas are Java code bodies, not full projects.
- No native custom message viewer.
- Persistence is limited unless using BurpDB, Java Preferences, or JDBC.
- Implementing a complete Seroval parser in a Bambda would be awkward and hard to maintain.

Recommended use:

- Use Bambdas for discovery, annotations, filters, and issue reporting.
- Do not make Bambdas the primary decoder/editor.

Persistence note:

- If a Bambda needs to dedupe extracted server function IDs across many assets, prefer the BurpDB extension if installed.
- Otherwise use Java Preferences for small per-project values.

## Burp Option 2: Montoya Extension

A Burp extension is the best long-term Burp integration.

Recommended features:

- Custom HTTP message editor tab named `TanStack`.
- Request decoder for JSON server function payloads.
- Response decoder for `x-tss-serialized` JSON responses.
- Framed response viewer for `application/x-tss-framed; v=1`.
- Context menu items:
  - `Decode TanStack Start Body`
  - `Encode TanStack Start Body`
  - `Send Decoded To Repeater`
  - `Extract Server Functions From JS`
- Passive scan check that reports exposed server function surface.
- Suite tab with discovered functions and source assets.

Benefits:

- Native Burp workflow.
- Can add custom message viewers.
- Can persist findings in `api.persistence().extensionData()`.
- Can support editable tabs with validation.
- Better for binary framed responses than Bambdas.

Limitations:

- Java implementation must either port the Seroval parser or call a helper process/library.
- Bundling a JS runtime is possible but heavy.
- Custom editable structured views take UI work.

Implementation choices:

- Pure Java parser: best Burp packaging, more protocol code to maintain.
- Java extension plus local Node sidecar: easiest correctness because it can reuse Seroval, but adds setup.
- Java extension plus embedded GraalJS: possible, but packaging and compatibility are heavier.

Recommended use:

- Build the Montoya extension after the TypeScript protocol core exists.
- Start with read-only viewers.
- Add safe editing after decode coverage is strong.

## Burp Option 3: Piper Custom Message Viewers

Piper can be useful if it lets Burp pipe message bodies to external commands and display transformed output.

Recommended Piper commands:

- Decode current request body to readable IR.
- Decode current response body to readable IR.
- Decode framed response bytes to a frame list.
- Encode edited IR back to Seroval.

Benefits:

- Quick bridge from Burp to a Node CLI.
- Avoids writing a full Montoya UI at first.
- Lets the protocol core stay in TypeScript.

Limitations:

- Depends on Piper installation and its exact viewer/editing model.
- Editing round trips may be less smooth than a native extension.
- Binary framed responses need byte-safe piping.

Recommended use:

- Use Piper as the fastest path to a working Burp viewer if the extension is too much upfront.
- Treat it as an interim integration, not the final UX.

## Option 4: Standalone Webapp

A simple local webapp is a good companion tool.

Features:

- Paste raw request body or response body.
- Auto-detect request wrapper vs response node.
- Decode to editable IR.
- Show a simplified human view.
- Re-encode to Seroval.
- Decode binary framed response from file upload.
- Extract server function IDs from pasted JavaScript.

Benefits:

- Easy to build with TypeScript.
- Easy to reuse Seroval directly.
- Good for training and manual analysis.
- Does not depend on Burp APIs.

Limitations:

- Manual copy/paste unless paired with Piper or a Burp action.
- Browser file handling for binary frames needs care.
- Must warn users not to paste sensitive production data into a remote-hosted tool.

Recommended use:

- Build as a local-only static app or Vite dev app.
- Pair it with a CLI for automation.

## Option 5: CLI

A CLI should exist even if the main UI is Burp.

Commands:

```text
tss detect <request-or-response-file>
tss decode-request <body-file>
tss encode-request <ir-file>
tss decode-response <body-file>
tss decode-framed <binary-body-file>
tss extract-fns <js-file-or-directory>
```

Benefits:

- Easy to test.
- Easy to call from Piper, shell, or Repeater custom actions.
- Easy to add fixtures for every Seroval node type.

Recommended use:

- Build immediately after the protocol core.

## Prioritized Build Plan

Phase 1: Protocol Core And CLI

- Implement Seroval node decode to editable IR.
- Implement editable IR encode back to Seroval.
- Support request wrapper `{t,f,m}` and bare response nodes.
- Implement binary frame decoder.
- Implement JavaScript server function extraction.
- Add fixtures from the sampled app and generated Seroval examples.

Phase 2: Webapp

- Add paste-and-decode UI.
- Add editable IR panel.
- Add re-encode button.
- Add function ID extractor panel.
- Add framed response file upload.

Phase 3: Burp Piper Integration

- Add Piper-friendly CLI modes that read stdin and write stdout.
- Document Burp Piper command recipes.
- Support request and response body transforms.

Phase 4: Burp Bambdas

- Passive scan check for TanStack Start detection.
- Passive scan check for exposed server function IDs in JS.
- View filter for TanStack Start RPC traffic.
- Custom column for function ID and decoded status.
- Optional Repeater custom action that calls local CLI.

Phase 5: Native Montoya Extension

- Add custom message viewer tabs.
- Add discovery suite tab.
- Add passive scan checks.
- Add editable request body view.
- Add project persistence for discovered function IDs.

## Recommended First Tool

Build the TypeScript protocol core and CLI first.

This gives the highest leverage because every later option can reuse it:

- The webapp imports the core directly.
- Piper calls the CLI.
- Repeater custom actions can shell out to the CLI.
- A Montoya extension can either port the logic later or call the CLI as a sidecar.

## Testing Fixtures

Create fixtures for:

- Minimal `POST` request with `{ data: { x: 1 } }`.
- `GET` request with URL-encoded `payload`.
- Response `{ result: undefined, error: undefined, context: {} }`.
- Response with `Date`.
- Response with `Map` and `Set`.
- Response with cyclic object.
- Response with `$TSR/Error`.
- Response with unknown plugin tag.
- Binary framed response with one JSON frame.
- Binary framed response with JSON plus `RawStream` chunks.

Use the sampled app fixtures:

- `Sample APP Files/index.html`
- `Sample APP Files/index-DmRqCZ_Q.js`
- `Sample APP Files/index-Ce1DP5ee.js`
- `Sample APP Files/use-autosave-BsutJmPx.js`

## Practical Burp Workflow

1. Browse the app through Burp.
2. Filter for `X-Tsr-ServerFn` or `x-tss-serialized`.
3. Send interesting server function calls to Repeater.
4. Decode the request body with the CLI, Piper viewer, or extension tab.
5. Edit the decoded IR.
6. Re-encode and replace the body.
7. Fix `Content-Length`.
8. Send the request.
9. Decode the response and inspect `result`, `error`, and `context`.
10. Extract all server function IDs from JS assets and test authorization one by one.

## Security Checks To Automate Later

Candidate passive checks:

- TanStack Start detected.
- Server function ID exposed in JavaScript.
- Serialized error message present.
- Unknown custom serialization plugin present.
- Framed response present.
- Raw server function response present via `x-tss-raw`.

Candidate active checks:

- Server function method mismatch behavior.
- Missing `X-Tsr-ServerFn` behavior.
- Cross-origin preflight and CORS policy.
- Malformed Seroval handling.
- Oversized `GET` payload behavior.
- Unknown plugin tag behavior.
- Prototype pollution keys in `data`.
- Authorization bypass by calling server function IDs directly.

Active checks should be opt-in and gated. Some will generate errors or state changes.

## Open Design Questions

- Should the editable IR preserve exact original node IDs, or regenerate IDs from the edited object graph?
- How should the UI represent cycles without confusing new testers?
- Should unknown plugin nodes be editable as raw Seroval only?
- Should the first Burp integration be Piper or a Montoya extension?
- Will the user accept a local Node sidecar for Burp, or must the final tool be a single Java JAR?

## Recommendation

Use this order:

1. TypeScript core and CLI.
2. Local webapp for manual decode/edit/re-encode.
3. Piper integration for quick Burp message viewing.
4. Bambdas for discovery and scanner surfacing.
5. Native Montoya extension for the polished Burp workflow.

This keeps the parser correct early, gives immediate tester value, and avoids locking the project into the wrong Burp integration before the protocol model is stable.
