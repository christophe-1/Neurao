'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'
import ProductList from '@/components/ProductList'
import { fetchCategories } from '@/lib/api'

/** Catalogue page: the format filter and the list of products. */
export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('')
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  function handleCategory(slug) {
    setCategory(slug)
    setPage(1)
  }

  return (
    <main>
      <nav aria-label="Fil d’Ariane" className="breadcrumb">
        <Link href="/">Accueil</Link> / La gamme
      </nav>
      <h1>La gamme</h1>
      <p className="lead">
        Gélules, gommes, liquides et poudres : chaque formule existe dans un format adapté à l’âge
        de l’enfant.
      </p>

      <div className="filters">
        <span className="filters-label">Format</span>
        <button
          type="button"
          className={category === '' ? 'filter-button filter-button-active' : 'filter-button'}
          aria-pressed={category === ''}
          onClick={() => handleCategory('')}
        >
          Tous
        </button>
        {categories &&
          categories.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                category === item.slug ? 'filter-button filter-button-active' : 'filter-button'
              }
              aria-pressed={category === item.slug}
              onClick={() => handleCategory(item.slug)}
            >
              {item.name}
            </button>
          ))}
      </div>

      <ProductList page={page} search="" category={category} onPageChange={setPage} />
    </main>
  )
}
