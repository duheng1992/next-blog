import React from 'react'

export default function AnchorItem({ id, name, level }) {
  const handleAnchorScroll = () => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  return (
    <div className="anchor-item" style={{ paddingLeft: `${(+level) * 12}px` }} onClick={handleAnchorScroll}>{name}</div>
  )
}
