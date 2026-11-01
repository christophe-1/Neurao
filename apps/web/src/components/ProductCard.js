import formatPrice from '@/lib/formatPrice'

export default function ProductCard({ name, unitPriceCents }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{formatPrice(unitPriceCents)}</p>
    </article>
  )
}
