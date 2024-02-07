import React from 'react'
import directorys from '../public/directory.json'

import AnchorItem from './AnchorItem';

function AnchorWrapper({ anchors }) {
  return <div className='anchor-wrapper'>
    {(anchors || []).map(anchor => {
      if (anchor.children) {
        return <div className='anchor-subitem-wrapper' key={anchor.id}>
          <AnchorItem name={anchor.name} id={anchor.id} level={anchor.level} />
          {
            anchor.children && anchor.children.length ? <AnchorWrapper anchors={anchor.children} /> : null
          }
        </div>
      }
  
      return <AnchorItem key={anchor.id} name={anchor.name} level={anchor.level} id={anchor.id} />
    })}
  </div>
}

export default function Anchor({ name }) {
  const anchors = directorys[name];

  return (
    <div className='anchor'>
      <div className='anchor-title'>Table of contents</div>
      <AnchorWrapper anchors={anchors} />
    </div>

  )
}
