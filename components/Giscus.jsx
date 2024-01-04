import React from 'react'

import Giscus from '@giscus/react';
import { storeContext } from '../store';

export default function GiscusComponent() {
  const theme = React.useContext(storeContext);

  return (
    <section style={{ marginTop: '32px' }}>
      <Giscus
        id="comments"
        reactionsEnabled="1"
        inputPosition="bottom"
        loading="lazy"
        src="https://giscus.app/client.js"
        repo="duheng1992/next-blog"
        repoId="R_kgDOKowndw"
        category="Announcements"
        categoryId="DIC_kwDOKownd84Cb7GG"
        mapping="pathname"
        strict="0"
        emitMetadata="0"
        theme={theme === 'dark' ? 'cobalt' : 'light'}
        lang="zh-CN"
        crossorigin="anonymous"
        async={true}
      />
    </section>
  )
}
