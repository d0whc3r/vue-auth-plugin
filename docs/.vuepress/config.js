module.exports = {
  plugins: [
    require('./plugin.js'),
  ],
  locales: {
    '/': {
      lang: 'en-US',
      title: 'VueCliPluginAuth',
      description: 'VueCliPluginAuth for Vue.js',
    },
  },
  themeConfig: {
    repo: '/vue-auth-plugin',
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
          '/installation.md',
          '/started.md',
        ],
      },
    },
  },
};
