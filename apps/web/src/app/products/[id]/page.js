'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { fetchProduct } from '@/lib/api'
import formatPrice from '@/lib/formatPrice'

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
    <main>
      <h1>{data.name}</h1>
      <p className="product-price">{formatPrice(data.unitPriceCents)}</p>
      <p className="product-description">{data.description}</p>
    </main>
  )
}
