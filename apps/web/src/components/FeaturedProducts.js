'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { fetchProducts } from '@/lib/api'

const FEATURED_COUNT = 4

/** Shows four products with a photo, taken from the first page of the catalogue. */
export default function FeaturedProducts() {
  const { data } = useQuery({
    queryKey: ['products', 1],
    queryFn: () => fetchProducts(1, '', ''),
  })

  if (!data) {
    return null
  }

  const productsWithPhoto = data.products.filter((product) => product.image)

  return (
    <section className="featured" aria-labelledby="featured-title">
      <div className="section-heading">
        <div>
          <p className="kicker">La gamme</p>
          <h2 id="featured-title">À découvrir</h2>
        </div>
        <Link href="/products" className="see-all">
          Voir toute la gamme →
        </Link>
      </div>
      <div className="product-grid">
        {productsWithPhoto.slice(0, FEATURED_COUNT).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
