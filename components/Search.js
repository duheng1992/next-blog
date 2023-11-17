import React, { useState } from 'react'
// import { useRouter } from 'next/router';
import Turnstone from 'turnstone'
import searchPosts from '../public/search.json'

// The maximum number of items we want to show in the list
const maxItems = 10

// Set up listbox contents. We are fetching cities and airports from two different
// API endpoints. 10 from each but ideally we only want to show 8 cities and 2 airports.
const listbox = [
  {
    id: 'posts',
    name: 'posts',
    // ratio: 8,
    displayField: 'name',
    data: (query) => {
      if (!query) {
        return searchPosts
      }
      return searchPosts.filter(item => item.title?.toLowerCase().indexOf(query) > -1 || item.description?.toLowerCase().indexOf(query) > -1)
    },
    searchType: 'contains'
  }
]

export default function Search() {
  // const router = useRouter();
  const containerStyles = 'fixed block w-full h-full top-0 left-0 bg-white z-50 overflow-auto sm:relative sm:w-6/12 sm:h-auto sm:top-auto sm:left-auto sm:bg-transparent sm:z-auto sm:overflow-visible'

  return (
    <div className={`search-container ${containerStyles}`}>
      <Turnstone
        id="autocomplete"
        listbox={listbox}
        listboxIsImmutable={true}
        matchText={true}
        maxItems={maxItems}
        typeahead={true}
        noItemsMessage="We found no places that match your search"
        // onBlur={onBlur}
        // onFocus={onFocus}
        placeholder="Search posts"
        // Cancel={() => {}}
        // Clear={() => {}}
        onSelect={search => {
          // 跳转目录
          if (search && search.url) {
            window.open(search.url, '_blank')
          }
        }}
      />
    </div>
  )
}