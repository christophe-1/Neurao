'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { fetchProducts } from '@/lib/api'

export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const { data, isPending, isError } = useQuery({
    queryKey: ['products', page],
    queryFn: () => fetchProducts(page),
  })

  if (isPending) {
    return <p>Chargement des produits...</p>
  }

  if (isError) {
    return <p>Impossible de charger les produits. Réessayez plus tard.</p>
  }

  if (data.products.length === 0) {
    return <p>Aucun produit à afficher.</p>
  }

  return (
    <main>
      <h1>La gamme</h1>
      <div className="product-grid">
        {data.products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            unitPriceCents={product.unitPriceCents}
          />
        ))}
      </div>
      <p>
        Page {data.page} sur {data.totalPages}
      </p>
      <button type="button" onClick={() => setPage(page - 1)} disabled={page === 1}>
        Précédent
      </button>
      <button type="button" onClick={() => setPage(page + 1)} disabled={page === data.totalPages}>
        Suivant
      </button>
    </main>
  )
}
