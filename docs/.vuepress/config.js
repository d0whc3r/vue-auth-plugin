module.exports = {
  base: process.env.BASE_DOCS || '/',
  plugins: [
    require('./plugin.js'),
  ],
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue Auth plugin',
      description: 'Vue Auth plugin for Vue.js',
    },
  },
  themeConfig: {
    repo: 'd0whc3r/vue-auth-plugin',
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          {
            text: 'Release Notes',
            link: 'https://github.com/d0whc3r/vue-auth-plugin/releases',
          }],
        sidebar: [
          '/installation',
          {
            title: 'Guide',
            collapsable: false,
            children: [
              '/guide/',
              '/guide/methods',
            ],
          }],
      },
    },
  },
};
