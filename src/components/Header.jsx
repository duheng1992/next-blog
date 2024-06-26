import { forwardRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { motion, useScroll, useTransform } from 'framer-motion'

import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
} from '@/components/MobileNavigation'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import { MobileSearch, Search } from '@/components/Search'
import { ThemeToggle } from '@/components/ThemeToggle'

function TopLevelNavItem({ href, className, children }) {
  return (
    <li className={className}>
      <Link
        href={href}
        className={`text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white`}
      >
        {children}
      </Link>
    </li>
  )
}

function DropdownMenu({ title, items }) {
  return (
    <li className="dropdown">
      <Link
        href={"#"}
        className={`dropdown-toggle text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white`}
      >
        {title}
      </Link>
      <ul role="list" className="rounded-2xl transition-shadow hover:shadow-md dropdown-content">
        {items.map(item => {
          return (
            <TopLevelNavItem className="bg-zinc-50 dark:bg-zinc-900/[var(--bg-opacity-dark)]" key={item.title} href={item.href}>{item.title}</TopLevelNavItem>
          )
        })}
      </ul>
    </li>
  )
}

export const Header = forwardRef(function Header({ className }, ref) {
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
  let isInsideMobileNavigation = useIsInsideMobileNavigation()

  let { scrollY } = useScroll()
  let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
  let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

  return (
    <motion.div
      ref={ref}
      className={clsx(
        className,
        'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80',
        !isInsideMobileNavigation &&
        'backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80',
        isInsideMobileNavigation
          ? 'bg-white dark:bg-zinc-900'
          : 'bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]',
      )}
      style={{
        '--bg-opacity-light': bgOpacityLight,
        '--bg-opacity-dark': bgOpacityDark,
      }}
    >
      <div
        className={clsx(
          'absolute inset-x-0 top-full h-px transition',
          (isInsideMobileNavigation || !mobileNavIsOpen) &&
          'bg-zinc-900/7.5 dark:bg-white/7.5',
        )}
      />
      <Search />
      <div className="flex items-center gap-5 lg:hidden">
        <MobileNavigation />
        <Link href="/" aria-label="Home">
          <Logo className="h-6" />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <nav className="hidden md:block">
          <ul role="list" className="flex items-center gap-8">
            <DropdownMenu title="公告" items={[
              { href: '#', title: '本个人主页仅用于学习交流，不用做任何商业用途！' },
            ]} />
            <DropdownMenu title="作品" items={[
              { href: 'https://duheng1992.github.io/monto-color/', title: '配色方案' },
              { href: 'https://dh1992.gitee.io/dux-ui-react/', title: 'DUX UI' },
              { href: 'https://chromewebstore.google.com/detail/chrome-bookmark/ilcmekmgeldhckdembghkiohkdffihpe?hl=zh-CN&utm_source=ext_sidebar', title: '谷歌书签-威力加强版 v0.1.0' },
            ]} />
            <TopLevelNavItem href="#">读书笔记</TopLevelNavItem>
          </ul>
        </nav>
        <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
        <div className="flex gap-4">
          <MobileSearch />
          <ThemeToggle />
        </div>
        {/* <div className="hidden min-[416px]:contents">
          <Button href="#">Sign in</Button>
        </div> */}
      </div>
    </motion.div>
  )
})
