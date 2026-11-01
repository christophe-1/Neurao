'use client'

import { useQuery } from '@tanstack/react-query'
import ProductCard from '@/components/ProductCard'
import { fetchProducts } from '@/lib/api'

export default function ProductsPage() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['products', 1],
    queryFn: () => fetchProducts(1),
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
      {data.products.map((product) => (
        <ProductCard key={product.id} name={product.name} unitPriceCents={product.unitPriceCents} />
      ))}
    </main>
  )
}
