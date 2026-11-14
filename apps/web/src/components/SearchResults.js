'use client'

import { useState } from 'react'
import ProductList from '@/components/ProductList'

/** Search results: a title with the searched text, then the matching products. */
export default function SearchResults({ search }) {
  const [page, setPage] = useState(1)

  return (
    <main>
      <h1>Résultats pour « {search} »</h1>
      <ProductList page={page} search={search} category="" onPageChange={setPage} />
    </main>
  )
}
