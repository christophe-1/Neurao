'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ProductImage from '@/components/ProductImage'
import { fetchProduct } from '@/lib/api'
import formatPrice from '@/lib/formatPrice'
import { minimumAge, rangeColor } from '@/lib/productDisplay'

/** Product page: photo, age, reference, price, stock and description. */
export default function ProductPage() {
  const { id } = useParams()
  const { data, isPending, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
  })

  if (isPending) {
    return <main>Chargement du produit...</main>
  }

  if (isError) {
    return <main>Impossible de charger le produit. Réessayez plus tard.</main>
  }

  if (data === null) {
    return <main>Produit introuvable.</main>
  }

  const color = rangeColor(data.name)
  const age = minimumAge(data.description)

  return (
    <main>
      <nav aria-label="Fil d’Ariane" className="breadcrumb">
        <Link href="/">Accueil</Link> / <Link href="/products">La gamme</Link> / {data.name}
      </nav>

      <div className="product-detail">
        <ProductImage src={data.image} alt={data.name} size={560} color={color} />

        <div className="product-info">
          <h1>{data.name}</h1>
          {age && <p className={`pill tile-${color}`}>{age}</p>}
          <p className="product-reference">Réf. {data.reference}</p>
          <p className="product-price">{formatPrice(data.unitPriceCents)}</p>
          {data.stock > 0 ? (
            <p className="in-stock">En stock</p>
          ) : (
            <p className="out-of-stock">Bientôt de retour</p>
          )}

          <div className="product-description">
            <h2>Description</h2>
            <p>{data.description}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
