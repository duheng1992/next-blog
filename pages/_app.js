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
        <header style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '60px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)',
          backgroundColor: theme === 'dark' ? 'rgba(55, 55, 55, .6)' : 'rgba(255, 255, 255, .6)',
          zIndex: 999,
        }}>
          <h2 style={{ fontWeight: 700, fontSize: '20px' }}>
            我的个人主页哦
          </h2>
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
