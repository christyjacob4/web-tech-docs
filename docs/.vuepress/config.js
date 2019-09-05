module.exports = {
    title: 'Web Technologies II',
    description: 'Guide to advanced concepts in Web Technologies',
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