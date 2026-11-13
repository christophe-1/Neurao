import Link from 'next/link'
import ProductImage from '@/components/ProductImage'
import formatPrice from '@/lib/formatPrice'

export default function ProductCard({ id, name, unitPriceCents, image }) {
  return (
    <article className="product-card">
      <Link href={`/products/${id}`}>
        <ProductImage src={image} alt="" size={320} />
        <h2>{name}</h2>
      </Link>
      <p>{formatPrice(unitPriceCents)}</p>
    </article>
  )
}
