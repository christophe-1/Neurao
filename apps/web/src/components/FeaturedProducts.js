'use client'

import { useQuery } from '@tanstack/react-query'
import ProductCard from '@/components/ProductCard'
import { fetchProducts } from '@/lib/api'

const FEATURED_COUNT = 3

export default function FeaturedProducts() {
  const { data } = useQuery({
    queryKey: ['products', 1],
    queryFn: () => fetchProducts(1),
  })

  if (!data) {
    return null
  }

  return (
    <section className="featured" aria-labelledby="featured-title">
      <h2 id="featured-title">À découvrir</h2>
      <div className="product-grid">
        {data.products.slice(0, FEATURED_COUNT).map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            unitPriceCents={product.unitPriceCents}
          />
        ))}
      </div>
    </section>
  )
}
