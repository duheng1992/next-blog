const { promises: fs } = require('fs')
const path = require('path')
const RSS = require('rss')
const matter = require('gray-matter')

async function generate() {
  const useRss = process.argv.slice(2);

  const posts = await fs.readdir(path.join(__dirname, '..', 'pages', 'posts'))
  const allPosts = []
  await Promise.all(
    posts.map(async (name) => {
      if (name.startsWith('index.')) return

      const content = await fs.readFile(
        path.join(__dirname, '..', 'pages', 'posts', name)
      )
      const frontmatter = matter(content)

      allPosts.push({
        title: frontmatter.data.title,
        url: '/posts/' + name.replace(/\.mdx?/, ''),
        date: frontmatter.data.date,
        description: frontmatter.data.description,
        categories: frontmatter.data.tag.split(', '),
        author: frontmatter.data.author
      })
    })
  )

  allPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
  
  if (useRss && useRss.length) {
    const feed = new RSS({
      title: '小肚肚肚肚肚哦',
      site_url: 'https://next-blog-pro-gray.vercel.app/',
      feed_url: 'https://next-blog-pro-gray.vercel.app/feed.xml'
    })
    allPosts.forEach((post) => {
      feed.item(post)
    });
    await fs.writeFile('./public/feed.xml', feed.xml({ indent: true }))
  }
  await fs.writeFile('./public/search.json', JSON.stringify(allPosts))
}

generate()
