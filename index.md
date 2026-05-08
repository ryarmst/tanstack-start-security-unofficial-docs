---
layout: home

hero:
  name: TanStack Start
  text: Server function security tutorial
  tagline: Learn the development model first, then the security properties that matter.
  actions:
    - theme: brand
      text: Start the tutorial
      link: /guide/01-web-framework-basics
    - theme: alt
      text: Read the appendices
      link: /tanstack-start-wire-format-spec

features:
  - title: Development model first
    details: Start with web frameworks, routing, server functions, and serialization before looking at raw traffic.
  - title: Security properties throughout
    details: Each topic explains the property to preserve, such as clear trust boundaries, validated inputs, and safe error handling.
  - title: Tooling as an appendix
    details: tss-codec and the security lab support the tutorial, but the main path stays concept-first and beginner-friendly.
---

## Who this is for

This tutorial is for beginner application security readers who know basic HTTP and JavaScript, but are new to TanStack Start server functions.

The goal is not to memorize a wire format first. The goal is to understand how developers build these features, then reason about the security properties of the request path.

## Learning path

Read these in order.

1. [Web framework basics](./guide/01-web-framework-basics.md)
2. [TanStack Start basics](./guide/02-tanstack-start-basics.md)
3. [Server functions from a developer view](./guide/03-server-functions-development.md)
4. [The request lifecycle](./guide/04-request-lifecycle.md)
5. [Serialization and Seroval](./guide/05-serialization-seroval.md)
6. [Trust boundaries](./guide/06-trust-boundaries.md)
7. [Validation and parsing](./guide/07-validation-and-parsing.md)
8. [Security properties](./guide/08-security-properties.md)
9. [Common failure patterns](./guide/09-common-failure-patterns.md)
10. [A simple testing mindset](./guide/10-testing-mindset.md)

## Companion projects

The tutorial is concept-first. These projects are useful after you understand the model.

| Project | Purpose |
|---------|---------|
| [tss-codec](https://github.com/ryarmst/tss-codec) | CLI + UI to decode/encode Seroval envelopes, detect traffic, extract function IDs |
| [Tanstack Server Functions Security Lab](https://github.com/ryarmst/Tanstack-Server-Functions-Security-Lab) | Intentionally vulnerable TanStack Start app with hands-on labs |

## Appendices

Use these after the learning path.

- [Wire format reference](./tanstack-start-wire-format-spec.md)
- [Wire vs decoded walkthrough](./tanstack-start-request-encoded-decoded-walkthrough.md)
- [Security test case catalog](./tanstack-start-security-test-cases.md)
- [Tooling appendix](./tanstack-start-testing-tooling-plan.md)

## Publishing

This mini-site builds with **VitePress** and can deploy to **GitHub Pages** on push. See **[Publishing](./publishing)** for setup, base URL, and workflow placement.
