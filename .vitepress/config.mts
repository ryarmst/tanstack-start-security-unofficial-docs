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
      { text: 'Tutorial', link: '/guide/01-web-framework-basics' },
      { text: 'Appendices', link: '/tanstack-start-wire-format-spec' },
      { text: 'Publishing', link: '/publishing' },
    ],

    sidebar: [
      {
        text: 'Tutorial',
        items: [
          { text: 'Overview', link: '/' },
          { text: '1. Web framework basics', link: '/guide/01-web-framework-basics' },
          { text: '2. TanStack Start basics', link: '/guide/02-tanstack-start-basics' },
          { text: '3. Server functions', link: '/guide/03-server-functions-development' },
          { text: '4. Request lifecycle', link: '/guide/04-request-lifecycle' },
          { text: '5. Serialization and Seroval', link: '/guide/05-serialization-seroval' },
          { text: '6. Trust boundaries', link: '/guide/06-trust-boundaries' },
          { text: '7. Validation and parsing', link: '/guide/07-validation-and-parsing' },
          { text: '8. Security properties', link: '/guide/08-security-properties' },
          { text: '9. Failure patterns', link: '/guide/09-common-failure-patterns' },
          { text: '10. Testing mindset', link: '/guide/10-testing-mindset' },
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
      {
        text: 'Site',
        items: [{ text: 'Publishing', link: '/publishing' }],
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
