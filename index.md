---
layout: home

hero:
  name: TanStack Start
  text: Server function security tutorial
  tagline: Learn server functions through TanStack Start code, HTTP traffic, and review patterns.
  actions:
    - theme: brand
      text: Start the tutorial
      link: /guide/01-tanstack-start-server-functions
    - theme: alt
      text: Read the appendices
      link: /tanstack-start-wire-format-spec

features:
  - title: TanStack Start first
    details: 'Every module starts from createServerFn, route files, inputValidator, handler data, or server function HTTP traffic.'
  - title: Code and traffic together
    details: 'The guide pairs TypeScript snippets with proxy-visible POST, GET, payload, response, and Seroval examples.'
  - title: Security review patterns
    details: 'The focus is on concrete server function risks: passthrough schemas, object copies, dynamic writes, context misuse, and verbose errors.'
---

## Who this is for

This tutorial is for application security readers who know basic HTTP and JavaScript, but are new to TanStack Start server functions.

The goal is not to explain web development from scratch. The goal is to show how TanStack Start server functions are written, how their requests look, and where security review should focus.

## Learning path

Read these in order.

1. [TanStack Start server functions](./guide/01-tanstack-start-server-functions.md)
2. [Project shape and routing](./guide/02-project-shape-and-routing.md)
3. [createServerFn anatomy](./guide/03-create-server-fn-anatomy.md)
4. [POST request lifecycle](./guide/04-post-request-lifecycle.md)
5. [GET and Seroval payloads](./guide/05-get-and-seroval-payloads.md)
6. [data, context, and sessions](./guide/06-data-context-and-sessions.md)
7. [Zod validation choices](./guide/07-zod-validation-choices.md)
8. [Responses and errors](./guide/08-responses-and-errors.md)
9. [TanStack Start failure patterns](./guide/09-tanstack-failure-patterns.md)
10. [Testing TanStack Start server functions](./guide/10-testing-tanstack-start.md)

## Companion projects

The tutorial is code-first. These projects are useful when you want to practice against real traffic.

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
