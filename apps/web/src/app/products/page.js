'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { fetchProducts } from '@/lib/api'

/** Catalogue page, with pagination. */
export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const { data, isPending, isError } = useQuery({
    queryKey: ['products', page],
    queryFn: () => fetchProducts(page),
  })

  if (isPending) {
    return <main>Chargement des produits...</main>
  }

  if (isError) {
    return <main>Impossible de charger les produits. Réessayez plus tard.</main>
  }

  if (data.products.length === 0) {
    return <main>Aucun produit à afficher.</main>
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
      <p className="product-count">{data.total} produits</p>

      <div className="product-grid">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <nav className="pagination" aria-label="Pagination">
        <button type="button" onClick={() => setPage(page - 1)} disabled={page === 1}>
          Précédent
        </button>
        <p>
          Page {data.page} sur {data.totalPages}
        </p>
        <button type="button" onClick={() => setPage(page + 1)} disabled={page === data.totalPages}>
          Suivant
        </button>
      </nav>
    </main>
  )
}
