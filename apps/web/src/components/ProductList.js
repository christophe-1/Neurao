'use client'

import { useQuery } from '@tanstack/react-query'
import ProductCard from '@/components/ProductCard'
import { fetchProducts } from '@/lib/api'

/** One page of products for a search and a category, with the pagination buttons. */
export default function ProductList({ page, search, category, onPageChange }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['products', page, search, category],
    queryFn: () => fetchProducts(page, search, category),
  })

  if (isPending) {
    return <p>Chargement des produits...</p>
  }

  if (isError) {
    return <p>Impossible de charger les produits. Réessayez plus tard.</p>
  }

  if (data.products.length === 0) {
    return <p>Aucun produit ne correspond à votre recherche.</p>
  }

  return (
    <>
      <p className="product-count">{data.total} produits</p>

      <div className="product-grid">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <nav className="pagination" aria-label="Pagination">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          Précédent
        </button>
        <p>
          Page {data.page} sur {data.totalPages}
        </p>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === data.totalPages}
        >
          Suivant
        </button>
      </nav>
    </>
  )
}
