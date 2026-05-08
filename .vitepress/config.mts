import { defineConfig } from 'vitepress'

/**
 * GitHub Pages project URLs look like https://<user>.github.io/<repo>/
 * VitePress must use base: /<repo>/ in that layout.
 *
 * Locally and for user/org sites (repo named <user>.github.io), base is "/".
 *
 * CI sets VITEPRESS_BASE automatically from the repository name (see workflow).
 */
const base = process.env.VITEPRESS_BASE?.replace(/\/?$/, '/') ?? '/'

export default defineConfig({
  srcExclude: ['README.md'],
  title: 'TanStack Start — security notes',
  description:
    'A beginner-friendly security tutorial for TanStack Start server functions.',
  base,

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Tutorial', link: '/guide/01-tanstack-start-server-functions' },
      { text: 'Appendices', link: '/tanstack-start-wire-format-spec' },
    ],

    sidebar: [
      {
        text: 'Tutorial',
        items: [
          { text: 'Overview', link: '/' },
          {
            text: '1. Server functions',
            link: '/guide/01-tanstack-start-server-functions',
          },
          {
            text: '2. Project shape and routing',
            link: '/guide/02-project-shape-and-routing',
          },
          { text: '3. createServerFn anatomy', link: '/guide/03-create-server-fn-anatomy' },
          { text: '4. POST lifecycle', link: '/guide/04-post-request-lifecycle' },
          { text: '5. GET and Seroval payloads', link: '/guide/05-get-and-seroval-payloads' },
          { text: '6. data, context, sessions', link: '/guide/06-data-context-and-sessions' },
          { text: '7. Zod validation choices', link: '/guide/07-zod-validation-choices' },
          { text: '8. Responses and errors', link: '/guide/08-responses-and-errors' },
          { text: '9. Failure patterns', link: '/guide/09-tanstack-failure-patterns' },
          { text: '10. Testing workflow', link: '/guide/10-testing-tanstack-start' },
        ],
      },
      {
        text: 'Appendices',
        items: [
          { text: 'Wire format reference', link: '/tanstack-start-wire-format-spec' },
          { text: 'Wire vs decoded', link: '/tanstack-start-request-encoded-decoded-walkthrough' },
          { text: 'Security test cases', link: '/tanstack-start-security-test-cases' },
          { text: 'Tooling appendix', link: '/tanstack-start-testing-tooling-plan' },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ryarmst/tss-codec',
        ariaLabel: 'tss-codec repository',
      },
      {
        icon: 'github',
        link: 'https://github.com/ryarmst/Tanstack-Server-Functions-Security-Lab',
        ariaLabel: 'Security lab repository',
      },
    ],

    search: {
      provider: 'local',
    },

    outline: { level: [2, 3] },

    footer: {
      message: 'Educational material for authorized security testing only.',
      copyright: 'Reference docs for TanStack Start server function research',
    },
  },
})
