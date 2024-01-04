import React, { Fragment } from 'react'
import directorys from '../public/directory.json'

import AnchorItem from './AnchorItem';

export default function Anchor({ name }) {
  const anchors = directorys[name];

  return (
    <div className='anchor'>
      <div className='anchor-title'>Table of contents</div>
      {anchors.map(anchor => {
        if (anchor.children) {
          return <Fragment key={anchor.id}>
            <AnchorItem name={anchor.name} id={anchor.id} />
            {
              anchor.children.map(child => {
                return <AnchorItem key={child.id} name={child.name} id={child.id} subItem />
              })
            }
          </Fragment>
        }

        return <AnchorItem key={anchor.id} name={anchor.name} id={anchor.id} />
      })}
    </div>

  )
}
