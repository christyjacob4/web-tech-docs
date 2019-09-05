module.exports = {
    title: 'Web Tech Docs',
    description: 'A Guide for the Web Technologies II course',
    themeConfig: {
      lastUpdated: 'Last Updated',
      displayAllHeaders: true,
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide/' },
        { text: 'External', link: 'https://google.com' },
      ],
      sidebar: {
        '/guide/': [
          '',     
          'constructors',  /* /foo/one.html */
          'prototypes'   /* /foo/two.html */
        ],
      }
    }
  }