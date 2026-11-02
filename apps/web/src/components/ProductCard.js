import Link from 'next/link'
import formatPrice from '@/lib/formatPrice'

export default function ProductCard({ id, name, unitPriceCents }) {
  return (
    <article className="product-card">
      <Link href={`/products/${id}`}>
        <h2>{name}</h2>
      </Link>
      <p>{formatPrice(unitPriceCents)}</p>
    </article>
  )
}
