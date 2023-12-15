const YEAR = new Date().getFullYear()

export default {
  footer: (
    <small style={{ display: 'block', marginTop: '8rem' }}>
      <time>{YEAR}</time> © 小肚肚肚肚肚哦.
      <a href="/feed.xml">RSS</a>
      <style jsx>{`
        a {
          float: right;
        }
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </small>
  ),
  readMore: '大官人，进来看看呀~~ →',
  postFooter: null,
  darkMode: false,
  navs: [
    // {
    //   url: 'https://github.com/shuding/nextra',
    //   name: 'Nextra'
    // }
  ]
}
