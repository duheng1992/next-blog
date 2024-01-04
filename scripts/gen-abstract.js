const { promises: fs } = require('fs')
const path = require('path')
const RSS = require('rss')
const matter = require('gray-matter')

// nodes 类型：{ name: '引', level: 1 }
// function buildLevelTree(nodes) {
//   const tree = [];

//   if (!nodes || nodes.length === 0) {
//     return tree;
//   }

//   const valleyIndex = findValley(nodes);
//   console.log(valleyIndex)

// }

// function findValley(nodes) {
//   let cursor = 0;
//   let isValley = false;
//   // 从头开始找，依次找到 level 的峰谷
//   while (!isValley) {
//     if (cursor > nodes.length) {
//       break;
//     }

//     if (nodes[cursor].level > nodes[cursor + 1].level) {
//       isValley = true;
//       // 此时 cursor-1 的位置就是峰谷位置
//       break;
//     } else {
//       cursor++;
//     }
//   }

//   return cursor - 1;
// }

async function generate() {
  const useRss = process.argv.slice(2);

  const posts = await fs.readdir(path.join(__dirname, '..', 'pages', 'posts'))
  const allPosts = []
  const abstracts = [];
  const directories = {};  // 存一个字典，通过文章名称定位具体的目录树

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

      abstracts.push({
        title: frontmatter.data.title,
        content: frontmatter.content
      })
    })
  )

  allPosts.sort((a, b) => new Date(b.date) - new Date(a.date))

  if (abstracts.length) {
    abstracts.forEach(post => {
      directories[post.title] = directories[post.title] || [];
      const tree = directories[post.title];

      // 所有 push 的地方，记录一下上一次最后一个节点的位置
      let lastNode = null;
      let lastNodeParentArray = tree;

      // 将Markdown文本分成多行
      const lines = post.content.split('\n');
      // 用于保存解析后的HTML代码
      let result = '';

      // 每一个for是一篇文章
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // 处理标题
        if (line.startsWith('#')) {
          const level = line.match(/^#+/)[0].length;
          const name = line.substring(level).trim();
          const id = name.replace(/\s/g, '-');
          const now = { id, name, level };
          // 根据层级结构和标题构造树
          if (tree.length === 0) {
            tree.push(now);
            lastNode = now;
            lastNodeParentNode = tree;
            continue;
          }

          if (lastNode.level < level) {
            lastNode.children = lastNode.children || [];
            lastNode.children.push(now);
            lastNodeParentNode = lastNode.children;
          } else if (lastNode.level === level) {
            lastNodeParentNode.push(now);
          } else {
            tree.push(now);
            lastNodeParentNode = tree;
          }

          lastNode = now;
        }
      }
    })
  }

  if (useRss && allPosts.length) {
    const feed = new RSS({
      title: '小肚肚肚肚肚哦',
      site_url: 'https://next-blog-pro-gray.vercel.app/',
      feed_url: 'https://next-blog-pro-gray.vercel.app/feed.xml'
    })
    allPosts.forEach((post) => {
      feed.item(post)
    })
    await fs.writeFile('./public/feed.xml', feed.xml({ indent: true }))
  }
  await fs.writeFile('./public/search.json', JSON.stringify(allPosts))
  await fs.writeFile('./public/directory.json', JSON.stringify(directories))
}

generate()
