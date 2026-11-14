import Link from 'next/link'
import ProductImage from '@/components/ProductImage'
import formatPrice from '@/lib/formatPrice'
import { minimumAge, rangeColor } from '@/lib/productDisplay'

/** Card of a product in a list: photo, age, name, price and link to its page. */
export default function ProductCard({ product }) {
  const color = rangeColor(product.name)
  const age = minimumAge(product.description)

  return (
    <article className="product-card">
      <Link href={`/products/${product.id}`} className="product-card-link">
        <ProductImage src={product.image} alt="" size={320} color={color} />
        {age && <span className={`pill tile-${color}`}>{age}</span>}
        <h2>{product.name}</h2>
      </Link>
      <p className="product-card-price">{formatPrice(product.unitPriceCents)}</p>
      {product.stock === 0 && <p className="out-of-stock">Bientôt de retour</p>}
    </article>
  )
}
