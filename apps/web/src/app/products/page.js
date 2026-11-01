'use client'

import { useQuery } from '@tanstack/react-query'
import ProductCard from '@/components/ProductCard'
import { fetchProducts } from '@/lib/api'

export default function ProductPage() {
  const { data } = useQuery({
    queryKey: ['products', 1],
    queryFn: () => fetchProducts(1),
  })

  return (
    <main>
      <h1>La gamme</h1>
      {data?.products.map((product) => (
        <ProductCard key={product.id} name={product.name} unitPriceCents={product.unitPriceCents} />
      ))}
    </main>
  )
}
