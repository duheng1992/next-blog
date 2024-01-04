import React from 'react'

export default function AnchorItem({ id, name, subItem }) {

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
    <div className={`anchor-item ${subItem ? 'sub-item' : ''}`} onClick={handleAnchorScroll}>{name}</div>
  )
}
