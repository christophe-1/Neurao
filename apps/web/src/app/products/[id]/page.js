'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import ProductImage from '@/components/ProductImage'
import { fetchProduct } from '@/lib/api'
import formatPrice from '@/lib/formatPrice'

/** Product page: photo, price and description. */
export default function ProductPage() {
  const { id } = useParams()
  const { data, isPending, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
  })

  if (isPending) {
    return <p>Chargement du produit...</p>
  }

  if (isError) {
    return <p>Impossible de charger le produit. Réessayez plus tard.</p>
  }

  if (data === null) {
    return <p>Produit introuvable.</p>
  }

  return (
    <main className="product-detail">
      <ProductImage src={data.image} alt={data.name} size={480} />
      <div>
        <h1>{data.name}</h1>
        <p className="product-price">{formatPrice(data.unitPriceCents)}</p>
        <p className="product-description">{data.description}</p>
      </div>
    </main>
  )
}
