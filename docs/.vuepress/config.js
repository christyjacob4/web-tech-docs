module.exports = {
    title: 'Web Tech Docs',
    description: 'A Guide to Advanced Web Technologies',
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
          'prototypes'   /* /foo/two.html */,
          'call-and-apply'
        ],
      }
    }
  }