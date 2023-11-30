import 'nextra-theme-blog/style.css'
import Head from 'next/head'
import { useEffect, useState } from 'react';

import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';

import '../styles/main.css'

export default function Nextra({ Component, pageProps }) {

  const [theme, setTheme] = useState();

  const changeTheme = (isDark) => {
    const html = document.querySelector('html');
    if (html) {
      html.classList.remove(['light']);
      html.classList.remove(['dark']);
      html.classList.add(isDark ? 'dark' : 'light');
      html.style['colorScheme'] = isDark ? 'dark' : 'light';
    }
  }

  const handleThemeChange = (e) => {
    const isDark = e.matches;
    setTheme(isDark ? 'dark' : 'light');
    changeTheme(isDark);
  }

  useEffect(() => {
    let mediaQueryListDark;
    if (window) {
      mediaQueryListDark = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQueryListDark.addListener(handleThemeChange);
      // 初始化先设置一次
      handleThemeChange(mediaQueryListDark);
    }

    return () => {
      if (mediaQueryListDark) {
        mediaQueryListDark.removeListener(handleThemeChange);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS"
          href="/feed.xml"
        />
        <link
          rel="preload"
          href="/fonts/Inter-roman.latin.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>

      {theme ? (
        <header style={{ float: 'right', marginTop: '8px' }}>
          <DarkModeToggle
            mode={theme}
            dark="dark"
            light="light"
            size="sm"
            inactiveTrackColor="#e2e8f0"
            inactiveTrackColorOnHover="#f8fafc"
            inactiveTrackColorOnActive="#cbd5e1"
            activeTrackColor="#334155"
            activeTrackColorOnHover="#1e293b"
            activeTrackColorOnActive="#0f172a"
            inactiveThumbColor="#1e293b"
            activeThumbColor="#e2e8f0"
            ariaLabel="Toggle color scheme"
            onChange={(mode) => {
              setTheme(mode);
              changeTheme(mode === 'dark');
            }}
          />
        </header>
      ) : null}

      <Component {...pageProps} />
    </>
  )
}
