import 'nextra-theme-blog/style.css'
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';

import { storeContext } from '../store';

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

    const button = document.querySelector('.bubbly-button');
    if (button) {
      button.classList.remove('animate');

      button.classList.add('animate');
      setTimeout(function () {
        button.classList.remove('animate');
      }, 700);
    }
  }

  const autoThemeChange = (e) => {
    const isDark = e.matches;
    setTheme(isDark ? 'dark' : 'light');
    changeTheme(isDark);
  }

  useEffect(() => {
    let mediaQueryListDark;
    if (window) {
      mediaQueryListDark = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQueryListDark.addListener(autoThemeChange);
      // 初始化先设置一次
      autoThemeChange(mediaQueryListDark);
    }

    return () => {
      if (mediaQueryListDark) {
        mediaQueryListDark.removeListener(autoThemeChange);
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
        <header className='header' style={{
          backgroundColor: theme === 'dark' ? 'rgba(55, 55, 55, .6)' : 'rgba(255, 255, 255, .6)',
        }}>
          <h2
            onClick={() => window.location.href = '/'}
            className='title'
          >
            小肚肚肚肚肚哦
          </h2>

          <div className='bubbly-button'>
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

          </div>
        </header>
      ) : null}

      <storeContext.Provider value={theme}>
        <Component {...pageProps} />
      </storeContext.Provider>
    </>
  )
}
