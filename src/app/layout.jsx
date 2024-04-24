import glob from 'fast-glob'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'
import { HeroPattern } from '@/components/HeroPattern'

export const metadata = {
  title: {
    template: '%s - 小肚肚肚肚肚哦主页',
    default: '小肚肚肚肚肚哦主页',
  },
}

export default async function RootLayout({ children }) {
  let pages = await glob('**/*.mdx', { cwd: 'src/app' })
  let allSectionsEntries = await Promise.all(
    pages.map(async (filename) => [
      '/' + filename.replace(/(^|\/)page\.mdx$/, ''),
      (await import(`./${filename}`)).sections,
    ]),
  )
  let allSections = Object.fromEntries(allSectionsEntries)

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=2"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta charSet="UTF-8" />
        <meta name="keywords" content="小肚肚肚肚肚哦,小肚,前端,程序员,博客,blog,日常" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <Providers>
          <HeroPattern />

          <div className="w-full">
            <Layout allSections={allSections}>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
